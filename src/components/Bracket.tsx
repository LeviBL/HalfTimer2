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
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex p-8 gap-12 min-w-max bg-gradient-to-b from-gray-50/50 to-white">
          {ROUND_NAMES.map((name, i) => (
            <div key={name} className="flex flex-col gap-6">
              <div className="sticky top-0 bg-orange-500 text-white py-2 px-6 rounded-full text-center shadow-md z-10">
                <span className="text-xs font-black uppercase tracking-widest">{name}</span>
              </div>
              <div className="flex flex-col justify-around flex-grow gap-8 pt-4">
                {rounds[i].length > 0 ? (
                  rounds[i].map(game => (
                    <BracketGameCard key={game.id} game={game} onClick={onGameClick} />
                  ))
                ) : (
                  // Enhanced TBD Placeholder
                  <div className="w-48 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 group hover:border-orange-200 transition-colors">
                    <div className="w-full px-3 space-y-2 opacity-30">
                      <div className="h-2 w-2/3 bg-gray-300 rounded"></div>
                      <div className="h-2 w-1/2 bg-gray-300 rounded"></div>
                    </div>
                    <span className="absolute text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-orange-400 transition-colors">Matchup TBD</span>
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