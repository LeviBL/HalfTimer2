// src/utils/nflTeamAbbreviations.ts

const nflTeamAbbreviations: { [key: string]: string } = {
  "Arizona Cardinals": "ARI Cardinals",
  "Atlanta Falcons": "ATL Falcons",
  "Baltimore Ravens": "BAL Ravens",
  "Buffalo Bills": "BUF Bills",
  "Carolina Panthers": "CAR Panthers",
  "Chicago Bears": "CHI Bears",
  "Cincinnati Bengals": "CIN Bengals",
  "Cleveland Browns": "CLE Browns",
  "Dallas Cowboys": "DAL Cowboys",
  "Denver Broncos": "DEN Broncos",
  "Detroit Lions": "DET Lions",
  "Green Bay Packers": "GB Packers",
  "Houston Texans": "HOU Texans",
  "Indianapolis Colts": "IND Colts",
  "Jacksonville Jaguars": "JAX Jaguars",
  "Kansas City Chiefs": "KC Chiefs",
  "Las Vegas Raiders": "LV Raiders",
  "Los Angeles Chargers": "LAC Chargers",
  "Los Angeles Rams": "LAR Rams",
  "Miami Dolphins": "MIA Dolphins",
  "Minnesota Vikings": "MIN Vikings",
  "New England Patriots": "NE Patriots",
  "New Orleans Saints": "NO Saints",
  "New York Giants": "NYG Giants",
  "New York Jets": "NYJ Jets",
  "Philadelphia Eagles": "PHI Eagles",
  "Pittsburgh Steelers": "PIT Steelers",
  "San Francisco 49ers": "SF 49ers",
  "Seattle Seahawks": "SEA Seahawks",
  "Tampa Bay Buccaneers": "TB Buccaneers",
  "Tennessee Titans": "TEN Titans",
  "Washington Commanders": "WAS Commanders", // Reverted to 'WAS Commanders'
};

export const getAbbreviatedTeamName = (fullName: string): string => {
  return nflTeamAbbreviations[fullName] || fullName; // Fallback to full name if not found
};