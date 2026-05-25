export type MatchStatus = "scheduled" | "final";

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

export function formatMatchTime(kickoffUtc: string): string {
  return new Intl.DateTimeFormat("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(kickoffUtc));
}

export function getTimezoneLabel(timezone: string): string {
  if (timezone === "America/New_York") {
    return "Hora Este";
  }

  if (timezone === "America/Los_Angeles") {
    return "Hora Pacífico";
  }

  return "hora local";
}

export function canPredict(match: FootballMatch): boolean {
  return match.status !== "final" && new Date(match.kickoffUtc).getTime() > Date.now();
}

export function getStatusLabel(match: FootballMatch): string {
  if (match.status === "final") {
    return "Finalizado";
  }

  const diffMs = new Date(match.kickoffUtc).getTime() - Date.now();

  if (diffMs <= 0) {
    return "Pronósticos cerrados";
  }

  if (diffMs < 2 * HOUR_MS) {
    return "Cierra pronto";
  }

  if (diffMs < DAY_MS) {
    const hours = Math.ceil(diffMs / HOUR_MS);
    return `Empieza en ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  const days = Math.ceil(diffMs / DAY_MS);
  return `Empieza en ${days} ${days === 1 ? "día" : "días"}`;
}

export function buildWhatsAppShareText(match: FootballMatch): string {
  const slug = match.slug ?? match.id;

  return [
    "🔥 Modo Mundial",
    `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    `Hora: ${match.kickoffLabel ?? formatMatchTime(match.kickoffUtc)}`,
    `Pronostica aquí: https://www.futbolweb.app/match/${slug}/predict`,
  ].join("\n");
}
