"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHalftimeTimers } from "@/hooks/use-halftime-timers";
import { Shield } from "lucide-react";

interface Team {
  displayName: string;
  logo: string;
  score: string;
  seed?: string;
  line?: string;
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
  network?: string;
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

  // Format date to local time (e.g., "Mar 19 - 8:50 AM")
  const localTime = new Date(game.date).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const localDate = new Date(game.date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  const isTbd = game.competitors.away.displayName === "TBD" || game.competitors.home.displayName === "TBD";

  return (
    <Card 
      onClick={() => onClick(game)}
      className={cn(
        "w-64 p-3 cursor-pointer hover:shadow-lg transition-all border-2 bg-white rounded-xl relative",
        isHalftime ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100 shadow-sm"
      )}
    >
      {/* Betting Line */}
      {!isTbd && isScheduled && (
        <div className="absolute top-2 right-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
          {game.competitors.home.line || `${game.competitors.home.displayName.substring(0,3).toUpperCase()} -0.0`}
        </div>
      )}

      <div className="space-y-3">
        {/* Away Team */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            {game.competitors.away.displayName === "TBD" ? (
              <Shield className="w-5 h-5 text-gray-300 fill-gray-100" />
            ) : (
              <img src={game.competitors.away.logo} className="w-6 h-6 object-contain flex-shrink-0" alt="" />
            )}
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-gray-400 font-bold text-sm">{game.competitors.away.seed}</span>
              <span className="font-bold text-gray-900 text-sm truncate">{game.competitors.away.displayName}</span>
            </div>
          </div>
          {!isScheduled && <span className="font-black text-gray-900 ml-2">{game.competitors.away.score}</span>}
        </div>

        {/* Home Team */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            {game.competitors.home.displayName === "TBD" ? (
              <Shield className="w-5 h-5 text-gray-300 fill-gray-100" />
            ) : (
              <img src={game.competitors.home.logo} className="w-6 h-6 object-contain flex-shrink-0" alt="" />
            )}
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-gray-400 font-bold text-sm">{game.competitors.home.seed}</span>
              <span className="font-bold text-gray-900 text-sm truncate">{game.competitors.home.displayName}</span>
            </div>
          </div>
          {!isScheduled && <span className="font-black text-gray-900 ml-2">{game.competitors.home.score}</span>}
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {isHalftime ? (
            <span className="text-blue-600 animate-pulse">Halftime: {halftimeRemaining !== null ? formatCountdown(halftimeRemaining) : "..."}</span>
          ) : isScheduled ? (
            <>
              <span>{localDate} - {localTime}</span>
              <span className="text-gray-300">{game.network || "CBS"}</span>
            </>
          ) : isFinal ? (
            <span className="text-red-500">Final</span>
          ) : (
            <span className="text-emerald-500">{game.status.type.shortDetail}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BracketGameCard;