import { describe, expect, it } from "vitest";

import { answerOracleQuestion } from "@/lib/oracle";
import { buildOracleContext, detectOracleIntent, type OracleContext } from "@/lib/oracle/context";
import type { OracleCharacter } from "@/lib/oracle-characters";
import type { GroupStanding } from "@/lib/mock-group-standings";
import type { RankingParticipant } from "@/lib/ranking-types";
import type { RealityMatch, TournamentReality } from "@/lib/tournament-reality";

const mexicoSouthAfrica = {
  id: "mexico-south-africa-2026-06-11",
  slug: "mexico-south-africa-2026-06-11",
  homeTeam: { name: "México", flagEmoji: "🇲🇽" },
  awayTeam: { name: "Sudáfrica", flagEmoji: "🇿🇦" },
  kickoffUtc: "2026-06-11T19:00:00Z",
  kickoffLabel: "Jue, 11 Jun 2026 · 3:00 PM ET",
  venueName: "Mexico City Stadium",
  venueTimezone: "America/Mexico_City",
  stage: "Fase de grupos",
  groupCode: "Grupo A",
  status: "final",
  homeScore: 2,
  awayScore: 0,
  homeTeamCode: "MEX",
  awayTeamCode: "RSA",
  realityStatus: "finished_with_result",
  sourceName: "match_results",
  sourceUpdatedAt: "2026-06-11T22:00:00Z",
} satisfies RealityMatch;

const southKoreaCzechia = {
  id: "south-korea-czechia-2026-06-11",
  slug: "south-korea-czechia-2026-06-11",
  homeTeam: { name: "Corea del Sur", flagEmoji: "🇰🇷" },
  awayTeam: { name: "Chequia", flagEmoji: "🇨🇿" },
  kickoffUtc: "2026-06-12T02:00:00Z",
  kickoffLabel: "Jue, 11 Jun 2026 · 10:00 PM ET",
  venueName: "Guadalajara Stadium",
  venueTimezone: "America/Mexico_City",
  stage: "Fase de grupos",
  groupCode: "Grupo A",
  status: "scheduled",
  homeTeamCode: "KOR",
  awayTeamCode: "CZE",
  realityStatus: "upcoming",
  sourceName: "fixture",
  sourceUpdatedAt: "2026-06-11T22:00:00Z",
} satisfies RealityMatch;

const colombiaPortugal = {
  id: "portugal-colombia-2026-06-24",
  slug: "portugal-colombia-2026-06-24",
  homeTeam: { name: "Portugal", flagEmoji: "🇵🇹" },
  awayTeam: { name: "Colombia", flagEmoji: "🇨🇴" },
  kickoffUtc: "2026-06-24T21:00:00Z",
  kickoffLabel: "Mié, 24 Jun 2026 · 5:00 PM ET",
  venueName: "Miami Stadium",
  venueTimezone: "America/New_York",
  stage: "Fase de grupos",
  groupCode: "Grupo K",
  status: "scheduled",
  homeTeamCode: "POR",
  awayTeamCode: "COL",
  realityStatus: "upcoming",
  sourceName: "fixture",
  sourceUpdatedAt: "2026-06-11T22:00:00Z",
} satisfies RealityMatch;

const reality = {
  generatedAt: "2026-06-11T22:00:00Z",
  latestFinishedMatch: mexicoSouthAfrica,
  liveMatches: [],
  nextMatch: southKoreaCzechia,
  todayFinishedMatches: [mexicoSouthAfrica],
  todayUpcomingMatches: [southKoreaCzechia],
  todayFinishedPendingResultMatches: [],
  allMatches: [mexicoSouthAfrica, southKoreaCzechia, colombiaPortugal],
  sources: [],
} satisfies TournamentReality;

const ranking = [
  {
    position: 1,
    name: "Ana",
    points: 18,
    exactScores: 2,
    correctResults: 4,
    groupCode: "GRUPO-TEST",
    status: "gold",
  },
  {
    position: 2,
    name: "Luis",
    points: 12,
    exactScores: 1,
    correctResults: 3,
    groupCode: "GRUPO-TEST",
    status: "green",
  },
] satisfies RankingParticipant[];

const groupStandings = [
  {
    groupId: "grupo-a",
    groupName: "Grupo A",
    teams: [
      {
        teamId: "mexico",
        teamName: "México",
        played: 1,
        won: 1,
        drawn: 0,
        lost: 0,
        goalsFor: 2,
        goalsAgainst: 0,
        goalDifference: 2,
        points: 3,
        rank: 1,
        status: "pending",
      },
      {
        teamId: "sudafrica",
        teamName: "Sudáfrica",
        played: 1,
        won: 0,
        drawn: 0,
        lost: 1,
        goalsFor: 0,
        goalsAgainst: 2,
        goalDifference: -2,
        points: 0,
        rank: 4,
        status: "pending",
      },
    ],
  },
] satisfies GroupStanding[];

