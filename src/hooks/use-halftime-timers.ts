import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HalftimeTimerEntry {
  game_id: string;
  halftime_start_timestamp: number;
  user_id?: string;
}

export function useHalftimeTimers() {
  const [halftimeStartTimes, setHalftimeStartTimes] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialTimers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('halftime_timers')
        .select('game_id, halftime_start_timestamp');

      if (error) {
        console.error("[useHalftimeTimers] Error fetching initial halftime timers:", error);
      } else if (data && isMounted) {
        const initialMap = new Map<string, number>();
        data.forEach(entry => {
          initialMap.set(entry.game_id, Number(entry.halftime_start_timestamp));
        });
        setHalftimeStartTimes(initialMap);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchInitialTimers();

    const channel = supabase
      .channel('halftime_timers_changes')
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
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const getHalftimeStartTime = useCallback((gameId: string): number | undefined => {
    return halftimeStartTimes.get(gameId);
  }, [halftimeStartTimes]);

  const setHalftimeStartTime = useCallback(async (gameId: string, timestamp: number) => {
    // Optimistically update local state so countdown begins immediately
    setHalftimeStartTimes(prev => {
      const newMap = new Map(prev);
      newMap.set(gameId, timestamp);
      return newMap;
    });

    const { error } = await supabase
      .from('halftime_timers')
      .upsert({ game_id: gameId, halftime_start_timestamp: timestamp }, { onConflict: 'game_id' });

    if (error) {
      console.error("[useHalftimeTimers] Error upserting halftime start time:", error);
    }
  }, []);

  const clearHalftimeStartTime = useCallback(async (gameId: string) => {
    setHalftimeStartTimes(prev => {
      const newMap = new Map(prev);
      newMap.delete(gameId);
      return newMap;
    });

    const { error } = await supabase
      .from('halftime_timers')
      .delete()
      .eq('game_id', gameId);

    if (error) {
      console.error("[useHalftimeTimers] Error deleting halftime start time:", error);
    }
  }, []);

  return { getHalftimeStartTime, setHalftimeStartTime, clearHalftimeStartTime, isLoading };
}