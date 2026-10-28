import type { Game } from "@/pages/HalfTimer";
import type { Sport } from "@/utils/gameData";
import PossessionIndicator from "@/components/PossessionIndicator";

const teamColor = (color?: string) => color && /^[0-9a-f]{6}$/i.test(color) ? `#${color}` : "#64748b";

const MatchupHeader = ({ game, sport }: { game: Game; sport: Sport }) => {
  const isScheduled = game.status.type.state === "pre";
  const isHalftime = game.status.type.description === "Halftime" || game.status.type.shortDetail === "HT";
  const showPossession = sport === "nfl" && game.status.type.state === "in" && !isHalftime;
  return (
    <header className="relative overflow-hidden border-b border-gray-200 bg-white">
      <div className="absolute inset-0 flex opacity-10" aria-hidden="true">
        <div className="w-1/2" style={{ backgroundColor: teamColor(game.competitors.away.color) }} />
        <div className="w-1/2" style={{ backgroundColor: teamColor(game.competitors.home.color) }} />
      </div>
      <div className="relative px-3 py-4 sm:px-6 sm:py-5">
        <p className="mb-3 text-center text-xs font-extrabold tracking-[0.2em] text-gray-600">HalfTimer · {sport.toUpperCase()}</p>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center gap-2">
          {(["away", "home"] as const).map((side, index) => {
            const team = game.competitors[side];
            return (
              <div key={side} className="contents">
                {index === 1 && <span className="text-center text-sm font-black text-gray-500">VS</span>}
                <div className="min-w-0 text-center">
                  <img src={team.logo} alt={team.displayName} className="mx-auto mb-2 h-14 w-14 object-contain sm:h-20 sm:w-20" />
                  <h1 className="flex min-h-12 items-center justify-center gap-1 text-lg font-extrabold leading-tight sm:text-2xl">
                    <span>{team.displayName}</span>
                    {showPossession && team.id && game.possessionId === team.id && <PossessionIndicator />}
                  </h1>
                  <p className="mt-2 text-5xl font-black tabular-nums tracking-tight sm:text-6xl">{isScheduled ? "--" : team.score}</p>
                  <div className="mx-auto mt-3 h-1 w-14 rounded-full" style={{ backgroundColor: teamColor(team.color) }} />
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
