import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

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

export const predictionNationalTeams = Array.from(
  new Set([
    ...priorityTeams,
    ...worldCup2026Matches.flatMap((match) => [
      match.homeTeam.name,
      match.awayTeam.name,
    ]),
  ]),
);
