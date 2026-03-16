"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHalftimeTimers } from "@/hooks/use-halftime-timers";

interface Team {
  displayName: string;
  logo: string;
  score: string;
  seed?: string;
}

interface Game {
  id: string;
  date: string;
  status: {
    type: {
      description: string;
      state: "pre" | "in" | "post";
      shortDetail?: string;
      detail?: string;
    };
  };
  competitors: {
    home: Team;
    away: Team;
  };
}

interface BracketGameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const BracketGameCard: React.FC<BracketGameCardProps> = ({ game, onClick }) => {
  const [halftimeRemaining, setHalftimeRemaining] = useState<number | null>(null);
  const { getHalftimeStartTime } = useHalftimeTimers();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isHalftime = game.status.type.description === "Halftime";
  const isFinal = game.status.type.state === "post";
  const isScheduled = game.status.type.state === "pre";

  useEffect(() => {
    if (isHalftime) {
      const startTime = getHalftimeStartTime(game.id) || Date.now();
      const duration = 14 * 60 + 25;

      const update = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setHalftimeRemaining(Math.max(0, duration - elapsed));
      };

      update();
      intervalRef.current = setInterval(update, 1000);
    } else {
      setHalftimeRemaining(null);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHalftime, game.id, getHalftimeStartTime]);

  // Extract time from detail string (e.g., "Mar 19, 11:50 AM") or fallback to local time
  const displayTime = game.status.type.detail 
    ? game.status.type.detail.split(',').pop()?.trim() 
    : new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card 
      onClick={() => onClick(game)}
      className={cn(
        "w-52 p-2 cursor-pointer hover:shadow-md transition-all border-2",
        isHalftime ? "border-amber-400 bg-amber-50/30" : "border-gray-200 bg-white"
      )}
    >
      <div className="space-y-2">
        {/* Away Team */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="text-gray-500 font-bold min-w-[1.75rem]">({game.competitors.away.seed || "?"})</span>
            <img src={game.competitors.away.logo} className="w-5 h-5 object-contain flex-shrink-0" alt="" />
            <span className="truncate font-semibold text-gray-900">{game.competitors.away.displayName}</span>
          </div>
          <span className="font-bold ml-2">{game.competitors.away.score}</span>
        </div>

        {/* Home Team */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="text-gray-500 font-bold min-w-[1.75rem]">({game.competitors.home.seed || "?"})</span>
            <img src={game.competitors.home.logo} className="w-5 h-5 object-contain flex-shrink-0" alt="" />
            <span className="truncate font-semibold text-gray-900">{game.competitors.home.displayName}</span>
          </div>
          <span className="font-bold ml-2">{game.competitors.home.score}</span>
        </div>

        {/* Status */}
        <div className="pt-1.5 border-t border-gray-100 text-[10px] text-center font-bold uppercase tracking-wider">
          {isHalftime ? (
            <span className="text-amber-600">Halftime: {halftimeRemaining !== null ? formatCountdown(halftimeRemaining) : "..."}</span>
          ) : isScheduled ? (
            <span className="text-gray-500">{displayTime}</span>
          ) : isFinal ? (
            <span className="text-red-600">Final</span>
          ) : (
            <span className="text-emerald-600">{game.status.type.shortDetail}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BracketGameCard;