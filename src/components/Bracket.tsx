"use client";

import React, { useMemo } from "react";
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
  const groupedRegions = useMemo(() => {
    const regions: Record<string, Game[]> = {
      East: [],
      West: [],
      South: [],
      Midwest: []
    };

    // First, use explicit region data if available
    games.forEach(game => {
      if (game.region && regions[game.region]) {
        regions[game.region].push(game);
      }
    });

    // Fallback: If regions are empty or incomplete, group by seed pairing logic
    // Each region has exactly 8 games in the Round of 64
    const unassignedGames = games.filter(g => !g.region || g.region === "Other");
    
    if (unassignedGames.length > 0) {
      // Group into 4 buckets of 8
      for (let i = 0; i < 4; i++) {
        const regionName = REGIONS[i];
        if (regions[regionName].length === 0) {
          regions[regionName] = unassignedGames.slice(i * 8, (i + 1) * 8);
        }
      }
    }

    // Sort each region by standard bracket pairing order (1/16, 8/9, 5/12, 4/13, 6/11, 3/14, 7/10, 2/15)
    const pairingOrder = ["1", "8", "5", "4", "6", "3", "7", "2"];
    
    Object.keys(regions).forEach(regionName => {
      regions[regionName].sort((a, b) => {
        const aSeed = a.competitors.away.seed || a.competitors.home.seed || "0";
        const bSeed = b.competitors.away.seed || b.competitors.home.seed || "0";
        return pairingOrder.indexOf(aSeed) - pairingOrder.indexOf(bSeed);
      });
    });

    return regions;
  }, [games]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
      {REGIONS.map((region) => {
        const regionGames = groupedRegions[region];
        
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