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
  // Group games by round
  const rounds = [1, 2, 3, 4, 5, 6].map(r => games.filter(g => g.round === r));

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex p-12 gap-0 min-w-max bg-gray-50/30">
          {ROUND_NAMES.map((name, roundIdx) => (
            <div key={name} className="flex flex-col w-64 relative">
              {/* Round Header */}
              <div className="sticky top-0 mb-8 px-4 z-20">
                <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded-full text-center border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{name}</span>
                </div>
              </div>

              {/* Games Container */}
              <div className="flex flex-col justify-around flex-grow relative">
                {rounds[roundIdx].length > 0 ? (
                  rounds[roundIdx].map((game, gameIdx) => (
                    <div key={game.id} className="relative py-4 px-4 flex items-center">
                      <BracketGameCard game={game} onClick={onGameClick} />
                      
                      {/* Connector Lines to Next Round */}
                      {roundIdx < ROUND_NAMES.length - 1 && (
                        <div className="absolute right-0 top-1/2 w-4 h-px bg-gray-300"></div>
                      )}
                      {roundIdx > 0 && (
                        <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-300"></div>
                      )}
                    </div>
                  ))
                ) : (
                  // Professional TBD Placeholder
                  <div className="flex flex-col justify-around h-full">
                    {Array.from({ length: Math.max(1, 32 / Math.pow(2, roundIdx)) }).map((_, i) => (
                      <div key={i} className="relative py-4 px-4 flex items-center opacity-40">
                        <div className="w-48 h-16 border-2 border-dashed border-gray-200 rounded-xl bg-white flex items-center justify-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Matchup TBD</span>
                        </div>
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