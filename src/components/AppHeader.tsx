"use client";

import React from "react";
import MobileNavMenu from "./MobileNavMenu";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom"; // Import useLocation

interface AppHeaderProps {
  lastUpdated: string | null;
  isRefreshing: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ lastUpdated, isRefreshing }) => {
  const location = useLocation(); // Use useLocation hook
  const isHomePage = location.pathname === "/"; // Check if it's the home page

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 py-3 px-4 flex items-center justify-center shadow-sm">
      {/* MobileNavMenu - positioned absolutely to the left */}
      <div className="absolute left-4">
        <MobileNavMenu />
      </div>

      {/* Centered Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md">HalfTimer</h1>

      {/* Last Updated - positioned absolutely to the right, conditional */}
      {isHomePage && lastUpdated && (
        <div className="absolute right-4 text-sm text-gray-700 flex items-center gap-2">
          Last Updated: {lastUpdated}
          {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
        </div>
      )}
    </header>
  );
};

export default AppHeader;