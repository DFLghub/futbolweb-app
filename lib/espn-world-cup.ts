import { worldCup2026Matches, type WorldCupMatch } from "@/lib/world-cup-2026-matches";
import type { CanonicalMatchReality } from "@/lib/knockout-reality";
import type { MatchResultRow } from "@/lib/tournament-reality";

const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

type EspnScoreboard = {
  events?: EspnEvent[];
};

type EspnEvent = {
  competitions?: EspnCompetition[];
  date?: string;
  id?: string;
};

type EspnCompetition = {
  competitors?: EspnCompetitor[];
  details?: EspnPlayDetail[];
  status?: {
    period?: number;
    type?: {
      completed?: boolean;
      detail?: string;
      name?: string;
      shortDetail?: string;
      state?: string;
    };
  };
};

type EspnCompetitor = {
  homeAway?: "home" | "away";
  score?: string;
  winner?: boolean;
  team?: {
    abbreviation?: string;
    displayName?: string;
    id?: string;
    shortDisplayName?: string;
  };
};

type EspnPlayDetail = {
  clock?: {
    value?: number;
  };
  ownGoal?: boolean;
  scoringPlay?: boolean;
  scoreValue?: number;
  shootout?: boolean;
  team?: {
    id?: string;
  };
};

function dateKeyInUtc(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isKnockoutMatch(match: WorldCupMatch) {
  return match.isKnockout === true || match.stageEn !== "First Stage";
}

function findKnownMatch(event: EspnEvent) {
  if (event.id) {
    const byFifaId = worldCup2026Matches.find((match) => match.fifaId === event.id);
    if (byFifaId) return byFifaId;
  }

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

function scoreFromCompetitor(competitor: EspnCompetitor | undefined) {
  const score = Number(competitor?.score);
  return Number.isInteger(score) ? score : null;
}

function displayTeamName(match: WorldCupMatch, competitor: EspnCompetitor, side: "home" | "away") {
  const scheduledName = side === "home" ? match.homeTeam.name : match.awayTeam.name;

  if (scheduledName && scheduledName !== "Por definir") {
    return scheduledName;
  }

  return competitor.team?.displayName || competitor.team?.shortDisplayName || competitor.team?.abbreviation || null;
}

function deriveAdvancingTeam(match: WorldCupMatch, home: EspnCompetitor, away: EspnCompetitor) {
  if (home.winner === true) return displayTeamName(match, home, "home");
  if (away.winner === true) return displayTeamName(match, away, "away");
  return null;
}

function deriveRegulationScore(
  competition: EspnCompetition,
  home: EspnCompetitor,
  away: EspnCompetitor,
): { scoreA: number; scoreB: number } | null {
  const details = competition.details ?? [];
  const homeTeamId = home.team?.id;
  const awayTeamId = away.team?.id;

  if (!homeTeamId || !awayTeamId || details.length === 0) {
    return null;
  }

  let scoreA = 0;
  let scoreB = 0;
  let sawGoal = false;

  for (const detail of details) {
    if (!detail.scoringPlay || detail.shootout || detail.clock?.value === undefined || detail.clock.value > 5400) {
      continue;
    }

    const scoreValue = typeof detail.scoreValue === "number" && Number.isInteger(detail.scoreValue) ? detail.scoreValue : 1;
    if (detail.team?.id === homeTeamId) {
      scoreA += (detail.ownGoal ?? false) ? 0 : scoreValue;
      scoreB += (detail.ownGoal ?? false) ? scoreValue : 0;
      sawGoal = true;
    } else if (detail.team?.id === awayTeamId) {
      scoreA += (detail.ownGoal ?? false) ? scoreValue : 0;
      scoreB += (detail.ownGoal ?? false) ? 0 : scoreValue;
      sawGoal = true;
    }
  }

  if (!sawGoal) {
    return null;
  }

  return { scoreA, scoreB };
}

function buildMatchResult(
  knownMatch: WorldCupMatch,
  competition: EspnCompetition,
  home: EspnCompetitor,
  away: EspnCompetitor,
  finalScoreA: number,
  finalScoreB: number,
): MatchResultRow | null {
  const knockout = isKnockoutMatch(knownMatch);

  if (!knockout) {
    return {
      match_slug: knownMatch.slug,
      score_a: finalScoreA,
      score_b: finalScoreB,
      is_knockout: false,
      score_a_120: null,
      score_b_120: null,
      advancing_team: null,
    };
  }

  const regulationScore = deriveRegulationScore(competition, home, away);
  const advancingTeam = deriveAdvancingTeam(knownMatch, home, away);

  if (!advancingTeam) {
    return null;
  }

  return {
    match_slug: knownMatch.slug,
    score_a: regulationScore?.scoreA ?? finalScoreA,
    score_b: regulationScore?.scoreB ?? finalScoreB,
    is_knockout: true,
    score_a_120: finalScoreA,
    score_b_120: finalScoreB,
    advancing_team: advancingTeam,
  };
}

function statusFromCompetition(competition: EspnCompetition): CanonicalMatchReality["status"] {
  if (competition.status?.type?.completed === true || competition.status?.type?.state === "post") {
    return "final";
  }

  if (competition.status?.type?.state === "in") {
    return "live";
  }

  return "upcoming";
}

function buildCanonicalReality(
  knownMatch: WorldCupMatch,
  competition: EspnCompetition,
  home: EspnCompetitor,
  away: EspnCompetitor,
  scoreA: number | null,
  scoreB: number | null,
  sourceCheckedAt: string,
): CanonicalMatchReality {
  const knockout = isKnockoutMatch(knownMatch);
  const status = statusFromCompetition(competition);
  const regulationScore = knockout && status === "final"
    ? deriveRegulationScore(competition, home, away)
    : null;
  const advancingTeam = knockout && status === "final"
    ? deriveAdvancingTeam(knownMatch, home, away)
    : null;

  return {
    matchNumber: knownMatch.matchNumber,
    slug: knownMatch.slug,
    status,
    homeTeamName: displayTeamName(knownMatch, home, "home"),
    awayTeamName: displayTeamName(knownMatch, away, "away"),
    homeTeamCode: home.team?.abbreviation ?? knownMatch.homeTeamCode,
    awayTeamCode: away.team?.abbreviation ?? knownMatch.awayTeamCode,
    score90A: regulationScore?.scoreA ?? (status === "final" ? scoreA : null),
    score90B: regulationScore?.scoreB ?? (status === "final" ? scoreB : null),
    score120A: knockout && status === "final" ? scoreA : null,
    score120B: knockout && status === "final" ? scoreB : null,
    penaltiesA: null,
    penaltiesB: null,
    advancingTeam,
    sourceName: "ESPN FIFA World Cup scoreboard",
    sourceCheckedAt,
  };
}

export async function fetchEspnWorldCupReality(): Promise<CanonicalMatchReality[]> {
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
  const realities: CanonicalMatchReality[] = [];
  const sourceCheckedAt = new Date().toISOString();

  for (const event of scoreboard.events ?? []) {
    const competition = event.competitions?.[0];
    const knownMatch = findKnownMatch(event);
    const home = competition?.competitors?.find((competitor) => competitor.homeAway === "home");
    const away = competition?.competitors?.find((competitor) => competitor.homeAway === "away");
    const scoreA = scoreFromCompetitor(home);
    const scoreB = scoreFromCompetitor(away);

    if (!knownMatch || !isKnockoutMatch(knownMatch) || !competition || !home || !away) {
      continue;
    }

    realities.push(buildCanonicalReality(knownMatch, competition, home, away, scoreA, scoreB, sourceCheckedAt));
  }

  return realities;
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
    const scoreA = scoreFromCompetitor(home);
    const scoreB = scoreFromCompetitor(away);

    if (!completed || !knownMatch || !competition || !home || !away || scoreA === null || scoreB === null) {
      continue;
    }

    const result = buildMatchResult(knownMatch, competition, home, away, scoreA, scoreB);
    if (result) {
      results.push(result);
    }
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

  const slugs = results.map((result) => result.match_slug);
  const existingResponse = await fetch(
    `${supabaseUrl}/rest/v1/match_results?select=match_slug,score_a,score_b,is_knockout,score_a_120,score_b_120,advancing_team&match_slug=in.(${slugs.map(encodeURIComponent).join(",")})`,
    {
      cache: "no-store",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  const existingRows = existingResponse.ok
    ? await existingResponse.json() as MatchResultRow[]
    : [];
  const existingBySlug = new Map(existingRows.map((row) => [row.match_slug, row]));

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
      is_knockout: result.is_knockout ?? false,
      score_a_120: result.score_a_120 ?? null,
      score_b_120: result.score_b_120 ?? null,
      advancing_team: result.advancing_team ?? null,
      confirmed_by: "espn-scoreboard-sync",
    }))),
  });

  if (!response.ok) {
    throw new Error(`Could not upsert match_results: ${response.status}`);
  }

  const upserted = await response.json();

  await Promise.all(results.map((result) => {
    const existing = existingBySlug.get(result.match_slug);
    const changed = existing && (
      existing.score_a !== result.score_a ||
      existing.score_b !== result.score_b ||
      (existing.score_a_120 ?? null) !== (result.score_a_120 ?? null) ||
      (existing.score_b_120 ?? null) !== (result.score_b_120 ?? null) ||
      (existing.advancing_team ?? null) !== (result.advancing_team ?? null)
    );
    const action = existing ? changed ? "corrected" : "confirmed" : "entered";
    const eventHash = [
      result.score_a,
      result.score_b,
      result.score_a_120 ?? "",
      result.score_b_120 ?? "",
      result.advancing_team ?? "",
    ].join(":");

    if (existing && !changed) {
      return Promise.resolve();
    }

    return fetch(`${supabaseUrl}/rest/v1/rpc/record_state_change_event`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        p_event_type: "MatchResultEntered",
        p_entity_type: "match_results",
        p_entity_id: null,
        p_match_slug: result.match_slug,
        p_group_code: null,
        p_dedupe_key: `MatchResultEntered:${result.match_slug}:${eventHash}`,
        p_payload: {
          action,
          source: "espn-scoreboard-sync",
          result,
        },
        p_source: "reality-sync",
      }),
    });
  }));

  return upserted;
}
