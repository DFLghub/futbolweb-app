import type { MatchResultRow } from "@/lib/tournament-reality";

type PredictionScoreRow = {
  match_slug: string;
};

type StateChangeEventRow = {
  created_at: string;
  event_type: string;
  match_slug: string | null;
  payload: unknown;
  source: string;
};

type RankingSummaryRow = {
  points: number | string;
};

export type MatchScoringStatus = {
  hasResult: boolean;
  lastScoredAt: string | null;
  matchSlug: string;
  scoredPredictions: number;
  status: "pending_scoring" | "scored";
};

export type ScoringPropagationStatus = {
  generatedAt: string;
  latestRankingUpdatedAt: string | null;
  matches: MatchScoringStatus[];
  pendingScoring: MatchScoringStatus[];
  scored: MatchScoringStatus[];
  totalRankingParticipants: number;
};

export type ScoringRunResult = {
  matchSlug: string;
  scoredRows: number;
};

export type ScoringRunFailure = {
  error: string;
  matchSlug: string;
};

export type ScoringPropagationRun = {
  scoringFailures: ScoringRunFailure[];
  scoringRuns: ScoringRunResult[];
};

type ScoringPropagationClient = {
  getRankingParticipantCount: () => Promise<number>;
  getScoredCountsByMatch: () => Promise<Map<string, number>>;
  getStateChangeEvents: () => Promise<StateChangeEventRow[]>;
  runScoringForMatch: (matchSlug: string) => Promise<Array<{ alias: string }>>;
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials for scoring propagation");
  }

  return { supabaseUrl, serviceRoleKey };
}

async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase REST error ${response.status} for ${path}`);
  }

  return response.json();
}

async function supabaseRpc<T>(functionName: string, body: unknown): Promise<T> {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Supabase RPC error ${response.status} for ${functionName}`);
  }

  return response.json();
}

async function getScoredCountsByMatch() {
  const rows = await supabaseRest<PredictionScoreRow[]>(
    "prediction_scores?select=match_slug",
  );
  const counts = new Map<string, number>();

  for (const row of rows) {
    counts.set(row.match_slug, (counts.get(row.match_slug) ?? 0) + 1);
  }

  return counts;
}

async function getStateChangeEvents() {
  return supabaseRest<StateChangeEventRow[]>(
    "state_change_events?select=event_type,match_slug,payload,source,created_at&order=created_at.desc&limit=200",
  );
}

async function getRankingParticipantCount() {
  const rows = await supabaseRest<RankingSummaryRow[]>("ranking_summary?select=points");
  return rows.length;
}

const defaultClient: ScoringPropagationClient = {
  getRankingParticipantCount,
  getScoredCountsByMatch,
  getStateChangeEvents,
  runScoringForMatch: (matchSlug) => supabaseRpc<Array<{ alias: string }>>(
    "run_scoring_for_match",
    { p_match_slug: matchSlug },
  ),
};

export async function getScoringPropagationStatus(
  results: MatchResultRow[],
  client: ScoringPropagationClient = defaultClient,
): Promise<ScoringPropagationStatus> {
  const [scoredCounts, events, totalRankingParticipants] = await Promise.all([
    client.getScoredCountsByMatch(),
    client.getStateChangeEvents(),
    client.getRankingParticipantCount(),
  ]);
  const latestScoringByMatch = new Map<string, string>();

  for (const event of events) {
    if (event.event_type !== "ScoringCompleted" || !event.match_slug) {
      continue;
    }

    if (!latestScoringByMatch.has(event.match_slug)) {
      latestScoringByMatch.set(event.match_slug, event.created_at);
    }
  }

  const latestRankingUpdatedAt =
    events.find((event) => event.event_type === "RankingUpdated")?.created_at ?? null;
  const matches = results.map((result) => {
    const scoredPredictions = scoredCounts.get(result.match_slug) ?? 0;
    const lastScoredAt = latestScoringByMatch.get(result.match_slug) ?? null;

    return {
      hasResult: true,
      lastScoredAt,
      matchSlug: result.match_slug,
      scoredPredictions,
      status: lastScoredAt ? "scored" as const : "pending_scoring" as const,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    latestRankingUpdatedAt,
    matches,
    pendingScoring: matches.filter((match) => match.status === "pending_scoring"),
    scored: matches.filter((match) => match.status === "scored"),
    totalRankingParticipants,
  };
}

export async function runScoringForPendingResults(
  results: MatchResultRow[],
  client: ScoringPropagationClient = defaultClient,
): Promise<ScoringPropagationRun> {
  const status = await getScoringPropagationStatus(results, client);
  const runs: ScoringRunResult[] = [];
  const failures: ScoringRunFailure[] = [];

  for (const pendingMatch of status.pendingScoring) {
    try {
      const scoredRows = await client.runScoringForMatch(pendingMatch.matchSlug);

      runs.push({
        matchSlug: pendingMatch.matchSlug,
        scoredRows: scoredRows.length,
      });
    } catch (error) {
      failures.push({
        matchSlug: pendingMatch.matchSlug,
        error: error instanceof Error ? error.message : "Unknown scoring error",
      });
    }
  }

  return {
    scoringFailures: failures,
    scoringRuns: runs,
  };
}
