import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const API_ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sport } = await req.json();
    if (sport !== 'nfl' && sport !== 'nba') {
      throw new Error('Invalid sport specified. Must be "nfl" or "nba".');
    }

    const apiResponse = await fetch(API_ENDPOINTS[sport]);
    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch data from ESPN API: ${apiResponse.statusText}`);
    }
    const gameData = await apiResponse.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: existingTimers, error: fetchError } = await supabase
      .from('halftime_timers')
      .select('game_id')
      .eq('sport', sport);

    if (fetchError) throw fetchError;

    const existingTimerIds = new Set(existingTimers.map(t => t.game_id));
    const gamesInHalftime = new Set();
    const now = new Date().toISOString();

    for (const event of gameData.events) {
      const isHalftime = event.status.type.description === "Halftime" || event.status.type.shortDetail === "HT";
      const gameId = event.id;

      if (isHalftime) {
        gamesInHalftime.add(gameId);
        if (!existingTimerIds.has(gameId)) {
          console.log(`[fetch-game-data] New halftime: ${gameId}`);
          const { error: insertError } = await supabase
            .from('halftime_timers')
            .insert({ game_id: gameId, sport: sport, start_time: now });
          if (insertError) console.error(`[fetch-game-data] Error inserting timer for ${gameId}:`, insertError);
        }
      }
    }

    for (const timerId of existingTimerIds) {
      if (!gamesInHalftime.has(timerId)) {
        console.log(`[fetch-game-data] Halftime ended: ${timerId}`);
        const { error: deleteError } = await supabase
          .from('halftime_timers')
          .delete()
          .eq('game_id', timerId);
        if (deleteError) console.error(`[fetch-game-data] Error deleting timer for ${timerId}:`, deleteError);
      }
    }

    const { data: updatedTimers, error: finalFetchError } = await supabase
      .from('halftime_timers')
      .select('game_id, start_time')
      .eq('sport', sport);

    if (finalFetchError) throw finalFetchError;

    const responsePayload = {
      gameData,
      halftimeTimers: updatedTimers,
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("[fetch-game-data] An unexpected error occurred:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
