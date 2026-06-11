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

function createClient(overrides = {}) {
  const scoringCalls: string[] = [];

  return {
    client: {
      getRankingParticipantCount: async () => 3,
      getScoredCountsByMatch: async () => new Map([[mexicoResult.match_slug, 2]]),
      getStateChangeEvents: async () => [
        {
          created_at: "2026-06-11T22:00:00Z",
          event_type: "ScoringCompleted",
          match_slug: mexicoResult.match_slug,
          payload: {},
          source: "scoring",
        },
        {
          created_at: "2026-06-11T22:01:00Z",
          event_type: "RankingUpdated",
          match_slug: mexicoResult.match_slug,
          payload: {},
          source: "scoring",
        },
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
  it("reports scored and pending matches from state_change_events", async () => {
    const { client } = createClient();
    const status = await getScoringPropagationStatus([mexicoResult, koreaResult], client);

    expect(status.scored.map((match) => match.matchSlug)).toEqual([mexicoResult.match_slug]);
    expect(status.pendingScoring.map((match) => match.matchSlug)).toEqual([
      koreaResult.match_slug,
    ]);
    expect(status.latestRankingUpdatedAt).toBe("2026-06-11T22:01:00Z");
    expect(status.totalRankingParticipants).toBe(3);
  });

  it("runs scoring only for confirmed results missing ScoringCompleted", async () => {
    const { client, scoringCalls } = createClient();
    const runs = await runScoringForPendingResults([mexicoResult, koreaResult], client);

    expect(scoringCalls).toEqual([koreaResult.match_slug]);
    expect(runs).toEqual([
      {
        matchSlug: koreaResult.match_slug,
        scoredRows: 1,
      },
    ]);
  });
});
