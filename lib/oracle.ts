import type { Locale } from "@/lib/i18n";
import { localizeWorldCupGroupStandings, localizeWorldCupMatches, worldCup2026Matches } from "@/lib/world-cup-2026-matches";
import { mockWorldCupGroupStandings } from "@/lib/mock-group-standings";

type OracleLabels = {
  allTied: string;
  classificationUnavailable: string;
  contact: string;
  fallback: string;
  forTeam: string;
  groupInitial: string;
  groupNotFound: string;
  groupStagePath: string;
  noMatchesToday: string;
  noQuestion: string;
  noTeamFound: string;
  offTopic: string;
  nextMatches: string;
  playsInGroup: string;
  todayMatches: string;
  venues: string;
  vs: string;
};

export type OracleCharacter = "paulgpt" | "vargpt" | "insultistagpt";

const defaultOracleCharacter: OracleCharacter = "paulgpt";

export function normalizeOracleCharacter(value: unknown): OracleCharacter {
  if (value === "vargpt" || value === "insultistagpt" || value === "paulgpt") {
    return value;
  }

  return defaultOracleCharacter;
}

const labelsByLocale: Record<Locale, OracleLabels> = {
  es: {
    allTied: "El Mundial todavía no empezó para ese grupo: todos están con 0 puntos.",
    classificationUnavailable: "Todavía no hay resultados suficientes para calcular escenarios reales de clasificación.",
    contact: "Mejoras, sugerencias, soporte o aportes: jorge@deepfeelingslabs.com.",
    fallback: "Puedo ayudarte con partidos, grupos, sedes, rivales, próximos juegos y estados iniciales de la tabla. Prueba con: ¿Cuándo juega Colombia?",
    forTeam: "de",
    groupInitial: "Tabla inicial",
    groupNotFound: "No encontré ese grupo en el Mundial 2026.",
    groupStagePath: "En la fase de grupos clasifican los dos primeros de cada grupo y los mejores terceros disponibles según el formato del Mundial 2026.",
    noMatchesToday: "Hoy no hay partidos programados en el calendario cargado. Te dejo los próximos partidos:",
    noQuestion: "Escríbeme una pregunta mundialista y la respondo con los datos de FutbolWeb.",
    noTeamFound: "No encontré esa selección en el calendario cargado. Prueba con el nombre completo.",
    offTopic: "PaulGPT se queda en la cancha: Mundiales FIFA masculinos, FutbolWeb 2026, partidos, grupos, sedes y memoria mundialista. Loterías, chefs y trucos raros van para otro camerino.",
    nextMatches: "Próximos partidos",
    playsInGroup: "está en",
    todayMatches: "Partidos de hoy",
    venues: "Sedes",
    vs: "vs",
  },
  en: {
    allTied: "The World Cup has not started for that group yet: everyone is on 0 points.",
    classificationUnavailable: "There are not enough results yet to calculate real qualification scenarios.",
    contact: "Improvements, suggestions, support, or contributions: jorge@deepfeelingslabs.com.",
    fallback: "I can help with matches, groups, venues, opponents, upcoming games, and initial standings. Try: When does Colombia play?",
    forTeam: "for",
    groupInitial: "Initial table",
    groupNotFound: "I could not find that group in the 2026 World Cup.",
    groupStagePath: "In the group stage, the top two teams from each group qualify, plus the available best third-place teams under the 2026 World Cup format.",
    noMatchesToday: "There are no matches scheduled today in the loaded calendar. Here are the next matches:",
    noQuestion: "Ask me a World Cup question and I will answer with FutbolWeb data.",
    noTeamFound: "I could not find that team in the loaded schedule. Try the full team name.",
    offTopic: "PaulGPT stays on the pitch: men's FIFA World Cups, FutbolWeb 2026, matches, groups, venues, and World Cup memory. Lotteries, chefs, and random tricks belong in another locker room.",
    nextMatches: "Upcoming matches",
    playsInGroup: "is in",
    todayMatches: "Today's matches",
    venues: "Venues",
    vs: "vs",
  },
};

type WorldCupFinal = {
  champion: string;
  finalScore: string;
  host: string;
  runnerUp: string;
  year: number;
};

