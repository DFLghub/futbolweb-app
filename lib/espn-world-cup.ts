import { worldCup2026Matches, type WorldCupMatch } from "@/lib/world-cup-2026-matches";
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

    const scoreValue = Number.isInteger(detail.scoreValue) ? detail.scoreValue : 1;
    if (detail.team?.id === homeTeamId) {
      scoreA += detail.ownGoal ? 0 : scoreValue;
      scoreB += detail.ownGoal ? scoreValue : 0;
      sawGoal = true;
    } else if (detail.team?.id === awayTeamId) {
      scoreA += detail.ownGoal ? scoreValue : 0;
      scoreB += detail.ownGoal ? 0 : scoreValue;
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

  return response.json();
}
