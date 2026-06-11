import { NextResponse } from "next/server";

import {
  fetchEspnWorldCupFinalResults,
  upsertOfficialMatchResults,
} from "@/lib/espn-world-cup";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await fetchEspnWorldCupFinalResults();
    const upserted = await upsertOfficialMatchResults(results);

    return NextResponse.json({
      ok: true,
      source: "ESPN FIFA World Cup scoreboard",
      imported: results.length,
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
