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

// Mock data for game leaders
const mockGameLeaders: { [gameId: string]: GameLeadersData } = {
  "401547500": { // Example game ID (replace with actual game IDs from your API if needed)
    gameId: "401547500",
    homeTeamName: "Pittsburgh Steelers",
    awayTeamName: "Cincinnati Bengals",
    homeTeamLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png",
    awayTeamLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png",
    passingLeaders: {
      home: {
        id: "1",
        name: "A. Rodgers",
        position: "QB",
        value: 249,
        detail: "23/34, 4 TD, 2 INT",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/8439.png&w=350&h=254",
      },
      away: {
        id: "2",
        name: "J. Flacco",
        position: "QB",
        value: 342,
        detail: "31/47, 3 TD",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/11243.png&w=350&h=254",
      },
    },
    rushingLeaders: {
      home: {
        id: "3",
        name: "J. Warren",
        position: "RB",
        value: 127,
        detail: "16 CAR",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4361403.png&w=350&h=254",
      },
      away: {
        id: "4",
        name: "C. Brown",
        position: "RB",
        value: 108,
        detail: "11 CAR",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4240080.png&w=350&h=254",
      },
    },
    receivingLeaders: {
      home: {
        id: "5",
        name: "P. Freiermuth",
        position: "TE",
        value: 111,
        detail: "5 REC, 2 TD",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4262921.png&w=350&h=254",
      },
      away: {
        id: "6",
        name: "J. Chase",
        position: "WR",
        value: 161,
        detail: "16 REC, 1 TD",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4361403.png&w=350&h=254",
      },
    },
    sacksLeaders: {
      home: {
        id: "7",
        name: "K. Benton",
        position: "DT",
        value: 1,
        detail: "",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4427900.png&w=350&h=254",
      },
      away: {
        id: "8",
        name: "T. Hendrickson",
        position: "DE",
        value: 1,
        detail: "",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3042607.png&w=350&h=254",
      },
    },
    tacklesLeaders: {
      home: {
        id: "9",
        name: "D. Elliott",
        position: "S",
        value: 9,
        detail: "6 SOLO",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3043078.png&w=350&h=254",
      },
      away: {
        id: "10",
        name: "B. Carter",
        position: "LB",
        value: 12,
        detail: "8 SOLO",
        headshot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4240080.png&w=350&h=254",
      },
    },
  },
  // Add more mock data for other game IDs if you want to test different scenarios
  // For now, this single mock game will demonstrate the functionality.
};

export const fetchGameLeaders = async (gameId: string): Promise<GameLeadersData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = mockGameLeaders[gameId];
  if (data) {
    console.log(`[nflStats] Fetched mock leaders for game ${gameId}`);
    return data;
  }
  console.log(`[nflStats] No mock leaders found for game ${gameId}`);
  return null;
};