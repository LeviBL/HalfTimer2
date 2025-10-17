"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchGameLeaders, GameLeadersData, PlayerStat } from "@/api/nflStats";
import { getAbbreviatedTeamName } from "@/utils/nflTeamAbbreviations";
import { User } from "lucide-react"; // For placeholder avatar

interface GameLeadersProps {
  gameId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
}

interface StatCategoryProps {
  title: string;
  homePlayer: PlayerStat | null;
  awayPlayer: PlayerStat | null;
}

const PlayerStatRow: React.FC<StatCategoryProps> = ({ title, homePlayer, awayPlayer }) => (
  <div className="grid grid-cols-2 gap-4 py-4 first:pt-0 last:pb-0">
    {/* Home Team Player */}
    <div className="flex items-center justify-start gap-2">
      {homePlayer ? (
        <>
          <Avatar className="h-10 w-10">
            <AvatarImage src={homePlayer.headshot} alt={homePlayer.name} />
            <AvatarFallback><User className="h-5 w-5 text-gray-500" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold">{homePlayer.value}</span>
            <span className="text-sm font-medium">{homePlayer.name} {homePlayer.position}</span>
            <span className="text-xs text-gray-500">{homePlayer.detail}</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold text-gray-400">-</span>
          <span className="text-sm font-medium text-gray-400">N/A</span>
        </div>
      )}
    </div>

    {/* Stat Category Title */}
    <div className="flex flex-col items-center justify-center text-center">
      <span className="text-sm font-semibold text-gray-700">{title.split(' ')[0]}</span>
      <span className="text-sm font-semibold text-gray-700">{title.split(' ').slice(1).join(' ')}</span>
    </div>

    {/* Away Team Player */}
    <div className="col-start-2 flex items-center justify-end gap-2 text-right">
      {awayPlayer ? (
        <>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold">{awayPlayer.value}</span>
            <span className="text-sm font-medium">{awayPlayer.name} {awayPlayer.position}</span>
            <span className="text-xs text-gray-500">{awayPlayer.detail}</span>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={awayPlayer.headshot} alt={awayPlayer.name} />
            <AvatarFallback><User className="h-5 w-5 text-gray-500" /></AvatarFallback>
          </Avatar>
        </>
      ) : (
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold text-gray-400">-</span>
          <span className="text-sm font-medium text-gray-400">N/A</span>
        </div>
      )}
    </div>
  </div>
);

const GameLeaders: React.FC<GameLeadersProps> = ({
  gameId,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
}) => {
  const [leaders, setLeaders] = useState<GameLeadersData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLeaders = async () => {
      setIsLoading(true);
      const data = await fetchGameLeaders(gameId);
      setLeaders(data);
      setIsLoading(false);
    };
    loadLeaders();
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold mb-4 text-gray-900">GAME LEADERS</h3>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center justify-start gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex flex-col">
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="col-start-2 flex items-center justify-end gap-2">
              <div className="flex flex-col items-end">
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!leaders) {
    return (
      <div className="p-6 border-t border-gray-200 bg-gray-50 text-center text-gray-600">
        No game leader statistics available for this game.
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <h3 className="text-lg font-bold mb-4 text-gray-900">GAME LEADERS</h3>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src={homeTeamLogo} alt={homeTeamName} className="w-8 h-8 object-contain" />
          <span className="text-base font-semibold text-gray-800">{getAbbreviatedTeamName(homeTeamName)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-800">{getAbbreviatedTeamName(awayTeamName)}</span>
          <img src={awayTeamLogo} alt={awayTeamName} className="w-8 h-8 object-contain" />
        </div>
      </div>

      <div className="space-y-4">
        <PlayerStatRow title="Passing Yards" homePlayer={leaders.passingLeaders.home} awayPlayer={leaders.passingLeaders.away} />
        <Separator className="bg-gray-200" />
        <PlayerStatRow title="Rushing Yards" homePlayer={leaders.rushingLeaders.home} awayPlayer={leaders.rushingLeaders.away} />
        <Separator className="bg-gray-200" />
        <PlayerStatRow title="Receiving Yards" homePlayer={leaders.receivingLeaders.home} awayPlayer={leaders.receivingLeaders.away} />
        <Separator className="bg-gray-200" />
        <PlayerStatRow title="Sacks" homePlayer={leaders.sacksLeaders.home} awayPlayer={leaders.sacksLeaders.away} />
        <Separator className="bg-gray-200" />
        <PlayerStatRow title="Tackles" homePlayer={leaders.tacklesLeaders.home} awayPlayer={leaders.tacklesLeaders.away} />
      </div>
    </div>
  );
};

export default GameLeaders;