"use client";

import React, { useMemo } from "react";
import BracketGameCard from "./BracketGameCard";
import { cn } from "@/lib/utils";

interface Game {
  id: string;
  date: string;
  status: {
    type: {
      description: string;
      state: "pre" | "in" | "post";
      shortDetail?: string;
    };
  };
  competitors: {
    home: any;
    away: any;
  };
  round?: number;
}

interface BracketProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  const { leftSide, rightSide } = useMemo(() => {
    // Sort all 32 games by date and time
    const sortedGames = [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Split into 2 sides: first 16 games and next 16 games
    return {
      leftSide: sortedGames.slice(0, 16),
      rightSide: sortedGames.slice(16, 32)
    };
  }, [games]);

  if (games.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {/* Left Side Column */}
        <div className="space-y-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Left Bracket</span>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {leftSide.map((game, idx) => (
              <div 
                key={game.id} 
                className={cn(
                  "flex justify-center",
                  idx % 2 === 1 ? "mb-8" : "" // Visual spacing to group matchups
                )}
              >
                <BracketGameCard game={game} onClick={onGameClick} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Right Bracket</span>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {rightSide.map((game, idx) => (
              <div 
                key={game.id} 
                className={cn(
                  "flex justify-center",
                  idx % 2 === 1 ? "mb-8" : "" // Visual spacing to group matchups
                )}
              >
                <BracketGameCard game={game} onClick={onGameClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bracket;