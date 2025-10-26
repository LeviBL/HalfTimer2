import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NFL_SCOREBOARD_API = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

// Interfaces for ESPN API response structure
interface CompetitionData {
  id: string;
  status: {
    type: {
      description: string;
    };
  };
}

interface EventData {
  id: string;
  status: {
    type: {
      description: string;
    };
  };
  competitions: CompetitionData[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    // This allows bypassing RLS for server-side operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Fetching NFL scoreboard data...");
    const response = await fetch(NFL_SCOREBOARD_API);
    if (!response.ok) {
      throw new Error(`Failed to fetch NFL scoreboard data: ${response.statusText}`);
    }
    const data = await response.json();

    const currentHalftimeGameIds = new Set<string>();

    for (const event of data.events) {
      const gameId = event.id;
      const isCurrentlyHalftime = event.status.type.description === "Halftime";

      if (isCurrentlyHalftime) {
        currentHalftimeGameIds.add(gameId);

        // Check if a timer already exists for this game
        const { data: existingTimer, error: fetchError } = await supabase
          .from('halftime_timers')
          .select('game_id')
          .eq('game_id', gameId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          console.error(`Error checking existing timer for game ${gameId}:`, fetchError);
          continue;
        }

        if (!existingTimer) {
          // If no timer exists, insert a new one
          console.log(`Game ${gameId} is in halftime, no timer found. Inserting new timer.`);
          const { error: insertError } = await supabase
            .from('halftime_timers')
            .upsert({ game_id: gameId, halftime_start_timestamp: Date.now() }, { onConflict: 'game_id' });

          if (insertError) {
            console.error(`Error inserting halftime timer for game ${gameId}:`, insertError);
          } else {
            console.log(`Successfully inserted halftime timer for game ${gameId}.`);
          }
        } else {
          console.log(`Game ${gameId} is in halftime, timer already exists.`);
        }
      }
    }

    // Clean up timers for games that are no longer in halftime
    console.log("Cleaning up timers for games no longer in halftime...");
    const { data: allStoredTimers, error: fetchAllError } = await supabase
      .from('halftime_timers')
      .select('game_id');

    if (fetchAllError) {
      console.error("Error fetching all stored timers for cleanup:", fetchAllError);
    } else if (allStoredTimers) {
      for (const storedTimer of allStoredTimers) {
        if (!currentHalftimeGameIds.has(storedTimer.game_id)) {
          console.log(`Game ${storedTimer.game_id} is no longer in halftime. Deleting timer.`);
          const { error: deleteError } = await supabase
            .from('halftime_timers')
            .delete()
            .eq('game_id', storedTimer.game_id);

          if (deleteError) {
            console.error(`Error deleting halftime timer for game ${storedTimer.game_id}:`, deleteError);
          } else {
            console.log(`Successfully deleted halftime timer for game ${storedTimer.game_id}.`);
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: "Halftime timers updated successfully." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Edge function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});