import { describe, expect, it } from "vitest";

import { answerOracleQuestion } from "@/lib/oracle";
import { buildOracleContext, type OracleContext } from "@/lib/oracle/context";
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

const reality = {
  generatedAt: "2026-06-11T22:00:00Z",
  latestFinishedMatch: mexicoSouthAfrica,
  liveMatches: [],
  nextMatch: southKoreaCzechia,
  todayFinishedMatches: [mexicoSouthAfrica],
  todayUpcomingMatches: [southKoreaCzechia],
  todayFinishedPendingResultMatches: [],
  allMatches: [mexicoSouthAfrica, southKoreaCzechia],
  sources: [],
} satisfies TournamentReality;

describe("oracle context", () => {
  it("returns real fixture context for a known next match question", async () => {
    const context = await buildOracleContext("¿Cuál es el próximo partido?", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("next_match");
    expect(context.facts.join("\n")).toContain("Próximo partido");
    expect(context.facts.join("\n")).toContain("Corea del Sur");
    expect(context.facts.join("\n")).toContain("Chequia");
  });

  it("returns latest result context from FutbolWeb reality", async () => {
    const context = await buildOracleContext("último resultado", "paulgpt", "es", {
      reality,
    });

    expect(context.detectedIntent).toBe("latest_result");
    expect(context.facts.join("\n")).toContain("Último resultado");
    expect(context.facts.join("\n")).toContain("México 2-0 Sudáfrica");
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
  });

  it("keeps the selected persona identity without overriding facts", async () => {
    const context: OracleContext = {
      detectedIntent: "latest_result",
      facts: ["Último resultado: México 2-0 Sudáfrica."],
      limitations: [],
      safeContextText: "Intent: latest_result\nFacts:\n- Último resultado: México 2-0 Sudáfrica.\nLimitations: none",
    };
    const answer = await answerOracleQuestion("último resultado", "es", "tribunerogpt", context);

    expect(answer).toContain("TribuneroGPT");
    expect(answer).toContain("México 2-0 Sudáfrica");
  });
});
