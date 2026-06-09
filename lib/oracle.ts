import type { Locale } from "@/lib/i18n";
import { localizeWorldCupGroupStandings, localizeWorldCupMatches, worldCup2026Matches } from "@/lib/world-cup-2026-matches";
import { mockWorldCupGroupStandings } from "@/lib/mock-group-standings";

type OracleLabels = {
  allTied: string;
  classificationUnavailable: string;
  contact: string;
  fallback: string;
  groupInitial: string;
  groupNotFound: string;
  groupStagePath: string;
  noMatchesToday: string;
  noQuestion: string;
  noTeamFound: string;
  nextMatches: string;
  playsInGroup: string;
  todayMatches: string;
  venues: string;
  vs: string;
};

const labelsByLocale: Record<Locale, OracleLabels> = {
  es: {
    allTied: "El Mundial todavía no empezó para ese grupo: todos están con 0 puntos.",
    classificationUnavailable: "Todavía no hay resultados suficientes para calcular escenarios reales de clasificación.",
    contact: "Si ves un dato raro, escribe a jorge@deepfeelingslabs.com.",
    fallback: "Puedo ayudarte con partidos, grupos, sedes, rivales, próximos juegos y estados iniciales de la tabla. Prueba con: ¿Cuándo juega Colombia?",
    groupInitial: "Tabla inicial",
    groupNotFound: "No encontré ese grupo en el Mundial 2026.",
    groupStagePath: "En la fase de grupos clasifican los dos primeros de cada grupo y los mejores terceros disponibles según el formato del Mundial 2026.",
    noMatchesToday: "Hoy no hay partidos programados en el calendario cargado. Te dejo los próximos partidos:",
    noQuestion: "Escríbeme una pregunta mundialista y la respondo con los datos de FutbolWeb.",
    noTeamFound: "No encontré esa selección en el calendario cargado. Prueba con el nombre completo.",
    nextMatches: "Próximos partidos",
    playsInGroup: "está en",
    todayMatches: "Partidos de hoy",
    venues: "Sedes",
    vs: "vs",
  },
  en: {
    allTied: "The World Cup has not started for that group yet: everyone is on 0 points.",
    classificationUnavailable: "There are not enough results yet to calculate real qualification scenarios.",
    contact: "If something looks off, contact jorge@deepfeelingslabs.com.",
    fallback: "I can help with matches, groups, venues, opponents, upcoming games, and initial standings. Try: When does Colombia play?",
    groupInitial: "Initial table",
    groupNotFound: "I could not find that group in the 2026 World Cup.",
    groupStagePath: "In the group stage, the top two teams from each group qualify, plus the available best third-place teams under the 2026 World Cup format.",
    noMatchesToday: "There are no matches scheduled today in the loaded calendar. Here are the next matches:",
    noQuestion: "Ask me a World Cup question and I will answer with FutbolWeb data.",
    noTeamFound: "I could not find that team in the loaded schedule. Try the full team name.",
    nextMatches: "Upcoming matches",
    playsInGroup: "is in",
    todayMatches: "Today's matches",
    venues: "Venues",
    vs: "vs",
  },
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

function dateKeyInEasternTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).format(date);
}

function formatMatchLine(match: ReturnType<typeof localizeWorldCupMatches>[number], labels: OracleLabels) {
  return `${match.homeTeam.flagEmoji} ${match.homeTeam.name} ${labels.vs} ${match.awayTeam.flagEmoji} ${match.awayTeam.name} · ${match.kickoffLabel} · ${match.venueName}`;
}

function getGroupLetter(value: string) {
  const normalized = normalizeText(value);
  const match = normalized.match(/\b(?:grupo|group)\s+([a-l])\b/);
  return match?.[1]?.toUpperCase();
}

function getTeamAliases(locale: Locale) {
  const localizedMatches = localizeWorldCupMatches(worldCup2026Matches, locale);
  const alternateMatches = localizeWorldCupMatches(worldCup2026Matches, locale === "es" ? "en" : "es");
  const aliases = new Map<string, { code: string; name: string }>();

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

  return aliases.find(([alias]) => normalizedQuestion.includes(` ${alias} `))?.[1];
}

