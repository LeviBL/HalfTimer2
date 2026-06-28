import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HalftimeTimerEntry {
  game_id: string;
  halftime_start_timestamp: number;
}

export function useHalftimeTimers() {
  const [halftimeStartTimes, setHalftimeStartTimes] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialTimers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('halftime_timers')
        .select('game_id, halftime_start_timestamp');

      if (error) {
        console.error("[useHalftimeTimers] Error fetching initial halftime timers:", error);
      } else if (data) {
        const initialMap = new Map<string, number>();
        data.forEach(entry => {
          // Ensure timestamp is treated as a number for calculations
          initialMap.set(entry.game_id, Number(entry.halftime_start_timestamp));
        });
        setHalftimeStartTimes(initialMap);
      }
      setIsLoading(false);
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
              newMap.set(newRecord.game_id, Number(newRecord.halftime_start_timestamp));
            } else if (eventType === 'DELETE') {
              newMap.delete(oldRecord.game_id);
            }
            return newMap;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getHalftimeStartTime = useCallback((gameId: string): number | undefined => {
    return halftimeStartTimes.get(gameId);
  }, [halftimeStartTimes]);

  return { getHalftimeStartTime, isLoading };
}