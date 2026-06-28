import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import {
  fetchEspnWorldCupReality,
  fetchEspnWorldCupFinalResults,
  upsertOfficialMatchResults,
} from "@/lib/espn-world-cup";
import { GROUP_MATCH_PREDICTIONS_TAG } from "@/lib/group-match-predictions";
import {
  buildFifaFixtureReality,
  buildKnockoutBracketAssignments,
} from "@/lib/knockout-reality";
import { PREDICTION_GROUP_STANDINGS_TAG } from "@/lib/prediction-group-standings";
import { STANDINGS_CACHE_TAG } from "@/lib/real-group-standings";
import { runScoringForPendingResults } from "@/lib/scoring-propagation";
import {
  getCompletedMatchResults,
  getOfficialMatchResults,
} from "@/lib/tournament-reality";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function runTournamentRealitySync(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fifaFixtures = buildFifaFixtureReality();
    const espnReality = await fetchEspnWorldCupReality();
    const results = await fetchEspnWorldCupFinalResults();
    const upserted = await upsertOfficialMatchResults(results);
    const completedResults = getCompletedMatchResults(await getOfficialMatchResults());
    const bracketAssignments = buildKnockoutBracketAssignments(completedResults);
    const propagation = await runScoringForPendingResults(completedResults);

    revalidateTag(STANDINGS_CACHE_TAG, "default");
    revalidateTag(GROUP_MATCH_PREDICTIONS_TAG, "default");
    revalidateTag(PREDICTION_GROUP_STANDINGS_TAG, "default");

    return NextResponse.json({
      ok: true,
      source: "FIFA fixtures + ESPN FIFA World Cup scoreboard",
      fifaFixtures: fifaFixtures.length,
      espnReality,
      imported: results.length,
      bracketAssignments,
      ...propagation,
      upserted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown sync error",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  return runTournamentRealitySync(request);
}

export async function POST(request: Request) {
  return runTournamentRealitySync(request);
}
