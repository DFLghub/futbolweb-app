import type { FootballMatch } from "./football-utils";

const now = Date.now();
const minutesFromNow = (minutes: number) => new Date(now + minutes * 60 * 1000).toISOString();

export const mockMatches: FootballMatch[] = [
  {
    id: "colombia-japon-demo",
    homeTeam: { name: "Colombia", flagEmoji: "🇨🇴" },
    awayTeam: { name: "Japón", flagEmoji: "🇯🇵" },
    kickoffUtc: minutesFromNow(-180),
    venueName: "Lumen Field",
    venueTimezone: "America/Los_Angeles",
    stage: "Fase de grupos",
    groupCode: "Grupo A",
    status: "final",
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: "argentina-brasil-cierra-pronto-demo",
    homeTeam: { name: "Argentina", flagEmoji: "🇦🇷" },
    awayTeam: { name: "Brasil", flagEmoji: "🇧🇷" },
    kickoffUtc: minutesFromNow(75),
    venueName: "AT&T Stadium",
    venueTimezone: "America/Chicago",
    stage: "Fase de grupos",
    groupCode: "Grupo B",
    status: "scheduled",
  },
  {
    id: "mexico-canada-varias-horas-demo",
    homeTeam: { name: "México", flagEmoji: "🇲🇽" },
    awayTeam: { name: "Canadá", flagEmoji: "🇨🇦" },
    kickoffUtc: minutesFromNow(360),
    venueName: "Estadio Mundialista Miami",
    venueTimezone: "America/New_York",
    stage: "Fase de grupos",
    groupCode: "Grupo C",
    status: "scheduled",
  },
  {
    id: "estados-unidos-paraguay-varios-dias-demo",
    homeTeam: { name: "Estados Unidos", flagEmoji: "🇺🇸" },
    awayTeam: { name: "Paraguay", flagEmoji: "🇵🇾" },
    kickoffUtc: minutesFromNow(60 * 54),
    venueName: "MetLife Stadium",
    venueTimezone: "America/New_York",
    stage: "Fase de grupos",
    groupCode: "Grupo D",
    status: "scheduled",
  },
];
