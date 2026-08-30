"use client";

import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

const getTargetDate = (): Date => {
  const now = new Date();
  let currentYear = now.getFullYear();
  // Target: Sept 9 at 5:20 PM (17:20)
  let target = new Date(currentYear, 8, 9, 17, 20, 0); // Month is 0-indexed (8 = September)

  // If this year's Sept 9 5:20 PM has already passed, target next year
  if (now.getTime() > target.getTime()) {
    target = new Date(currentYear + 1, 8, 9, 17, 20, 0);
  }

  return target;
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false };
};

const NFLCountdownBanner: React.FC = () => {
  const [targetDate] = useState<Date>(() => getTargetDate());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="w-full max-w-[600px] mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center shadow-sm">
        <p className="text-xl font-semibold text-blue-900">
          🏈 NFL is live! Tune in below...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mb-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-xl text-center shadow-sm">
      <p className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
        NFL is back in
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono font-bold text-blue-950 text-xl sm:text-2xl">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center min-w-[54px]">
          <span>{timeLeft.days}</span>
          <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider">Days</span>
        </div>
        <span>:</span>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center min-w-[54px]">
          <span>{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider">Hours</span>
        </div>
        <span>:</span>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center min-w-[54px]">
          <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider">Mins</span>
        </div>
        <span>:</span>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center min-w-[54px]">
          <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider">Secs</span>
        </div>
      </div>
    </div>
  );
};

export default NFLCountdownBanner;