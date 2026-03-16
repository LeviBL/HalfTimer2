"use client";

import React from "react";
import BracketGameCard from "./BracketGameCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const ROUND_NAMES = [
  "Round of 64",
  "Round of 32",
  "Sweet 16",
  "Elite 8",
  "Final Four",
  "Championship"
];

const Bracket: React.FC<BracketProps> = ({ games, onGameClick }) => {
  // Helper to get games for a round, filling with placeholders to maintain structure
  const getGamesForRound = (roundIdx: number) => {
    const roundNum = roundIdx + 1;
    const realGames = games.filter(g => g.round === roundNum);
    const totalSlots = 32 / Math.pow(2, roundIdx);
    
    const displayGames = [...realGames];
    for (let i = realGames.length; i < totalSlots; i++) {
      displayGames.push({
        id: `tbd-${roundIdx}-${i}`,
        date: new Date().toISOString(),
        status: { type: { description: "Scheduled", state: "pre" } },
        competitors: {
          home: { displayName: "TBD", logo: "", score: "0", seed: "" },
          away: { displayName: "TBD", logo: "", score: "0", seed: "" }
        },
        round: roundNum
      });
    }
    return displayGames;
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex p-12 gap-0 min-w-max bg-white">
          {ROUND_NAMES.map((name, roundIdx) => {
            const roundGames = getGamesForRound(roundIdx);
            return (
              <div key={name} className="flex flex-col w-72 relative">
                {/* Round Header */}
                <div className="sticky top-0 mb-12 px-4 z-20">
                  <div className="text-gray-400 py-2 px-4 text-center border-b border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{name}</span>
                  </div>
                </div>

                {/* Games Container */}
                <div className="flex flex-col justify-around flex-grow relative">
                  {roundGames.map((game, gameIdx) => (
                    <div 
                      key={game.id} 
                      className="relative py-8 px-6 flex items-center"
                      style={{ height: `${100 / roundGames.length}%` }}
                    >
                      <BracketGameCard game={game} onClick={onGameClick} />
                      
                      {/* Connector Lines */}
                      {roundIdx < ROUND_NAMES.length - 1 && (
                        <>
                          {/* Horizontal line from card */}
                          <div className="absolute right-0 top-1/2 w-6 h-[1px] bg-gray-300"></div>
                          
                          {/* Vertical line connecting pairs */}
                          {gameIdx % 2 === 0 ? (
                            <div className="absolute -right-[1px] top-1/2 w-[1px] h-full bg-gray-300"></div>
                          ) : (
                            <div className="absolute -right-[1px] bottom-1/2 w-[1px] h-full bg-gray-300"></div>
                          )}
                          
                          {/* Horizontal line to next round (midpoint) */}
                          {gameIdx % 2 === 0 && (
                            <div className="absolute -right-6 top-[100%] w-6 h-[1px] bg-gray-300"></div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Bracket;