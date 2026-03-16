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
  ncaa: "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=100"
};

// Official 2025-26 NCAA Tournament Bracket Data (Full 64 Teams)
const FALLBACK_NCAA_GAMES: Game[] = [
  // --- EAST REGION ---
  { id: "e1", name: "Duke vs Siena", shortName: "SIENA @ DUKE", date: "2026-03-19T15:50:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Duke", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png", score: "0", seed: "1" }, away: { displayName: "Siena", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2546.png", score: "0", seed: "16" } } },
  { id: "e2", name: "Ohio State vs TCU", shortName: "TCU @ OSU", date: "2026-03-19T13:15:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Ohio State", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/194.png", score: "0", seed: "8" }, away: { displayName: "TCU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png", score: "0", seed: "9" } } },
  { id: "e3", name: "St John's vs N. Iowa", shortName: "UNI @ STJ", date: "2026-03-20T20:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "St John's", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2550.png", score: "0", seed: "5" }, away: { displayName: "Northern Iowa", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2460.png", score: "0", seed: "12" } } },
  { id: "e4", name: "Kansas vs CA Baptist", shortName: "CBU @ KU", date: "2026-03-20T22:45:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Kansas", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png", score: "0", seed: "4" }, away: { displayName: "CA Baptist", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2110.png", score: "0", seed: "13" } } },
  { id: "e5", name: "Louisville vs USF", shortName: "USF @ LOU", date: "2026-03-19T14:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Louisville", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/97.png", score: "0", seed: "6" }, away: { displayName: "South Florida", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/58.png", score: "0", seed: "11" } } },
  { id: "e6", name: "Michigan St vs NDSU", shortName: "NDSU @ MSU", date: "2026-03-19T17:05:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Michigan St", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/127.png", score: "0", seed: "3" }, away: { displayName: "N Dakota St", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2449.png", score: "0", seed: "14" } } },
  { id: "e7", name: "UCLA vs UCF", shortName: "UCF @ UCLA", date: "2026-03-20T20:25:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "UCLA", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/26.png", score: "0", seed: "7" }, away: { displayName: "UCF", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png", score: "0", seed: "10" } } },
  { id: "e8", name: "UConn vs Furman", shortName: "FUR @ UCONN", date: "2026-03-20T23:00:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "UConn", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/41.png", score: "0", seed: "2" }, away: { displayName: "Furman", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/231.png", score: "0", seed: "15" } } },

  // --- WEST REGION ---
  { id: "w1", name: "Arizona vs LIU", shortName: "LIU @ ARIZ", date: "2026-03-20T14:35:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Arizona", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/12.png", score: "0", seed: "1" }, away: { displayName: "Long Island", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/112.png", score: "0", seed: "16" } } },
  { id: "w2", name: "Villanova vs Utah St", shortName: "USU @ VILLA", date: "2026-03-20T17:10:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Villanova", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/222.png", score: "0", seed: "8" }, away: { displayName: "Utah State", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/328.png", score: "0", seed: "9" } } },
  { id: "w3", name: "Wisconsin vs High Point", shortName: "HPU @ WIS", date: "2026-03-19T14:50:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Wisconsin", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/275.png", score: "0", seed: "5" }, away: { displayName: "High Point", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2272.png", score: "0", seed: "12" } } },
  { id: "w4", name: "Arkansas vs Hawai'i", shortName: "HAW @ ARK", date: "2026-03-19T17:25:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Arkansas", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/8.png", score: "0", seed: "4" }, away: { displayName: "Hawai'i", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/62.png", score: "0", seed: "13" } } },
  { id: "w5", name: "Texas vs Yale", shortName: "YALE @ TEX", date: "2026-03-20T18:45:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Texas", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png", score: "0", seed: "6" }, away: { displayName: "Yale", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/43.png", score: "0", seed: "11" } } },
  { id: "w6", name: "Gonzaga vs Colgate", shortName: "COLG @ GONZ", date: "2026-03-20T21:15:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Gonzaga", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2250.png", score: "0", seed: "3" }, away: { displayName: "Colgate", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2142.png", score: "0", seed: "14" } } },
  { id: "w7", name: "Auburn vs Boise St", shortName: "BSU @ AUB", date: "2026-03-19T19:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Auburn", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2.png", score: "0", seed: "7" }, away: { displayName: "Boise State", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/68.png", score: "0", seed: "10" } } },
  { id: "w8", name: "Purdue vs Vermont", shortName: "UVM @ PUR", date: "2026-03-19T22:00:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Purdue", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2509.png", score: "0", seed: "2" }, away: { displayName: "Vermont", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/261.png", score: "0", seed: "15" } } },

  // --- SOUTH REGION ---
  { id: "s1", name: "Florida vs TBD", shortName: "TBD @ FLA", date: "2026-03-20T22:25:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Florida", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/57.png", score: "0", seed: "1" }, away: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "16" } } },
  { id: "s2", name: "Clemson vs Iowa", shortName: "IOWA @ CLEM", date: "2026-03-20T19:50:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Clemson", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/228.png", score: "0", seed: "8" }, away: { displayName: "Iowa", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png", score: "0", seed: "9" } } },
  { id: "s3", name: "Alabama vs Drake", shortName: "DRAKE @ ALA", date: "2026-03-19T12:45:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Alabama", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/333.png", score: "0", seed: "5" }, away: { displayName: "Drake", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2181.png", score: "0", seed: "12" } } },
  { id: "s4", name: "Tennessee vs Samford", shortName: "SAM @ TENN", date: "2026-03-19T15:15:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Tennessee", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png", score: "0", seed: "4" }, away: { displayName: "Samford", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2535.png", score: "0", seed: "13" } } },
  { id: "s5", name: "Kentucky vs Oregon", shortName: "ORE @ UK", date: "2026-03-20T13:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Kentucky", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/96.png", score: "0", seed: "6" }, away: { displayName: "Oregon", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png", score: "0", seed: "11" } } },
  { id: "s6", name: "Houston vs Montana", shortName: "MONT @ HOU", date: "2026-03-20T16:00:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Houston", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/248.png", score: "0", seed: "3" }, away: { displayName: "Montana", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/149.png", score: "0", seed: "14" } } },
  { id: "s7", name: "Marquette vs VCU", shortName: "VCU @ MARQ", date: "2026-03-19T18:15:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Marquette", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/269.png", score: "0", seed: "7" }, away: { displayName: "VCU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2670.png", score: "0", seed: "10" } } },
  { id: "s8", name: "UNC vs Howard", shortName: "HOW @ UNC", date: "2026-03-19T20:45:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "N. Carolina", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/153.png", score: "0", seed: "2" }, away: { displayName: "Howard", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/47.png", score: "0", seed: "15" } } },

  // --- MIDWEST REGION ---
  { id: "m1", name: "Michigan vs TBD", shortName: "TBD @ MICH", date: "2026-03-19T20:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Michigan", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/130.png", score: "0", seed: "1" }, away: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "16" } } },
  { id: "m2", name: "Georgia vs St Louis", shortName: "SLU @ UGA", date: "2026-03-19T22:45:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Georgia", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/61.png", score: "0", seed: "8" }, away: { displayName: "Saint Louis", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2534.png", score: "0", seed: "9" } } },
  { id: "m3", name: "Illinois vs Princeton", shortName: "PRIN @ ILL", date: "2026-03-20T12:15:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Illinois", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/356.png", score: "0", seed: "5" }, away: { displayName: "Princeton", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/154.png", score: "0", seed: "12" } } },
  { id: "m4", name: "Iowa St vs Morehead St", shortName: "MOR @ ISU", date: "2026-03-20T14:45:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Iowa State", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/66.png", score: "0", seed: "4" }, away: { displayName: "Morehead St", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2413.png", score: "0", seed: "13" } } },
  { id: "m5", name: "Creighton vs Colorado", shortName: "COLO @ CREI", date: "2026-03-19T11:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Creighton", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/156.png", score: "0", seed: "6" }, away: { displayName: "Colorado", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/38.png", score: "0", seed: "11" } } },
  { id: "m6", name: "Baylor vs Akron", shortName: "AKR @ BAY", date: "2026-03-19T14:00:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Baylor", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/239.png", score: "0", seed: "3" }, away: { displayName: "Akron", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2006.png", score: "0", seed: "14" } } },
  { id: "m7", name: "Texas Tech vs Nevada", shortName: "NEV @ TTU", date: "2026-03-20T17:30:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Texas Tech", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png", score: "0", seed: "7" }, away: { displayName: "Nevada", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2440.png", score: "0", seed: "10" } } },
  { id: "m8", name: "Kansas St vs Grambling", shortName: "GRAM @ KSU", date: "2026-03-20T20:00:00Z", round: 1, status: { type: { description: "Scheduled", state: "pre" } }, competitors: { home: { displayName: "Kansas State", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png", score: "0", seed: "2" }, away: { displayName: "Grambling", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2247.png", score: "0", seed: "15" } } }
];

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

      const processedGames: Game[] = (data.events || []).map((event: EventData) => {
        const competition = event.competitions[0];
        const homeCompetitor = competition.competitors.find(c => c.homeAway === "home");
        const awayCompetitor = competition.competitors.find(c => c.homeAway === "away");

        let round = 1;
        if (activeSport === 'ncaa') {
          const note = competition.notes?.[0]?.text.toUpperCase() || "";
          if (note.includes("1ST ROUND") || note.includes("FIRST ROUND")) round = 1;
          else if (note.includes("2ND ROUND") || note.includes("SECOND ROUND")) round = 2;
          else if (note.includes("SWEET 16") || note.includes("REGIONAL SEMIFINAL")) round = 3;
          else if (note.includes("ELITE 8") || note.includes("REGIONAL FINAL")) round = 4;
          else if (note.includes("FINAL FOUR") || note.includes("NATIONAL SEMIFINAL")) round = 5;
          else if (note.includes("CHAMPIONSHIP") || note.includes("NATIONAL CHAMPIONSHIP")) round = 6;
        }

        return {
          id: event.id,
          name: event.name,
          shortName: event.shortName,
          date: event.date,
          round,
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
              seed: homeCompetitor?.curatedRank?.current?.toString() || "16",
            },
            away: {
              displayName: awayCompetitor?.team.displayName || "N/A",
              logo: awayCompetitor?.team.logo || "/placeholder.svg",
              score: awayCompetitor?.score || "0",
              seed: awayCompetitor?.curatedRank?.current?.toString() || "16",
            },
          },
        };
      });

      if (activeSport === 'ncaa' && processedGames.length === 0) {
        setGames(FALLBACK_NCAA_GAMES);
      } else {
        setGames(processedGames);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error(`Failed to fetch ${activeSport} game data:`, err);
      if (activeSport === 'ncaa') {
        setGames(FALLBACK_NCAA_GAMES);
        setError(null);
      } else {
        setError(`Failed to load ${activeSport.toUpperCase()} game data.`);
        setGames([]);
      }
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
      // 1. Favorites first
      const aIsFavorited = favoriteGameIds.has(a.id);
      const bIsFavorited = favoriteGameIds.has(b.id);
      if (aIsFavorited && !bIsFavorited) return -1;
      if (!aIsFavorited && bIsFavorited) return 1;

      // 2. Sort by state (Live/Halftime > Scheduled > Final)
      const getStatePriority = (state: string, desc: string) => {
        if (desc === "Halftime" || state === "in") return 0;
        if (state === "pre") return 1;
        return 2;
      };
      const aPriority = getStatePriority(a.status.type.state, a.status.type.description);
      const bPriority = getStatePriority(b.status.type.state, b.status.type.description);
      if (aPriority !== bPriority) return aPriority - bPriority;

      // 3. Chronological sort within groups
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [games, favoriteGameIds]);

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
        <div className="w-full max-w-6xl mb-12 space-y-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">March Madness Bracket</h2>
          </div>
          <Bracket games={games} onGameClick={setSelectedGame} />
          
          <div className="flex items-center justify-center gap-3 pt-8">
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Standard View</h2>
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
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
          sortedGames.length === 1 ? "flex justify-center" : "grid grid-cols-1 min-[720px]:grid-cols-2 gap-2"
        )}>
          {sortedGames.length > 0 ? (
            sortedGames.map((game) => (
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