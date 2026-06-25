import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import {
  fetchEspnWorldCupFinalResults,
  upsertOfficialMatchResults,
} from "@/lib/espn-world-cup";
import { GROUP_MATCH_PREDICTIONS_TAG } from "@/lib/group-match-predictions";
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
    const results = await fetchEspnWorldCupFinalResults();
    const upserted = await upsertOfficialMatchResults(results);
    const completedResults = getCompletedMatchResults(await getOfficialMatchResults());
    const propagation = await runScoringForPendingResults(completedResults);

    revalidateTag(STANDINGS_CACHE_TAG);
    revalidateTag(GROUP_MATCH_PREDICTIONS_TAG);
    revalidateTag(PREDICTION_GROUP_STANDINGS_TAG);

    return NextResponse.json({
      ok: true,
      source: "ESPN FIFA World Cup scoreboard",
      imported: results.length,
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
