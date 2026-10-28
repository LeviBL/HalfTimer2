import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useGameSummary } from "@/hooks/use-game-summary";
import { ESPN_ENDPOINTS, fetchEspnJson, gamePath, mapEspnEvent, type Sport } from "@/utils/gameData";
import type { EventData, Game } from "@/pages/HalfTimer";

function scoreboardDate(date: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date(date));
  return ["year", "month", "day"].map(type => parts.find(part => part.type === type)?.value).join("");
}

const GamePage = ({ sport }: { sport: Sport }) => {
  const { gameId = "" } = useParams();
  const location = useLocation();
  const state = location.state as { game?: Game; halftimeStartTime?: number } | null;
  const seed = state?.game?.id === gameId ? state.game : undefined;
  const validId = /^\d+$/.test(gameId);
  const summary = useGameSummary(sport, gameId);
  const initialGame = summary.data?.game || seed;
  const date = initialGame ? scoreboardDate(initialGame.date) : undefined;
  const scoreboard = useQuery({
    queryKey: ["matchup-scoreboard", sport, date],
    queryFn: ({ signal }) => fetchEspnJson<{ events: EventData[] }>(`${ESPN_ENDPOINTS[sport]}/scoreboard?dates=${date}&limit=1000`, signal),
    enabled: validId && !!date,
    refetchInterval: 20 * 1000,
    staleTime: 20 * 1000,
    retry: 1,
  });
  const event = scoreboard.data?.events?.find(event => event.id === gameId);
  const game = event ? mapEspnEvent(event) : initialGame;
  const timers = useQuery({
    queryKey: ["matchup-halftime-timestamps", sport],
    queryFn: async () => {
      const { data, error } = await supabase.from("halftime_timers")
        .select("game_id, start_time").eq("sport", sport);
      if (error) throw error;
      return data.reduce((acc: Record<string, number>, timer: { game_id: string; start_time: string }) => {
        acc[timer.game_id] = new Date(timer.start_time).getTime();
        return acc;
      }, {});
    },
    enabled: validId,
    refetchInterval: 10000,
    // This is the same authoritative timestamp already read by the overview.
    placeholderData: seed && state?.halftimeStartTime ? { [gameId]: state.halftimeStartTime } : undefined,
  });

  const favoritesKey = `favoriteGameIds_${sport}`;
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem(favoritesKey) || "[]")));
  useEffect(() => {
    setFavorites(new Set(JSON.parse(localStorage.getItem(favoritesKey) || "[]")));
  }, [favoritesKey]);
  const toggleFavorite = (id: string) => {
    const next = new Set<string>(JSON.parse(localStorage.getItem(favoritesKey) || "[]"));
    if (next.has(id)) next.delete(id);
    else next.add(id);
    localStorage.setItem(favoritesKey, JSON.stringify([...next]));
    setFavorites(next);
  };

  const matchupName = game ? `${game.competitors.away.displayName} vs ${game.competitors.home.displayName}` : "Game";
  // A failed or missing scoreboard response must not leave a stale possession icon.
  const displayGame = game && !event ? { ...game, possessionId: undefined } :
    game && scoreboard.isError ? { ...game, possessionId: undefined } : game;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <SEO title={`${matchupName} · ${sport.toUpperCase()} Live Score & Halftime Timer`}
        description={`Follow ${matchupName} on HalfTimer with live scores and the synchronized halftime countdown.`}
        canonicalUrl={`https://thehalftimer.com${gamePath(sport, gameId)}`} />
      <nav className="flex w-full items-center justify-between px-4 py-3 sm:px-6" aria-label="Game navigation">
        <Button asChild variant="ghost" className="-ml-2 gap-2 font-bold">
          <Link to="/"><ArrowLeft className="h-5 w-5" /> Home</Link>
        </Button>
        <Link to="/" className="text-lg font-extrabold tracking-tight">HalfTimer</Link>
      </nav>
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-8 pt-1 sm:px-6 sm:pt-4">
        <h1 className="sr-only">{matchupName}</h1>
        {!validId || (!displayGame && summary.isError) ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Game unavailable</h2>
            <p className="mb-4 text-gray-600">We couldn't load this matchup from ESPN.</p>
            {validId && <Button variant="outline" onClick={() => summary.refetch()}>Try again</Button>}
          </div>
        ) : !displayGame ? (
          <div className="flex justify-center gap-2 py-20" role="status"><Loader2 className="h-5 w-5 animate-spin" /> Loading matchup...</div>
        ) : (
          <>
            <GameCard key={`${sport}-${gameId}`} game={displayGame} sport={sport} detailed
              halftimeStartTime={timers.data?.[gameId]} isFavorited={favorites.has(gameId)} onToggleFavorite={toggleFavorite} />
            <p className="mt-4 text-center text-xs text-gray-500">
              {scoreboard.isError ? "Score updates temporarily unavailable. Retrying automatically." : "Scores refresh every 20 seconds."}
            </p>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GamePage;
