"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className, size = 40 }) => {
  return (
    <div className={cn("relative flex items-center justify-center transition-all duration-300", className)}>
      <img 
        src="/favicon.svg" 
        alt="The Halftimer - Live NFL and NBA Halftime Countdown Clock" 
        width={size} 
        height={size}
        className="drop-shadow-md"
      />
    </div>
  );
};

export default Logo;