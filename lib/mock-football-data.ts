import type { FootballMatch } from "./football-utils";

const now = Date.now();
const minutesFromNow = (minutes: number) => new Date(now + minutes * 60 * 1000).toISOString();

export const mockMatches: FootballMatch[] = [
  {
    id: "colombia-japon-demo",
    homeTeam: { name: "Colombia", flagEmoji: "🇨🇴" },
    awayTeam: { name: "Japón", flagEmoji: "🇯🇵" },
    kickoffUtc: minutesFromNow(360),
    venueName: "Estadio Mundialista Miami",
    venueTimezone: "America/New_York",
    stage: "Fase de grupos",
    groupCode: "Grupo C",
    status: "scheduled",
  },
  {
    id: "brasil-argentina-demo",
    homeTeam: { name: "Brasil", flagEmoji: "🇧🇷" },
    awayTeam: { name: "Argentina", flagEmoji: "🇦🇷" },
    kickoffUtc: minutesFromNow(60 * 54),
    venueName: "MetLife Stadium",
    venueTimezone: "America/New_York",
    stage: "Fase de grupos",
    groupCode: "Grupo A",
    status: "scheduled",
  },
  {
    id: "colombia-brasil-demo",
    homeTeam: { name: "Colombia", flagEmoji: "🇨🇴" },
    awayTeam: { name: "Brasil", flagEmoji: "🇧🇷" },
    kickoffUtc: minutesFromNow(75),
    venueName: "AT&T Stadium",
    venueTimezone: "America/Chicago",
    stage: "Fase de grupos",
    groupCode: "Grupo C",
    status: "scheduled",
  },
  {
    id: "argentina-japon-demo",
    homeTeam: { name: "Argentina", flagEmoji: "🇦🇷" },
    awayTeam: { name: "Japón", flagEmoji: "🇯🇵" },
    kickoffUtc: minutesFromNow(-180),
    venueName: "Lumen Field",
    venueTimezone: "America/Los_Angeles",
    stage: "Fase de grupos",
    groupCode: "Grupo B",
    status: "final",
    homeScore: 2,
    awayScore: 1,
  },
];
