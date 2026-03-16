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
  const rounds = [1, 2, 3, 4, 5, 6].map(r => games.filter(g => g.round === r));

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex p-12 gap-0 min-w-max bg-gray-50/20">
          {ROUND_NAMES.map((name, roundIdx) => (
            <div key={name} className="flex flex-col w-64 relative">
              {/* Round Header */}
              <div className="sticky top-0 mb-8 px-4 z-20">
                <div className="bg-white/80 backdrop-blur-md text-gray-400 py-2 px-4 rounded-xl text-center border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{name}</span>
                </div>
              </div>

              {/* Games Container */}
              <div className="flex flex-col justify-around flex-grow relative">
                {rounds[roundIdx].length > 0 ? (
                  rounds[roundIdx].map((game, gameIdx) => (
                    <div key={game.id} className="relative py-4 px-4 flex items-center group">
                      <BracketGameCard game={game} onClick={onGameClick} />
                      
                      {/* Connector Lines */}
                      {roundIdx < ROUND_NAMES.length - 1 && (
                        <>
                          {/* Horizontal line from card */}
                          <div className="absolute right-0 top-1/2 w-4 h-[2px] bg-gray-200"></div>
                          
                          {/* Vertical line connecting pairs */}
                          {gameIdx % 2 === 0 ? (
                            <div className="absolute -right-[2px] top-1/2 w-[2px] h-full bg-gray-200"></div>
                          ) : (
                            <div className="absolute -right-[2px] bottom-1/2 w-[2px] h-full bg-gray-200"></div>
                          )}
                          
                          {/* Horizontal line to next round */}
                          {gameIdx % 2 === 0 && (
                            <div className="absolute -right-4 top-[100%] w-4 h-[2px] bg-gray-200"></div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  // Professional TBD Placeholder
                  <div className="flex flex-col justify-around h-full">
                    {Array.from({ length: Math.max(1, 16 / Math.pow(2, roundIdx)) }).map((_, i) => (
                      <div key={i} className="relative py-4 px-4 flex items-center opacity-60">
                        <BracketGameCard 
                          game={{
                            id: `tbd-${roundIdx}-${i}`,
                            date: new Date().toISOString(),
                            status: { type: { description: "Scheduled", state: "pre" } },
                            competitors: {
                              home: { displayName: "TBD", logo: "", score: "0", seed: "" },
                              away: { displayName: "TBD", logo: "", score: "0", seed: "" }
                            }
                          }} 
                          onClick={() => {}} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Bracket;