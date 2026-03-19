"use client";

import React, { useMemo } from "react";
import BracketGameCard from "./BracketGameCard";
import { cn } from "@/lib/utils";
import { Game } from "@/pages/HalfTimer";

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

const CARD_HEIGHT = 130;
const BASE_GAP = 40;
const SLOT_HEIGHT = CARD_HEIGHT + BASE_GAP;

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  const bracketData = useMemo(() => {
    // 1. Order Round 1 (Round of 64) strictly by seed pattern
    const r1Games = games.filter(g => g.round === 1);
    
    const getSeedKey = (g: Game) => {
      const s1 = parseInt(g.competitors.home.seed || "0");
      const s2 = parseInt(g.competitors.away.seed || "0");
      const sorted = [s1, s2].sort((a, b) => a - b);
      return `${sorted[0]}-${sorted[1]}`;
    };

    const groups: Record<string, Game[]> = {};
    r1Games.forEach(g => {
      const key = getSeedKey(g);
      if (!groups[key]) groups[key] = [];
      groups[key].push(g);
    });

    // Sort by date to keep regions consistent
    Object.values(groups).forEach(group => {
      group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    const seedPattern = ["1-16", "8-9", "5-12", "4-13", "6-11", "3-14", "7-10", "2-15"];
    const orderedR1: Game[] = [];
    
    for (let region = 0; region < 4; region++) {
      seedPattern.forEach(key => {
        if (groups[key] && groups[key].length > 0) {
          orderedR1.push(groups[key].shift()!);
        } else {
          // Placeholder if game missing
          orderedR1.push({
            id: `placeholder-r1-reg${region}-${key}`,
            name: "TBD vs TBD",
            shortName: "TBD",
            date: "TBD",
            status: { type: { description: "TBD", state: "pre" } },
            round: 1,
            competitors: {
              home: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: key.split('-')[0] },
              away: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: key.split('-')[1] }
            }
          });
        }
      });
    }

    const rounds: Game[][] = [orderedR1];

    // 2. Populate subsequent rounds based on the "Path" from Round 1
    for (let r = 2; r <= 6; r++) {
      const prevRound = rounds[r - 2];
      const currentRoundSize = prevRound.length / 2;
      const currentRound: Game[] = [];
      const apiGamesForRound = games.filter(g => g.round === r);

      for (let i = 0; i < currentRoundSize; i++) {
        const parent1 = prevRound[i * 2];
        const parent2 = prevRound[i * 2 + 1];
        
        // Get all possible team names that could be in this slot
        const possibleTeams = new Set([
          parent1.competitors.home.displayName,
          parent1.competitors.away.displayName,
          parent2.competitors.home.displayName,
          parent2.competitors.away.displayName
        ]);

        // Find a game in the API for this round that involves these teams
        const matchingGame = apiGamesForRound.find(g => 
          possibleTeams.has(g.competitors.home.displayName) || 
          possibleTeams.has(g.competitors.away.displayName)
        );

        if (matchingGame) {
          currentRound.push(matchingGame);
        } else {
          currentRound.push({
            id: `placeholder-r${r}-p${i}`,
            name: "TBD vs TBD",
            shortName: "TBD",
            date: "TBD",
            status: { type: { description: "TBD", state: "pre" } },
            round: r,
            competitors: {
              home: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "" },
              away: { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "" }
            }
          });
        }
      }
      rounds.push(currentRound);
    }

    return rounds;
  }, [games]);

  if (games.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-12">
      <div className="flex gap-16 min-w-max px-12 py-8">
        {bracketData.map((roundMatches, roundIdx) => {
          const roundSlotHeight = SLOT_HEIGHT * Math.pow(2, roundIdx);
          
          return (
            <div 
              key={roundIdx} 
              className="flex flex-col" 
              style={{ width: "280px" }}
            >
              <div className="text-center mb-8 h-12 flex items-end justify-center">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2 w-full">
                  {ROUND_NAMES[roundIdx]}
                </h3>
              </div>

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
                      
                      {roundIdx < 5 && (
                        <div className="absolute right-[-64px] w-16 h-full pointer-events-none">
                          <div 
                            className="absolute top-1/2 right-8 w-8 h-px bg-gray-300" 
                            style={{ transform: 'translateY(-50%)' }}
                          />
                          
                          <div 
                            className={cn(
                              "absolute right-8 w-px bg-gray-300",
                              isEven ? "top-1/2" : "bottom-1/2"
                            )}
                            style={{ height: `${connectorHeight}px` }}
                          />

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