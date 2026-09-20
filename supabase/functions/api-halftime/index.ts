import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const API_ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchAndProcessSport(sport: 'nfl' | 'nba') {
  try {
    const response = await fetch(API_ENDPOINTS[sport]);
    if (!response.ok) {
      console.error(`[api-halftime] Error fetching ${sport} data: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    const halftimeGames = [];

    for (const event of data.events) {
      const isHalftime = (event.status.type.description === "Halftime" || event.status.type.shortDetail === "HT");
      if (isHalftime) {
        const competition = event.competitions[0];
        const home = competition.competitors.find((c: any) => c.homeAway === 'home');
        const away = competition.competitors.find((c: any) => c.homeAway === 'away');

        halftimeGames.push({
          gameId: event.id,
          sport: sport.toUpperCase(),
          homeTeam: home?.team?.displayName || 'TBD',
          awayTeam: away?.team?.displayName || 'TBD',
          homeScore: parseInt(home?.score || '0', 10),
          awayScore: parseInt(away?.score || '0', 10),
          status: 'halftime',
        });
      }
    }
    return halftimeGames;
  } catch (error) {
    console.error(`[api-halftime] Exception fetching ${sport} data:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[api-halftime] Fetching halftime games...");
    const nflHalftimeGames = await fetchAndProcessSport('nfl');
    const nbaHalftimeGames = await fetchAndProcessSport('nba');

    const allHalftimeGames = [...nflHalftimeGames, ...nbaHalftimeGames];
    console.log(`[api-halftime] Found ${allHalftimeGames.length} games in halftime.`);

    return new Response(JSON.stringify(allHalftimeGames), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("[api-halftime] An unexpected error occurred:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
