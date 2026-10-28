import type { EventData, Game } from "@/pages/HalfTimer";

interface Play {
  type?: { id?: string; text?: string };
  text?: string;
  period?: { number: number };
  clock?: { displayValue: string };
  start?: { team?: { id: string } };
  homeScore?: number;
  awayScore?: number;
}

export interface EspnSummary {
  header?: EventData;
  plays?: Play[];
  drives?: { previous?: Array<{ plays?: Play[] }>; current?: { plays?: Play[] } };
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function explicitKickoffReceiver(texts: string[], game: Game): string | null | undefined {
  const teams = [game.competitors.away, game.competitors.home];
  const decisions = new Set<string>();
  for (const team of teams) {
    if (!team.id) continue;
    const aliases = [team.displayName, team.abbreviation].filter(Boolean).map(value => escapeRegex(value!)).join("|");
    const subject = `\\b(?:${aliases})\\b`;
    for (const text of texts) {
      const defer = new RegExp(`${subject}\\s+(?:(?:wins? (?:the )?(?:coin )?toss|won (?:the )?(?:coin )?toss)[, ]*(?:and )?)?(?:elects? to |elected to |chooses? to |chose to )?defer(?:s|red)?\\b`, "i");
      const secondHalf = new RegExp(`${subject}\\s+(?:will |to |(?:elects?|chooses?) to )?receive(?:s)?(?: the)?(?: (?:second[- ]half|2nd[- ]half) kickoff| (?:kickoff )?(?:in|to start) the (?:second|2nd) half)`, "i");
      const openingReceive = new RegExp(`${subject}\\s+(?:(?:wins? (?:the )?(?:coin )?toss)[, ]*(?:and )?)?(?:elects?|chooses?) to receive\\b(?![^.]*second[- ]half)`, "i");
      if (defer.test(text) || secondHalf.test(text)) decisions.add(team.id);
      else if (openingReceive.test(text)) {
        const other = teams.find(candidate => candidate.id !== team.id);
        if (other?.id) decisions.add(other.id);
      }
    }
  }
  if (!decisions.size) return undefined;
  return decisions.size === 1 ? [...decisions][0] : null;
}

export function getNflKickoffReceiver(summary: EspnSummary, game: Game): string | null {
  const plays = [
    ...(summary.plays || []),
    ...(summary.drives?.previous || []).flatMap(drive => drive.plays || []),
    ...(summary.drives?.current?.plays || []),
  ];
  const texts = [
    ...(summary.header?.competitions?.[0]?.notes || []).map(note => note.text),
    ...plays.filter(play => !play.period || play.period.number === 1).map(play => play.text || ""),
  ];
  const explicit = explicitKickoffReceiver(texts, game);
  if (explicit !== undefined) return explicit;

  // At 15:00 in Q1 with no score: the opening kickoff, including any re-kick.
  // ESPN start.team is the kicking team (the drive team is often the receiver).
  const openingKicks = plays.filter(play =>
    play.period?.number === 1 && play.clock?.displayValue === "15:00" &&
    (play.type?.id === "53" || /kickoff/i.test(play.type?.text || "")) &&
    play.homeScore === 0 && play.awayScore === 0
  );
  if (!openingKicks.length || openingKicks.some(play => !play.start?.team?.id)) return null;
  const ids = new Set(openingKicks.map(play => play.start!.team!.id));
  if (ids.size !== 1) return null;
  const id = [...ids][0];
  return [game.competitors.home.id, game.competitors.away.id].includes(id) ? id : null;
}
