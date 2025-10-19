"use client";

import React, { useState, useEffect, useRef } from "react";
import GameCard from "@/components/GameCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
// Loader2 is now in AppHeader, no longer needed here

// ESPN NFL Scoreboard API endpoint
const NFL_SCOREBOARD_API = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

// Data refresh interval in milliseconds (20 seconds)
const REFRESH_INTERVAL = 20 * 1000;
const FAVORITE_GAMES_STORAGE_KEY = "favoriteNflGameIds";

interface TeamData {
  displayName: string;
  logo: string;
  score: string;
}

interface CompetitionData {
  id: string;
  date: string;
  status: {
    type: {
      description: string;
      state: "pre" | "in" | "post";
      detail: string;
      shortDetail: string;
    };
  };
  competitors: Array<{
    homeAway: "home" | "away";
    score: string;
    team: {
      displayName: string;
      logo: string;
    };
  }>;
}

interface EventData {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: {
    type: {
      description: string;
      state: "pre" | "in" | "post";
      detail: string;
      shortDetail: string;
    };
  };
  competitions: CompetitionData[];
}

interface Game {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: {
    type: {
      description: string;
      state: "pre" | "in" | "post";
      detail?: string;
      shortDetail?: string;
    };
  };
  competitors: {
    home: TeamData;
    away: TeamData;
  };
}

interface HalfTimerProps {
  setLastUpdated: (time: string | null) => void;
  setIsRefreshing: (refreshing: boolean) => void;
}

const HalfTimer: React.FC<HalfTimerProps> = ({ setLastUpdated, setIsRefreshing }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteGameIds, setFavoriteGameIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem(FAVORITE_GAMES_STORAGE_KEY);
      return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
    }
    return new Set();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FAVORITE_GAMES_STORAGE_KEY, JSON.stringify(Array.from(favoriteGameIds)));
    }
  }, [favoriteGameIds]);

  const toggleFavorite = (gameId: string) => {
    setFavoriteGameIds(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(gameId)) {
        newFavorites.delete(gameId);
      } else {
        newFavorites.add(gameId);
      }
      return newFavorites;
    });
  };

  const fetchNFLGames = async (initialLoad: boolean = false) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch(NFL_SCOREBOARD_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const processedGames: Game[] = data.events.map((event: EventData) => {
        const competition = event.competitions[0];
        const homeCompetitor = competition.competitors.find(c => c.homeAway === "home");
        const awayCompetitor = competition.competitors.find(c => c.homeAway === "away");

        return {
          id: event.id,
          name: event.name,
          shortName: event.shortName,
          date: event.date,
          status: {
            type: {
              description: event.status.type.description,
              state: event.status.type.state,
              detail: event.status.type.detail,
              shortDetail: event.status.type.shortDetail,
            },
          },
          competitors: {
            home: {
              displayName: homeCompetitor?.team.displayName || "N/A",
              logo: homeCompetitor?.team.logo || "/placeholder.svg",
              score: homeCompetitor?.score || "0",
            },
            away: {
              displayName: awayCompetitor?.team.displayName || "N/A",
              logo: awayCompetitor?.team.logo || "/placeholder.svg",
              score: awayCompetitor?.score || "0",
            },
          },
        };
      });

      const sortedGames = [...processedGames].sort((a, b) => {
        const aIsFavorited = favoriteGameIds.has(a.id);
        const bIsFavorited = favoriteGameIds.has(b.id);

        if (aIsFavorited && !bIsFavorited) return -1;
        if (!aIsFavorited && bIsFavorited) return 1;

        if (a.status.type.state === "post" && b.status.type.state !== "post") {
          return 1;
        }
        if (a.status.type.state !== "post" && b.status.type.state === "post") {
          return -1;
        }
        return 0;
      });

      setGames(sortedGames);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch NFL game data:", err);
      setError("Failed to load NFL game data. Please try again later.");
      setLastUpdated(null); // Clear last updated on error
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchNFLGames(true);

    const intervalId = setInterval(() => fetchNFLGames(false), REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [favoriteGameIds, setLastUpdated, setIsRefreshing]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-[72px] text-gray-800 relative"> {/* Added pt-[72px] */}
      <p className="text-lg text-gray-700 text-center mb-8">
        Live NFL halftime countdowns for all games in just one view.
      </p>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[664px] mx-auto">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-[320px] bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-gray-400" />
                    <Skeleton className="h-6 w-24 bg-gray-400" />
                  </div>
                  <Skeleton className="h-8 w-12 bg-gray-400" />
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-gray-400" />
                    <Skeleton className="h-6 w-24 bg-gray-400" />
                  </div>
                  <Skeleton className="h-8 w-12 bg-gray-400" />
                </div>
                <Skeleton className="h-6 w-40 mx-auto bg-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-600 text-xl p-4 bg-red-100 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[664px] mx-auto">
          {games.length > 0 ? (
            games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorited={favoriteGameIds.has(game.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-2xl">No NFL games currently available.</p>
          )}
        </div>
      )}

      <div className="mt-12 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-md text-gray-800 text-xs flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center">
        <p className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 bg-emerald-500 rounded-full"></span>
          <span>= Live Game</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 bg-amber-400 rounded-full"></span>
          <span>= Halftime</span>
        </p>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default HalfTimer;