describe("oracle context", () => {
  it("detects focused Oracle intents from common questions", () => {
    expect(detectOracleIntent("¿Cuándo juega Colombia?", "es")).toBe("team_schedule");
    expect(detectOracleIntent("¿Quién ganó México vs Sudáfrica?", "es")).toBe("latest_result");
    expect(detectOracleIntent("¿Cómo funciona el puntaje?", "es")).toBe("rules");
    expect(detectOracleIntent("¿Quién va primero en el ranking?", "es")).toBe("ranking");
  });

  it("returns real fixture context for a known next match question", async () => {
    const context = await buildOracleContext("¿Cuál es el próximo partido?", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("next_match");
    expect(context.facts.join("\n")).toContain("Próximo partido");
    expect(context.facts.join("\n")).toContain("Corea del Sur");
    expect(context.facts.join("\n")).toContain("Chequia");
  });

  it("returns team fixture context when a team schedule is available", async () => {
    const context = await buildOracleContext("¿Cuándo juega Colombia?", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("team_schedule");
    expect(context.facts.join("\n")).toContain("Calendario de Colombia");
    expect(context.facts.join("\n")).toContain("Portugal");
    expect(context.facts.join("\n")).toContain("Miami Stadium");
  });

  it("returns latest result context from FutbolWeb reality", async () => {
    const context = await buildOracleContext("último resultado", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("latest_result");
    expect(context.facts.join("\n")).toContain("Último resultado");
    expect(context.facts.join("\n")).toContain("México 2-0 Sudáfrica");
  });

  it("returns the latest result for a winner question without inventing extra match details", async () => {
    const context = await buildOracleContext("¿Quién ganó México vs Sudáfrica?", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("latest_result");
    expect(context.facts.join("\n")).toContain("México 2-0 Sudáfrica");
    expect(context.facts.join("\n")).not.toContain("expuls");
  });

  it("returns rules/help context for scoring questions", async () => {
    const context = await buildOracleContext("¿Cómo funciona el puntaje?", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("rules");
    expect(context.facts.join("\n")).toContain("pronósticos aceptados");
    expect(context.facts.join("\n")).toContain("ranking deriva de prediction_scores");
  });

  it("returns supplied ranking context when ranking data is available", async () => {
    const context = await buildOracleContext("¿Quién va primero en el ranking?", "paulgpt", "es", {
      ranking,
      reality,
    });

    expect(context.detectedIntent).toBe("ranking");
    expect(context.facts.join("\n")).toContain("Ranking actual de pronósticos");
    expect(context.facts.join("\n")).toContain("#1 Ana · 18 pts");
  });

  it("returns supplied group standings context when available", async () => {
    const context = await buildOracleContext("posiciones del grupo A", "paulgpt", "es", {
      groupStandings,
      reality,
    });

    expect(context.detectedIntent).toBe("group_standings");
    expect(context.facts.join("\n")).toContain("Grupo A");
    expect(context.facts.join("\n")).toContain("1. México · 3 pts");
  });

  it("keeps VARGPT honest for incident questions without an incident feed", async () => {
    const context = await buildOracleContext("¿Por qué expulsaron a Montes?", "vargpt", "es", {
      reality,
    });
    const answer = await answerOracleQuestion("¿Por qué expulsaron a Montes?", "es", "vargpt", context);

    expect(context.detectedIntent).toBe("incident_detail");
    expect(answer).toContain("VARGPT");
    expect(answer).toContain("No tengo todavía el detalle oficial de incidencias jugada a jugada");
    expect(answer).toContain("no debo inventar");
    expect(answer).not.toContain("Montes fue expulsado por");
    expect(answer).not.toContain("conducta violenta");
    expect(answer).not.toContain("segunda amarilla");
    expect(answer).not.toContain("ocasión manifiesta");
    expect(answer).not.toContain("insulto");
    expect(answer).not.toContain("revisión VAR");
  });

  it("returns a grounded fallback for unknown questions", async () => {
    const context = await buildOracleContext("¿Qué clima hace en la luna?", "paulgpt", "es", {
      reality,
    });
    const answer = await answerOracleQuestion("¿Qué clima hace en la luna?", "es", "paulgpt", context);

    expect(context.detectedIntent).toBe("unknown");
    expect(answer).toContain("PaulGPT");
    expect(answer).toContain("No pude conectar esa pregunta");
    expect(answer).toContain("Último resultado confirmado");
    expect(answer).toContain("Próximo partido conocido");
    expect(answer).toContain("Prueba con:");
    expect(answer).not.toContain("clima");
  });

  it("keeps every persona layered over the same facts with a distinct voice", async () => {
    const context: OracleContext = {
      detectedIntent: "latest_result",
      facts: ["Último resultado: México 2-0 Sudáfrica."],
      limitations: [],
      safeContextText: "Intent: latest_result\nFacts:\n- Último resultado: México 2-0 Sudáfrica.\nLimitations: none",
    };
    const personas: Array<[OracleCharacter, string, string]> = [
      ["paulgpt", "PaulGPT desde la cabina", "Lectura de estadio"],
      ["vargpt", "Decisión VARGPT", "Claro, reglamentario"],
      ["insultistagpt", "InsultistaGPT desde la tribuna", "Vacile sano"],
      ["optimistagpt", "OptimistaGPT", "Lado positivo"],
      ["tribunerogpt", "TribuneroGPT desde la tribuna", "¿Qué dice la banda?"],
    ];
    const answers = new Set<string>();

    for (const [character, identity, marker] of personas) {
      const answer = await answerOracleQuestion("último resultado", "es", character, context);

      expect(answer).toContain(identity);
      expect(answer).toContain(marker);
      expect(answer).toContain("México 2-0 Sudáfrica");
      expect(answer).not.toContain("México 3-0 Sudáfrica");
      answers.add(answer);
    }

    expect(answers.size).toBe(personas.length);
  });

  it("renders unknown fallback differently by persona while staying grounded", async () => {
    const context = await buildOracleContext("¿Qué clima hace en la luna?", "paulgpt", "es", {
      reality,
    });
    const paul = await answerOracleQuestion("¿Qué clima hace en la luna?", "es", "paulgpt", context);
    const vargpt = await answerOracleQuestion("¿Qué clima hace en la luna?", "es", "vargpt", context);
    const insultista = await answerOracleQuestion("¿Qué clima hace en la luna?", "es", "insultistagpt", context);
    const optimista = await answerOracleQuestion("¿Qué clima hace en la luna?", "es", "optimistagpt", context);
    const tribunero = await answerOracleQuestion("¿Qué clima hace en la luna?", "es", "tribunerogpt", context);
    const answers = [paul, vargpt, insultista, optimista, tribunero];

    answers.forEach((answer) => {
      expect(answer).toContain("No pude conectar esa pregunta");
      expect(answer).toContain("Último resultado confirmado");
      expect(answer).toContain("Próximo partido conocido");
      expect(answer).toContain("Prueba con:");
    });
    expect(paul).toContain("PaulGPT desde la cabina");
    expect(vargpt).toContain("Decisión VARGPT");
    expect(insultista).toContain("Vacile sano");
    expect(optimista).toContain("Lado positivo");
    expect(tribunero).toContain("¿Qué dice la banda?");
    expect(new Set(answers).size).toBe(answers.length);
  });

  it("supports English context and answers with grounded facts", async () => {
    const englishReality = {
      ...reality,
      latestFinishedMatch: {
        ...mexicoSouthAfrica,
        homeTeam: { name: "Mexico", flagEmoji: "🇲🇽" },
        awayTeam: { name: "South Africa", flagEmoji: "🇿🇦" },
      },
      nextMatch: {
        ...southKoreaCzechia,
        homeTeam: { name: "South Korea", flagEmoji: "🇰🇷" },
        awayTeam: { name: "Czechia", flagEmoji: "🇨🇿" },
      },
      todayFinishedMatches: [
        {
          ...mexicoSouthAfrica,
          homeTeam: { name: "Mexico", flagEmoji: "🇲🇽" },
          awayTeam: { name: "South Africa", flagEmoji: "🇿🇦" },
        },
      ],
      todayUpcomingMatches: [
        {
          ...southKoreaCzechia,
          homeTeam: { name: "South Korea", flagEmoji: "🇰🇷" },
          awayTeam: { name: "Czechia", flagEmoji: "🇨🇿" },
        },
      ],
      allMatches: [
        {
          ...mexicoSouthAfrica,
          homeTeam: { name: "Mexico", flagEmoji: "🇲🇽" },
          awayTeam: { name: "South Africa", flagEmoji: "🇿🇦" },
        },
        {
          ...southKoreaCzechia,
          homeTeam: { name: "South Korea", flagEmoji: "🇰🇷" },
          awayTeam: { name: "Czechia", flagEmoji: "🇨🇿" },
        },
      ],
    } satisfies TournamentReality;
    const context = await buildOracleContext("latest result", "paulgpt", "en", {
      reality: englishReality,
    });
    const answer = await answerOracleQuestion("latest result", "en", "paulgpt", context);

    expect(context.detectedIntent).toBe("latest_result");
    expect(answer).toContain("PaulGPT");
    expect(answer).toContain("broadcast booth");
    expect(answer).toContain("Latest result");
    expect(answer).toContain("Mexico 2-0 South Africa");
  });
});
