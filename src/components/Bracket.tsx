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

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  // 1. Process the 32 Round of 64 games
  const round1Matches = useMemo(() => {
    return [...games]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 32);
  }, [games]);

  // 2. Generate the full bracket structure (6 rounds)
  const bracketData = useMemo(() => {
    const rounds: Game[][] = [round1Matches];

    for (let r = 1; r < 6; r++) {
      const prevRound = rounds[r - 1];
      const currentRoundSize = prevRound.length / 2;
      const currentRoundMatches: any[] = [];

      for (let i = 0; i < currentRoundSize; i++) {
        const parent1 = prevRound[i * 2];
        const parent2 = prevRound[i * 2 + 1];

        // Determine winners if games are finished
        const getWinner = (game: Game) => {
          if (game.status.type.state !== "post") return null;
          const homeScore = parseInt(game.competitors.home.score || "0");
          const awayScore = parseInt(game.competitors.away.score || "0");
          return homeScore > awayScore ? game.competitors.home : game.competitors.away;
        };

        const winner1 = parent1 ? getWinner(parent1) : null;
        const winner2 = parent2 ? getWinner(parent2) : null;

        currentRoundMatches.push({
          id: `r${r}-m${i}`,
          date: parent1?.date || "",
          status: { type: { description: "TBD", state: "pre" } },
          competitors: {
            away: winner1 || { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "" },
            home: winner2 || { displayName: "TBD", logo: "/placeholder.svg", score: "0", seed: "" }
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
      <div className="flex gap-12 min-w-max px-8 py-4">
        {bracketData.map((roundMatches, roundIdx) => (
          <div key={roundIdx} className="flex flex-col justify-around gap-8 py-4" style={{ width: "280px" }}>
            {/* Round Header */}
            <div className="text-center mb-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">
                {ROUND_NAMES[roundIdx]}
              </h3>
            </div>

            {/* Matches */}
            <div className="flex-grow flex flex-col justify-around gap-12">
              {roundMatches.map((game, matchIdx) => (
                <div key={game.id} className="relative group">
                  <BracketGameCard game={game} onClick={onGameClick} />
                  
                  {/* Connector Lines (Progressing Right) */}
                  {roundIdx < 5 && (
                    <>
                      {/* Horizontal line out */}
                      <div className="absolute top-1/2 -right-6 w-6 h-px bg-gray-300" />
                      
                      {/* Vertical connector line */}
                      {matchIdx % 2 === 0 ? (
                        <div 
                          className="absolute right-[-24px] bg-gray-300" 
                          style={{ 
                            top: "50%", 
                            height: "calc(50% + 3.5rem)", // Dynamic height based on gap
                            width: "1px" 
                          }} 
                        />
                      ) : (
                        <div 
                          className="absolute right-[-24px] bg-gray-300" 
                          style={{ 
                            bottom: "50%", 
                            height: "calc(50% + 3.5rem)", 
                            width: "1px" 
                          }} 
                        />
                      )}

                      {/* Horizontal line into next round (only for even matches to center) */}
                      {matchIdx % 2 === 0 && (
                        <div 
                          className="absolute right-[-48px] bg-gray-300"
                          style={{ 
                            top: "calc(50% + 3.5rem)", 
                            width: "24px", 
                            height: "1px" 
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom CSS for Bracket Lines (Fallback/Refinement) */}
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