const historicalWorldCups: WorldCupFinal[] = [
  { year: 1930, host: "Uruguay", champion: "Uruguay", runnerUp: "Argentina", finalScore: "4-2" },
  { year: 1934, host: "Italy", champion: "Italy", runnerUp: "Czechoslovakia", finalScore: "2-1 aet" },
  { year: 1938, host: "France", champion: "Italy", runnerUp: "Hungary", finalScore: "4-2" },
  { year: 1950, host: "Brazil", champion: "Uruguay", runnerUp: "Brazil", finalScore: "2-1" },
  { year: 1954, host: "Switzerland", champion: "West Germany", runnerUp: "Hungary", finalScore: "3-2" },
  { year: 1958, host: "Sweden", champion: "Brazil", runnerUp: "Sweden", finalScore: "5-2" },
  { year: 1962, host: "Chile", champion: "Brazil", runnerUp: "Czechoslovakia", finalScore: "3-1" },
  { year: 1966, host: "England", champion: "England", runnerUp: "West Germany", finalScore: "4-2 aet" },
  { year: 1970, host: "Mexico", champion: "Brazil", runnerUp: "Italy", finalScore: "4-1" },
  { year: 1974, host: "West Germany", champion: "West Germany", runnerUp: "Netherlands", finalScore: "2-1" },
  { year: 1978, host: "Argentina", champion: "Argentina", runnerUp: "Netherlands", finalScore: "3-1 aet" },
  { year: 1982, host: "Spain", champion: "Italy", runnerUp: "West Germany", finalScore: "3-1" },
  { year: 1986, host: "Mexico", champion: "Argentina", runnerUp: "West Germany", finalScore: "3-2" },
  { year: 1990, host: "Italy", champion: "West Germany", runnerUp: "Argentina", finalScore: "1-0" },
  { year: 1994, host: "United States", champion: "Brazil", runnerUp: "Italy", finalScore: "0-0; Brazil won 3-2 on penalties" },
  { year: 1998, host: "France", champion: "France", runnerUp: "Brazil", finalScore: "3-0" },
  { year: 2002, host: "South Korea/Japan", champion: "Brazil", runnerUp: "Germany", finalScore: "2-0" },
  { year: 2006, host: "Germany", champion: "Italy", runnerUp: "France", finalScore: "1-1; Italy won 5-3 on penalties" },
  { year: 2010, host: "South Africa", champion: "Spain", runnerUp: "Netherlands", finalScore: "1-0 aet" },
  { year: 2014, host: "Brazil", champion: "Germany", runnerUp: "Argentina", finalScore: "1-0 aet" },
  { year: 2018, host: "Russia", champion: "France", runnerUp: "Croatia", finalScore: "4-2" },
  { year: 2022, host: "Qatar", champion: "Argentina", runnerUp: "France", finalScore: "3-3; Argentina won 4-2 on penalties" },
];

const localizedCountryNames: Record<string, Record<Locale, string>> = {
  Argentina: { es: "Argentina", en: "Argentina" },
  Brazil: { es: "Brasil", en: "Brazil" },
  Chile: { es: "Chile", en: "Chile" },
  Croatia: { es: "Croacia", en: "Croatia" },
  Czechoslovakia: { es: "Checoslovaquia", en: "Czechoslovakia" },
  England: { es: "Inglaterra", en: "England" },
  France: { es: "Francia", en: "France" },
  Germany: { es: "Alemania", en: "Germany" },
  Hungary: { es: "Hungría", en: "Hungary" },
  Italy: { es: "Italia", en: "Italy" },
  Mexico: { es: "México", en: "Mexico" },
  Netherlands: { es: "Países Bajos", en: "Netherlands" },
  Qatar: { es: "Catar", en: "Qatar" },
  Russia: { es: "Rusia", en: "Russia" },
  "South Africa": { es: "Sudáfrica", en: "South Africa" },
  "South Korea/Japan": { es: "Corea del Sur/Japón", en: "South Korea/Japan" },
  Spain: { es: "España", en: "Spain" },
  Sweden: { es: "Suecia", en: "Sweden" },
  Switzerland: { es: "Suiza", en: "Switzerland" },
  Uruguay: { es: "Uruguay", en: "Uruguay" },
  "United States": { es: "Estados Unidos", en: "United States" },
  "West Germany": { es: "Alemania Federal", en: "West Germany" },
};

