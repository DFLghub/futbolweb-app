import type { FootballMatch } from "@/lib/football-utils";
import type { Locale } from "@/lib/i18n";
import { localizeWorldCupMatches, worldCup2026Matches } from "@/lib/world-cup-2026-matches";

type MatchResultRow = {
  match_slug: string;
  score_a: number;
  score_b: number;
};

export type TournamentState = {
  latestFinishedMatch: FootballMatch | null;
  liveMatches: FootballMatch[];
  nextMatch: FootballMatch | null;
  todayFinishedMatches: FootballMatch[];
  todayUpcomingMatches: FootballMatch[];
  todayFinishedPendingResultMatches: FootballMatch[];
};

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

function dateKeyInEasternTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).format(date);
}

async function getMatchResults(): Promise<MatchResultRow[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/match_results?select=match_slug,score_a,score_b`,
    {
      cache: "no-store",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Could not load match_results: ${response.status}`);
  }

  return response.json();
}

export async function deriveHomeMatchState(
  locale: Locale,
  now = new Date(),
  matchResults?: MatchResultRow[],
): Promise<TournamentState> {
  const matches = localizeWorldCupMatches(worldCup2026Matches, locale).sort((left, right) => {
    return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
  });
  const loadedResults = matchResults ?? await getMatchResults();
  const resultsBySlug = new Map(
    loadedResults.map((result) => [result.match_slug, result]),
  );
  const nowTime = now.getTime();
  const todayKey = dateKeyInEasternTime(now);

  const matchesWithState = matches.map((match): FootballMatch => {
    const result = resultsBySlug.get(match.slug ?? match.id);
    const kickoffTime = new Date(match.kickoffUtc).getTime();
    const hasStarted = kickoffTime <= nowTime;
    const hasLikelyFinished = kickoffTime + MATCH_DURATION_MS <= nowTime;

    if (result && hasStarted) {
      return {
        ...match,
        status: "final",
        homeScore: result.score_a,
        awayScore: result.score_b,
      };
    }

    if (hasStarted && !hasLikelyFinished) {
      return {
        ...match,
        status: "live",
      };
    }

    return {
      ...match,
      status: hasStarted ? "scheduled" : match.status,
    };
  });

  const finishedMatches = matchesWithState.filter((match) => match.status === "final");
  const todayMatches = matchesWithState.filter((match) => {
    return dateKeyInEasternTime(new Date(match.kickoffUtc)) === todayKey;
  });

  return {
    latestFinishedMatch: finishedMatches.at(-1) ?? null,
    liveMatches: matchesWithState.filter((match) => match.status === "live"),
    nextMatch: matchesWithState.find((match) => {
      return new Date(match.kickoffUtc).getTime() > nowTime && match.status !== "final";
    }) ?? null,
    todayFinishedMatches: todayMatches.filter((match) => match.status === "final"),
    todayUpcomingMatches: todayMatches.filter((match) => {
      return match.status !== "final" && new Date(match.kickoffUtc).getTime() > nowTime;
    }),
    todayFinishedPendingResultMatches: todayMatches.filter((match) => {
      const kickoffTime = new Date(match.kickoffUtc).getTime();
      return match.status !== "final" && kickoffTime + MATCH_DURATION_MS <= nowTime;
    }),
  };
}
