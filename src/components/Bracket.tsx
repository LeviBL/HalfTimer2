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

// Standard bracket pairing order for Round of 64
const PAIRING_ORDER = [
  { away: "1", home: "16" },
  { away: "8", home: "9" },
  { away: "5", home: "12" },
  { away: "4", home: "13" },
  { away: "6", home: "11" },
  { away: "3", home: "14" },
  { away: "7", home: "10" },
  { away: "2", home: "15" }
];

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  const groupedRegions = useMemo(() => {
    const regions: Record<string, Game[]> = {
      East: [],
      West: [],
      South: [],
      Midwest: []
    };

    // Group games into regions
    // If ESPN doesn't provide explicit region, we distribute the 32 games into 4 buckets of 8
    const sortedAll = [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    games.forEach(game => {
      if (game.region && regions[game.region]) {
        regions[game.region].push(game);
      }
    });

    // Fallback distribution if regions are missing
    const unassigned = games.filter(g => !g.region || g.region === "Other");
    if (unassigned.length > 0) {
      REGIONS.forEach((region, i) => {
        if (regions[region].length === 0) {
          regions[region] = unassigned.slice(i * 8, (i + 1) * 8);
        }
      });
    }

    // Sort each region by the specific pairing order
    Object.keys(regions).forEach(regionName => {
      const regionGames = regions[regionName];
      const ordered: Game[] = [];
      
      PAIRING_ORDER.forEach(pair => {
        const match = regionGames.find(g => 
          (g.competitors.away.seed === pair.away && g.competitors.home.seed === pair.home) ||
          (g.competitors.home.seed === pair.away && g.competitors.away.seed === pair.home)
        );
        if (match) ordered.push(match);
      });

      // If pairing logic fails (e.g. seeds are different), just keep what we have
      regions[regionName] = ordered.length === 8 ? ordered : regionGames;
    });

    return regions;
  }, [games]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-16">
      {REGIONS.map((region) => {
        const regionGames = groupedRegions[region];
        if (regionGames.length === 0) return null;

        return (
          <div key={region} className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gray-300 flex-grow"></div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-[0.2em]">{region} Region</h3>
              <div className="h-px bg-gray-300 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Top Half of Region (1/16, 8/9, 5/12, 4/13) */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {regionGames.slice(0, 2).map(game => (
                    <BracketGameCard key={game.id} game={game} onClick={onGameClick} />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {regionGames.slice(2, 4).map(game => (
                    <BracketGameCard key={game.id} game={game} onClick={onGameClick} />
                  ))}
                </div>
              </div>

              {/* Bottom Half of Region (6/11, 3/14, 7/10, 2/15) */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {regionGames.slice(4, 6).map(game => (
                    <BracketGameCard key={game.id} game={game} onClick={onGameClick} />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {regionGames.slice(6, 8).map(game => (
                    <BracketGameCard key={game.id} game={game} onClick={onGameClick} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Bracket;