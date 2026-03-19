"use client";

import React from "react";
import BracketGameCard from "./BracketGameCard";

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
  region?: string;
}

interface BracketProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}

const REGIONS = ["East", "West", "South", "Midwest"];

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  const getGamesForRegion = (region: string) => {
    return games
      .filter(g => g.region === region)
      .sort((a, b) => {
        // Sort by seed pairing (1 vs 16, 8 vs 9, etc.)
        const aSeed = parseInt(a.competitors.away.seed || "0");
        const bSeed = parseInt(b.competitors.away.seed || "0");
        return aSeed - bSeed;
      });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
      {REGIONS.map((region) => {
        const regionGames = getGamesForRegion(region);
        
        return (
          <div key={region} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-grow"></div>
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">{region} Region</h3>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {regionGames.length > 0 ? (
                regionGames.map((game) => (
                  <div key={game.id} className="flex justify-center">
                    <BracketGameCard game={game} onClick={onGameClick} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 italic text-sm">
                  Region data loading or not yet available...
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Bracket;