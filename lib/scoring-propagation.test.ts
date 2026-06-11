import { describe, expect, it } from "vitest";

import {
  getScoringPropagationStatus,
  runScoringForPendingResults,
} from "@/lib/scoring-propagation";

const mexicoResult = {
  match_slug: "mexico-south-africa-2026-06-11",
  score_a: 2,
  score_b: 0,
};

const koreaResult = {
  match_slug: "south-korea-czechia-2026-06-11",
  score_a: 1,
  score_b: 1,
};

const canadaResult = {
  match_slug: "canada-bosnia-and-herzegovina-2026-06-12",
  score_a: 3,
  score_b: 1,
};

function scoringCompleted(matchSlug: string, createdAt = "2026-06-11T22:00:00Z") {
  return {
    created_at: createdAt,
    event_type: "ScoringCompleted",
    match_slug: matchSlug,
    payload: {},
    source: "scoring",
  };
}

function rankingUpdated(matchSlug: string, createdAt = "2026-06-11T22:01:00Z") {
  return {
    created_at: createdAt,
    event_type: "RankingUpdated",
    match_slug: matchSlug,
    payload: {},
    source: "scoring",
  };
}

function createClient(overrides = {}) {
  const scoringCalls: string[] = [];

  return {
    client: {
      getRankingParticipantCount: async () => 3,
      getScoredCountsByMatch: async () => new Map([[mexicoResult.match_slug, 2]]),
      getStateChangeEvents: async () => [
        scoringCompleted(mexicoResult.match_slug),
        rankingUpdated(mexicoResult.match_slug),
      ],
      runScoringForMatch: async (matchSlug: string) => {
        scoringCalls.push(matchSlug);
        return [{ alias: "Alejo" }];
      },
      ...overrides,
    },
    scoringCalls,
  };
}

describe("scoring propagation", () => {
  it("reports a confirmed result without ScoringCompleted as pending scoring", async () => {
    const { client } = createClient();
    const status = await getScoringPropagationStatus([koreaResult], client);

    expect(status.pendingScoring).toHaveLength(1);
    expect(status.pendingScoring[0]?.matchSlug).toBe(koreaResult.match_slug);
    expect(status.scored).toHaveLength(0);
  });

  it("does not report a confirmed result with ScoringCompleted as pending", async () => {
    const { client } = createClient();
    const status = await getScoringPropagationStatus([mexicoResult], client);

    expect(status.pendingScoring).toHaveLength(0);
    expect(status.scored.map((match) => match.matchSlug)).toEqual([mexicoResult.match_slug]);
  });

  it("calls the existing run_scoring_for_match path for pending confirmed results", async () => {
    const { client, scoringCalls } = createClient();
    const result = await runScoringForPendingResults([mexicoResult, koreaResult], client);

    expect(scoringCalls).toEqual([koreaResult.match_slug]);
    expect(result.scoringRuns).toEqual([
      {
        matchSlug: koreaResult.match_slug,
        scoredRows: 1,
      },
    ]);
    expect(result.scoringFailures).toEqual([]);
  });

  it("is idempotent when ScoringCompleted exists before the second propagation run", async () => {
    const scoringCalls: string[] = [];
    let events = [
      scoringCompleted(mexicoResult.match_slug),
      rankingUpdated(mexicoResult.match_slug),
    ];
    const client = {
      getRankingParticipantCount: async () => 3,
      getScoredCountsByMatch: async () => new Map<string, number>(),
      getStateChangeEvents: async () => events,
      runScoringForMatch: async (matchSlug: string) => {
        scoringCalls.push(matchSlug);
        events = [
          scoringCompleted(koreaResult.match_slug, "2026-06-12T02:30:00Z"),
          rankingUpdated(koreaResult.match_slug, "2026-06-12T02:31:00Z"),
          ...events,
        ];
        return [{ alias: "Alejo" }];
      },
    };

    const firstRun = await runScoringForPendingResults([mexicoResult, koreaResult], client);
    const secondRun = await runScoringForPendingResults([mexicoResult, koreaResult], client);

    expect(scoringCalls).toEqual([koreaResult.match_slug]);
    expect(firstRun.scoringRuns).toHaveLength(1);
    expect(secondRun.scoringRuns).toEqual([]);
    expect(secondRun.scoringFailures).toEqual([]);
  });

  it("exposes latestRankingUpdatedAt when RankingUpdated exists", async () => {
    const { client } = createClient();
    const status = await getScoringPropagationStatus([mexicoResult, koreaResult], client);

    expect(status.latestRankingUpdatedAt).toBe("2026-06-11T22:01:00Z");
    expect(status.totalRankingParticipants).toBe(3);
  });

  it("returns safe empty lists when no confirmed results exist", async () => {
    const { client } = createClient();
    const status = await getScoringPropagationStatus([], client);
    const result = await runScoringForPendingResults([], client);

    expect(status.matches).toEqual([]);
    expect(status.pendingScoring).toEqual([]);
    expect(status.scored).toEqual([]);
    expect(result.scoringRuns).toEqual([]);
    expect(result.scoringFailures).toEqual([]);
  });

  it("reports per-match scoring failures without hiding other successful matches", async () => {
    const scoringCalls: string[] = [];
    const client = {
      getRankingParticipantCount: async () => 3,
      getScoredCountsByMatch: async () => new Map<string, number>(),
      getStateChangeEvents: async () => [],
      runScoringForMatch: async (matchSlug: string) => {
        scoringCalls.push(matchSlug);

        if (matchSlug === koreaResult.match_slug) {
          throw new Error("RPC failed");
        }

        return [{ alias: "Alejo" }, { alias: "Marta" }];
      },
    };

    const result = await runScoringForPendingResults([koreaResult, canadaResult], client);

    expect(scoringCalls).toEqual([koreaResult.match_slug, canadaResult.match_slug]);
    expect(result.scoringRuns).toEqual([
      {
        matchSlug: canadaResult.match_slug,
        scoredRows: 2,
      },
    ]);
    expect(result.scoringFailures).toEqual([
      {
        matchSlug: koreaResult.match_slug,
        error: "RPC failed",
      },
    ]);
  });
});
