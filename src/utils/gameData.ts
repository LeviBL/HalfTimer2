import type { EventData, Game } from "@/pages/HalfTimer";

export type Sport = "nfl" | "nba";

export const ESPN_ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba",
};

export const gamePath = (sport: Sport, gameId: string) => `/${sport}/${encodeURIComponent(gameId)}`;

export function mapEspnEvent(event: EventData, index = 0): Game {
  const competition = event.competitions[0];
  const home = competition.competitors.find(c => c.homeAway === "home");
  const away = competition.competitors.find(c => c.homeAway === "away");
  const mapTeam = (competitor: typeof home) => ({
    id: competitor?.team.id,
    color: competitor?.team.color,
    abbreviation: competitor?.team.abbreviation,
    displayName: competitor?.team.displayName || "TBD",
    logo: competitor?.team.logo || competitor?.team.logos?.[0]?.href || "/placeholder.svg",
    score: competitor?.score || "0",
  });
  const status = event.status || competition.status;
  const isHalftime = status.type.description === "Halftime" || status.type.shortDetail === "HT";
  const possession = competition.situation?.possession;
  const possessionId = possession == null ? undefined : String(possession);
  return {
    id: event.id,
    name: event.name,
    shortName: event.shortName,
    date: event.date || competition.date,
    bracketPosition: competition.bracketPosition || index,
    status,
    competitors: { home: mapTeam(home), away: mapTeam(away) },
    // Only the current situation is used; never merge a previous possession marker.
    possessionId: status.type.state === "in" && !isHalftime &&
      competition.competitors.some(c => c.team.id === possessionId) ? possessionId : undefined,
    notes: competition.notes,
  };
}

export async function fetchEspnJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`ESPN request failed (${response.status})`);
  return response.json();
}
