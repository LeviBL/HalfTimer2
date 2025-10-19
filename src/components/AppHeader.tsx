"use client";

import React from "react";
import MobileNavMenu from "./MobileNavMenu";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  lastUpdated: string | null;
  isRefreshing: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ lastUpdated, isRefreshing }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <MobileNavMenu />
        <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-md">HalfTimer</h1>
      </div>
      {lastUpdated && (
        <div className="text-sm text-gray-700 flex items-center gap-2">
          Last Updated: {lastUpdated}
          {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
        </div>
      )}
    </header>
  );
};

export default AppHeader;