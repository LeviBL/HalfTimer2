"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAbbreviatedTeamName as getNflAbbreviation } from "@/utils/nflTeamAbbreviations";
import { getAbbreviatedNbaTeamName as getNbaAbbreviation } from "@/utils/nbaTeamAbbreviations";
import { ProgressWithIndicator } from "@/components/ProgressWithIndicator";
import { Star, Loader2 } from "lucide-react";
import { useHalftimeTimers } from "@/hooks/use-halftime-timers";

const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatScheduledTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatScheduledDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
};

interface Team {
  displayName: string;
  logo: string;
  score: string;
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
    home: Team;
    away: Team;
  };
}

interface GameCardProps {
  game: Game;
  isFavorited: boolean;
  onToggleFavorite: (gameId: string) => void;
  sport: 'nfl' | 'nba';
}

// Durations in seconds
const DURATIONS = {
  nfl: 12 * 60 + 20, // 12:20
  nba: 14 * 60 + 30, // 14:30
};

const GameCard: React.FC<GameCardProps> = ({ game, isFavorited, onToggleFavorite, sport }) => {
  const [halftimeRemainingSeconds, setHalftimeRemainingSeconds] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { getHalftimeStartTime, isLoading: isHalftimeTimersLoading } = useHalftimeTimers();

  const gameStatusDescription = game.status.type.description;
  const gameId = game.id;
  const halftimeDuration = DURATIONS[sport];

  useEffect(() => {
    const isCurrentlyHalftime = gameStatusDescription === "Halftime";

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isHalftimeTimersLoading) {
      setHalftimeRemainingSeconds(null);
      return;
    }

    if (isCurrentlyHalftime) {
      let effectiveHalftimeStartTime = getHalftimeStartTime(gameId);

      if (effectiveHalftimeStartTime === undefined) {
        effectiveHalftimeStartTime = Date.now();
      }

      const calculateCurrentRemaining = () => {
        const elapsed = Math.floor((Date.now() - effectiveHalftimeStartTime!) / 1000);
        return Math.max(0, halftimeDuration - elapsed);
      };

      setHalftimeRemainingSeconds(calculateCurrentRemaining());

      intervalRef.current = setInterval(() => {
        const currentRemaining = calculateCurrentRemaining();
        setHalftimeRemainingSeconds(currentRemaining);
        if (currentRemaining <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }, 1000);
    } else {
      setHalftimeRemainingSeconds(null);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameStatusDescription, gameId, getHalftimeStartTime, isHalftimeTimersLoading, halftimeDuration]);

  const halftimeProgress =
    halftimeRemainingSeconds !== null && halftimeDuration > 0
      ? ((halftimeDuration - halftimeRemainingSeconds) / halftimeDuration) * 100
      : 0;

  const isHalftime = gameStatusDescription === "Halftime";
  const isScheduled = game.status.type.state === "pre";
  const isFinal = game.status.type.state === "post";
  const isInProgress = game.status.type.state === "in" && !isHalftime;

  const borderColorClass = isHalftime
    ? "border-amber-400"
    : game.status.type.state === "in"
    ? "border-emerald-500"
    : game.status.type.state === "post"
    ? "border-gray-400"
    : isScheduled
    ? "border-gray-100"
    : "border-transparent";

  const getTeamName = (name: string) => {
    return sport === 'nfl' ? getNflAbbreviation(name) : getNbaAbbreviation(name);
  };

  return (
    <Card
      className={cn(
        "w-[340px] text-gray-800 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 relative mx-auto",
        "border-[3px]",
        borderColorClass
      )}
    >
      <CardContent className={cn(
        "p-6 flex flex-col justify-between h-[250px]",
        isFinal ? "bg-gray-200" : "bg-gray-100"
      )}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <img src={game.competitors.away.logo} alt={game.competitors.away.displayName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">{getTeamName(game.competitors.away.displayName)}</span>
          </div>
          <span className="text-3xl font-extrabold">{game.competitors.away.score}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <img src={game.competitors.home.logo} alt={game.competitors.home.displayName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">{getTeamName(game.competitors.home.displayName)}</span>
          </div>
          <span className="text-3xl font-extrabold">{game.competitors.home.score}</span>
        </div>

        <div className="text-center text-lg font-semibold mb-4">
          {isScheduled ? (
            <>
              <p className="text-gray-800">Scheduled: {formatScheduledTime(game.date)}</p>
              <p className="text-sm text-gray-500">{formatScheduledDate(game.date)}</p>
            </>
          ) : (
            isHalftime ? (
              halftimeRemainingSeconds !== null && halftimeRemainingSeconds > 0 ? (
                <div className="flex flex-col items-center">
                  <p className="text-gray-700 mb-2">Halftime: {formatCountdown(halftimeRemainingSeconds)}</p>
                  <ProgressWithIndicator value={halftimeProgress} className="w-full max-w-xs h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                </div>
              ) : (halftimeRemainingSeconds !== null && halftimeRemainingSeconds <= 0) ? (
                <p className="text-red-700 animate-pulse">2nd Half Starting Soon</p>
              ) : (
                <div className="flex items-center justify-center text-gray-700">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Halftime (Initializing Timer...)</span>
                </div>
              )
            ) : isInProgress && game.status.type.shortDetail ? (
              <div className="flex flex-col items-center">
                <p className="text-green-700 mb-1 text-base">In Progress</p>
                <p className="text-gray-800">{game.status.type.shortDetail}</p>
              </div>
            ) : (
              <p className={cn("text-gray-700", { "text-red-700": isFinal })}>{game.status.type.description}</p>
            )
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(game.id)}
          className="absolute bottom-3 right-3 p-1 rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:scale-110 transition-transform duration-200"
          aria-label={isFavorited ? "Unfavorite game" : "Favorite game"}
        >
          <Star
            className={cn(
              "h-3 w-3",
              isFavorited ? "fill-yellow-500 text-yellow-500" : "text-gray-400"
            )}
          />
        </button>
      </CardContent>
    </Card>
  );
};

export default GameCard;