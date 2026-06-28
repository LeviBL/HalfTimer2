import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HalftimeTimerEntry {
  game_id: string;
  halftime_start_timestamp: number;
  user_id?: string; // Optional, as RLS is broad for this table
}

export function useHalftimeTimers() {
  const [halftimeStartTimes, setHalftimeStartTimes] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialTimers = async () => {
      setIsLoading(true);
      console.log("[useHalftimeTimers] Starting initial fetch for halftime timers...");
      const { data, error } = await supabase
        .from('halftime_timers')
        .select('game_id, halftime_start_timestamp');

      if (error) {
        console.error("[useHalftimeTimers] Error fetching initial halftime timers:", error);
      } else if (data) {
        const initialMap = new Map<string, number>();
        data.forEach(entry => {
          initialMap.set(entry.game_id, entry.halftime_start_timestamp);
        });
        setHalftimeStartTimes(initialMap);
        console.log("[useHalftimeTimers] Initial fetch complete. Data received:", data);
        console.log("[useHalftimeTimers] Initial halftimeStartTimes map:", Array.from(initialMap.entries()));
      }
      setIsLoading(false);
      console.log("[useHalftimeTimers] Initial fetch finished. isLoading set to false.");
    };

    fetchInitialTimers();

    const channel = supabase
      .channel('halftime_timers_changes')
      .on<HalftimeTimerEntry>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'halftime_timers' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          console.log(`[useHalftimeTimers] Realtime change detected: ${eventType}`, payload);

          setHalftimeStartTimes(prev => {
            const newMap = new Map(prev);
            if (eventType === 'INSERT' || eventType === 'UPDATE') {
              newMap.set(newRecord.game_id, newRecord.halftime_start_timestamp);
              console.log(`[useHalftimeTimers] Realtime ${eventType} for ${newRecord.game_id}. New Map:`, Array.from(newMap.entries()));
            } else if (eventType === 'DELETE') {
              newMap.delete(oldRecord.game_id);
              console.log(`[useHalftimeTimers] Realtime ${eventType} for ${oldRecord.game_id}. New Map:`, Array.from(newMap.entries()));
            }
            return newMap;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      console.log("[useHalftimeTimers] Supabase channel unsubscribed.");
    };
  }, []);

  const getHalftimeStartTime = useCallback((gameId: string): number | undefined => {
    const time = halftimeStartTimes.get(gameId);
    console.log(`[useHalftimeTimers] getHalftimeStartTime called for ${gameId}. Returning: ${time}`);
    return time;
  }, [halftimeStartTimes]);

  const setHalftimeStartTime = useCallback(async (gameId: string, timestamp: number) => {
    console.log(`[useHalftimeTimers] Attempting to upsert halftime start time for ${gameId} to ${timestamp}`);
    const { error } = await supabase
      .from('halftime_timers')
      .upsert({ game_id: gameId, halftime_start_timestamp: timestamp }, { onConflict: 'game_id' });

    if (error) {
      console.error("[useHalftimeTimers] Error upserting halftime start time:", error);
    } else {
      console.log(`[useHalftimeTimers] Successfully upserted halftime start time for ${gameId}`);
    }
  }, []);

  const clearHalftimeStartTime = useCallback(async (gameId: string) => {
    console.log(`[useHalftimeTimers] Attempting to delete halftime start time for ${gameId}`);
    const { error } = await supabase
      .from('halftime_timers')
      .delete()
      .eq('game_id', gameId);

    if (error) {
      console.error("[useHalftimeTimers] Error deleting halftime start time:", error);
    } else {
      console.log(`[useHalftimeTimers] Successfully deleted halftime start time for ${gameId}`);
    }
  }, []);

  return { getHalftimeStartTime, setHalftimeStartTime, clearHalftimeStartTime, isLoading };
}