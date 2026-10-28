import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Game } from "@/pages/HalfTimer";
import { ESPN_ENDPOINTS, fetchEspnJson, mapEspnEvent, type Sport } from "@/utils/gameData";
import { explicitKickoffReceiver, getNflKickoffReceiver, type EspnSummary } from "@/utils/nflKickoff";

interface MatchupSummary {
  game: Game;
  receiverId: string | null;
}

const summaryKey = (sport: Sport, id: string) => ["matchup-summary", sport, id];

async function fetchSummary(sport: Sport, id: string, signal?: AbortSignal): Promise<MatchupSummary> {
  const data = await fetchEspnJson<EspnSummary>(`${ESPN_ENDPOINTS[sport]}/summary?event=${encodeURIComponent(id)}`, signal);
  if (!data.header?.competitions?.[0] || data.header.id !== id) throw new Error("Matchup not found");
  const game = mapEspnEvent(data.header);
  return { game, receiverId: sport === "nfl" ? getNflKickoffReceiver(data, game) : null };
}

export function useGameSummary(sport: Sport, id: string) {
  return useQuery({
    queryKey: summaryKey(sport, id),
    queryFn: ({ signal }) => fetchSummary(sport, id, signal),
    enabled: /^\d+$/.test(id),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}

export function useNflKickoffReceiver(game: Game, sport: Sport, isHalftime: boolean) {
  const queryClient = useQueryClient();
  const explicit = sport === "nfl" ? explicitKickoffReceiver((game.notes || []).map(note => note.text), game) : null;
  const query = useQuery({
    queryKey: ["nfl-kickoff-receiver", game.id],
    queryFn: async () => {
      const cached = queryClient.getQueryData<MatchupSummary>(summaryKey("nfl", game.id));
      if (cached && (cached.receiverId || cached.game.status.type.state !== "pre")) return cached.receiverId;
      // Share even in-flight summary requests between cards and direct page visits.
      const result = await queryClient.fetchQuery({
        queryKey: summaryKey("nfl", game.id),
        queryFn: ({ signal }) => fetchSummary("nfl", game.id, signal),
        staleTime: 0,
      });
      return result.receiverId;
    },
    enabled: sport === "nfl" && isHalftime && explicit === undefined,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
  if (sport !== "nfl" || !isHalftime) return undefined;
  const id = explicit === undefined ? query.data : explicit;
  return [game.competitors.home, game.competitors.away].find(team => team.id && team.id === id);
}
