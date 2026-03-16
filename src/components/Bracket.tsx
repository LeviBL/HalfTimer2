"use client";

import React, { useRef } from "react";
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
  // In a real scenario, we'd use the ESPN tournament structure.
  // For now, we'll simulate rounds based on the data provided.
  const rounds = [1, 2, 3, 4, 5, 6].map(r => games.filter(g => g.round === r || (!g.round && r === 1)));

  return (
    <div className="w-full bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex p-6 gap-8 min-w-max">
          {ROUND_NAMES.map((name, i) => (
            <div key={name} className="flex flex-col gap-4">
              <div className="sticky top-0 bg-white/90 backdrop-blur-sm py-2 px-4 rounded-full border border-gray-100 text-center shadow-sm z-10">
                <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">{name}</span>
              </div>
              <div className="flex flex-col justify-around flex-grow gap-6 pt-4">
                {rounds[i].length > 0 ? (
                  rounds[i].map(game => (
                    <BracketGameCard key={game.id} game={game} onClick={onGameClick} />
                  ))
                ) : (
                  <div className="w-48 h-24 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                    <span className="text-xs text-gray-300 font-medium italic">TBD</span>
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