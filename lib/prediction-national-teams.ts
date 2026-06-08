import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

const worldCupTeamSlots = 48;

const priorityTeams = [
  "Colombia",
  "Brasil",
  "Argentina",
  "España",
  "Países Bajos",
  "Francia",
  "Inglaterra",
  "México",
  "Sudáfrica",
];

const knownNationalTeams = Array.from(
  new Set([
    ...priorityTeams,
    ...worldCup2026Matches.flatMap((match) => [
      match.homeTeam.name,
      match.awayTeam.name,
    ]),
  ]),
);

const placeholderTeams = Array.from(
  { length: Math.max(worldCupTeamSlots - knownNationalTeams.length, 0) },
  (_, index) => `Por definir ${index + 1}`,
);

export const predictionNationalTeams = [
  ...knownNationalTeams,
  ...placeholderTeams,
].slice(0, worldCupTeamSlots);
