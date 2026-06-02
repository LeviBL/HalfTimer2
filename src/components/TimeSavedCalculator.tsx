"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const TimeSavedCalculator = () => {
  const [games, setGames] = useState(12);

  const totalMinutes = games * 15;
  const totalHoursDecimal = (totalMinutes / 60).toFixed(1);
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all border border-gray-200 text-xl"
          aria-label="Time Saved Calculator"
        >
          📟
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6 bg-black text-white border-none rounded-3xl shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-black uppercase tracking-tighter text-gray-400 text-xs">Time Saved Calculator</h4>
            <div className="flex justify-between items-end">
              <span className="text-4xl font-black tracking-tighter">{games}</span>
              <span className="text-xs font-bold text-gray-500 mb-1 uppercase">Games Tracked</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={games}
              onChange={(e) => setGames(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Minutes</span>
              <span className="text-3xl font-black tracking-tighter">{totalMinutes} MINUTES</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Hours</span>
              <span className="text-3xl font-black tracking-tighter">{totalHoursDecimal} HOURS</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Formatted Time</span>
              <span className="text-2xl font-black tracking-tighter leading-none">
                {hoursPart} HOURS, {minutesPart} MINUTES
              </span>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-600 font-bold uppercase text-center pt-2">
            Based on 15 mins saved per game
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimeSavedCalculator;