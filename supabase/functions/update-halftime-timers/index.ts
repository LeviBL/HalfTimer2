import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_ENDPOINTS = {
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const currentHalftimeGameIds = new Set<string>();

    for (const [sport, url] of Object.entries(API_ENDPOINTS)) {
      console.log(`[update-halftime-timers] Fetching ${sport} scoreboard data...`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`[update-halftime-timers] Failed to fetch ${sport} data: ${response.statusText}`);
        continue;
      }
      const data = await response.json();

      for (const event of data.events) {
        const gameId = event.id;
        const isCurrentlyHalftime = event.status.type.description === "Halftime";

        if (isCurrentlyHalftime) {
          currentHalftimeGameIds.add(gameId);

          const { data: existingTimer, error: fetchError } = await supabase
            .from('halftime_timers')
            .select('game_id')
            .eq('game_id', gameId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error(`[update-halftime-timers] Error checking existing timer for game ${gameId}:`, fetchError);
            continue;
          }

          if (!existingTimer) {
            console.log(`[update-halftime-timers] Game ${gameId} (${sport}) is in halftime, no timer found. Inserting.`);
            const { error: insertError } = await supabase
              .from('halftime_timers')
              .upsert({ game_id: gameId, halftime_start_timestamp: Date.now() }, { onConflict: 'game_id' });

            if (insertError) {
              console.error(`[update-halftime-timers] Error inserting halftime timer for game ${gameId}:`, insertError);
            }
          }
        }
      }
    }

    console.log("[update-halftime-timers] Cleaning up stale timers...");
    const { data: allStoredTimers, error: fetchAllError } = await supabase
      .from('halftime_timers')
      .select('game_id');

    if (fetchAllError) {
      console.error("[update-halftime-timers] Error fetching all stored timers for cleanup:", fetchAllError);
    } else if (allStoredTimers) {
      for (const storedTimer of allStoredTimers) {
        if (!currentHalftimeGameIds.has(storedTimer.game_id)) {
          console.log(`[update-halftime-timers] Game ${storedTimer.game_id} is no longer in halftime. Deleting.`);
          await supabase
            .from('halftime_timers')
            .delete()
            .eq('game_id', storedTimer.game_id);
        }
      }
    }

    return new Response(JSON.stringify({ message: "Halftime timers updated successfully." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("[update-halftime-timers] Edge function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});