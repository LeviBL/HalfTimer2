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
    const rounds: Game[][] = [];
    
    for (let r = 1; r <= 6; r++) {
      const roundGames = games
        .filter(g => g.round === r)
        .sort((a, b) => (a.bracketPosition || 0) - (b.bracketPosition || 0));
      
      const expectedSize = 32 / Math.pow(2, r - 1);
      const filledRound: Game[] = [];
      
      for (let i = 0; i < expectedSize; i++) {
        const existingGame = roundGames.find(g => {
          // ESPN's bracketPosition is often 1-indexed within the round or global
          // We try to match by index if bracketPosition isn't perfectly sequential
          return g.bracketPosition === i || g.bracketPosition === i + 1 || roundGames.indexOf(g) === i;
        });

        if (existingGame) {
          filledRound.push(existingGame);
        } else {
          filledRound.push({
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
      rounds.push(filledRound);
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