function getTeamMatches(teamCode: string, locale: Locale) {
  return localizeWorldCupMatches(worldCup2026Matches, locale)
    .filter((match) => match.homeTeamCode === teamCode || match.awayTeamCode === teamCode)
    .sort((left, right) => new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime());
}

function getGroupStandingByLetter(groupLetter: string, locale: Locale) {
  return localizeWorldCupGroupStandings(mockWorldCupGroupStandings, locale).find((group) => {
    return group.groupName.endsWith(groupLetter);
  });
}

function answerGroup(question: string, locale: Locale, labels: OracleLabels) {
  const groupLetter = getGroupLetter(question);
  if (!groupLetter) return null;

  const group = getGroupStandingByLetter(groupLetter, locale);
  if (!group) return labels.groupNotFound;

  const table = group.teams.map((team) => `${team.rank}. ${team.teamName} · ${team.points} pts`).join("\n");
  return `${labels.allTied}\n\n${labels.groupInitial} ${group.groupName}:\n${table}`;
}

function answerTeamQuestion(question: string, locale: Locale, labels: OracleLabels) {
  const team = findTeam(question, locale);
  if (!team) return null;

  const matches = getTeamMatches(team.code, locale);
  if (matches.length === 0) return labels.noTeamFound;

  const group = matches.find((match) => /(?:Grupo|Group) [A-L]/.test(match.groupCode))?.groupCode;
  const normalizedQuestion = normalizeText(question);

  if (normalizedQuestion.includes("grupo") || normalizedQuestion.includes("group")) {
    const groupStanding = group ? getGroupStandingByLetter(group.at(-1) ?? "", locale) : null;
    const teams = groupStanding?.teams.map((standingTeam) => standingTeam.teamName).join(", ");
    return `${team.name} ${labels.playsInGroup} ${group}.${teams ? `\n${labels.groupInitial}: ${teams}.` : ""}`;
  }

  if (
    normalizedQuestion.includes("clasificar") ||
    normalizedQuestion.includes("qualify") ||
    normalizedQuestion.includes("needs") ||
    normalizedQuestion.includes("necesita")
  ) {
    return `${team.name}: ${labels.classificationUnavailable}\n${group ? `${team.name} ${labels.playsInGroup} ${group}. ` : ""}${labels.groupStagePath}`;
  }

  if (
    normalizedQuestion.includes("donde") ||
    normalizedQuestion.includes("sede") ||
    normalizedQuestion.includes("venue") ||
    normalizedQuestion.includes("where")
  ) {
    return `${labels.venues} de ${team.name}:\n${matches.slice(0, 5).map((match) => formatMatchLine(match, labels)).join("\n")}`;
  }

  return `${labels.nextMatches} de ${team.name}:\n${matches.slice(0, 5).map((match) => formatMatchLine(match, labels)).join("\n")}`;
}

function answerToday(locale: Locale, labels: OracleLabels) {
  const matches = localizeWorldCupMatches(worldCup2026Matches, locale).sort((left, right) => {
    return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
  });
  const todayKey = dateKeyInEasternTime(new Date());
  const todayMatches = matches.filter((match) => dateKeyInEasternTime(new Date(match.kickoffUtc)) === todayKey);

  if (todayMatches.length > 0) {
    return `${labels.todayMatches}:\n${todayMatches.map((match) => formatMatchLine(match, labels)).join("\n")}`;
  }

  return `${labels.noMatchesToday}\n${matches.slice(0, 4).map((match) => formatMatchLine(match, labels)).join("\n")}`;
}

export function answerOracleQuestion(question: string, locale: Locale) {
  const labels = labelsByLocale[locale];
  const trimmedQuestion = question.trim();
  const normalizedQuestion = normalizeText(trimmedQuestion);

  if (!trimmedQuestion) {
    return labels.noQuestion;
  }

  if (normalizedQuestion.includes("hoy") || normalizedQuestion.includes("today")) {
    return answerToday(locale, labels);
  }

  const teamAnswer = answerTeamQuestion(trimmedQuestion, locale, labels);
  if (teamAnswer) {
    return `${teamAnswer}\n\n${labels.contact}`;
  }

  const groupAnswer = answerGroup(trimmedQuestion, locale, labels);
  if (groupAnswer) {
    return `${groupAnswer}\n\n${labels.contact}`;
  }

  return `${labels.fallback}\n\n${labels.contact}`;
}
