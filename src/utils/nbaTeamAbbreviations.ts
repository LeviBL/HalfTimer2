// src/utils/nbaTeamAbbreviations.ts

const nbaTeamAbbreviations: { [key: string]: string } = {
  "Atlanta Hawks": "ATL Hawks",
  "Boston Celtics": "BOS Celtics",
  "Brooklyn Nets": "BKN Nets",
  "Charlotte Hornets": "CHA Hornets",
  "Chicago Bulls": "CHI Bulls",
  "Cleveland Cavaliers": "CLE Cavaliers",
  "Dallas Mavericks": "DAL Mavericks",
  "Denver Nuggets": "DEN Nuggets",
  "Detroit Pistons": "DET Pistons",
  "Golden State Warriors": "GSW Warriors",
  "Houston Rockets": "HOU Rockets",
  "Indiana Pacers": "IND Pacers",
  "LA Clippers": "LAC Clippers",
  "Los Angeles Lakers": "LAL Lakers",
  "Memphis Grizzlies": "MEM Grizzlies",
  "Miami Heat": "MIA Heat",
  "Milwaukee Bucks": "MIL Bucks",
  "Minnesota Timberwolves": "MIN Timberwolves",
  "New Orleans Pelicans": "NOP Pelicans",
  "New York Knicks": "NYK Knicks",
  "Oklahoma City Thunder": "OKC Thunder",
  "Orlando Magic": "ORL Magic",
  "Philadelphia 76ers": "PHI 76ers",
  "Phoenix Suns": "PHX Suns",
  "Portland Trail Blazers": "POR Blazers",
  "Sacramento Kings": "SAC Kings",
  "San Antonio Spurs": "SAS Spurs",
  "Toronto Raptors": "TOR Raptors",
  "Utah Jazz": "UTA Jazz",
  "Washington Wizards": "WAS Wizards",
};

export const getAbbreviatedNbaTeamName = (fullName: string): string => {
  return nbaTeamAbbreviations[fullName] || fullName;
};