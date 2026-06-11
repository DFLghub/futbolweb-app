import { NextResponse } from "next/server";

import {
  getScoringPropagationStatus,
  runScoringForPendingResults,
} from "@/lib/scoring-propagation";
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

export async function GET() {
  try {
    const completedResults = getCompletedMatchResults(await getOfficialMatchResults());
    const status = await getScoringPropagationStatus(completedResults);

    return NextResponse.json({
      ok: true,
      status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown propagation status error",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const completedResults = getCompletedMatchResults(await getOfficialMatchResults());
    const propagation = await runScoringForPendingResults(completedResults);
    const status = await getScoringPropagationStatus(completedResults);

    return NextResponse.json({
      ok: true,
      ...propagation,
      status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown propagation error",
      },
      { status: 502 },
    );
  }
}
