"use client";

import React, { useState, useEffect, useMemo } from "react";
import GameCard from "@/components/GameCard";
import Bracket from "@/components/Bracket";
import GameCardModal from "@/components/GameCardModal";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";
import MobileNavMenu from "@/components/MobileNavMenu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const API_ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  ncaa: "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=100&seasontype=3&limit=100&dates=20260317-20260407"
};

const REFRESH_INTERVAL = 20 * 1000;
const FAVORITE_GAMES_STORAGE_KEY_PREFIX = "favoriteGameIds_";

interface TeamData {
  displayName: string;
  logo: string;
  score: string;
  seed?: string;
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
    curatedRank?: { current: number };
    seed?: string;
    team: {
      displayName: string;
      logo: string;
    };
  }>;
  notes?: Array<{ text: string }>;
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
  round?: number;
  region?: string;
}

interface HalfTimerProps {
  defaultSport?: 'nfl' | 'nba' | 'ncaa';
}

const HalfTimer: React.FC<HalfTimerProps> = ({ defaultSport = 'nba' }) => {
  const [activeSport, setActiveSport] = useState<'nfl' | 'nba' | 'ncaa'>(defaultSport);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  const [favoriteGameIds, setFavoriteGameIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem(`${FAVORITE_GAMES_STORAGE_KEY_PREFIX}${activeSport}`);
      return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
    }
    return new Set();
  });

  useEffect(() => {
    setGames([]);
    setError(null);
    
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem(`${FAVORITE_GAMES_STORAGE_KEY_PREFIX}${activeSport}`);
      setFavoriteGameIds(storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set());
    }
    fetchGames(true);
  }, [activeSport]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${FAVORITE_GAMES_STORAGE_KEY_PREFIX}${activeSport}`, JSON.stringify(Array.from(favoriteGameIds)));
    }
  }, [favoriteGameIds, activeSport]);

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

  const fetchGames = async (initialLoad: boolean = false) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch(API_ENDPOINTS[activeSport]);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const processedGames: Game[] = (data.events || [])
        .map((event: EventData) => {
          const competition = event.competitions[0];
          const homeCompetitor = competition.competitors.find(c => c.homeAway === "home");
          const awayCompetitor = competition.competitors.find(c => c.homeAway === "away");

          let round = 1;
          let region = "Other";
          if (activeSport === 'ncaa') {
            const note = (competition.notes?.[0]?.text || "").toUpperCase();
            const desc = (event.status.type.description || "").toUpperCase();
            const name = (event.name || "").toUpperCase();
            const combined = `${note} ${desc} ${name}`;

            if (combined.includes("EAST")) region = "East";
            else if (combined.includes("WEST")) region = "West";
            else if (combined.includes("SOUTH")) region = "South";
            else if (combined.includes("MIDWEST")) region = "Midwest";

            if (combined.includes("1ST ROUND") || combined.includes("FIRST ROUND") || combined.includes("ROUND OF 64")) round = 1;
            else if (combined.includes("2ND ROUND") || combined.includes("SECOND ROUND") || combined.includes("ROUND OF 32")) round = 2;
            else if (combined.includes("SWEET 16") || combined.includes("REGIONAL SEMIFINAL")) round = 3;
            else if (combined.includes("ELITE 8") || combined.includes("REGIONAL FINAL")) round = 4;
            else if (combined.includes("FINAL FOUR") || combined.includes("NATIONAL SEMIFINAL")) round = 5;
            else if (combined.includes("CHAMPIONSHIP") || combined.includes("NATIONAL CHAMPIONSHIP")) round = 6;
            else if (combined.includes("FIRST FOUR") || combined.includes("OPENING ROUND")) round = 0;
            else round = 1;
          }

          const getSeed = (comp: any) => {
            const s = comp?.seed || comp?.curatedRank?.current?.toString() || "";
            return s === "99" ? "" : s;
          };

          return {
            id: event.id,
            name: event.name,
            shortName: event.shortName,
            date: event.date,
            round,
            region,
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
                displayName: homeCompetitor?.team.displayName || "TBD",
                logo: homeCompetitor?.team.logo || "/placeholder.svg",
                score: homeCompetitor?.score || "0",
                seed: getSeed(homeCompetitor),
              },
              away: {
                displayName: awayCompetitor?.team.displayName || "TBD",
                logo: awayCompetitor?.team.logo || "/placeholder.svg",
                score: awayCompetitor?.score || "0",
                seed: getSeed(awayCompetitor),
              },
            },
          };
        });

      setGames(processedGames);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error(`[HalfTimer] Failed to fetch ${activeSport} game data:`, err);
      setError(`Failed to load ${activeSport.toUpperCase()} game data.`);
      setGames([]);
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => {
      const aIsFavorited = favoriteGameIds.has(a.id);
      const bIsFavorited = favoriteGameIds.has(b.id);
      if (aIsFavorited && !bIsFavorited) return -1;
      if (!aIsFavorited && bIsFavorited) return 1;

      const getStatePriority = (state: string, desc: string) => {
        if (desc === "Halftime" || state === "in") return 0;
        if (state === "pre") return 1;
        return 2;
      };
      const aPriority = getStatePriority(a.status.type.state, a.status.type.description);
      const bPriority = getStatePriority(b.status.type.state, b.status.type.description);
      if (aPriority !== bPriority) return aPriority - bPriority;

      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [games, favoriteGameIds]);

  const standardViewGames = useMemo(() => {
    return sortedGames.filter(game => {
      if (activeSport === 'ncaa') {
        // Ignore First Four / Play-in games
        if (game.round === 0) return false;
        
        // Hide matchups where both teams are TBD
        const isHomeTbd = game.competitors.home.displayName === "TBD";
        const isAwayTbd = game.competitors.away.displayName === "TBD";
        if (isHomeTbd && isAwayTbd) return false;

        // Exclude specific non-NCAA tournament games requested by user
        const forbiddenMatchups = [
          ["UMBC", "Howard"],
          ["Texas", "NC State"],
          ["Prairie View A&M", "Lehigh"],
          ["Miami (OH)", "SMU"]
        ];
        
        const isForbidden = forbiddenMatchups.some(([teamA, teamB]) => 
          (game.competitors.home.displayName.includes(teamA) && game.competitors.away.displayName.includes(teamB)) ||
          (game.competitors.home.displayName.includes(teamB) && game.competitors.away.displayName.includes(teamA))
        );
        
        if (isForbidden) return false;
      }
      
      return true;
    });
  }, [sortedGames, activeSport]);

  const bracketGames = useMemo(() => {
    if (activeSport !== 'ncaa') return [];
    return games.filter(game => {
      // Only Round of 64
      if (game.round !== 1) return false;
      
      // Must have real teams (no TBD in Round of 64)
      if (game.competitors.home.displayName === "TBD" || game.competitors.away.displayName === "TBD") return false;
      
      // Must have valid seeds
      if (!game.competitors.home.seed || !game.competitors.away.seed) return false;
      
      return true;
    });
  }, [games, activeSport]);

  useEffect(() => {
    const intervalId = setInterval(() => fetchGames(false), REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [activeSport]);

  const isNcaa = activeSport === 'ncaa';

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20 text-gray-800 relative">
      <MobileNavMenu />
      <h1 className="text-5xl font-extrabold text-gray-900 mb-2 text-center drop-shadow-md">HalfTimer</h1>
      <p className="text-lg text-gray-700 text-center mb-6">
        Track live scores and see exactly how much halftime is left so you can skip ads.
      </p>

      <div className="w-full max-w-[500px] mb-8 px-2">
        <Tabs value={activeSport} className="w-full" onValueChange={(v) => setActiveSport(v as 'nfl' | 'nba' | 'ncaa')}>
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-gray-200/50 backdrop-blur-sm rounded-xl">
            <TabsTrigger value="nfl" className="text-sm sm:text-base font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">NFL</TabsTrigger>
            <TabsTrigger value="nba" className="text-sm sm:text-base font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">NBA</TabsTrigger>
            <TabsTrigger value="ncaa" className="text-sm sm:text-base font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all whitespace-nowrap">March Madness</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeSport === 'nfl' && (
        <div className="w-full max-w-[600px] mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center shadow-sm">
          <p className="text-xl font-semibold text-blue-900">
            NFL season is over - thanks for being here, and we’ll see you back on September 10th for kickoff.
          </p>
        </div>
      )}

      {isNcaa && !loading && (
        <div className="w-full max-w-7xl mb-12 space-y-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">March Madness Bracket</h2>
          </div>
          
          <Bracket games={bracketGames} onGameClick={setSelectedGame} />
          
          <div className="flex items-center justify-center gap-3 pt-12">
            <div className="h-px bg-gray-200 flex-grow max-w-[200px]"></div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Standard View</h2>
            <div className="h-px bg-gray-200 flex-grow max-w-[200px]"></div>
          </div>
        </div>
      )}

      {lastUpdated && (
        <div className="absolute top-4 right-4 text-sm text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
          Last Updated: {lastUpdated}
          {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 min-[720px]:grid-cols-2 gap-2 w-full max-w-[720px] mx-auto">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-[340px] bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 shadow-lg rounded-xl overflow-hidden mx-auto">
              <CardContent className="p-6 flex flex-col justify-between h-[250px]">
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
        <div className={cn(
          "w-full max-w-[720px] mx-auto",
          standardViewGames.length === 1 ? "flex justify-center" : "grid grid-cols-1 min-[720px]:grid-cols-2 gap-2"
        )}>
          {standardViewGames.length > 0 ? (
            standardViewGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorited={favoriteGameIds.has(game.id)}
                onToggleFavorite={toggleFavorite}
                sport={activeSport}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-2xl">No {activeSport.toUpperCase()} games currently available.</p>
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

      <GameCardModal 
        game={selectedGame} 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)}
        isFavorited={selectedGame ? favoriteGameIds.has(selectedGame.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <MadeWithDyad />
    </div>
  );
};

export default HalfTimer;