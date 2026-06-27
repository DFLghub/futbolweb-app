import type { FootballMatch } from "@/lib/football-utils";
import type { Locale } from "@/lib/i18n";
import { localizeWorldCupMatches, worldCup2026Matches } from "@/lib/world-cup-2026-matches";

export type MatchResultRow = {
  match_slug: string;
  score_a: number;
  score_b: number;
  is_knockout?: boolean;
  score_a_120?: number | null;
  score_b_120?: number | null;
  advancing_team?: string | null;
};

export type RealityMatchStatus =
  | "upcoming"
  | "live"
  | "finished_with_result"
  | "finished_pending_result";

export type RealityMatch = FootballMatch & {
  awayTeamCode: string | null;
  homeTeamCode: string | null;
  realityStatus: RealityMatchStatus;
  displayClock?: string;
  sourceName: string;
  sourceUpdatedAt: string;
};

export type TournamentReality = {
  generatedAt: string;
  latestFinishedMatch: RealityMatch | null;
  liveMatches: RealityMatch[];
  nextMatch: RealityMatch | null;
  todayFinishedMatches: RealityMatch[];
  todayUpcomingMatches: RealityMatch[];
  todayFinishedPendingResultMatches: RealityMatch[];
  allMatches: RealityMatch[];
  sources: Array<{
    name: string;
    url: string;
    confidence: "high" | "medium" | "low";
    types: string[];
  }>;
};

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;
const MATCH_RESULTS_SELECT = "match_slug,score_a,score_b,is_knockout,score_a_120,score_b_120,advancing_team";

function dateKeyInEasternTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).format(date);
}

export async function getOfficialMatchResults(): Promise<MatchResultRow[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/match_results?select=${MATCH_RESULTS_SELECT}`,
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

export function getCompletedMatchResults(
  matchResults: MatchResultRow[],
  now = new Date(),
): MatchResultRow[] {
  const nowTime = now.getTime();
  const startedSlugs = new Set(
    worldCup2026Matches
      .filter((match) => new Date(match.kickoffUtc).getTime() <= nowTime)
      .map((match) => match.slug),
  );

  return matchResults.filter((result) => startedSlugs.has(result.match_slug));
}

export async function getTournamentReality(
  locale: Locale,
  now = new Date(),
  matchResults?: MatchResultRow[],
): Promise<TournamentReality> {
  const loadedResults = matchResults ?? await getOfficialMatchResults();
  const completedResults = getCompletedMatchResults(loadedResults, now);
  const resultsBySlug = new Map(completedResults.map((result) => [result.match_slug, result]));
  const nowTime = now.getTime();
  const todayKey = dateKeyInEasternTime(now);
  const generatedAt = now.toISOString();
  const matches = localizeWorldCupMatches(worldCup2026Matches, locale).sort((left, right) => {
    return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
  });

  const allMatches = matches.map((match): RealityMatch => {
    const result = resultsBySlug.get(match.slug);
    const kickoffTime = new Date(match.kickoffUtc).getTime();
    const hasStarted = kickoffTime <= nowTime;
    const hasLikelyFinished = kickoffTime + MATCH_DURATION_MS <= nowTime;

    if (result) {
      return {
        ...match,
        status: "final",
        realityStatus: "finished_with_result",
        homeScore: result.score_a,
        awayScore: result.score_b,
        sourceName: "match_results",
        sourceUpdatedAt: generatedAt,
      };
    }

    if (hasStarted && !hasLikelyFinished) {
      return {
        ...match,
        status: "live",
        realityStatus: "live",
        sourceName: "fixture-clock",
        sourceUpdatedAt: generatedAt,
      };
    }

    if (hasLikelyFinished) {
      return {
        ...match,
        status: "scheduled",
        realityStatus: "finished_pending_result",
        sourceName: "fixture-clock",
        sourceUpdatedAt: generatedAt,
      };
    }

    return {
      ...match,
      status: "scheduled",
      realityStatus: "upcoming",
      sourceName: "fixture",
      sourceUpdatedAt: generatedAt,
    };
  });

  const todayMatches = allMatches.filter((match) => {
    return dateKeyInEasternTime(new Date(match.kickoffUtc)) === todayKey;
  });
  const finishedMatches = allMatches.filter((match) => match.realityStatus === "finished_with_result");

  return {
    generatedAt,
    latestFinishedMatch: finishedMatches.at(-1) ?? null,
    liveMatches: allMatches.filter((match) => match.realityStatus === "live"),
    nextMatch: allMatches.find((match) => match.realityStatus === "upcoming") ?? null,
    todayFinishedMatches: todayMatches.filter((match) => match.realityStatus === "finished_with_result"),
    todayUpcomingMatches: todayMatches.filter((match) => match.realityStatus === "upcoming"),
    todayFinishedPendingResultMatches: todayMatches.filter((match) => match.realityStatus === "finished_pending_result"),
    allMatches,
    sources: [
      {
        name: "FIFA Scores & Fixtures",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
        confidence: "high",
        types: ["fixture", "result"],
      },
      {
        name: "match_results",
        url: "supabase://public.match_results",
        confidence: "high",
        types: ["result"],
      },
    ],
  };
}

export function buildGptRealityContext(reality: TournamentReality) {
  return {
    generatedAt: reality.generatedAt,
    sources: reality.sources,
    latestFinishedMatch: reality.latestFinishedMatch,
    liveMatches: reality.liveMatches,
    nextMatch: reality.nextMatch,
    today: {
      finished: reality.todayFinishedMatches,
      live: reality.liveMatches,
      upcoming: reality.todayUpcomingMatches,
      pendingResult: reality.todayFinishedPendingResultMatches,
    },
  };
}
