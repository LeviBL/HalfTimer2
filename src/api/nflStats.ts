import { getAbbreviatedTeamName } from "@/utils/nflTeamAbbreviations";

export interface PlayerStat {
  id: string;
  name: string;
  position: string;
  value: string | number;
  detail: string;
  headshot: string;
}

export interface GameLeadersData {
  gameId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  passingLeaders: { home: PlayerStat | null; away: PlayerStat | null };
  rushingLeaders: { home: PlayerStat | null; away: PlayerStat | null };
  receivingLeaders: { home: PlayerStat | null; away: PlayerStat | null };
  sacksLeaders: { home: PlayerStat | null; away: PlayerStat | null };
  tacklesLeaders: { home: PlayerStat | null; away: PlayerStat | null };
}

export const fetchGameLeaders = async (gameId: string): Promise<GameLeadersData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // No mock data is being used. This function will always return null
  // until a real API for game leaders is integrated.
  console.log(`[nflStats] No game leader data available for game ${gameId}.`);
  return null;
};