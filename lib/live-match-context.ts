const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const LIVE_FALLBACK =
  "⚠️ No tengo marcador en vivo confiable disponible ahora mismo.\nPuedo responder con datos confirmados de FutbolWeb. Para el minuto a minuto te recomiendo ESPN o la app oficial de FIFA.";

type EspnScoreboard = {
  events?: EspnEvent[];
};

type EspnEvent = {
  competitions?: EspnCompetition[];
  displayClock?: string;
  shortDetail?: string;
  status?: EspnStatus;
};

type EspnCompetition = {
  competitors?: EspnCompetitor[];
  status?: EspnStatus;
};

type EspnCompetitor = {
  homeAway?: string;
  score?: string;
  team?: {
    abbreviation?: string;
    displayName?: string;
    name?: string;
    shortDisplayName?: string;
  };
};

type EspnStatus = {
  displayClock?: string;
  type?: {
    description?: string;
    state?: string;
  };
};

type ParsedEvent = {
  away: EspnCompetitor;
  home: EspnCompetitor;
  label: string;
  searchableText: string;
  state: string;
};

const liveIntentPatterns = [
  /\ben vivo\b/,
  /\blive\b/,
  /\bmarcador\b/,
  /\bscore\b/,
  /\bresultado\b/,
  /\bresult\b/,
  /\bahora\b/,
  /\bnow\b/,
  /\bminuto\b/,
  /\bminute\b/,
  /\bcomo va\b/,
  /\bcuanto va\b/,
  /\bhow is .* going\b/,
  /\bwhat'?s the score\b/,
  /\bhalftime\b/,
  /\bmedio tiempo\b/,
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function teamName(competitor: EspnCompetitor) {
  return competitor.team?.displayName ??
    competitor.team?.shortDisplayName ??
    competitor.team?.name ??
    competitor.team?.abbreviation ??
    "Equipo por confirmar";
}

function teamSearchText(competitor: EspnCompetitor) {
  return [
    competitor.team?.displayName,
    competitor.team?.shortDisplayName,
    competitor.team?.name,
    competitor.team?.abbreviation,
  ].filter(Boolean).join(" ");
}

function stateLabel(state: string) {
  if (state === "in") return "EN VIVO";
  if (state === "post") return "FINALIZADO";
  if (state === "pre") return "PROGRAMADO";
  return "ESTADO ESPN";
}

function eventClock(event: EspnEvent, competition: EspnCompetition) {
  return event.displayClock ||
    event.status?.displayClock ||
    competition.status?.displayClock ||
    event.status?.type?.description ||
    competition.status?.type?.description ||
    event.shortDetail ||
    "Sin reloj disponible";
}

function parseEvent(event: EspnEvent): ParsedEvent | null {
  const competition = event.competitions?.[0];

  if (!competition) {
    return null;
  }

  const competitors = competition?.competitors ?? [];
  const home = competitors.find((competitor) => competitor.homeAway === "home");
  const away = competitors.find((competitor) => competitor.homeAway === "away");

  if (!home || !away) {
    return null;
  }

  const state = event.status?.type?.state ?? competition?.status?.type?.state ?? "";
  const homeScore = home.score ?? "-";
  const awayScore = away.score ?? "-";

  return {
    away,
    home,
    label: [
      `${teamName(home)} ${homeScore} - ${awayScore} ${teamName(away)}`,
      `${stateLabel(state)} · ${eventClock(event, competition)}`,
    ].join("\n"),
    searchableText: normalizeText(`${teamSearchText(home)} ${teamSearchText(away)}`),
    state,
  };
}

function eventMatchesQuestion(event: ParsedEvent, normalizedQuestion: string) {
  const questionWords = normalizedQuestion.split(" ").filter((word) => word.length >= 3);

  return questionWords.some((word) => event.searchableText.includes(word));
}

function selectEvents(events: ParsedEvent[], question: string) {
  const normalizedQuestion = normalizeText(question);
  const matchingEvents = events.filter((event) => eventMatchesQuestion(event, normalizedQuestion));

  if (matchingEvents.length > 0) {
    return matchingEvents.slice(0, 2);
  }

  const liveEvents = events.filter((event) => event.state === "in");

  if (liveEvents.length > 0) {
    return liveEvents.slice(0, 3);
  }

  return events.slice(0, 3);
}

export function needsLiveContext(question: string): boolean {
  const normalizedQuestion = normalizeText(question);

  return liveIntentPatterns.some((pattern) => pattern.test(normalizedQuestion));
}

export async function getLiveMatchContext(question: string): Promise<string | null> {
  try {
    const response = await fetch(ESPN_SCOREBOARD_URL, {
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return LIVE_FALLBACK;
    }

    const scoreboard = await response.json() as EspnScoreboard;
    const events = (scoreboard.events ?? [])
      .map(parseEvent)
      .filter((event): event is ParsedEvent => event !== null);
    const selectedEvents = selectEvents(events, question);

    if (selectedEvents.length === 0) {
      return LIVE_FALLBACK;
    }

    return [
      "📡 Según ESPN:",
      selectedEvents.map((event) => event.label).join("\n\n"),
      "Fuente: ESPN scoreboard (best-effort, no oficial)",
    ].join("\n");
  } catch {
    return LIVE_FALLBACK;
  }
}
