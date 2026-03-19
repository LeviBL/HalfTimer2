"use client";

import React, { useMemo } from "react";
import BracketGameCard from "./BracketGameCard";
import { cn } from "@/lib/utils";

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
    };
  };
  competitors: {
    home: Team;
    away: Team;
  };
  round?: number;
}

interface BracketProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}

const ROUND_NAMES = [
  "Round of 64",
  "Round of 32",
  "Sweet 16",
  "Elite 8",
  "Final Four",
  "Championship"
];

// Fixed dimensions for deterministic alignment
const CARD_HEIGHT = 130;
const BASE_GAP = 40;
const SLOT_HEIGHT = CARD_HEIGHT + BASE_GAP;

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  // 1. Process the 32 Round of 64 games with strict seed-based ordering
  const round1Matches = useMemo(() => {
    // Filter for Round 1 games
    const r1 = games.filter(g => g.round === 1);
    
    // Define the strict NCAA seed pattern for a single region
    const seedPattern = [
      [1, 16], [8, 9], [5, 12], [4, 13],
      [6, 11], [3, 14], [7, 10], [2, 15]
    ];

    // Helper to identify a game by its seed pair
    const getSeedKey = (g: Game) => {
      const s1 = parseInt(g.competitors.home.seed || "0");
      const s2 = parseInt(g.competitors.away.seed || "0");
      return [s1, s2].sort((a, b) => a - b).join('-');
    };

    // Group games by their seed pair (there should be 4 games for each pair across 4 regions)
    const groups: Record<string, Game[]> = {};
    r1.forEach(g => {
      const key = getSeedKey(g);
      if (!groups[key]) groups[key] = [];
      groups[key].push(g);
    });

    // Sort each group by date to maintain consistent regional distribution
    Object.values(groups).forEach(group => {
      group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    const ordered: Game[] = [];
    // Build 4 regions using the seed pattern
    for (let region = 0; region < 4; region++) {
      seedPattern.forEach(([s1, s2]) => {
        const key = [s1, s2].sort((a, b) => a - b).join('-');
        const group = groups[key];
        if (group && group.length > 0) {
          const game = group.shift();
          if (game) ordered.push(game);
        }
      });
    }

    // If we have leftovers or fewer than 32 games, we return what we have
    // but the logic above ensures the first 32 follow the bracket order if data is present.
    return ordered.slice(0, 32);
  }, [games]);

  // 2. Generate the full bracket structure (6 rounds)
  // STRICT RULE: Only Round of 64 has real data. Rounds 1-5 are strictly TBD.
  const bracketData = useMemo(() => {
    const rounds: Game[][] = [round1Matches.map(g => ({ ...g, round: 1 }))];

    for (let r = 1; r < 6; r++) {
      const currentRoundSize = rounds[r - 1].length / 2;
      const currentRoundMatches: Game[] = [];

      for (let i = 0; i < currentRoundSize; i++) {
        currentRoundMatches.push({
          id: `r${r}-m${i}`,
          date: "TBD",
          status: { type: { description: "TBD", state: "pre" } },
          round: r + 1,
          competitors: {
            away: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "" },
            home: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "" }
          }
        });
      }
      rounds.push(currentRoundMatches);
    }

    return rounds;
  }, [round1Matches]);

  if (round1Matches.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-12">
      <div className="flex gap-16 min-w-max px-12 py-8">
        {bracketData.map((roundMatches, roundIdx) => {
          // Calculate vertical spacing for this round
          // Round 0: 1x SLOT_HEIGHT
          // Round 1: 2x SLOT_HEIGHT
          // Round 2: 4x SLOT_HEIGHT
          const roundSlotHeight = SLOT_HEIGHT * Math.pow(2, roundIdx);
          
          return (
            <div 
              key={roundIdx} 
              className="flex flex-col" 
              style={{ width: "280px" }}
            >
              {/* Round Header */}
              <div className="text-center mb-8 h-12 flex items-end justify-center">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2 w-full">
                  {ROUND_NAMES[roundIdx]}
                </h3>
              </div>

              {/* Matches Container */}
              <div className="relative flex-grow">
                {roundMatches.map((game, matchIdx) => {
                  const isEven = matchIdx % 2 === 0;
                  const connectorHeight = roundSlotHeight / 2;

                  return (
                    <div 
                      key={game.id} 
                      className="relative flex items-center justify-center"
                      style={{ height: `${roundSlotHeight}px` }}
                    >
                      <BracketGameCard game={game} onClick={onGameClick} />
                      
                      {/* Connector Lines (Progressing Right) */}
                      {roundIdx < 5 && (
                        <div className="absolute right-[-64px] w-16 h-full pointer-events-none">
                          {/* Horizontal line out from current game */}
                          <div 
                            className="absolute top-1/2 right-8 w-8 h-px bg-gray-300" 
                            style={{ transform: 'translateY(-50%)' }}
                          />
                          
                          {/* Vertical connector line */}
                          <div 
                            className={cn(
                              "absolute right-8 w-px bg-gray-300",
                              isEven ? "top-1/2" : "bottom-1/2"
                            )}
                            style={{ height: `${connectorHeight}px` }}
                          />

                          {/* Horizontal line into next round (only for even matches to center) */}
                          {isEven && (
                            <div 
                              className="absolute w-8 h-px bg-gray-300"
                              style={{ 
                                top: `calc(50% + ${connectorHeight}px)`, 
                                right: 0,
                                transform: 'translateY(-50%)'
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .min-w-max {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .min-w-max::-webkit-scrollbar {
          height: 6px;
        }
        .min-w-max::-webkit-scrollbar-track {
          background: transparent;
        }
        .min-w-max::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default Bracket;