"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAbbreviatedTeamName } from "@/utils/nflTeamAbbreviations";
import { ProgressWithIndicator } from "@/components/ProgressWithIndicator";
import { Star } from "lucide-react";
import { useHalftimeTimers } from "@/hooks/use-halftime-timers";

// Helper function to format time for countdown (MM:SS)
const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Helper function to format scheduled game time
const formatScheduledTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Helper function to format scheduled game date (e.g., "Sunday, September 28")
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
}

const HALFTIME_DURATION_SECONDS = 12 * 60 + 20; // Adjusted to 12 minutes and 20 seconds (740 seconds)

const GameCard: React.FC<GameCardProps> = ({ game, isFavorited, onToggleFavorite }) => {
  const [halftimeRemainingSeconds, setHalftimeRemainingSeconds] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { getHalftimeStartTime, setHalftimeStartTime, clearHalftimeStartTime, isLoading: isHalftimeTimersLoading } = useHalftimeTimers();

  const gameStatusDescription = game.status.type.description;
  const gameId = game.id;

  useEffect(() => {
    console.log(`[GameCard ${gameId}] Effect re-run. isHalftimeTimersLoading: ${isHalftimeTimersLoading}, gameStatusDescription: ${gameStatusDescription}`);

    const isCurrentlyHalftime = gameStatusDescription === "Halftime";

    // Always clear any existing interval when the effect re-runs
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If halftime timers are still loading, we cannot make decisions yet.
    // Clear any stale timer display and wait for the hook to finish loading.
    if (isHalftimeTimersLoading) {
      console.log(`[GameCard ${gameId}] Halftime timers still loading. Skipping timer logic.`);
      setHalftimeRemainingSeconds(null);
      return;
    }

    const storedHalftimeStartTime = getHalftimeStartTime(gameId);
    // The console.log inside getHalftimeStartTime will show what it returns.

    if (isCurrentlyHalftime) {
      if (storedHalftimeStartTime === undefined) {
        console.log(`[GameCard ${gameId}] Halftime detected, but no stored start time in hook's map. Attempting to set new timestamp.`);
        // This is the "first to detect" logic.
        // It will set Date.now() and then the real-time subscription will update the hook's map,
        // causing this effect to re-run with storedHalftimeStartTime defined.
        setHalftimeStartTime(gameId, Date.now());
        setHalftimeRemainingSeconds(null); // Keep null until the real-time update confirms the timestamp
      } else {
        console.log(`[GameCard ${gameId}] Halftime detected, using stored start time: ${storedHalftimeStartTime}`);
        const calculateCurrentRemaining = () => {
          const elapsed = Math.floor((Date.now() - storedHalftimeStartTime!) / 1000);
          return Math.max(0, HALFTIME_DURATION_SECONDS - elapsed);
        };

        setHalftimeRemainingSeconds(calculateCurrentRemaining());

        intervalRef.current = setInterval(() => {
          const currentRemaining = calculateCurrentRemaining();
          setHalftimeRemainingSeconds(currentRemaining);
          if (currentRemaining <= 0) {
            console.log(`[GameCard ${gameId}] Halftime timer ended.`);
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            clearHalftimeStartTime(gameId);
          }
        }, 1000);
      }
    } else {
      console.log(`[GameCard ${gameId}] Not in halftime. Clearing local timer.`);
      setHalftimeRemainingSeconds(null);
      if (storedHalftimeStartTime !== undefined) {
        console.log(`[GameCard ${gameId}] Clearing stored halftime start time from Supabase.`);
        clearHalftimeStartTime(gameId);
      }
    }

    return () => {
      if (intervalRef.current) {
        console.log(`[GameCard ${gameId}] Cleaning up interval for ${gameId}.`);
        clearInterval(intervalRef.current);
      }
    };
  }, [gameStatusDescription, gameId, getHalftimeStartTime, setHalftimeStartTime, clearHalftimeStartTime, isHalftimeTimersLoading]);

  // Calculate halftime progress for the progress bar
  const halftimeProgress =
    halftimeRemainingSeconds !== null && HALFTIME_DURATION_SECONDS > 0
      ? ((HALFTIME_DURATION_SECONDS - halftimeRemainingSeconds) / HALFTIME_DURATION_SECONDS) * 100
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

  return (
    <Card
      className={cn(
        "w-[320px] text-gray-800 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 relative mx-auto", // Added mx-auto here
        "border-[3px]",
        borderColorClass
      )}
    >
      <CardContent className={cn(
        "p-6 flex flex-col justify-between h-full",
        isFinal ? "bg-gray-200" : "bg-gray-100"
      )}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <img src={game.competitors.away.logo} alt={game.competitors.away.displayName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">{getAbbreviatedTeamName(game.competitors.away.displayName)}</span>
          </div>
          <span className="text-3xl font-extrabold">{game.competitors.away.score}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <img src={game.competitors.home.logo} alt={game.competitors.home.displayName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">{getAbbreviatedTeamName(game.competitors.home.displayName)}</span>
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
            isHalftime && halftimeRemainingSeconds !== null && halftimeRemainingSeconds > 0 ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-700 mb-2">Halftime: {formatCountdown(halftimeRemainingSeconds)}</p>
                <ProgressWithIndicator value={halftimeProgress} className="w-full max-w-xs h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
              </div>
            ) : isHalftime && halftimeRemainingSeconds === 0 ? (
              <p className="text-red-700 animate-pulse">2nd Half Starting</p>
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