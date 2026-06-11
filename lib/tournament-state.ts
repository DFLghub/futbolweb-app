import type { FootballMatch } from "@/lib/football-utils";
import type { Locale } from "@/lib/i18n";
import { getTournamentReality, type MatchResultRow } from "@/lib/tournament-reality";

export type TournamentState = {
  latestFinishedMatch: FootballMatch | null;
  liveMatches: FootballMatch[];
  nextMatch: FootballMatch | null;
  todayFinishedMatches: FootballMatch[];
  todayUpcomingMatches: FootballMatch[];
  todayFinishedPendingResultMatches: FootballMatch[];
};

export async function deriveHomeMatchState(
  locale: Locale,
  now = new Date(),
  matchResults?: MatchResultRow[],
): Promise<TournamentState> {
  const reality = await getTournamentReality(locale, now, matchResults);

  return {
    latestFinishedMatch: reality.latestFinishedMatch,
    liveMatches: reality.liveMatches,
    nextMatch: reality.nextMatch,
    todayFinishedMatches: reality.todayFinishedMatches,
    todayUpcomingMatches: reality.todayUpcomingMatches,
    todayFinishedPendingResultMatches: reality.todayFinishedPendingResultMatches,
  };
}
