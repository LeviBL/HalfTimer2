"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const HALFTIME_DURATIONS = {
  nfl: 12 * 60 + 20, // 12:20 = 740 seconds
  nba: 14 * 60 + 20, // 14:20 = 860 seconds
};

interface HalftimeContextType {
  getHalftimeStartTime: (gameId: string) => number | undefined;
  ensureHalftimeTimer: (gameId: string) => Promise<number | undefined>;
  clearHalftimeTimer: (gameId: string) => Promise<void>;
  isLoading: boolean;
  timers: Map<string, number>;
}

const HalftimeContext = createContext<HalftimeContextType>({
  getHalftimeStartTime: () => undefined,
  ensureHalftimeTimer: async () => undefined,
  clearHalftimeTimer: async () => {},
  isLoading: true,
  timers: new Map(),
});

export const HalftimeTimersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timers, setTimers] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pendingSync = useRef<Set<string>>(new Set());

  // 1. Fetch all active halftime timers on startup
  const fetchAllTimers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('halftime_timers')
        .select('game_id, halftime_start_timestamp');

      if (error) {
        console.error("[HalftimeTimers] Error fetching timers:", error);
      } else if (data) {
        setTimers(prev => {
          const map = new Map(prev);
          data.forEach(row => {
            if (row.game_id && row.halftime_start_timestamp) {
              map.set(row.game_id, Number(row.halftime_start_timestamp));
            }
          });
          return map;
        });
      }
    } catch (err) {
      console.error("[HalftimeTimers] Fetch exception:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTimers();

    // 2. Single Realtime subscription for the whole app
    const channel = supabase
      .channel('universal_halftime_timers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'halftime_timers' },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;
          setTimers(prev => {
            const next = new Map(prev);
            if (eventType === 'INSERT' || eventType === 'UPDATE') {
              if (newRec?.game_id && newRec?.halftime_start_timestamp) {
                next.set(newRec.game_id, Number(newRec.halftime_start_timestamp));
              }
            } else if (eventType === 'DELETE') {
              if (oldRec?.game_id) {
                next.delete(oldRec.game_id);
              }
            }
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllTimers]);

  const getHalftimeStartTime = useCallback((gameId: string): number | undefined => {
    return timers.get(gameId);
  }, [timers]);

  // Ensure a single universal start time is stored and returned
  const ensureHalftimeTimer = useCallback(async (gameId: string): Promise<number | undefined> => {
    // If already in local memory, return it
    if (timers.has(gameId)) {
      return timers.get(gameId);
    }

    if (pendingSync.current.has(gameId)) {
      return timers.get(gameId);
    }
    pendingSync.current.add(gameId);

    try {
      // Check database first to avoid overwriting an existing start time
      const { data: existing } = await supabase
        .from('halftime_timers')
        .select('halftime_start_timestamp')
        .eq('game_id', gameId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (existing?.halftime_start_timestamp) {
        const existingTs = Number(existing.halftime_start_timestamp);
        setTimers(prev => new Map(prev).set(gameId, existingTs));
        return existingTs;
      }

      // No record exists anywhere yet: insert the new start time
      const now = Date.now();
      const { data: inserted, error: insertError } = await supabase
        .from('halftime_timers')
        .insert({ game_id: gameId, halftime_start_timestamp: now })
        .select('halftime_start_timestamp')
        .maybeSingle();

      if (!insertError && inserted?.halftime_start_timestamp) {
        const finalTs = Number(inserted.halftime_start_timestamp);
        setTimers(prev => new Map(prev).set(gameId, finalTs));
        return finalTs;
      } else {
        // In case another client inserted concurrently, fetch the winner
        const { data: authoritative } = await supabase
          .from('halftime_timers')
          .select('halftime_start_timestamp')
          .eq('game_id', gameId)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (authoritative?.halftime_start_timestamp) {
          const finalTs = Number(authoritative.halftime_start_timestamp);
          setTimers(prev => new Map(prev).set(gameId, finalTs));
          return finalTs;
        }
      }
    } catch (err) {
      console.error(`[HalftimeTimers] Sync error for ${gameId}:`, err);
    } finally {
      pendingSync.current.delete(gameId);
    }

    return timers.get(gameId);
  }, [timers]);

  const clearHalftimeTimer = useCallback(async (gameId: string) => {
    setTimers(prev => {
      const next = new Map(prev);
      next.delete(gameId);
      return next;
    });

    try {
      await supabase
        .from('halftime_timers')
        .delete()
        .eq('game_id', gameId);
    } catch (err) {
      console.error(`[HalftimeTimers] Clear error for ${gameId}:`, err);
    }
  }, []);

  return (
    <HalftimeContext.Provider
      value={{
        getHalftimeStartTime,
        ensureHalftimeTimer,
        clearHalftimeTimer,
        isLoading,
        timers,
      }}
    >
      {children}
    </HalftimeContext.Provider>
  );
};

export const useHalftimeTimers = () => {
  return useContext(HalftimeContext);
};