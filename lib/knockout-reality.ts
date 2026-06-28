import type { Locale } from "@/lib/i18n";
import {
  localizeWorldCupMatches,
  worldCup2026Matches,
  type WorldCupMatch,
} from "@/lib/world-cup-2026-matches";
import type { MatchResultRow } from "@/lib/tournament-reality";

export type CanonicalMatchReality = {
  matchNumber: number;
  slug: string;
  status: "upcoming" | "live" | "final";
  homeTeamName: string | null;
  awayTeamName: string | null;
  homeTeamCode: string | null;
  awayTeamCode: string | null;
  score90A: number | null;
  score90B: number | null;
  score120A: number | null;
  score120B: number | null;
  penaltiesA: number | null;
  penaltiesB: number | null;
  advancingTeam: string | null;
  sourceName: "FIFA official match schedule" | "ESPN FIFA World Cup scoreboard";
  sourceCheckedAt: string;
};

export type BracketAssignment = {
  matchNumber: number;
  placeholder: string;
  teamName: string;
};

const KO_FIRST_MATCH_NUMBER = 73;
const KO_LAST_MATCH_NUMBER = 104;

export function knockoutSlugForMatchNumber(matchNumber: number) {
  if (matchNumber < KO_FIRST_MATCH_NUMBER || matchNumber > KO_LAST_MATCH_NUMBER) {
    return null;
  }

  return `mundial-2026-partido-${String(matchNumber).padStart(3, "0")}`;
}

export function isKnockoutMatchNumber(matchNumber: number) {
  return knockoutSlugForMatchNumber(matchNumber) !== null;
}

export function getWorldCupMatchByNumber(matchNumber: number) {
  return worldCup2026Matches.find((match) => match.matchNumber === matchNumber) ?? null;
}

export function getWorldCupMatchBySlug(slug: string) {
  return worldCup2026Matches.find((match) => match.slug === slug) ?? null;
}

function isKnockoutWorldCupMatch(match: WorldCupMatch) {
  return match.isKnockout === true || match.stageEn !== "First Stage";
}

export function buildFifaFixtureReality(now = new Date()): CanonicalMatchReality[] {
  return worldCup2026Matches
    .filter((match) => isKnockoutMatchNumber(match.matchNumber))
    .map((match) => ({
      matchNumber: match.matchNumber,
      slug: match.slug,
      status: "upcoming" as const,
      homeTeamName: match.homeTeamCode ? match.homeTeam.name : null,
      awayTeamName: match.awayTeamCode ? match.awayTeam.name : null,
      homeTeamCode: match.homeTeamCode,
      awayTeamCode: match.awayTeamCode,
      score90A: null,
      score90B: null,
      score120A: null,
      score120B: null,
      penaltiesA: null,
      penaltiesB: null,
      advancingTeam: null,
      sourceName: "FIFA official match schedule" as const,
      sourceCheckedAt: now.toISOString(),
    }));
}

function resultForMatchNumber(results: MatchResultRow[], matchNumber: number) {
  const slug = knockoutSlugForMatchNumber(matchNumber);
  if (!slug) return null;
  return results.find((result) => result.match_slug === slug) ?? null;
}

function teamNamesForMatch(
  match: WorldCupMatch,
  assignments: Map<string, string>,
  locale: Locale,
) {
  const localized = localizeWorldCupMatches([match], locale)[0];
  const homeName = match.homePlaceholder
    ? assignments.get(match.homePlaceholder) ?? localized.homeTeam.name
    : localized.homeTeam.name;
  const awayName = match.awayPlaceholder
    ? assignments.get(match.awayPlaceholder) ?? localized.awayTeam.name
    : localized.awayTeam.name;

  return { homeName, awayName };
}

export function buildKnockoutBracketAssignments(
  results: MatchResultRow[],
  locale: Locale = "es",
): BracketAssignment[] {
  const assignments = new Map<string, string>();
  const output: BracketAssignment[] = [];

  for (let matchNumber = KO_FIRST_MATCH_NUMBER; matchNumber <= KO_LAST_MATCH_NUMBER; matchNumber++) {
    const result = resultForMatchNumber(results, matchNumber);
    const match = getWorldCupMatchByNumber(matchNumber);

    if (!result || !match || !isKnockoutWorldCupMatch(match) || !result.advancing_team) {
      continue;
    }

    const winnerPlaceholder = `W${matchNumber}`;
    assignments.set(winnerPlaceholder, result.advancing_team);
    output.push({
      matchNumber,
      placeholder: winnerPlaceholder,
      teamName: result.advancing_team,
    });

    const { homeName, awayName } = teamNamesForMatch(match, assignments, locale);
    const runnerUp = result.advancing_team === homeName
      ? awayName
      : result.advancing_team === awayName
        ? homeName
        : null;

    if (runnerUp) {
      const runnerUpPlaceholder = `RU${matchNumber}`;
      assignments.set(runnerUpPlaceholder, runnerUp);
      output.push({
        matchNumber,
        placeholder: runnerUpPlaceholder,
        teamName: runnerUp,
      });
    }
  }

  return output;
}

export function applyKnockoutBracketAssignments<T extends WorldCupMatch>(
  matches: T[],
  results: MatchResultRow[],
  locale: Locale,
): T[] {
  const assignments = new Map(
    buildKnockoutBracketAssignments(results, locale)
      .map((assignment) => [assignment.placeholder, assignment.teamName]),
  );

  if (assignments.size === 0) {
    return matches;
  }

  return matches.map((match) => {
    const homeAssigned = match.homePlaceholder
      ? assignments.get(match.homePlaceholder)
      : undefined;
    const awayAssigned = match.awayPlaceholder
      ? assignments.get(match.awayPlaceholder)
      : undefined;

    if (!homeAssigned && !awayAssigned) {
      return match;
    }

    return {
      ...match,
      homeTeam: homeAssigned
        ? { ...match.homeTeam, name: homeAssigned }
        : match.homeTeam,
      awayTeam: awayAssigned
        ? { ...match.awayTeam, name: awayAssigned }
        : match.awayTeam,
    };
  });
}
