import type { Locale } from "@/lib/i18n";
import type { RankingParticipant } from "@/lib/ranking-types";
import { getRanking } from "@/lib/real-ranking";
import { getRealGroupStandings } from "@/lib/real-group-standings";
import type { GroupStanding } from "@/lib/mock-group-standings";
import { getTournamentReality, type RealityMatch, type TournamentReality } from "@/lib/tournament-reality";
import {
  localizeWorldCupGroupStandings,
  localizeWorldCupMatches,
  worldCup2026Matches,
} from "@/lib/world-cup-2026-matches";
import type { OracleCharacter } from "@/lib/oracle-characters";

export type OracleIntent =
  | "next_match"
  | "current_status"
  | "source_status"
  | "team_schedule"
  | "latest_result"
  | "group_standings"
  | "ranking"
  | "rules"
  | "world_cup_history"
  | "var_rules"
  | "incident_detail"
  | "unknown";

export type OracleContext = {
  detectedIntent: OracleIntent;
  facts: string[];
  limitations: string[];
  safeContextText: string;
};

type TeamAlias = {
  code: string;
  name: string;
};

export type OracleContextInputs = {
  groupStandings?: GroupStanding[];
  ranking?: RankingParticipant[];
  reality: TournamentReality;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTeamAliases(locale: Locale) {
  const localizedMatches = localizeWorldCupMatches(worldCup2026Matches, locale);
  const alternateMatches = localizeWorldCupMatches(worldCup2026Matches, locale === "es" ? "en" : "es");
  const aliases = new Map<string, TeamAlias>();

  localizedMatches.forEach((match, index) => {
    const alternateMatch = alternateMatches[index];
    const candidates: Array<[string | null, string, string]> = [
      [match.homeTeamCode, match.homeTeam.name, alternateMatch.homeTeam.name],
      [match.awayTeamCode, match.awayTeam.name, alternateMatch.awayTeam.name],
    ];

    candidates.forEach(([code, localizedName, alternateName]) => {
      if (!code) return;
      aliases.set(normalizeText(code), { code, name: localizedName });
      aliases.set(normalizeText(localizedName), { code, name: localizedName });
      aliases.set(normalizeText(alternateName), { code, name: localizedName });
    });
  });

  return aliases;
}

function findTeam(question: string, locale: Locale) {
  const normalizedQuestion = ` ${normalizeText(question)} `;
  const aliases = Array.from(getTeamAliases(locale).entries()).sort((left, right) => right[0].length - left[0].length);

  return aliases.find(([alias]) => normalizedQuestion.includes(` ${alias} `))?.[1] ?? null;
}

function getGroupLetter(question: string) {
  const normalized = normalizeText(question);
  const match = normalized.match(/\b(?:grupo|group)\s+([a-l])\b/);
  return match?.[1]?.toUpperCase() ?? null;
}

export function detectOracleIntent(question: string, locale: Locale): OracleIntent {
  const normalized = normalizeText(question);

  if (/\b(expuls\w*|roja|red card|sent off|var|penal|penalty|tarjeta)\b/.test(normalized)) {
    if (/\b(por que|why|reason|razon|motivo|expuls\w*|sent off)\b/.test(normalized)) {
      return "incident_detail";
    }

    return "var_rules";
  }

  if (/\b(ranking|tabla de jugadores|leaderboard|posiciones de jugadores)\b/.test(normalized)) {
    return "ranking";
  }

  if (/\b(dato real|estimado|fuente|source|best effort|fallback|confiable|real data)\b/.test(normalized)) {
    return "source_status";
  }

  if (/\b(grupo|group|posiciones|standings|lider|leader)\b/.test(normalized)) {
    return "group_standings";
  }

  if (/\b(que esta pasando|que pasa ahora|en vivo|live|ahora|now|marcador|score)\b/.test(normalized)) {
    return "current_status";
  }

  if (/\b(ultimo resultado|latest result|resultado|quien gano|who won|finalizado|que paso|como quedo|como les fue|como salio|que tal quedo|what happened|how did|how was|que resultado|cuanto quedo)\b/.test(normalized)) {
    return "latest_result";
  }

  if (/\b(proximo|siguiente|viene|next match|upcoming|cuando juega|when does|calendario|schedule)\b/.test(normalized)) {
    return findTeam(question, locale) ? "team_schedule" : "next_match";
  }

  if (/\b(mundial|world cup|historia|history|campeon|champion|maracanazo|mexico 86)\b/.test(normalized)) {
    return "world_cup_history";
  }

  if (/\b(regla|rules|como funciona|how it works|puntos|points|pronostico|prediction)\b/.test(normalized)) {
    return "rules";
  }

  return "unknown";
}

function formatMatch(match: RealityMatch, locale: Locale) {
  const teams = `${match.homeTeam.flagEmoji} ${match.homeTeam.name} vs ${match.awayTeam.flagEmoji} ${match.awayTeam.name}`;

  if (match.realityStatus === "finished_with_result") {
    return `${match.homeTeam.name} ${match.homeScore}-${match.awayScore} ${match.awayTeam.name}`;
  }

  if (match.realityStatus === "live") {
    return `${teams} (${locale === "en" ? "live" : "en vivo"})`;
  }

  if (match.realityStatus === "finished_pending_result") {
    return `${teams} (${locale === "en" ? "pending result" : "resultado pendiente"})`;
  }

  return `${teams} · ${match.kickoffLabel} · ${match.venueName}`;
}

function formatGroup(group: GroupStanding | undefined, locale: Locale) {
  if (!group) {
    return locale === "en" ? "Group table unavailable." : "Tabla de grupo no disponible.";
  }

  return [
    group.groupName,
    ...group.teams.map((team) => `${team.rank}. ${team.teamName} · ${team.points} pts · PJ ${team.played} · DG ${team.goalDifference}`),
  ].join("\n");
}

function buildSafeContextText(intent: OracleIntent, facts: string[], limitations: string[]) {
  return [
    `Intent: ${intent}`,
    facts.length > 0 ? `Facts:\n${facts.map((fact) => `- ${fact}`).join("\n")}` : "Facts: none",
    limitations.length > 0 ? `Limitations:\n${limitations.map((limitation) => `- ${limitation}`).join("\n")}` : "Limitations: none",
  ].join("\n");
}

export async function buildOracleContext(
  question: string,
  selectedCharacterId: OracleCharacter,
  locale: Locale,
  inputs?: Partial<OracleContextInputs>,
): Promise<OracleContext> {
  const reality = inputs?.reality ?? await getTournamentReality(locale);
  const intent = detectOracleIntent(question, locale);
  const facts: string[] = [];
  const limitations: string[] = [];
  const team = findTeam(question, locale);

  if (intent === "incident_detail") {
    limitations.push(
      locale === "en"
        ? "FutbolWeb does not yet have official play-by-play incidents, red-card reasons, lineups, injuries, or VAR decisions."
        : "FutbolWeb todavía no tiene incidencias oficiales jugada a jugada, razones de expulsiones, alineaciones, lesiones o decisiones VAR.",
    );
  }

  if (intent === "latest_result") {
    if (reality.latestFinishedMatch) {
      facts.push(`${locale === "en" ? "Latest result" : "Último resultado"}: ${formatMatch(reality.latestFinishedMatch, locale)}.`);
    } else {
      limitations.push(locale === "en" ? "No confirmed final result is available yet." : "Todavía no hay resultado final confirmado disponible.");
    }
  }

  if (intent === "current_status") {
    if (reality.liveMatches.length > 0) {
      facts.push(`${locale === "en" ? "Live or in-window matches" : "Partidos en vivo o en ventana actual"}:\n${reality.liveMatches.map((match) => formatMatch(match, locale)).join("\n")}`);
    }

    if (reality.latestFinishedMatch) {
      facts.push(`${locale === "en" ? "Latest confirmed result" : "Último resultado confirmado"}: ${formatMatch(reality.latestFinishedMatch, locale)}.`);
    }

    if (reality.nextMatch) {
      facts.push(`${locale === "en" ? "Next known match" : "Próximo partido conocido"}: ${formatMatch(reality.nextMatch, locale)}.`);
    }

    limitations.push(
      locale === "en"
        ? "Live ESPN context is best-effort. Confirmed results come from FutbolWeb match_results; fixtures come from the loaded FIFA schedule."
        : "El contexto ESPN en vivo es best-effort. Los resultados confirmados vienen de match_results de FutbolWeb; los partidos vienen del calendario FIFA cargado.",
    );
  }

  if (intent === "next_match") {
    if (reality.nextMatch) {
      facts.push(`${locale === "en" ? "Next match" : "Próximo partido"}: ${formatMatch(reality.nextMatch, locale)}.`);
    } else {
      limitations.push(locale === "en" ? "No upcoming match is available in the loaded schedule." : "No hay próximo partido disponible en el calendario cargado.");
    }
  }

  if (intent === "team_schedule" && team) {
    const matches = reality.allMatches
      .filter((match) => match.homeTeamCode === team.code || match.awayTeamCode === team.code)
      .slice(0, 5);

    if (matches.length > 0) {
      facts.push(`${locale === "en" ? "Schedule for" : "Calendario de"} ${team.name}:\n${matches.map((match) => formatMatch(match, locale)).join("\n")}`);
    } else {
      limitations.push(locale === "en" ? `No loaded matches for ${team.name}.` : `No hay partidos cargados para ${team.name}.`);
    }
  }

  if (intent === "group_standings") {
    const standings = inputs?.groupStandings ?? await getRealGroupStandings();
    const localizedStandings = localizeWorldCupGroupStandings(standings, locale);
    const groupLetter = getGroupLetter(question) ?? (
      team
        ? reality.allMatches.find((match) => match.homeTeamCode === team.code || match.awayTeamCode === team.code)?.groupCode.at(-1) ?? null
        : null
    );
    const group = groupLetter
      ? localizedStandings.find((standing) => standing.groupName.endsWith(groupLetter))
      : localizedStandings[0];

    facts.push(formatGroup(group, locale));
  }

  if (intent === "ranking") {
    const ranking = inputs?.ranking ?? await getRanking();
    const top = ranking.slice(0, 5);

    if (top.length > 0) {
      facts.push(`${locale === "en" ? "Current prediction ranking" : "Ranking actual de pronósticos"}:\n${top.map((participant) => `#${participant.position} ${participant.name}${participant.groupCode ? ` · ${participant.groupCode}` : ""} · ${participant.points} pts`).join("\n")}`);
    } else {
      limitations.push(locale === "en" ? "No scored ranking rows are available yet." : "Todavía no hay filas puntuadas en el ranking.");
    }
  }

  if (intent === "source_status") {
    facts.push(
      locale === "en"
        ? "Confirmed scores use FutbolWeb match_results. Fixtures and kickoff times use the loaded FIFA schedule. Prediction ranking uses ranking_summary recalculated globally by FutbolWeb. ESPN live context is used only as best-effort when it responds."
        : "Los marcadores confirmados usan match_results de FutbolWeb. Los partidos y horarios usan el calendario FIFA cargado. El ranking de pronósticos usa ranking_summary recalculado globalmente por FutbolWeb. ESPN en vivo se usa solo como best-effort cuando responde.",
    );
    limitations.push(
      locale === "en"
        ? "FutbolWeb does not yet have official play-by-play incidents, lineups, injuries, or guaranteed minute-by-minute live data."
        : "FutbolWeb todavía no tiene incidencias oficiales jugada a jugada, alineaciones, lesiones ni dato minuto a minuto garantizado.",
    );
  }

  if (intent === "var_rules") {
    facts.push(
      locale === "en"
        ? "General referee context: red cards can come from serious foul play, violent conduct, denying an obvious goal-scoring opportunity, a second yellow, or offensive/abusive language."
        : "Contexto arbitral general: una roja puede venir por juego brusco grave, conducta violenta, impedir ocasión manifiesta de gol, segunda amarilla o lenguaje ofensivo/abusivo.",
    );
    limitations.push(
      locale === "en"
        ? "This is a rules explanation, not a confirmed incident report."
        : "Esto es explicación reglamentaria, no reporte confirmado de una incidencia.",
    );
  }

  if (intent === "rules") {
    facts.push(
      locale === "en"
        ? "FutbolWeb predictions close before kickoff, accepted predictions can be scored after confirmed results, and rankings derive from prediction_scores."
        : "Los pronósticos de FutbolWeb cierran antes del pitazo, los pronósticos aceptados se puntúan con resultados confirmados y el ranking deriva de prediction_scores.",
    );
  }

  if (intent === "world_cup_history") {
    facts.push(
      locale === "en"
        ? "FutbolWeb has curated history hooks for champions, hosts, finals, and selected World Cup memories."
        : "FutbolWeb tiene referencias históricas curadas sobre campeones, sedes, finales y memorias mundialistas seleccionadas.",
    );
  }

  if (intent === "unknown") {
    if (reality.latestFinishedMatch) {
      facts.push(`${locale === "en" ? "Latest confirmed result" : "Último resultado confirmado"}: ${formatMatch(reality.latestFinishedMatch, locale)}.`);
    }

    if (reality.nextMatch) {
      facts.push(`${locale === "en" ? "Next known match" : "Próximo partido conocido"}: ${formatMatch(reality.nextMatch, locale)}.`);
    }

    limitations.push(
      locale === "en"
        ? "The question did not map cleanly to FutbolWeb fixtures, results, rankings, rules, or curated history."
        : "La pregunta no encajó claramente con partidos, resultados, rankings, reglas o historia curada de FutbolWeb.",
    );
  }

  return {
    detectedIntent: intent,
    facts,
    limitations,
    safeContextText: buildSafeContextText(intent, facts, limitations),
  };
}
