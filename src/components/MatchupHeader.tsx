import type { Game } from "@/pages/HalfTimer";
import type { Sport } from "@/utils/gameData";
import PossessionIndicator from "@/components/PossessionIndicator";

const MatchupHeader = ({ game, sport }: { game: Game; sport: Sport }) => {
  const isScheduled = game.status.type.state === "pre";
  const isHalftime = game.status.type.description === "Halftime" || game.status.type.shortDetail === "HT";
  const showPossession = sport === "nfl" && game.status.type.state === "in" && !isHalftime;
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-slate-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      </div>
      <div className="relative px-3 py-4 sm:px-6 sm:py-5">
        <p className="mb-3 text-center text-xs font-extrabold tracking-[0.2em] text-blue-800">HalfTimer · {sport.toUpperCase()}</p>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center gap-2">
          {(["away", "home"] as const).map((side, index) => {
            const team = game.competitors[side];
            return (
              <div key={side} className="contents">
                {index === 1 && <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xs font-black text-slate-500 shadow-sm">VS</span>}
                <div className="min-w-0 text-center">
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-sm sm:h-24 sm:w-24">
                    <img src={team.logo} alt={team.displayName} className="h-12 w-12 object-contain sm:h-20 sm:w-20" />
                  </div>
                  <h2 className="flex min-h-12 items-center justify-center gap-1 text-lg font-extrabold leading-tight text-slate-900 sm:text-2xl">
                    <span>{team.displayName}</span>
                    {showPossession && team.id && game.possessionId === team.id && <PossessionIndicator />}
                  </h2>
                  <p className="mt-2 text-5xl font-black tabular-nums tracking-tight text-slate-900 sm:text-6xl">{isScheduled ? "--" : team.score}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default MatchupHeader;