const teamTitleAliases: Record<string, string[]> = {
  Argentina: ["argentina"],
  Brazil: ["brasil", "brazil"],
  England: ["inglaterra", "england"],
  France: ["francia", "france"],
  Germany: ["alemania", "germany", "alemania federal", "west germany"],
  Italy: ["italia", "italy"],
  Spain: ["espana", "spain"],
  Uruguay: ["uruguay"],
};

const hostAliases: Record<number, string[]> = {
  1930: ["uruguay 1930"],
  1934: ["italia 1934", "italy 1934"],
  1938: ["francia 1938", "france 1938"],
  1950: ["brasil 1950", "brazil 1950"],
  1954: ["suiza 1954", "switzerland 1954"],
  1958: ["suecia 1958", "sweden 1958"],
  1962: ["chile 1962"],
  1966: ["inglaterra 1966", "england 1966"],
  1970: ["mexico 70", "mexico 1970", "méxico 70", "méxico 1970"],
  1974: ["alemania 1974", "alemania federal 1974", "west germany 1974"],
  1978: ["argentina 1978", "argentina 78"],
  1982: ["espana 1982", "espana 82", "españa 1982", "españa 82", "spain 1982"],
  1986: ["mexico 86", "mexico 1986", "méxico 86", "méxico 1986"],
  1990: ["italia 1990", "italia 90", "italy 1990"],
  1994: ["estados unidos 1994", "usa 1994", "united states 1994"],
  1998: ["francia 1998", "france 1998"],
  2002: ["corea japon 2002", "corea del sur japon 2002", "south korea japan 2002"],
  2006: ["alemania 2006", "germany 2006"],
  2010: ["sudafrica 2010", "south africa 2010"],
  2014: ["brasil 2014", "brazil 2014"],
  2018: ["rusia 2018", "russia 2018"],
  2022: ["catar 2022", "qatar 2022"],
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

function localizeName(name: string, locale: Locale) {
  return localizedCountryNames[name]?.[locale] ?? name;
}

function localizeFinalScore(score: string, locale: Locale) {
  if (locale === "en") {
    return score;
  }

  return score
    .replace("aet", "tras tiempo extra")
    .replace("Brazil won", "Brasil ganó")
    .replace("Argentina won", "Argentina ganó")
    .replace("Italy won", "Italia ganó")
    .replace("on penalties", "por penales");
}

function formatFinalResultLine(worldCup: WorldCupFinal, locale: Locale) {
  const champion = localizeName(worldCup.champion, locale);
  const runnerUp = localizeName(worldCup.runnerUp, locale);
  const score = localizeFinalScore(worldCup.finalScore, locale);

  if (score.includes(";")) {
    return `${champion} vs ${runnerUp}: ${score}`;
  }

  return `${champion} ${score} vs ${runnerUp}`;
}

function getHistoricalNote(worldCup: WorldCupFinal, locale: Locale) {
  if (worldCup.year !== 1950) {
    return "";
  }

  if (locale === "en") {
    return " There was no single final: Uruguay beat Brazil in the decisive final-group match, the Maracanazo.";
  }

  return " No hubo final única: Uruguay venció a Brasil en el partido decisivo del grupo final, el Maracanazo.";
}

function isWorldCupHistoryQuestion(normalizedQuestion: string) {
  return (
    normalizedQuestion.includes("mundial") ||
    normalizedQuestion.includes("world cup") ||
    normalizedQuestion.includes("copa del mundo") ||
    normalizedQuestion.includes("maracanazo") ||
    /\b(?:mexico|brasil|italia|francia|argentina|rusia|catar|qatar)\s*(?:70|78|82|86|90|98|20\d{2}|19\d{2})\b/.test(normalizedQuestion)
  );
}

function mentionsWinnerQuestion(normalizedQuestion: string) {
  return (
    normalizedQuestion.includes("quien gano") ||
    normalizedQuestion.includes("campeon") ||
    normalizedQuestion.includes("ganador") ||
    normalizedQuestion.includes("who won") ||
    normalizedQuestion.includes("champion") ||
    normalizedQuestion.includes("winner")
  );
}

function mentionsFinalQuestion(normalizedQuestion: string) {
  return (
    normalizedQuestion.includes("final") ||
    normalizedQuestion.includes("ultima") ||
    normalizedQuestion.includes("ultimo") ||
    normalizedQuestion.includes("last") ||
    normalizedQuestion.includes("last match") ||
    normalizedQuestion.includes("previous final") ||
    normalizedQuestion.includes("previous world cup")
  );
}

function findHistoricalWorldCup(normalizedQuestion: string) {
  const yearMatch = normalizedQuestion.match(/\b(19[3-9]\d|20[0-2]\d)\b/);
  const year = yearMatch ? Number(yearMatch[1]) : undefined;
  const shortYearMatch = normalizedQuestion.match(/\b(70|78|82|86|90|94|98)\b/);
  const shortYear = shortYearMatch ? 1900 + Number(shortYearMatch[1]) : undefined;
  const matchedYear = year ?? shortYear;

  if (matchedYear) {
    const byYear = historicalWorldCups.find((worldCup) => worldCup.year === matchedYear);
    if (byYear) return byYear;
  }

  return historicalWorldCups.find((worldCup) => {
    return hostAliases[worldCup.year]?.some((alias) => normalizedQuestion.includes(normalizeText(alias)));
  });
}

function answerHistoricalWinner(worldCup: WorldCupFinal, locale: Locale) {
  const champion = localizeName(worldCup.champion, locale);
  const host = localizeName(worldCup.host, locale);
  const resultLine = formatFinalResultLine(worldCup, locale);
  const note = getHistoricalNote(worldCup, locale);

  if (locale === "en") {
    return `PaulGPT memory check: ${champion} won the ${worldCup.year} men's FIFA World Cup in ${host}. Final/decider: ${resultLine}.${note}`;
  }

  return `Memoria de PaulGPT: el Mundial masculino FIFA ${worldCup.year}, jugado en ${host}, lo ganó ${champion}. Final/partido decisivo: ${resultLine}.${note}`;
}

function answerMaracanazo(locale: Locale) {
  if (locale === "en") {
    return "The Maracanazo was Uruguay's 2-1 win over Brazil at the Maracana on July 16, 1950. It was the decisive match of the final group, not a normal final. Brazil only needed a draw; Uruguay flipped the script and took the World Cup. Pure football earthquake.";
  }

  return "El Maracanazo fue el 2-1 de Uruguay sobre Brasil en el Maracaná, el 16 de julio de 1950. No fue una final normal: era el partido decisivo del grupo final. Brasil necesitaba apenas empatar; Uruguay le dio vuelta la historia y se llevó el Mundial. Terremoto futbolero, de los grandes.";
}

function findTeamForTitleCount(normalizedQuestion: string) {
  return Object.entries(teamTitleAliases).find(([, aliases]) => {
    return aliases.some((alias) => normalizedQuestion.includes(` ${normalizeText(alias)} `));
  })?.[0];
}

function answerTitleCount(teamName: string, locale: Locale) {
  const titles = historicalWorldCups.filter((worldCup) => {
    if (teamName === "Germany") {
      return worldCup.champion === "Germany" || worldCup.champion === "West Germany";
    }

    return worldCup.champion === teamName;
  });
  const localizedTeamName = localizeName(teamName, locale);
  const titleYears = titles.map((worldCup) => worldCup.year).join(", ");

  if (locale === "en") {
    return `${localizedTeamName} has won ${titles.length} men's FIFA World Cups: ${titleYears}. No betting slip needed, that is heavyweight history.`;
  }

  return `${localizedTeamName} ganó ${titles.length} Mundiales masculinos FIFA: ${titleYears}. Sin humo: historia pesada.`;
}

function answerLastFinalBefore2026(locale: Locale) {
  const worldCup = historicalWorldCups.at(-1);
  if (!worldCup) return null;

  const champion = localizeName(worldCup.champion, locale);
  const runnerUp = localizeName(worldCup.runnerUp, locale);

  if (locale === "en") {
    return `The last World Cup final before 2026 was Qatar 2022: ${champion} vs ${runnerUp}, 3-3 after extra time, and ${champion} won 4-2 on penalties. Messi lifted it; France made them suffer.`;
  }

  return `La última final mundialista antes de 2026 fue Catar 2022: ${champion} vs ${runnerUp}, 3-3 tras tiempo extra, y ${champion} ganó 4-2 por penales. Messi levantó la copa; Francia los hizo sudar hasta el último suspiro.`;
}

function answerRulesQuestion(question: string, locale: Locale) {
  const normalizedQuestion = ` ${normalizeText(question)} `;

  if (
    normalizedQuestion.includes(" perro ") ||
    normalizedQuestion.includes(" dog ") ||
    normalizedQuestion.includes(" animal ")
  ) {
    if (locale === "en") {
      return "If a dog or any outside agent enters the pitch, the referee stops play only if it interferes. The field is cleared, then play normally restarts with a dropped ball from the position required by the Laws of the Game.";
    }

    return "Si entra un perro o cualquier agente externo a la cancha, el árbitro detiene el juego solo si interfiere. Se despeja el campo y normalmente se reanuda con balón a tierra según el lugar que indiquen las Reglas de Juego.";
  }

  if (
    normalizedQuestion.includes(" rayo ") ||
    normalizedQuestion.includes(" tormenta ") ||
    normalizedQuestion.includes(" lightning ") ||
    normalizedQuestion.includes(" storm ")
  ) {
    if (locale === "en") {
      return "If lightning or a dangerous storm hits, player safety wins. The referee can suspend the match, send teams to a safe area, and resume only when conditions are safe. If it cannot continue, competition rules decide the next step.";
    }

    return "Si cae un rayo o hay tormenta peligrosa, manda la seguridad. El árbitro puede suspender el partido, mandar a los equipos a zona segura y reanudar solo cuando haya condiciones. Si no se puede seguir, decide el reglamento de la competición.";
  }

  if (
    normalizedQuestion.includes(" fuera de juego ") ||
    normalizedQuestion.includes(" offside ")
  ) {
    if (locale === "en") {
      return "Offside is judged when the teammate plays or touches the ball. Being in an offside position is not enough: the player must interfere with play, an opponent, or gain an advantage.";
    }

    return "El fuera de juego se juzga cuando un compañero juega o toca el balón. Estar adelantado no basta: debe intervenir en el juego, interferir a un rival o ganar ventaja.";
  }

  if (
    normalizedQuestion.includes(" tarjeta ") ||
    normalizedQuestion.includes(" roja ") ||
    normalizedQuestion.includes(" amarilla ") ||
    normalizedQuestion.includes(" card ") ||
    normalizedQuestion.includes(" red card ") ||
    normalizedQuestion.includes(" yellow card ")
  ) {
    if (locale === "en") {
      return "Cards depend on the offense: careless fouls are usually just fouls, reckless actions are yellow, and excessive force or denying an obvious goal-scoring opportunity can be red. Context matters.";
    }

    return "Las tarjetas dependen de la infracción: una falta imprudente puede quedar en falta, una acción temeraria suele ser amarilla y la fuerza excesiva o impedir una ocasión manifiesta puede ser roja. El contexto manda.";
  }

  return null;
}

function answerWorldCupHistory(question: string, locale: Locale) {
  const normalizedQuestion = ` ${normalizeText(question)} `;

  if (!isWorldCupHistoryQuestion(normalizedQuestion)) {
    return null;
  }

  if (normalizedQuestion.includes("maracanazo")) {
    return answerMaracanazo(locale);
  }

  if (
    (normalizedQuestion.includes("cuantos") ||
      normalizedQuestion.includes("cuantas") ||
      normalizedQuestion.includes("how many")) &&
    (normalizedQuestion.includes("mundiales") ||
      normalizedQuestion.includes("world cups") ||
      normalizedQuestion.includes("titulos") ||
      normalizedQuestion.includes("titles"))
  ) {
    const teamName = findTeamForTitleCount(normalizedQuestion);
    if (teamName) {
      return answerTitleCount(teamName, locale);
    }
  }

  if (
    mentionsFinalQuestion(normalizedQuestion) &&
    (normalizedQuestion.includes("antes de 2026") ||
      normalizedQuestion.includes("before 2026") ||
      normalizedQuestion.includes("anterior") ||
      normalizedQuestion.includes("previo") ||
      normalizedQuestion.includes("previous") ||
      normalizedQuestion.includes("ultima final") ||
      normalizedQuestion.includes("ultimo partido") ||
      normalizedQuestion.includes("last final"))
  ) {
    return answerLastFinalBefore2026(locale);
  }

  const worldCup = findHistoricalWorldCup(normalizedQuestion);

  if (worldCup && (mentionsWinnerQuestion(normalizedQuestion) || isWorldCupHistoryQuestion(normalizedQuestion))) {
    return answerHistoricalWinner(worldCup, locale);
  }

  return null;
}

function applyOraclePersonality(answer: string, character: OracleCharacter, locale: Locale) {
  if (character === "paulgpt") {
    return answer;
  }

  if (character === "vargpt") {
    const refereeAnswer = answer
      .replace("Memoria de PaulGPT:", "Consta en acta:")
      .replace("PaulGPT memory check:", "VARGPT ruling:");

    if (locale === "en") {
      return `VARGPT decision: ${refereeAnswer}\n\nClear ruling, no extra drama.`;
    }

    return `Decisión VARGPT: ${refereeAnswer}\n\nClaro, reglamentario y sin vender humo.`;
  }

  const roastAnswer = answer
    .replace("Memoria de PaulGPT:", "Archivo del Insultista:")
    .replace("PaulGPT memory check:", "InsultistaGPT memory check:");

  if (locale === "en") {
    return `InsultistaGPT from the stand: ${roastAnswer}\n\nHealthy roast: solid football, zero cheap shots.`;
  }

  return `InsultistaGPT desde la tribuna: ${roastAnswer}\n\nVacile sano: con fútbol, sin mala leche y sin pegarle a nadie por fuera de la cancha.`;
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
    normalizedQuestion.includes("campeon") ||
    normalizedQuestion.includes("champion") ||
    normalizedQuestion.includes("win it all")
  ) {
    const nextMatch = matches[0] ? formatMatchLine(matches[0], labels) : null;
    return `${team.name}: no puedo coronar a nadie antes de jugar. ${group ? `${team.name} ${labels.playsInGroup} ${group}. ` : ""}${nextMatch ? `${labels.nextMatches}: ${nextMatch}` : labels.classificationUnavailable}`;
  }

  if (
    normalizedQuestion.includes("donde") ||
    normalizedQuestion.includes("sede") ||
    normalizedQuestion.includes("venue") ||
    normalizedQuestion.includes("where")
  ) {
    return `${labels.venues} ${labels.forTeam} ${team.name}:\n${matches.slice(0, 5).map((match) => formatMatchLine(match, labels)).join("\n")}`;
  }

  return `${labels.nextMatches} ${labels.forTeam} ${team.name}:\n${matches.slice(0, 5).map((match) => formatMatchLine(match, labels)).join("\n")}`;
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

export function answerOracleQuestion(question: string, locale: Locale, character: OracleCharacter = defaultOracleCharacter) {
  const labels = labelsByLocale[locale];
  const trimmedQuestion = question.trim();
  const normalizedQuestion = normalizeText(trimmedQuestion);

  if (!trimmedQuestion) {
    return applyOraclePersonality(labels.noQuestion, character, locale);
  }

  if (normalizedQuestion.includes("hoy") || normalizedQuestion.includes("today")) {
    return applyOraclePersonality(answerToday(locale, labels), character, locale);
  }

  const historyAnswer = answerWorldCupHistory(trimmedQuestion, locale);
  if (historyAnswer) {
    return `${applyOraclePersonality(historyAnswer, character, locale)}\n\n${labels.contact}`;
  }

  const teamAnswer = answerTeamQuestion(trimmedQuestion, locale, labels);
  if (teamAnswer) {
    return `${applyOraclePersonality(teamAnswer, character, locale)}\n\n${labels.contact}`;
  }

  const groupAnswer = answerGroup(trimmedQuestion, locale, labels);
  if (groupAnswer) {
    return `${applyOraclePersonality(groupAnswer, character, locale)}\n\n${labels.contact}`;
  }

  const rulesAnswer = answerRulesQuestion(trimmedQuestion, locale);
  if (rulesAnswer) {
    return `${applyOraclePersonality(rulesAnswer, character, locale)}\n\n${labels.contact}`;
  }

  if (
    normalizedQuestion.includes("loteria") ||
    normalizedQuestion.includes("lottery") ||
    normalizedQuestion.includes("chef") ||
    normalizedQuestion.includes("actua como") ||
    normalizedQuestion.includes("act as") ||
    normalizedQuestion.includes("apuesta") ||
    normalizedQuestion.includes("bet")
  ) {
    return `${applyOraclePersonality(labels.offTopic, character, locale)}\n\n${labels.contact}`;
  }

  return `${applyOraclePersonality(labels.fallback, character, locale)}\n\n${labels.contact}`;
}
