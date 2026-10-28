"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAbbreviatedTeamName as getNflAbbreviation } from "@/utils/nflTeamAbbreviations";
import { getAbbreviatedNbaTeamName as getNbaAbbreviation } from "@/utils/nbaTeamAbbreviations";
import { ProgressWithIndicator } from "@/components/ProgressWithIndicator";
import { Star, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { Game } from "@/pages/HalfTimer";
import { gamePath } from "@/utils/gameData";
import { useNflKickoffReceiver } from "@/hooks/use-game-summary";
import MatchupHeader from "@/components/MatchupHeader";
import PossessionIndicator from "@/components/PossessionIndicator";

export const HALFTIME_DURATIONS = {
  nfl: 12 * 60 + 20, // 12 minutes and 20 seconds
  nba: 14 * 60 + 20, // 14 minutes and 20 seconds
};

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

interface GameCardProps {
  game: Game;
  isFavorited?: boolean;
  onToggleFavorite?: (gameId: string) => void;
  sport: 'nfl' | 'nba';
  halftimeStartTime: number | undefined;
  lastUpdated?: string | null;
  detailed?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, isFavorited, onToggleFavorite, sport, halftimeStartTime, lastUpdated, detailed = false }) => {
  const [halftimeRemainingSeconds, setHalftimeRemainingSeconds] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const gameStatusDescription = game.status.type.description;
  const halftimeDuration = HALFTIME_DURATIONS[sport];

  const isHalftime = gameStatusDescription === "Halftime" || game.status.type.shortDetail === "HT";
  const isScheduled = game.status.type.state === "pre";
  const isFinal = game.status.type.state === "post";
  const isInProgress = game.status.type.state === "in" && !isHalftime;
  const receiver = useNflKickoffReceiver(game, sport, isHalftime);
  const showPossession = sport === "nfl" && isInProgress;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isHalftime || !halftimeStartTime) {
      setHalftimeRemainingSeconds(null);
      return;
    }

    const calculateRemaining = () => {
      const elapsed = Math.floor((Date.now() - halftimeStartTime) / 1000);
      return Math.max(0, halftimeDuration - elapsed);
    };

    setHalftimeRemainingSeconds(calculateRemaining());

    intervalRef.current = setInterval(() => {
      const remaining = calculateRemaining();
      setHalftimeRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHalftime, halftimeStartTime, halftimeDuration]);

  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const shareUrl = new URL(gamePath(sport, game.id), window.location.origin).href;
    const shareText = `Tune into The Halftimer to see exactly how much halftime is left in the ${game.competitors.away.displayName} vs ${game.competitors.home.displayName} game. ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Game link copied to clipboard!");
    } catch {
      toast.error("Couldn't copy the link. Please copy the game URL from your address bar.");
    }
  };

  const halftimeProgress =
    halftimeRemainingSeconds !== null && halftimeDuration > 0
      ? ((halftimeDuration - halftimeRemainingSeconds) / halftimeDuration) * 100
      : 0;

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
    if (sport === 'nfl') return getNflAbbreviation(name);
    if (sport === 'nba') return getNbaAbbreviation(name);
    return name;
  };

  return (
    <Card
      className={cn(
        "text-gray-800 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 relative mx-auto",
        detailed ? "w-full max-w-3xl border-0 shadow-xl shadow-slate-200/60" : cn("w-[340px] hover:shadow-xl border-[3px]", borderColorClass)
      )}
    >
      {!detailed && <Link
        to={gamePath(sport, game.id)}
        state={{ game, halftimeStartTime, lastUpdated }}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-inset"
        aria-label={`Open ${game.competitors.away.displayName} vs ${game.competitors.home.displayName}`}
      />}
      {detailed && <MatchupHeader game={game} sport={sport} />}
      <CardContent className={cn(
        "flex flex-col justify-between",
        detailed ? "p-4 pb-16 sm:p-6 sm:pb-16" : receiver ? "p-6 h-[282px]" : "p-6 h-[250px]",
        detailed ? "bg-gradient-to-b from-white to-slate-50" : isFinal ? "bg-gray-200" : "bg-gray-100"
      )}>
        {!detailed && <>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <img src={game.competitors.away.logo} alt={game.competitors.away.displayName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">{getTeamName(game.competitors.away.displayName)}</span>
            {showPossession && game.competitors.away.id && game.possessionId === game.competitors.away.id && <PossessionIndicator />}
          </div>
          <span className="text-3xl font-extrabold">{isScheduled ? "--" : game.competitors.away.score}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <img src={game.competitors.home.logo} alt={game.competitors.home.displayName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold">{getTeamName(game.competitors.home.displayName)}</span>
            {showPossession && game.competitors.home.id && game.possessionId === game.competitors.home.id && <PossessionIndicator />}
          </div>
          <span className="text-3xl font-extrabold">{isScheduled ? "--" : game.competitors.home.score}</span>
        </div>
        </>}

        <div className={cn("text-center font-semibold mb-4", detailed ? "text-2xl sm:text-3xl font-extrabold" : "text-lg")}>
          {detailed && isHalftime && <p className="mb-2 text-sm font-extrabold uppercase tracking-widest text-blue-800">Halftime countdown</p>}
          {isScheduled ? (
            <>
              <p className="text-gray-800">Scheduled: {formatScheduledTime(game.date)}</p>
              <p className="text-sm text-gray-500">{formatScheduledDate(game.date)}</p>
            </>
          ) : (
            isHalftime ? (
              halftimeRemainingSeconds !== null && halftimeRemainingSeconds > 0 ? (
                <div className="flex flex-col items-center">
                  <p className={cn("mb-2", detailed ? "text-[clamp(4rem,18vw,8rem)] leading-none font-black tracking-tight tabular-nums text-gray-900" : "text-gray-700")}>
                    {!detailed && "Halftime: "}{formatCountdown(halftimeRemainingSeconds)}
                  </p>
                  <ProgressWithIndicator value={halftimeProgress} className="w-full max-w-xs h-2 bg-gray-200" indicatorClassName={detailed ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-amber-500"} />
                </div>
              ) : (halftimeRemainingSeconds !== null && halftimeRemainingSeconds <= 0) ? (
                <p className="text-red-700 animate-pulse">2nd Half Starting Soon</p>
              ) : (
                <div className="flex items-center justify-center text-gray-700">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Syncing Countdown...</span>
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
          {receiver && <p className={cn("mt-2 font-semibold text-gray-700", detailed ? "text-base" : "text-xs")}>
            {detailed ? receiver.displayName : getTeamName(receiver.displayName)} to receive second-half kickoff.
          </p>}
        </div>
        
        <div className="absolute bottom-3 right-3 z-20 flex gap-2">
          <button
            onClick={handleShare}
            className={cn("rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:scale-110 transition-transform duration-200", detailed ? "p-3" : "p-1.5")}
            aria-label="Share game"
          >
            <Share2 className={cn("text-blue-500", detailed ? "h-5 w-5" : "h-3.5 w-3.5")} />
          </button>
          {!detailed && onToggleFavorite && <button
            onClick={(event) => { event.stopPropagation(); onToggleFavorite(game.id); }}
            className="p-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:scale-110 transition-transform duration-200"
            aria-label={isFavorited ? "Unfavorite game" : "Favorite game"}
            aria-pressed={isFavorited}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                isFavorited ? "fill-yellow-500 text-yellow-500" : "text-gray-400"
              )}
            />
          </button>}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
