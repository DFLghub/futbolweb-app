export type MatchStatus = "scheduled" | "live" | "final";

export type FootballTeam = {
  name: string;
  flagEmoji: string;
};

export type FootballMatch = {
  id: string;
  slug?: string;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  kickoffUtc: string;
  kickoffLabel?: string;
  kickoffET?: string;
  venueName: string;
  venueTimezone: string;
  stage: string;
  groupCode: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  sourceLabel?: string;
  sourceCheckedAt?: string;
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function formatMatchTime(kickoffUtc: string, locale = "es"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(kickoffUtc));
}

export function getTimezoneLabel(
  timezone: string,
  labels = {
    eastern: "Hora Este",
    local: "hora local",
    pacific: "Hora Pacífico",
  },
): string {
  if (timezone === "America/New_York") {
    return labels.eastern;
  }

  if (timezone === "America/Los_Angeles") {
    return labels.pacific;
  }

  return labels.local;
}

export function canPredict(match: FootballMatch): boolean {
  return match.status !== "final" && new Date(match.kickoffUtc).getTime() > Date.now();
}

export function getStatusLabel(
  match: FootballMatch,
  labels = {
    closed: "Pronósticos cerrados",
    closingSoon: "Cierra pronto",
    final: "Finalizado",
    live: "En Vivo",
    startsInDay: "Empieza en 1 día",
    startsInDays: "Empieza en {count} días",
    startsInHour: "Empieza en 1 hora",
    startsInHours: "Empieza en {count} horas",
  },
): string {
  if (match.status === "final") {
    return labels.final;
  }

  if (match.status === "live") {
    return labels.live;
  }

  const diffMs = new Date(match.kickoffUtc).getTime() - Date.now();

  if (diffMs <= 0) {
    return labels.closed;
  }

  if (diffMs < 2 * HOUR_MS) {
    return labels.closingSoon;
  }

  if (diffMs < DAY_MS) {
    const hours = Math.ceil(diffMs / HOUR_MS);
    return hours === 1 ? labels.startsInHour : labels.startsInHours.replace("{count}", String(hours));
  }

  const days = Math.ceil(diffMs / DAY_MS);
  return days === 1 ? labels.startsInDay : labels.startsInDays.replace("{count}", String(days));
}

export function buildWhatsAppShareText(
  match: FootballMatch,
  labels = {
    link: "Pronostica aquí: {url}",
    time: "Hora: {time}",
    title: "🔥 Modo Mundial",
  },
  locale = "es",
): string {
  const slug = match.slug ?? match.id;
  const predictionUrl = `https://www.futbolweb.app/match/${slug}/predict`;
  const matchTime = match.kickoffLabel ?? formatMatchTime(match.kickoffUtc, locale);

  return [
    labels.title,
    `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    labels.time.replace("{time}", matchTime),
    labels.link.replace("{url}", predictionUrl),
  ].join("\n");
}
