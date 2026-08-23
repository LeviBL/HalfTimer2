import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HalftimeTimerEntry {
  game_id: string;
  halftime_start_timestamp: number;
}

export function useHalftimeTimers() {
  const [halftimeStartTimes, setHalftimeStartTimes] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pendingRequests = useRef<Set<string>>(new Set());

  const fetchTimers = useCallback(async () => {
    const { data, error } = await supabase
      .from('halftime_timers')
      .select('game_id, halftime_start_timestamp');

    if (error) {
      console.error("[useHalftimeTimers] Error fetching halftime timers:", error);
    } else if (data) {
      setHalftimeStartTimes(prev => {
        const nextMap = new Map(prev);
        data.forEach(entry => {
          if (entry.game_id && entry.halftime_start_timestamp) {
            nextMap.set(entry.game_id, Number(entry.halftime_start_timestamp));
          }
        });
        return nextMap;
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTimers();

    const channel = supabase
      .channel('halftime_timers_realtime')
      .on<HalftimeTimerEntry>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'halftime_timers' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          setHalftimeStartTimes(prev => {
            const newMap = new Map(prev);
            if (eventType === 'INSERT' || eventType === 'UPDATE') {
              if (newRecord?.game_id && newRecord?.halftime_start_timestamp) {
                newMap.set(newRecord.game_id, Number(newRecord.halftime_start_timestamp));
              }
            } else if (eventType === 'DELETE') {
              if (oldRecord?.game_id) {
                newMap.delete(oldRecord.game_id);
              }
            }
            return newMap;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTimers]);

  const getHalftimeStartTime = useCallback((gameId: string): number | undefined => {
    return halftimeStartTimes.get(gameId);
  }, [halftimeStartTimes]);

  // Synchronize a new halftime start time ONLY if one does not already exist in the database
  const ensureHalftimeTimer = useCallback(async (gameId: string) => {
    if (halftimeStartTimes.has(gameId) || pendingRequests.current.has(gameId)) {
      return;
    }

    pendingRequests.current.add(gameId);

    try {
      // First check if Supabase already has a record from the backend crawler or another viewer
      const { data: existing, error: checkError } = await supabase
        .from('halftime_timers')
        .select('halftime_start_timestamp')
        .eq('game_id', gameId)
        .maybeSingle();

      if (!checkError && existing?.halftime_start_timestamp) {
        const syncedTimestamp = Number(existing.halftime_start_timestamp);
        setHalftimeStartTimes(prev => new Map(prev).set(gameId, syncedTimestamp));
        return;
      }

      // If no timer exists anywhere, insert the initial start timestamp
      const now = Date.now();
      const { data: inserted, error: insertError } = await supabase
        .from('halftime_timers')
        .insert({ game_id: gameId, halftime_start_timestamp: now })
        .select('halftime_start_timestamp')
        .single();

      if (!insertError && inserted?.halftime_start_timestamp) {
        const syncedTimestamp = Number(inserted.halftime_start_timestamp);
        setHalftimeStartTimes(prev => new Map(prev).set(gameId, syncedTimestamp));
      } else {
        // In case of conflict (another client inserted simultaneously), fetch the authoritative record
        const { data: authoritative } = await supabase
          .from('halftime_timers')
          .select('halftime_start_timestamp')
          .eq('game_id', gameId)
          .maybeSingle();

        if (authoritative?.halftime_start_timestamp) {
          setHalftimeStartTimes(prev => new Map(prev).set(gameId, Number(authoritative.halftime_start_timestamp)));
        }
      }
    } catch (err) {
      console.error("[useHalftimeTimers] Sync error:", err);
    } finally {
      pendingRequests.current.delete(gameId);
    }
  }, [halftimeStartTimes]);

  const clearHalftimeStartTime = useCallback(async (gameId: string) => {
    setHalftimeStartTimes(prev => {
      const newMap = new Map(prev);
      newMap.delete(gameId);
      return newMap;
    });

    await supabase
      .from('halftime_timers')
      .delete()
      .eq('game_id', gameId);
  }, []);

  return { getHalftimeStartTime, ensureHalftimeTimer, clearHalftimeStartTime, isLoading };
}