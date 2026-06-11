import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";
import type { MatchResultRow } from "@/lib/tournament-reality";

const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

type EspnScoreboard = {
  events?: EspnEvent[];
};

type EspnEvent = {
  competitions?: Array<{
    competitors?: EspnCompetitor[];
    status?: {
      type?: {
        completed?: boolean;
        state?: string;
      };
    };
  }>;
  date?: string;
};

type EspnCompetitor = {
  homeAway?: "home" | "away";
  score?: string;
  team?: {
    abbreviation?: string;
  };
};

function dateKeyInUtc(date: Date) {
  return date.toISOString().slice(0, 10);
}

function findKnownMatch(event: EspnEvent) {
  const competition = event.competitions?.[0];
  const home = competition?.competitors?.find((competitor) => competitor.homeAway === "home");
  const away = competition?.competitors?.find((competitor) => competitor.homeAway === "away");
  const eventDate = event.date ? dateKeyInUtc(new Date(event.date)) : null;

  if (!home?.team?.abbreviation || !away?.team?.abbreviation || !eventDate) {
    return null;
  }

  return worldCup2026Matches.find((match) => {
    return (
      dateKeyInUtc(new Date(match.kickoffUtc)) === eventDate &&
      match.homeTeamCode === home.team?.abbreviation &&
      match.awayTeamCode === away.team?.abbreviation
    );
  }) ?? null;
}

export async function fetchEspnWorldCupFinalResults(): Promise<MatchResultRow[]> {
  const response = await fetch(ESPN_SCOREBOARD_URL, {
    cache: "no-store",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Could not load ESPN World Cup scoreboard: ${response.status}`);
  }

  const scoreboard = await response.json() as EspnScoreboard;
  const results: MatchResultRow[] = [];

  for (const event of scoreboard.events ?? []) {
    const competition = event.competitions?.[0];
    const completed = competition?.status?.type?.completed === true ||
      competition?.status?.type?.state === "post";
    const knownMatch = findKnownMatch(event);
    const home = competition?.competitors?.find((competitor) => competitor.homeAway === "home");
    const away = competition?.competitors?.find((competitor) => competitor.homeAway === "away");
    const scoreA = Number(home?.score);
    const scoreB = Number(away?.score);

    if (!completed || !knownMatch || !Number.isInteger(scoreA) || !Number.isInteger(scoreB)) {
      continue;
    }

    results.push({
      match_slug: knownMatch.slug,
      score_a: scoreA,
      score_b: scoreB,
    });
  }

  return results;
}

export async function upsertOfficialMatchResults(results: MatchResultRow[]) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (results.length === 0) {
    return [];
  }

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials for result sync");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/match_results?on_conflict=match_slug`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(results.map((result) => ({
      match_slug: result.match_slug,
      score_a: result.score_a,
      score_b: result.score_b,
      confirmed_by: "espn-scoreboard-sync",
    }))),
  });

  if (!response.ok) {
    throw new Error(`Could not upsert match_results: ${response.status}`);
  }

  return response.json();
}
