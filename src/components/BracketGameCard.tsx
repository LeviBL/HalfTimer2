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

  const dateObj = new Date(game.date);
  const localTime = dateObj.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const localDate = dateObj.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card 
      onClick={() => onClick(game)}
      className={cn(
        "w-full max-w-[280px] p-0 cursor-pointer hover:bg-gray-50 transition-all duration-200 border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md active:scale-95",
        isHalftime ? "ring-2 ring-amber-400 border-amber-400" : ""
      )}
    >
      <div className="divide-y divide-gray-100">
        {/* Away Team */}
        <div className="flex justify-between items-center px-4 py-3 h-12">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="text-gray-400 font-black text-xs w-5 text-center">
              ({game.competitors.away.seed || ""})
            </span>
            <div className="flex items-center gap-2 truncate">
              <img 
                src={game.competitors.away.logo} 
                className="w-5 h-5 object-contain flex-shrink-0" 
                alt="" 
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              <span className="font-bold text-sm truncate text-gray-900">
                {game.competitors.away.displayName}
              </span>
            </div>
          </div>
          {!isScheduled && (
            <span className="font-black text-gray-900 text-sm ml-2">{game.competitors.away.score}</span>
          )}
        </div>

        {/* Home Team */}
        <div className="flex justify-between items-center px-4 py-3 h-12">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="text-gray-400 font-black text-xs w-5 text-center">
              ({game.competitors.home.seed || ""})
            </span>
            <div className="flex items-center gap-2 truncate">
              <img 
                src={game.competitors.home.logo} 
                className="w-5 h-5 object-contain flex-shrink-0" 
                alt="" 
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              <span className="font-bold text-sm truncate text-gray-900">
                {game.competitors.home.displayName}
              </span>
            </div>
          </div>
          {!isScheduled && (
            <span className="font-black text-gray-900 text-sm ml-2">{game.competitors.home.score}</span>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50/80 px-4 py-2 flex justify-center items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {isHalftime ? (
            <span className="text-amber-600 animate-pulse">Halftime: {halftimeRemaining !== null ? formatCountdown(halftimeRemaining) : "..."}</span>
          ) : isScheduled ? (
            <span>{localDate} • {localTime}</span>
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