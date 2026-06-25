import { unstable_cache } from "next/cache";
import { mockWorldCupGroupStandings, type GroupStanding } from "@/lib/mock-group-standings";
import {
  getCompletedMatchResults,
  getOfficialMatchResults,
} from "@/lib/tournament-reality";

import { worldCup2026Matches } from "./world-cup-2026-matches";

function groupCodeToGroupId(groupCode: string) {
  return groupCode
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cloneInitialStandings(): GroupStanding[] {
  return mockWorldCupGroupStandings.map((group) => ({
    ...group,
    teams: group.teams.map((team) => ({
      ...team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    })),
  }));
}

export async function getRealGroupStandings(now = new Date()): Promise<GroupStanding[]> {
  const standings = cloneInitialStandings();
  const resultsBySlug = new Map(
    getCompletedMatchResults(await getOfficialMatchResults(), now).map((result) => [
      result.match_slug,
      result,
    ]),
  );
  const groupsById = new Map(standings.map((group) => [group.groupId, group]));

  for (const match of worldCup2026Matches) {
    const result = resultsBySlug.get(match.slug);

    if (!result) {
      continue;
    }

    const groupId = groupCodeToGroupId(match.groupCode);
    const group = groupsById.get(groupId);

    if (!group) {
      continue;
    }

    const homeTeam = group.teams.find((team) => team.teamName === match.homeTeam.name);
    const awayTeam = group.teams.find((team) => team.teamName === match.awayTeam.name);

    if (!homeTeam || !awayTeam) {
      continue;
    }

    homeTeam.played += 1;
    awayTeam.played += 1;
    homeTeam.goalsFor += result.score_a;
    homeTeam.goalsAgainst += result.score_b;
    awayTeam.goalsFor += result.score_b;
    awayTeam.goalsAgainst += result.score_a;

    if (result.score_a > result.score_b) {
      homeTeam.won += 1;
      homeTeam.points += 3;
      awayTeam.lost += 1;
    } else if (result.score_a < result.score_b) {
      awayTeam.won += 1;
      awayTeam.points += 3;
      homeTeam.lost += 1;
    } else {
      homeTeam.drawn += 1;
      awayTeam.drawn += 1;
      homeTeam.points += 1;
      awayTeam.points += 1;
    }
  }

  for (const group of standings) {
    group.teams.forEach((team) => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
    });

    group.teams.sort((teamA, teamB) => (
      teamB.points - teamA.points ||
      teamB.goalDifference - teamA.goalDifference ||
      teamB.goalsFor - teamA.goalsFor ||
      teamA.teamName.localeCompare(teamB.teamName)
    ));

    group.teams.forEach((team, index) => {
      team.rank = index + 1;
    });
  }

  return standings;
}

export const STANDINGS_CACHE_TAG = "real-group-standings";

export const getCachedRealGroupStandings = unstable_cache(
  () => getRealGroupStandings(),
  [STANDINGS_CACHE_TAG],
  { revalidate: 60, tags: [STANDINGS_CACHE_TAG] },
);
