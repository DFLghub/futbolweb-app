import type { Locale } from "./i18n";
import type { FootballMatch } from "./football-utils";
import type { GroupStanding } from "./mock-group-standings";

const SOURCE_LABEL = "FIFA official match schedule";
const SOURCE_CHECKED_AT = "2026-06-09";

export type WorldCupStage = "Fase de grupos" | "Dieciseisavos de final" | "Octavos de final" | "Cuartos de final" | "Semifinal" | "Tercer puesto" | "Final";

export type WorldCupMatch = FootballMatch & {
  slug: string;
  fifaId: string;
  matchNumber: number;
  stage: string;
  stageEn: string;
  group: string;
  homeTeamCode: string | null;
  awayTeamCode: string | null;
  homePlaceholder?: string;
  awayPlaceholder?: string;
  homeFlag: string;
  awayFlag: string;
  venue: string;
  city: string;
  country: string;
  kickoffLabel: string;
  kickoffET: string;
  sourceLabel: typeof SOURCE_LABEL;
  sourceCheckedAt: typeof SOURCE_CHECKED_AT;
};

export const worldCup2026Matches: WorldCupMatch[] = [
  {
    "id": "mexico-south-africa-2026-06-11",
    "slug": "mexico-south-africa-2026-06-11",
    "fifaId": "400021443",
    "matchNumber": 1,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo A",
    "groupCode": "Grupo A",
    "homeTeam": {
      "name": "México",
      "flagEmoji": "🇲🇽"
    },
    "awayTeam": {
      "name": "Sudáfrica",
      "flagEmoji": "🇿🇦"
    },
    "homeTeamCode": "MEX",
    "awayTeamCode": "RSA",
    "homeFlag": "🇲🇽",
    "awayFlag": "🇿🇦",
    "venue": "Mexico City Stadium",
    "venueName": "Mexico City Stadium",
    "city": "Mexico City",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Jue, 11 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-11 15:00 ET",
    "kickoffUtc": "2026-06-11T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "south-korea-czechia-2026-06-11",
    "slug": "south-korea-czechia-2026-06-11",
    "fifaId": "400021441",
    "matchNumber": 2,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo A",
    "groupCode": "Grupo A",
    "homeTeam": {
      "name": "Corea del Sur",
      "flagEmoji": "🇰🇷"
    },
    "awayTeam": {
      "name": "Chequia",
      "flagEmoji": "🇨🇿"
    },
    "homeTeamCode": "KOR",
    "awayTeamCode": "CZE",
    "homeFlag": "🇰🇷",
    "awayFlag": "🇨🇿",
    "venue": "Guadalajara Stadium",
    "venueName": "Guadalajara Stadium",
    "city": "Guadalajara",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Jue, 11 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-11 22:00 ET",
    "kickoffUtc": "2026-06-12T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "canada-bosnia-and-herzegovina-2026-06-12",
    "slug": "canada-bosnia-and-herzegovina-2026-06-12",
    "fifaId": "400021449",
    "matchNumber": 3,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo B",
    "groupCode": "Grupo B",
    "homeTeam": {
      "name": "Canadá",
      "flagEmoji": "🇨🇦"
    },
    "awayTeam": {
      "name": "Bosnia y Herzegovina",
      "flagEmoji": "🇧🇦"
    },
    "homeTeamCode": "CAN",
    "awayTeamCode": "BIH",
    "homeFlag": "🇨🇦",
    "awayFlag": "🇧🇦",
    "venue": "Toronto Stadium",
    "venueName": "Toronto Stadium",
    "city": "Toronto",
    "country": "Canadá",
    "venueTimezone": "America/Toronto",
    "kickoffLabel": "Vie, 12 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-12 15:00 ET",
    "kickoffUtc": "2026-06-12T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "usa-paraguay-2026-06-12",
    "slug": "usa-paraguay-2026-06-12",
    "fifaId": "400021458",
    "matchNumber": 4,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo D",
    "groupCode": "Grupo D",
    "homeTeam": {
      "name": "Estados Unidos",
      "flagEmoji": "🇺🇸"
    },
    "awayTeam": {
      "name": "Paraguay",
      "flagEmoji": "🇵🇾"
    },
    "homeTeamCode": "USA",
    "awayTeamCode": "PAR",
    "homeFlag": "🇺🇸",
    "awayFlag": "🇵🇾",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Vie, 12 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-12 21:00 ET",
    "kickoffUtc": "2026-06-13T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "haiti-scotland-2026-06-13",
    "slug": "haiti-scotland-2026-06-13",
    "fifaId": "400021453",
    "matchNumber": 5,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo C",
    "groupCode": "Grupo C",
    "homeTeam": {
      "name": "Haití",
      "flagEmoji": "🇭🇹"
    },
    "awayTeam": {
      "name": "Escocia",
      "flagEmoji": "🏴"
    },
    "homeTeamCode": "HAI",
    "awayTeamCode": "SCO",
    "homeFlag": "🇭🇹",
    "awayFlag": "🏴",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 13 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-13 21:00 ET",
    "kickoffUtc": "2026-06-14T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "australia-turquia-2026-06-14",
    "slug": "australia-turquia-2026-06-14",
    "fifaId": "400021463",
    "matchNumber": 6,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo D",
    "groupCode": "Grupo D",
    "homeTeam": {
      "name": "Australia",
      "flagEmoji": "🇦🇺"
    },
    "awayTeam": {
      "name": "Turquía",
      "flagEmoji": "🇹🇷"
    },
    "homeTeamCode": "AUS",
    "awayTeamCode": "TUR",
    "homeFlag": "🇦🇺",
    "awayFlag": "🇹🇷",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Dom, 14 Jun 2026 · 12:00 AM ET",
    "kickoffET": "2026-06-14 24:00 ET",
    "kickoffUtc": "2026-06-14T04:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "brazil-morocco-2026-06-13",
    "slug": "brazil-morocco-2026-06-13",
    "fifaId": "400021456",
    "matchNumber": 7,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo C",
    "groupCode": "Grupo C",
    "homeTeam": {
      "name": "Brasil",
      "flagEmoji": "🇧🇷"
    },
    "awayTeam": {
      "name": "Marruecos",
      "flagEmoji": "🇲🇦"
    },
    "homeTeamCode": "BRA",
    "awayTeamCode": "MAR",
    "homeFlag": "🇧🇷",
    "awayFlag": "🇲🇦",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 13 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-13 18:00 ET",
    "kickoffUtc": "2026-06-13T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "qatar-switzerland-2026-06-13",
    "slug": "qatar-switzerland-2026-06-13",
    "fifaId": "400021447",
    "matchNumber": 8,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo B",
    "groupCode": "Grupo B",
    "homeTeam": {
      "name": "Qatar",
      "flagEmoji": "🇶🇦"
    },
    "awayTeam": {
      "name": "Suiza",
      "flagEmoji": "🇨🇭"
    },
    "homeTeamCode": "QAT",
    "awayTeamCode": "SUI",
    "homeFlag": "🇶🇦",
    "awayFlag": "🇨🇭",
    "venue": "San Francisco Bay Area Stadium",
    "venueName": "San Francisco Bay Area Stadium",
    "city": "San Francisco Bay Area",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Sáb, 13 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-13 15:00 ET",
    "kickoffUtc": "2026-06-13T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "costa-de-marfil-ecuador-2026-06-14",
    "slug": "costa-de-marfil-ecuador-2026-06-14",
    "fifaId": "400021467",
    "matchNumber": 9,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo E",
    "groupCode": "Grupo E",
    "homeTeam": {
      "name": "Costa de Marfil",
      "flagEmoji": "🇨🇮"
    },
    "awayTeam": {
      "name": "Ecuador",
      "flagEmoji": "🇪🇨"
    },
    "homeTeamCode": "CIV",
    "awayTeamCode": "ECU",
    "homeFlag": "🇨🇮",
    "awayFlag": "🇪🇨",
    "venue": "Philadelphia Stadium",
    "venueName": "Philadelphia Stadium",
    "city": "Philadelphia",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Dom, 14 Jun 2026 · 7:00 PM ET",
    "kickoffET": "2026-06-14 19:00 ET",
    "kickoffUtc": "2026-06-14T23:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "alemania-curazao-2026-06-14",
    "slug": "alemania-curazao-2026-06-14",
    "fifaId": "400021464",
    "matchNumber": 10,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo E",
    "groupCode": "Grupo E",
    "homeTeam": {
      "name": "Alemania",
      "flagEmoji": "🇩🇪"
    },
    "awayTeam": {
      "name": "Curazao",
      "flagEmoji": "🇨🇼"
    },
    "homeTeamCode": "GER",
    "awayTeamCode": "CUW",
    "homeFlag": "🇩🇪",
    "awayFlag": "🇨🇼",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Dom, 14 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-14 13:00 ET",
    "kickoffUtc": "2026-06-14T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "paises-bajos-japon-2026-06-14",
    "slug": "paises-bajos-japon-2026-06-14",
    "fifaId": "400021470",
    "matchNumber": 11,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo F",
    "groupCode": "Grupo F",
    "homeTeam": {
      "name": "Países Bajos",
      "flagEmoji": "🇳🇱"
    },
    "awayTeam": {
      "name": "Japón",
      "flagEmoji": "🇯🇵"
    },
    "homeTeamCode": "NED",
    "awayTeamCode": "JPN",
    "homeFlag": "🇳🇱",
    "awayFlag": "🇯🇵",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Dom, 14 Jun 2026 · 4:00 PM ET",
    "kickoffET": "2026-06-14 16:00 ET",
    "kickoffUtc": "2026-06-14T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "suecia-tunez-2026-06-14",
    "slug": "suecia-tunez-2026-06-14",
    "fifaId": "400021474",
    "matchNumber": 12,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo F",
    "groupCode": "Grupo F",
    "homeTeam": {
      "name": "Suecia",
      "flagEmoji": "🇸🇪"
    },
    "awayTeam": {
      "name": "Túnez",
      "flagEmoji": "🇹🇳"
    },
    "homeTeamCode": "SWE",
    "awayTeamCode": "TUN",
    "homeFlag": "🇸🇪",
    "awayFlag": "🇹🇳",
    "venue": "Monterrey Stadium",
    "venueName": "Monterrey Stadium",
    "city": "Monterrey",
    "country": "México",
    "venueTimezone": "America/Monterrey",
    "kickoffLabel": "Dom, 14 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-14 22:00 ET",
    "kickoffUtc": "2026-06-15T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "arabia-saudita-uruguay-2026-06-15",
    "slug": "arabia-saudita-uruguay-2026-06-15",
    "fifaId": "400021486",
    "matchNumber": 13,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo H",
    "groupCode": "Grupo H",
    "homeTeam": {
      "name": "Arabia Saudita",
      "flagEmoji": "🇸🇦"
    },
    "awayTeam": {
      "name": "Uruguay",
      "flagEmoji": "🇺🇾"
    },
    "homeTeamCode": "KSA",
    "awayTeamCode": "URU",
    "homeFlag": "🇸🇦",
    "awayFlag": "🇺🇾",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Lun, 15 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-15 18:00 ET",
    "kickoffUtc": "2026-06-15T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "spain-cabo-verde-2026-06-15",
    "slug": "spain-cabo-verde-2026-06-15",
    "fifaId": "400021482",
    "matchNumber": 14,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo H",
    "groupCode": "Grupo H",
    "homeTeam": {
      "name": "España",
      "flagEmoji": "🇪🇸"
    },
    "awayTeam": {
      "name": "Cabo Verde",
      "flagEmoji": "🇨🇻"
    },
    "homeTeamCode": "ESP",
    "awayTeamCode": "CPV",
    "homeFlag": "🇪🇸",
    "awayFlag": "🇨🇻",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Lun, 15 Jun 2026 · 12:00 PM ET",
    "kickoffET": "2026-06-15 12:00 ET",
    "kickoffUtc": "2026-06-15T16:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "iran-nueva-zelanda-2026-06-15",
    "slug": "iran-nueva-zelanda-2026-06-15",
    "fifaId": "400021476",
    "matchNumber": 15,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo G",
    "groupCode": "Grupo G",
    "homeTeam": {
      "name": "Irán",
      "flagEmoji": "🇮🇷"
    },
    "awayTeam": {
      "name": "Nueva Zelanda",
      "flagEmoji": "🇳🇿"
    },
    "homeTeamCode": "IRN",
    "awayTeamCode": "NZL",
    "homeFlag": "🇮🇷",
    "awayFlag": "🇳🇿",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Lun, 15 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-15 21:00 ET",
    "kickoffUtc": "2026-06-16T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "belgica-egipto-2026-06-15",
    "slug": "belgica-egipto-2026-06-15",
    "fifaId": "400021478",
    "matchNumber": 16,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo G",
    "groupCode": "Grupo G",
    "homeTeam": {
      "name": "Bélgica",
      "flagEmoji": "🇧🇪"
    },
    "awayTeam": {
      "name": "Egipto",
      "flagEmoji": "🇪🇬"
    },
    "homeTeamCode": "BEL",
    "awayTeamCode": "EGY",
    "homeFlag": "🇧🇪",
    "awayFlag": "🇪🇬",
    "venue": "Seattle Stadium",
    "venueName": "Seattle Stadium",
    "city": "Seattle",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Lun, 15 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-15 15:00 ET",
    "kickoffUtc": "2026-06-15T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "france-senegal-2026-06-16",
    "slug": "france-senegal-2026-06-16",
    "fifaId": "400021490",
    "matchNumber": 17,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo I",
    "groupCode": "Grupo I",
    "homeTeam": {
      "name": "Francia",
      "flagEmoji": "🇫🇷"
    },
    "awayTeam": {
      "name": "Senegal",
      "flagEmoji": "🇸🇳"
    },
    "homeTeamCode": "FRA",
    "awayTeamCode": "SEN",
    "homeFlag": "🇫🇷",
    "awayFlag": "🇸🇳",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mar, 16 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-16 15:00 ET",
    "kickoffUtc": "2026-06-16T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "irak-noruega-2026-06-16",
    "slug": "irak-noruega-2026-06-16",
    "fifaId": "400021488",
    "matchNumber": 18,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo I",
    "groupCode": "Grupo I",
    "homeTeam": {
      "name": "Irak",
      "flagEmoji": "🇮🇶"
    },
    "awayTeam": {
      "name": "Noruega",
      "flagEmoji": "🇳🇴"
    },
    "homeTeamCode": "IRQ",
    "awayTeamCode": "NOR",
    "homeFlag": "🇮🇶",
    "awayFlag": "🇳🇴",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mar, 16 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-16 18:00 ET",
    "kickoffUtc": "2026-06-16T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "argentina-argelia-2026-06-16",
    "slug": "argentina-argelia-2026-06-16",
    "fifaId": "400021496",
    "matchNumber": 19,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo J",
    "groupCode": "Grupo J",
    "homeTeam": {
      "name": "Argentina",
      "flagEmoji": "🇦🇷"
    },
    "awayTeam": {
      "name": "Argelia",
      "flagEmoji": "🇩🇿"
    },
    "homeTeamCode": "ARG",
    "awayTeamCode": "ALG",
    "homeFlag": "🇦🇷",
    "awayFlag": "🇩🇿",
    "venue": "Kansas City Stadium",
    "venueName": "Kansas City Stadium",
    "city": "Kansas City",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Mar, 16 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-16 21:00 ET",
    "kickoffUtc": "2026-06-17T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "austria-jordania-2026-06-17",
    "slug": "austria-jordania-2026-06-17",
    "fifaId": "400021498",
    "matchNumber": 20,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo J",
    "groupCode": "Grupo J",
    "homeTeam": {
      "name": "Austria",
      "flagEmoji": "🇦🇹"
    },
    "awayTeam": {
      "name": "Jordania",
      "flagEmoji": "🇯🇴"
    },
    "homeTeamCode": "AUT",
    "awayTeamCode": "JOR",
    "homeFlag": "🇦🇹",
    "awayFlag": "🇯🇴",
    "venue": "San Francisco Bay Area Stadium",
    "venueName": "San Francisco Bay Area Stadium",
    "city": "San Francisco Bay Area",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Mié, 17 Jun 2026 · 12:00 AM ET",
    "kickoffET": "2026-06-17 24:00 ET",
    "kickoffUtc": "2026-06-17T04:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "ghana-panama-2026-06-17",
    "slug": "ghana-panama-2026-06-17",
    "fifaId": "400021510",
    "matchNumber": 21,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo L",
    "groupCode": "Grupo L",
    "homeTeam": {
      "name": "Ghana",
      "flagEmoji": "🇬🇭"
    },
    "awayTeam": {
      "name": "Panamá",
      "flagEmoji": "🇵🇦"
    },
    "homeTeamCode": "GHA",
    "awayTeamCode": "PAN",
    "homeFlag": "🇬🇭",
    "awayFlag": "🇵🇦",
    "venue": "Toronto Stadium",
    "venueName": "Toronto Stadium",
    "city": "Toronto",
    "country": "Canadá",
    "venueTimezone": "America/Toronto",
    "kickoffLabel": "Mié, 17 Jun 2026 · 7:00 PM ET",
    "kickoffET": "2026-06-17 19:00 ET",
    "kickoffUtc": "2026-06-17T23:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "inglaterra-croacia-2026-06-17",
    "slug": "inglaterra-croacia-2026-06-17",
    "fifaId": "400021507",
    "matchNumber": 22,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo L",
    "groupCode": "Grupo L",
    "homeTeam": {
      "name": "Inglaterra",
      "flagEmoji": "🏴"
    },
    "awayTeam": {
      "name": "Croacia",
      "flagEmoji": "🇭🇷"
    },
    "homeTeamCode": "ENG",
    "awayTeamCode": "CRO",
    "homeFlag": "🏴",
    "awayFlag": "🇭🇷",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Mié, 17 Jun 2026 · 4:00 PM ET",
    "kickoffET": "2026-06-17 16:00 ET",
    "kickoffUtc": "2026-06-17T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "portugal-rd-congo-2026-06-17",
    "slug": "portugal-rd-congo-2026-06-17",
    "fifaId": "400021502",
    "matchNumber": 23,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo K",
    "groupCode": "Grupo K",
    "homeTeam": {
      "name": "Portugal",
      "flagEmoji": "🇵🇹"
    },
    "awayTeam": {
      "name": "RD Congo",
      "flagEmoji": "🇨🇩"
    },
    "homeTeamCode": "POR",
    "awayTeamCode": "COD",
    "homeFlag": "🇵🇹",
    "awayFlag": "🇨🇩",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Mié, 17 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-17 13:00 ET",
    "kickoffUtc": "2026-06-17T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "uzbekistan-colombia-2026-06-17",
    "slug": "uzbekistan-colombia-2026-06-17",
    "fifaId": "400021504",
    "matchNumber": 24,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo K",
    "groupCode": "Grupo K",
    "homeTeam": {
      "name": "Uzbekistán",
      "flagEmoji": "🇺🇿"
    },
    "awayTeam": {
      "name": "Colombia",
      "flagEmoji": "🇨🇴"
    },
    "homeTeamCode": "UZB",
    "awayTeamCode": "COL",
    "homeFlag": "🇺🇿",
    "awayFlag": "🇨🇴",
    "venue": "Mexico City Stadium",
    "venueName": "Mexico City Stadium",
    "city": "Mexico City",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Mié, 17 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-17 22:00 ET",
    "kickoffUtc": "2026-06-18T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "czechia-south-africa-2026-06-18",
    "slug": "czechia-south-africa-2026-06-18",
    "fifaId": "400021440",
    "matchNumber": 25,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo A",
    "groupCode": "Grupo A",
    "homeTeam": {
      "name": "Chequia",
      "flagEmoji": "🇨🇿"
    },
    "awayTeam": {
      "name": "Sudáfrica",
      "flagEmoji": "🇿🇦"
    },
    "homeTeamCode": "CZE",
    "awayTeamCode": "RSA",
    "homeFlag": "🇨🇿",
    "awayFlag": "🇿🇦",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Jue, 18 Jun 2026 · 12:00 PM ET",
    "kickoffET": "2026-06-18 12:00 ET",
    "kickoffUtc": "2026-06-18T16:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "suiza-bosnia-y-herzegovina-2026-06-18",
    "slug": "suiza-bosnia-y-herzegovina-2026-06-18",
    "fifaId": "400021446",
    "matchNumber": 26,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo B",
    "groupCode": "Grupo B",
    "homeTeam": {
      "name": "Suiza",
      "flagEmoji": "🇨🇭"
    },
    "awayTeam": {
      "name": "Bosnia y Herzegovina",
      "flagEmoji": "🇧🇦"
    },
    "homeTeamCode": "SUI",
    "awayTeamCode": "BIH",
    "homeFlag": "🇨🇭",
    "awayFlag": "🇧🇦",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Jue, 18 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-18 15:00 ET",
    "kickoffUtc": "2026-06-18T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "canada-qatar-2026-06-18",
    "slug": "canada-qatar-2026-06-18",
    "fifaId": "400021450",
    "matchNumber": 27,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo B",
    "groupCode": "Grupo B",
    "homeTeam": {
      "name": "Canadá",
      "flagEmoji": "🇨🇦"
    },
    "awayTeam": {
      "name": "Qatar",
      "flagEmoji": "🇶🇦"
    },
    "homeTeamCode": "CAN",
    "awayTeamCode": "QAT",
    "homeFlag": "🇨🇦",
    "awayFlag": "🇶🇦",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Jue, 18 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-18 18:00 ET",
    "kickoffUtc": "2026-06-18T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mexico-corea-del-sur-2026-06-18",
    "slug": "mexico-corea-del-sur-2026-06-18",
    "fifaId": "400021442",
    "matchNumber": 28,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo A",
    "groupCode": "Grupo A",
    "homeTeam": {
      "name": "México",
      "flagEmoji": "🇲🇽"
    },
    "awayTeam": {
      "name": "Corea del Sur",
      "flagEmoji": "🇰🇷"
    },
    "homeTeamCode": "MEX",
    "awayTeamCode": "KOR",
    "homeFlag": "🇲🇽",
    "awayFlag": "🇰🇷",
    "venue": "Guadalajara Stadium",
    "venueName": "Guadalajara Stadium",
    "city": "Guadalajara",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Jue, 18 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-18 21:00 ET",
    "kickoffUtc": "2026-06-19T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "brasil-haiti-2026-06-19",
    "slug": "brasil-haiti-2026-06-19",
    "fifaId": "400021457",
    "matchNumber": 29,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo C",
    "groupCode": "Grupo C",
    "homeTeam": {
      "name": "Brasil",
      "flagEmoji": "🇧🇷"
    },
    "awayTeam": {
      "name": "Haití",
      "flagEmoji": "🇭🇹"
    },
    "homeTeamCode": "BRA",
    "awayTeamCode": "HAI",
    "homeFlag": "🇧🇷",
    "awayFlag": "🇭🇹",
    "venue": "Philadelphia Stadium",
    "venueName": "Philadelphia Stadium",
    "city": "Philadelphia",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Vie, 19 Jun 2026 · 8:30 PM ET",
    "kickoffET": "2026-06-19 20:30 ET",
    "kickoffUtc": "2026-06-20T00:30:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "escocia-marruecos-2026-06-19",
    "slug": "escocia-marruecos-2026-06-19",
    "fifaId": "400021454",
    "matchNumber": 30,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo C",
    "groupCode": "Grupo C",
    "homeTeam": {
      "name": "Escocia",
      "flagEmoji": "🏴"
    },
    "awayTeam": {
      "name": "Marruecos",
      "flagEmoji": "🇲🇦"
    },
    "homeTeamCode": "SCO",
    "awayTeamCode": "MAR",
    "homeFlag": "🏴",
    "awayFlag": "🇲🇦",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Vie, 19 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-19 18:00 ET",
    "kickoffUtc": "2026-06-19T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "turquia-paraguay-2026-06-19",
    "slug": "turquia-paraguay-2026-06-19",
    "fifaId": "400021460",
    "matchNumber": 31,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo D",
    "groupCode": "Grupo D",
    "homeTeam": {
      "name": "Turquía",
      "flagEmoji": "🇹🇷"
    },
    "awayTeam": {
      "name": "Paraguay",
      "flagEmoji": "🇵🇾"
    },
    "homeTeamCode": "TUR",
    "awayTeamCode": "PAR",
    "homeFlag": "🇹🇷",
    "awayFlag": "🇵🇾",
    "venue": "San Francisco Bay Area Stadium",
    "venueName": "San Francisco Bay Area Stadium",
    "city": "San Francisco Bay Area",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Vie, 19 Jun 2026 · 11:00 PM ET",
    "kickoffET": "2026-06-19 23:00 ET",
    "kickoffUtc": "2026-06-20T03:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "estados-unidos-australia-2026-06-19",
    "slug": "estados-unidos-australia-2026-06-19",
    "fifaId": "400021462",
    "matchNumber": 32,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo D",
    "groupCode": "Grupo D",
    "homeTeam": {
      "name": "Estados Unidos",
      "flagEmoji": "🇺🇸"
    },
    "awayTeam": {
      "name": "Australia",
      "flagEmoji": "🇦🇺"
    },
    "homeTeamCode": "USA",
    "awayTeamCode": "AUS",
    "homeFlag": "🇺🇸",
    "awayFlag": "🇦🇺",
    "venue": "Seattle Stadium",
    "venueName": "Seattle Stadium",
    "city": "Seattle",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Vie, 19 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-19 15:00 ET",
    "kickoffUtc": "2026-06-19T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "alemania-costa-de-marfil-2026-06-20",
    "slug": "alemania-costa-de-marfil-2026-06-20",
    "fifaId": "400021469",
    "matchNumber": 33,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo E",
    "groupCode": "Grupo E",
    "homeTeam": {
      "name": "Alemania",
      "flagEmoji": "🇩🇪"
    },
    "awayTeam": {
      "name": "Costa de Marfil",
      "flagEmoji": "🇨🇮"
    },
    "homeTeamCode": "GER",
    "awayTeamCode": "CIV",
    "homeFlag": "🇩🇪",
    "awayFlag": "🇨🇮",
    "venue": "Toronto Stadium",
    "venueName": "Toronto Stadium",
    "city": "Toronto",
    "country": "Canadá",
    "venueTimezone": "America/Toronto",
    "kickoffLabel": "Sáb, 20 Jun 2026 · 4:00 PM ET",
    "kickoffET": "2026-06-20 16:00 ET",
    "kickoffUtc": "2026-06-20T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "ecuador-curazao-2026-06-20",
    "slug": "ecuador-curazao-2026-06-20",
    "fifaId": "400021465",
    "matchNumber": 34,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo E",
    "groupCode": "Grupo E",
    "homeTeam": {
      "name": "Ecuador",
      "flagEmoji": "🇪🇨"
    },
    "awayTeam": {
      "name": "Curazao",
      "flagEmoji": "🇨🇼"
    },
    "homeTeamCode": "ECU",
    "awayTeamCode": "CUW",
    "homeFlag": "🇪🇨",
    "awayFlag": "🇨🇼",
    "venue": "Kansas City Stadium",
    "venueName": "Kansas City Stadium",
    "city": "Kansas City",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Sáb, 20 Jun 2026 · 8:00 PM ET",
    "kickoffET": "2026-06-20 20:00 ET",
    "kickoffUtc": "2026-06-21T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "paises-bajos-suecia-2026-06-20",
    "slug": "paises-bajos-suecia-2026-06-20",
    "fifaId": "400021472",
    "matchNumber": 35,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo F",
    "groupCode": "Grupo F",
    "homeTeam": {
      "name": "Países Bajos",
      "flagEmoji": "🇳🇱"
    },
    "awayTeam": {
      "name": "Suecia",
      "flagEmoji": "🇸🇪"
    },
    "homeTeamCode": "NED",
    "awayTeamCode": "SWE",
    "homeFlag": "🇳🇱",
    "awayFlag": "🇸🇪",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Sáb, 20 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-20 13:00 ET",
    "kickoffUtc": "2026-06-20T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "tunez-japon-2026-06-21",
    "slug": "tunez-japon-2026-06-21",
    "fifaId": "400021475",
    "matchNumber": 36,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo F",
    "groupCode": "Grupo F",
    "homeTeam": {
      "name": "Túnez",
      "flagEmoji": "🇹🇳"
    },
    "awayTeam": {
      "name": "Japón",
      "flagEmoji": "🇯🇵"
    },
    "homeTeamCode": "TUN",
    "awayTeamCode": "JPN",
    "homeFlag": "🇹🇳",
    "awayFlag": "🇯🇵",
    "venue": "Monterrey Stadium",
    "venueName": "Monterrey Stadium",
    "city": "Monterrey",
    "country": "México",
    "venueTimezone": "America/Monterrey",
    "kickoffLabel": "Dom, 21 Jun 2026 · 12:00 AM ET",
    "kickoffET": "2026-06-21 24:00 ET",
    "kickoffUtc": "2026-06-21T04:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "uruguay-cabo-verde-2026-06-21",
    "slug": "uruguay-cabo-verde-2026-06-21",
    "fifaId": "400021487",
    "matchNumber": 37,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo H",
    "groupCode": "Grupo H",
    "homeTeam": {
      "name": "Uruguay",
      "flagEmoji": "🇺🇾"
    },
    "awayTeam": {
      "name": "Cabo Verde",
      "flagEmoji": "🇨🇻"
    },
    "homeTeamCode": "URU",
    "awayTeamCode": "CPV",
    "homeFlag": "🇺🇾",
    "awayFlag": "🇨🇻",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Dom, 21 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-21 18:00 ET",
    "kickoffUtc": "2026-06-21T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "espana-arabia-saudita-2026-06-21",
    "slug": "espana-arabia-saudita-2026-06-21",
    "fifaId": "400021483",
    "matchNumber": 38,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo H",
    "groupCode": "Grupo H",
    "homeTeam": {
      "name": "España",
      "flagEmoji": "🇪🇸"
    },
    "awayTeam": {
      "name": "Arabia Saudita",
      "flagEmoji": "🇸🇦"
    },
    "homeTeamCode": "ESP",
    "awayTeamCode": "KSA",
    "homeFlag": "🇪🇸",
    "awayFlag": "🇸🇦",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Dom, 21 Jun 2026 · 12:00 PM ET",
    "kickoffET": "2026-06-21 12:00 ET",
    "kickoffUtc": "2026-06-21T16:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "belgica-iran-2026-06-21",
    "slug": "belgica-iran-2026-06-21",
    "fifaId": "400021477",
    "matchNumber": 39,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo G",
    "groupCode": "Grupo G",
    "homeTeam": {
      "name": "Bélgica",
      "flagEmoji": "🇧🇪"
    },
    "awayTeam": {
      "name": "Irán",
      "flagEmoji": "🇮🇷"
    },
    "homeTeamCode": "BEL",
    "awayTeamCode": "IRN",
    "homeFlag": "🇧🇪",
    "awayFlag": "🇮🇷",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Dom, 21 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-21 15:00 ET",
    "kickoffUtc": "2026-06-21T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "nueva-zelanda-egipto-2026-06-21",
    "slug": "nueva-zelanda-egipto-2026-06-21",
    "fifaId": "400021480",
    "matchNumber": 40,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo G",
    "groupCode": "Grupo G",
    "homeTeam": {
      "name": "Nueva Zelanda",
      "flagEmoji": "🇳🇿"
    },
    "awayTeam": {
      "name": "Egipto",
      "flagEmoji": "🇪🇬"
    },
    "homeTeamCode": "NZL",
    "awayTeamCode": "EGY",
    "homeFlag": "🇳🇿",
    "awayFlag": "🇪🇬",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Dom, 21 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-21 21:00 ET",
    "kickoffUtc": "2026-06-22T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "noruega-senegal-2026-06-22",
    "slug": "noruega-senegal-2026-06-22",
    "fifaId": "400021491",
    "matchNumber": 41,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo I",
    "groupCode": "Grupo I",
    "homeTeam": {
      "name": "Noruega",
      "flagEmoji": "🇳🇴"
    },
    "awayTeam": {
      "name": "Senegal",
      "flagEmoji": "🇸🇳"
    },
    "homeTeamCode": "NOR",
    "awayTeamCode": "SEN",
    "homeFlag": "🇳🇴",
    "awayFlag": "🇸🇳",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Lun, 22 Jun 2026 · 8:00 PM ET",
    "kickoffET": "2026-06-22 20:00 ET",
    "kickoffUtc": "2026-06-23T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "francia-irak-2026-06-22",
    "slug": "francia-irak-2026-06-22",
    "fifaId": "400021492",
    "matchNumber": 42,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo I",
    "groupCode": "Grupo I",
    "homeTeam": {
      "name": "Francia",
      "flagEmoji": "🇫🇷"
    },
    "awayTeam": {
      "name": "Irak",
      "flagEmoji": "🇮🇶"
    },
    "homeTeamCode": "FRA",
    "awayTeamCode": "IRQ",
    "homeFlag": "🇫🇷",
    "awayFlag": "🇮🇶",
    "venue": "Philadelphia Stadium",
    "venueName": "Philadelphia Stadium",
    "city": "Philadelphia",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Lun, 22 Jun 2026 · 5:00 PM ET",
    "kickoffET": "2026-06-22 17:00 ET",
    "kickoffUtc": "2026-06-22T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "argentina-austria-2026-06-22",
    "slug": "argentina-austria-2026-06-22",
    "fifaId": "400021494",
    "matchNumber": 43,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo J",
    "groupCode": "Grupo J",
    "homeTeam": {
      "name": "Argentina",
      "flagEmoji": "🇦🇷"
    },
    "awayTeam": {
      "name": "Austria",
      "flagEmoji": "🇦🇹"
    },
    "homeTeamCode": "ARG",
    "awayTeamCode": "AUT",
    "homeFlag": "🇦🇷",
    "awayFlag": "🇦🇹",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Lun, 22 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-22 13:00 ET",
    "kickoffUtc": "2026-06-22T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "jordania-argelia-2026-06-22",
    "slug": "jordania-argelia-2026-06-22",
    "fifaId": "400021499",
    "matchNumber": 44,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo J",
    "groupCode": "Grupo J",
    "homeTeam": {
      "name": "Jordania",
      "flagEmoji": "🇯🇴"
    },
    "awayTeam": {
      "name": "Argelia",
      "flagEmoji": "🇩🇿"
    },
    "homeTeamCode": "JOR",
    "awayTeamCode": "ALG",
    "homeFlag": "🇯🇴",
    "awayFlag": "🇩🇿",
    "venue": "San Francisco Bay Area Stadium",
    "venueName": "San Francisco Bay Area Stadium",
    "city": "San Francisco Bay Area",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Lun, 22 Jun 2026 · 11:00 PM ET",
    "kickoffET": "2026-06-22 23:00 ET",
    "kickoffUtc": "2026-06-23T03:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "inglaterra-ghana-2026-06-23",
    "slug": "inglaterra-ghana-2026-06-23",
    "fifaId": "400021506",
    "matchNumber": 45,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo L",
    "groupCode": "Grupo L",
    "homeTeam": {
      "name": "Inglaterra",
      "flagEmoji": "🏴"
    },
    "awayTeam": {
      "name": "Ghana",
      "flagEmoji": "🇬🇭"
    },
    "homeTeamCode": "ENG",
    "awayTeamCode": "GHA",
    "homeFlag": "🏴",
    "awayFlag": "🇬🇭",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mar, 23 Jun 2026 · 4:00 PM ET",
    "kickoffET": "2026-06-23 16:00 ET",
    "kickoffUtc": "2026-06-23T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "panama-croacia-2026-06-23",
    "slug": "panama-croacia-2026-06-23",
    "fifaId": "400021511",
    "matchNumber": 46,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo L",
    "groupCode": "Grupo L",
    "homeTeam": {
      "name": "Panamá",
      "flagEmoji": "🇵🇦"
    },
    "awayTeam": {
      "name": "Croacia",
      "flagEmoji": "🇭🇷"
    },
    "homeTeamCode": "PAN",
    "awayTeamCode": "CRO",
    "homeFlag": "🇵🇦",
    "awayFlag": "🇭🇷",
    "venue": "Toronto Stadium",
    "venueName": "Toronto Stadium",
    "city": "Toronto",
    "country": "Canadá",
    "venueTimezone": "America/Toronto",
    "kickoffLabel": "Mar, 23 Jun 2026 · 7:00 PM ET",
    "kickoffET": "2026-06-23 19:00 ET",
    "kickoffUtc": "2026-06-23T23:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "portugal-uzbekistan-2026-06-23",
    "slug": "portugal-uzbekistan-2026-06-23",
    "fifaId": "400021503",
    "matchNumber": 47,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo K",
    "groupCode": "Grupo K",
    "homeTeam": {
      "name": "Portugal",
      "flagEmoji": "🇵🇹"
    },
    "awayTeam": {
      "name": "Uzbekistán",
      "flagEmoji": "🇺🇿"
    },
    "homeTeamCode": "POR",
    "awayTeamCode": "UZB",
    "homeFlag": "🇵🇹",
    "awayFlag": "🇺🇿",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Mar, 23 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-23 13:00 ET",
    "kickoffUtc": "2026-06-23T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "colombia-rd-congo-2026-06-23",
    "slug": "colombia-rd-congo-2026-06-23",
    "fifaId": "400021501",
    "matchNumber": 48,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo K",
    "groupCode": "Grupo K",
    "homeTeam": {
      "name": "Colombia",
      "flagEmoji": "🇨🇴"
    },
    "awayTeam": {
      "name": "RD Congo",
      "flagEmoji": "🇨🇩"
    },
    "homeTeamCode": "COL",
    "awayTeamCode": "COD",
    "homeFlag": "🇨🇴",
    "awayFlag": "🇨🇩",
    "venue": "Guadalajara Stadium",
    "venueName": "Guadalajara Stadium",
    "city": "Guadalajara",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Mar, 23 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-23 22:00 ET",
    "kickoffUtc": "2026-06-24T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "scotland-brazil-2026-06-24",
    "slug": "scotland-brazil-2026-06-24",
    "fifaId": "400021455",
    "matchNumber": 49,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo C",
    "groupCode": "Grupo C",
    "homeTeam": {
      "name": "Escocia",
      "flagEmoji": "🏴"
    },
    "awayTeam": {
      "name": "Brasil",
      "flagEmoji": "🇧🇷"
    },
    "homeTeamCode": "SCO",
    "awayTeamCode": "BRA",
    "homeFlag": "🏴",
    "awayFlag": "🇧🇷",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mié, 24 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-24 18:00 ET",
    "kickoffUtc": "2026-06-24T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "marruecos-haiti-2026-06-24",
    "slug": "marruecos-haiti-2026-06-24",
    "fifaId": "400021452",
    "matchNumber": 50,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo C",
    "groupCode": "Grupo C",
    "homeTeam": {
      "name": "Marruecos",
      "flagEmoji": "🇲🇦"
    },
    "awayTeam": {
      "name": "Haití",
      "flagEmoji": "🇭🇹"
    },
    "homeTeamCode": "MAR",
    "awayTeamCode": "HAI",
    "homeFlag": "🇲🇦",
    "awayFlag": "🇭🇹",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mié, 24 Jun 2026 · 6:00 PM ET",
    "kickoffET": "2026-06-24 18:00 ET",
    "kickoffUtc": "2026-06-24T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "suiza-canada-2026-06-24",
    "slug": "suiza-canada-2026-06-24",
    "fifaId": "400021451",
    "matchNumber": 51,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo B",
    "groupCode": "Grupo B",
    "homeTeam": {
      "name": "Suiza",
      "flagEmoji": "🇨🇭"
    },
    "awayTeam": {
      "name": "Canadá",
      "flagEmoji": "🇨🇦"
    },
    "homeTeamCode": "SUI",
    "awayTeamCode": "CAN",
    "homeFlag": "🇨🇭",
    "awayFlag": "🇨🇦",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Mié, 24 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-24 15:00 ET",
    "kickoffUtc": "2026-06-24T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "bosnia-y-herzegovina-qatar-2026-06-24",
    "slug": "bosnia-y-herzegovina-qatar-2026-06-24",
    "fifaId": "400021448",
    "matchNumber": 52,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo B",
    "groupCode": "Grupo B",
    "homeTeam": {
      "name": "Bosnia y Herzegovina",
      "flagEmoji": "🇧🇦"
    },
    "awayTeam": {
      "name": "Qatar",
      "flagEmoji": "🇶🇦"
    },
    "homeTeamCode": "BIH",
    "awayTeamCode": "QAT",
    "homeFlag": "🇧🇦",
    "awayFlag": "🇶🇦",
    "venue": "Seattle Stadium",
    "venueName": "Seattle Stadium",
    "city": "Seattle",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Mié, 24 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-24 15:00 ET",
    "kickoffUtc": "2026-06-24T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "chequia-mexico-2026-06-24",
    "slug": "chequia-mexico-2026-06-24",
    "fifaId": "400021444",
    "matchNumber": 53,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo A",
    "groupCode": "Grupo A",
    "homeTeam": {
      "name": "Chequia",
      "flagEmoji": "🇨🇿"
    },
    "awayTeam": {
      "name": "México",
      "flagEmoji": "🇲🇽"
    },
    "homeTeamCode": "CZE",
    "awayTeamCode": "MEX",
    "homeFlag": "🇨🇿",
    "awayFlag": "🇲🇽",
    "venue": "Mexico City Stadium",
    "venueName": "Mexico City Stadium",
    "city": "Mexico City",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Mié, 24 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-24 21:00 ET",
    "kickoffUtc": "2026-06-25T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "sudafrica-corea-del-sur-2026-06-24",
    "slug": "sudafrica-corea-del-sur-2026-06-24",
    "fifaId": "400021445",
    "matchNumber": 54,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo A",
    "groupCode": "Grupo A",
    "homeTeam": {
      "name": "Sudáfrica",
      "flagEmoji": "🇿🇦"
    },
    "awayTeam": {
      "name": "Corea del Sur",
      "flagEmoji": "🇰🇷"
    },
    "homeTeamCode": "RSA",
    "awayTeamCode": "KOR",
    "homeFlag": "🇿🇦",
    "awayFlag": "🇰🇷",
    "venue": "Monterrey Stadium",
    "venueName": "Monterrey Stadium",
    "city": "Monterrey",
    "country": "México",
    "venueTimezone": "America/Monterrey",
    "kickoffLabel": "Mié, 24 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-24 21:00 ET",
    "kickoffUtc": "2026-06-25T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "curazao-costa-de-marfil-2026-06-25",
    "slug": "curazao-costa-de-marfil-2026-06-25",
    "fifaId": "400021468",
    "matchNumber": 55,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo E",
    "groupCode": "Grupo E",
    "homeTeam": {
      "name": "Curazao",
      "flagEmoji": "🇨🇼"
    },
    "awayTeam": {
      "name": "Costa de Marfil",
      "flagEmoji": "🇨🇮"
    },
    "homeTeamCode": "CUW",
    "awayTeamCode": "CIV",
    "homeFlag": "🇨🇼",
    "awayFlag": "🇨🇮",
    "venue": "Philadelphia Stadium",
    "venueName": "Philadelphia Stadium",
    "city": "Philadelphia",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Jue, 25 Jun 2026 · 4:00 PM ET",
    "kickoffET": "2026-06-25 16:00 ET",
    "kickoffUtc": "2026-06-25T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "ecuador-alemania-2026-06-25",
    "slug": "ecuador-alemania-2026-06-25",
    "fifaId": "400021466",
    "matchNumber": 56,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo E",
    "groupCode": "Grupo E",
    "homeTeam": {
      "name": "Ecuador",
      "flagEmoji": "🇪🇨"
    },
    "awayTeam": {
      "name": "Alemania",
      "flagEmoji": "🇩🇪"
    },
    "homeTeamCode": "ECU",
    "awayTeamCode": "GER",
    "homeFlag": "🇪🇨",
    "awayFlag": "🇩🇪",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Jue, 25 Jun 2026 · 4:00 PM ET",
    "kickoffET": "2026-06-25 16:00 ET",
    "kickoffUtc": "2026-06-25T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "japon-suecia-2026-06-25",
    "slug": "japon-suecia-2026-06-25",
    "fifaId": "400021471",
    "matchNumber": 57,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo F",
    "groupCode": "Grupo F",
    "homeTeam": {
      "name": "Japón",
      "flagEmoji": "🇯🇵"
    },
    "awayTeam": {
      "name": "Suecia",
      "flagEmoji": "🇸🇪"
    },
    "homeTeamCode": "JPN",
    "awayTeamCode": "SWE",
    "homeFlag": "🇯🇵",
    "awayFlag": "🇸🇪",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Jue, 25 Jun 2026 · 7:00 PM ET",
    "kickoffET": "2026-06-25 19:00 ET",
    "kickoffUtc": "2026-06-25T23:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "tunez-paises-bajos-2026-06-25",
    "slug": "tunez-paises-bajos-2026-06-25",
    "fifaId": "400021473",
    "matchNumber": 58,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo F",
    "groupCode": "Grupo F",
    "homeTeam": {
      "name": "Túnez",
      "flagEmoji": "🇹🇳"
    },
    "awayTeam": {
      "name": "Países Bajos",
      "flagEmoji": "🇳🇱"
    },
    "homeTeamCode": "TUN",
    "awayTeamCode": "NED",
    "homeFlag": "🇹🇳",
    "awayFlag": "🇳🇱",
    "venue": "Kansas City Stadium",
    "venueName": "Kansas City Stadium",
    "city": "Kansas City",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Jue, 25 Jun 2026 · 7:00 PM ET",
    "kickoffET": "2026-06-25 19:00 ET",
    "kickoffUtc": "2026-06-25T23:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "turquia-estados-unidos-2026-06-25",
    "slug": "turquia-estados-unidos-2026-06-25",
    "fifaId": "400021459",
    "matchNumber": 59,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo D",
    "groupCode": "Grupo D",
    "homeTeam": {
      "name": "Turquía",
      "flagEmoji": "🇹🇷"
    },
    "awayTeam": {
      "name": "Estados Unidos",
      "flagEmoji": "🇺🇸"
    },
    "homeTeamCode": "TUR",
    "awayTeamCode": "USA",
    "homeFlag": "🇹🇷",
    "awayFlag": "🇺🇸",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Jue, 25 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-25 22:00 ET",
    "kickoffUtc": "2026-06-26T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "paraguay-australia-2026-06-25",
    "slug": "paraguay-australia-2026-06-25",
    "fifaId": "400021461",
    "matchNumber": 60,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo D",
    "groupCode": "Grupo D",
    "homeTeam": {
      "name": "Paraguay",
      "flagEmoji": "🇵🇾"
    },
    "awayTeam": {
      "name": "Australia",
      "flagEmoji": "🇦🇺"
    },
    "homeTeamCode": "PAR",
    "awayTeamCode": "AUS",
    "homeFlag": "🇵🇾",
    "awayFlag": "🇦🇺",
    "venue": "San Francisco Bay Area Stadium",
    "venueName": "San Francisco Bay Area Stadium",
    "city": "San Francisco Bay Area",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Jue, 25 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-25 22:00 ET",
    "kickoffUtc": "2026-06-26T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "noruega-francia-2026-06-26",
    "slug": "noruega-francia-2026-06-26",
    "fifaId": "400021489",
    "matchNumber": 61,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo I",
    "groupCode": "Grupo I",
    "homeTeam": {
      "name": "Noruega",
      "flagEmoji": "🇳🇴"
    },
    "awayTeam": {
      "name": "Francia",
      "flagEmoji": "🇫🇷"
    },
    "homeTeamCode": "NOR",
    "awayTeamCode": "FRA",
    "homeFlag": "🇳🇴",
    "awayFlag": "🇫🇷",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Vie, 26 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-26 15:00 ET",
    "kickoffUtc": "2026-06-26T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "senegal-irak-2026-06-26",
    "slug": "senegal-irak-2026-06-26",
    "fifaId": "400021493",
    "matchNumber": 62,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo I",
    "groupCode": "Grupo I",
    "homeTeam": {
      "name": "Senegal",
      "flagEmoji": "🇸🇳"
    },
    "awayTeam": {
      "name": "Irak",
      "flagEmoji": "🇮🇶"
    },
    "homeTeamCode": "SEN",
    "awayTeamCode": "IRQ",
    "homeFlag": "🇸🇳",
    "awayFlag": "🇮🇶",
    "venue": "Toronto Stadium",
    "venueName": "Toronto Stadium",
    "city": "Toronto",
    "country": "Canadá",
    "venueTimezone": "America/Toronto",
    "kickoffLabel": "Vie, 26 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-26 15:00 ET",
    "kickoffUtc": "2026-06-26T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "egipto-iran-2026-06-26",
    "slug": "egipto-iran-2026-06-26",
    "fifaId": "400021479",
    "matchNumber": 63,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo G",
    "groupCode": "Grupo G",
    "homeTeam": {
      "name": "Egipto",
      "flagEmoji": "🇪🇬"
    },
    "awayTeam": {
      "name": "Irán",
      "flagEmoji": "🇮🇷"
    },
    "homeTeamCode": "EGY",
    "awayTeamCode": "IRN",
    "homeFlag": "🇪🇬",
    "awayFlag": "🇮🇷",
    "venue": "Seattle Stadium",
    "venueName": "Seattle Stadium",
    "city": "Seattle",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Vie, 26 Jun 2026 · 11:00 PM ET",
    "kickoffET": "2026-06-26 23:00 ET",
    "kickoffUtc": "2026-06-27T03:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "nueva-zelanda-belgica-2026-06-26",
    "slug": "nueva-zelanda-belgica-2026-06-26",
    "fifaId": "400021481",
    "matchNumber": 64,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo G",
    "groupCode": "Grupo G",
    "homeTeam": {
      "name": "Nueva Zelanda",
      "flagEmoji": "🇳🇿"
    },
    "awayTeam": {
      "name": "Bélgica",
      "flagEmoji": "🇧🇪"
    },
    "homeTeamCode": "NZL",
    "awayTeamCode": "BEL",
    "homeFlag": "🇳🇿",
    "awayFlag": "🇧🇪",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Vie, 26 Jun 2026 · 11:00 PM ET",
    "kickoffET": "2026-06-26 23:00 ET",
    "kickoffUtc": "2026-06-27T03:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "cabo-verde-arabia-saudita-2026-06-26",
    "slug": "cabo-verde-arabia-saudita-2026-06-26",
    "fifaId": "400021485",
    "matchNumber": 65,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo H",
    "groupCode": "Grupo H",
    "homeTeam": {
      "name": "Cabo Verde",
      "flagEmoji": "🇨🇻"
    },
    "awayTeam": {
      "name": "Arabia Saudita",
      "flagEmoji": "🇸🇦"
    },
    "homeTeamCode": "CPV",
    "awayTeamCode": "KSA",
    "homeFlag": "🇨🇻",
    "awayFlag": "🇸🇦",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Vie, 26 Jun 2026 · 8:00 PM ET",
    "kickoffET": "2026-06-26 20:00 ET",
    "kickoffUtc": "2026-06-27T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "uruguay-espana-2026-06-26",
    "slug": "uruguay-espana-2026-06-26",
    "fifaId": "400021484",
    "matchNumber": 66,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo H",
    "groupCode": "Grupo H",
    "homeTeam": {
      "name": "Uruguay",
      "flagEmoji": "🇺🇾"
    },
    "awayTeam": {
      "name": "España",
      "flagEmoji": "🇪🇸"
    },
    "homeTeamCode": "URU",
    "awayTeamCode": "ESP",
    "homeFlag": "🇺🇾",
    "awayFlag": "🇪🇸",
    "venue": "Guadalajara Stadium",
    "venueName": "Guadalajara Stadium",
    "city": "Guadalajara",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Vie, 26 Jun 2026 · 8:00 PM ET",
    "kickoffET": "2026-06-26 20:00 ET",
    "kickoffUtc": "2026-06-27T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "panama-inglaterra-2026-06-27",
    "slug": "panama-inglaterra-2026-06-27",
    "fifaId": "400021508",
    "matchNumber": 67,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo L",
    "groupCode": "Grupo L",
    "homeTeam": {
      "name": "Panamá",
      "flagEmoji": "🇵🇦"
    },
    "awayTeam": {
      "name": "Inglaterra",
      "flagEmoji": "🏴"
    },
    "homeTeamCode": "PAN",
    "awayTeamCode": "ENG",
    "homeFlag": "🇵🇦",
    "awayFlag": "🏴",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 27 Jun 2026 · 5:00 PM ET",
    "kickoffET": "2026-06-27 17:00 ET",
    "kickoffUtc": "2026-06-27T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "croacia-ghana-2026-06-27",
    "slug": "croacia-ghana-2026-06-27",
    "fifaId": "400021509",
    "matchNumber": 68,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo L",
    "groupCode": "Grupo L",
    "homeTeam": {
      "name": "Croacia",
      "flagEmoji": "🇭🇷"
    },
    "awayTeam": {
      "name": "Ghana",
      "flagEmoji": "🇬🇭"
    },
    "homeTeamCode": "CRO",
    "awayTeamCode": "GHA",
    "homeFlag": "🇭🇷",
    "awayFlag": "🇬🇭",
    "venue": "Philadelphia Stadium",
    "venueName": "Philadelphia Stadium",
    "city": "Philadelphia",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 27 Jun 2026 · 5:00 PM ET",
    "kickoffET": "2026-06-27 17:00 ET",
    "kickoffUtc": "2026-06-27T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "argelia-austria-2026-06-27",
    "slug": "argelia-austria-2026-06-27",
    "fifaId": "400021497",
    "matchNumber": 69,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo J",
    "groupCode": "Grupo J",
    "homeTeam": {
      "name": "Argelia",
      "flagEmoji": "🇩🇿"
    },
    "awayTeam": {
      "name": "Austria",
      "flagEmoji": "🇦🇹"
    },
    "homeTeamCode": "ALG",
    "awayTeamCode": "AUT",
    "homeFlag": "🇩🇿",
    "awayFlag": "🇦🇹",
    "venue": "Kansas City Stadium",
    "venueName": "Kansas City Stadium",
    "city": "Kansas City",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Sáb, 27 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-27 22:00 ET",
    "kickoffUtc": "2026-06-28T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "jordania-argentina-2026-06-27",
    "slug": "jordania-argentina-2026-06-27",
    "fifaId": "400021495",
    "matchNumber": 70,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo J",
    "groupCode": "Grupo J",
    "homeTeam": {
      "name": "Jordania",
      "flagEmoji": "🇯🇴"
    },
    "awayTeam": {
      "name": "Argentina",
      "flagEmoji": "🇦🇷"
    },
    "homeTeamCode": "JOR",
    "awayTeamCode": "ARG",
    "homeFlag": "🇯🇴",
    "awayFlag": "🇦🇷",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Sáb, 27 Jun 2026 · 10:00 PM ET",
    "kickoffET": "2026-06-27 22:00 ET",
    "kickoffUtc": "2026-06-28T02:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "colombia-portugal-2026-06-27",
    "slug": "colombia-portugal-2026-06-27",
    "fifaId": "400021505",
    "matchNumber": 71,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo K",
    "groupCode": "Grupo K",
    "homeTeam": {
      "name": "Colombia",
      "flagEmoji": "🇨🇴"
    },
    "awayTeam": {
      "name": "Portugal",
      "flagEmoji": "🇵🇹"
    },
    "homeTeamCode": "COL",
    "awayTeamCode": "POR",
    "homeFlag": "🇨🇴",
    "awayFlag": "🇵🇹",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 27 Jun 2026 · 7:30 PM ET",
    "kickoffET": "2026-06-27 19:30 ET",
    "kickoffUtc": "2026-06-27T23:30:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "rd-congo-uzbekistan-2026-06-27",
    "slug": "rd-congo-uzbekistan-2026-06-27",
    "fifaId": "400021500",
    "matchNumber": 72,
    "stage": "Fase de grupos",
    "stageEn": "First Stage",
    "group": "Grupo K",
    "groupCode": "Grupo K",
    "homeTeam": {
      "name": "RD Congo",
      "flagEmoji": "🇨🇩"
    },
    "awayTeam": {
      "name": "Uzbekistán",
      "flagEmoji": "🇺🇿"
    },
    "homeTeamCode": "COD",
    "awayTeamCode": "UZB",
    "homeFlag": "🇨🇩",
    "awayFlag": "🇺🇿",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 27 Jun 2026 · 7:30 PM ET",
    "kickoffET": "2026-06-27 19:30 ET",
    "kickoffUtc": "2026-06-27T23:30:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-073",
    "slug": "mundial-2026-partido-073",
    "fifaId": "400021518",
    "matchNumber": 73,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "2A",
    "awayPlaceholder": "2B",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Dom, 28 Jun 2026 · 3:00 PM ET",
    "kickoffET": "2026-06-28 15:00 ET",
    "kickoffUtc": "2026-06-28T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-074",
    "slug": "mundial-2026-partido-074",
    "fifaId": "400021513",
    "matchNumber": 74,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1E",
    "awayPlaceholder": "3ABCDF",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Lun, 29 Jun 2026 · 4:30 PM ET",
    "kickoffET": "2026-06-29 16:30 ET",
    "kickoffUtc": "2026-06-29T20:30:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-075",
    "slug": "mundial-2026-partido-075",
    "fifaId": "400021522",
    "matchNumber": 75,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1F",
    "awayPlaceholder": "2C",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Monterrey Stadium",
    "venueName": "Monterrey Stadium",
    "city": "Monterrey",
    "country": "México",
    "venueTimezone": "America/Monterrey",
    "kickoffLabel": "Lun, 29 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-29 21:00 ET",
    "kickoffUtc": "2026-06-30T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-076",
    "slug": "mundial-2026-partido-076",
    "fifaId": "400021516",
    "matchNumber": 76,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1C",
    "awayPlaceholder": "2F",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Lun, 29 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-29 13:00 ET",
    "kickoffUtc": "2026-06-29T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-077",
    "slug": "mundial-2026-partido-077",
    "fifaId": "400021523",
    "matchNumber": 77,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1I",
    "awayPlaceholder": "3CDFGH",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mar, 30 Jun 2026 · 5:00 PM ET",
    "kickoffET": "2026-06-30 17:00 ET",
    "kickoffUtc": "2026-06-30T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-078",
    "slug": "mundial-2026-partido-078",
    "fifaId": "400021514",
    "matchNumber": 78,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "2E",
    "awayPlaceholder": "2I",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Mar, 30 Jun 2026 · 1:00 PM ET",
    "kickoffET": "2026-06-30 13:00 ET",
    "kickoffUtc": "2026-06-30T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-079",
    "slug": "mundial-2026-partido-079",
    "fifaId": "400021520",
    "matchNumber": 79,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1A",
    "awayPlaceholder": "3CEFHI",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Mexico City Stadium",
    "venueName": "Mexico City Stadium",
    "city": "Mexico City",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Mar, 30 Jun 2026 · 9:00 PM ET",
    "kickoffET": "2026-06-30 21:00 ET",
    "kickoffUtc": "2026-07-01T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-080",
    "slug": "mundial-2026-partido-080",
    "fifaId": "400021512",
    "matchNumber": 80,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1L",
    "awayPlaceholder": "3EHIJK",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mié, 1 Jul 2026 · 12:00 PM ET",
    "kickoffET": "2026-07-01 12:00 ET",
    "kickoffUtc": "2026-07-01T16:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-081",
    "slug": "mundial-2026-partido-081",
    "fifaId": "400021524",
    "matchNumber": 81,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1D",
    "awayPlaceholder": "3BEFIJ",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "San Francisco Bay Area Stadium",
    "venueName": "San Francisco Bay Area Stadium",
    "city": "San Francisco Bay Area",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Mié, 1 Jul 2026 · 8:00 PM ET",
    "kickoffET": "2026-07-01 20:00 ET",
    "kickoffUtc": "2026-07-02T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-082",
    "slug": "mundial-2026-partido-082",
    "fifaId": "400021525",
    "matchNumber": 82,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1G",
    "awayPlaceholder": "3AEHIJ",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Seattle Stadium",
    "venueName": "Seattle Stadium",
    "city": "Seattle",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Mié, 1 Jul 2026 · 4:00 PM ET",
    "kickoffET": "2026-07-01 16:00 ET",
    "kickoffUtc": "2026-07-01T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-083",
    "slug": "mundial-2026-partido-083",
    "fifaId": "400021526",
    "matchNumber": 83,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "2K",
    "awayPlaceholder": "2L",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Toronto Stadium",
    "venueName": "Toronto Stadium",
    "city": "Toronto",
    "country": "Canadá",
    "venueTimezone": "America/Toronto",
    "kickoffLabel": "Jue, 2 Jul 2026 · 7:00 PM ET",
    "kickoffET": "2026-07-02 19:00 ET",
    "kickoffUtc": "2026-07-02T23:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-084",
    "slug": "mundial-2026-partido-084",
    "fifaId": "400021519",
    "matchNumber": 84,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1H",
    "awayPlaceholder": "2J",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Jue, 2 Jul 2026 · 3:00 PM ET",
    "kickoffET": "2026-07-02 15:00 ET",
    "kickoffUtc": "2026-07-02T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-085",
    "slug": "mundial-2026-partido-085",
    "fifaId": "400021527",
    "matchNumber": 85,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1B",
    "awayPlaceholder": "3EFGIJ",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Jue, 2 Jul 2026 · 11:00 PM ET",
    "kickoffET": "2026-07-02 23:00 ET",
    "kickoffUtc": "2026-07-03T03:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-086",
    "slug": "mundial-2026-partido-086",
    "fifaId": "400021521",
    "matchNumber": 86,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1J",
    "awayPlaceholder": "2H",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Vie, 3 Jul 2026 · 6:00 PM ET",
    "kickoffET": "2026-07-03 18:00 ET",
    "kickoffUtc": "2026-07-03T22:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-087",
    "slug": "mundial-2026-partido-087",
    "fifaId": "400021517",
    "matchNumber": 87,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "1K",
    "awayPlaceholder": "3DEIJL",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Kansas City Stadium",
    "venueName": "Kansas City Stadium",
    "city": "Kansas City",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Vie, 3 Jul 2026 · 9:30 PM ET",
    "kickoffET": "2026-07-03 21:30 ET",
    "kickoffUtc": "2026-07-04T01:30:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-088",
    "slug": "mundial-2026-partido-088",
    "fifaId": "400021515",
    "matchNumber": 88,
    "stage": "Dieciseisavos de final",
    "stageEn": "Round of 32",
    "group": "Dieciseisavos de final",
    "groupCode": "Dieciseisavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "2D",
    "awayPlaceholder": "2G",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Vie, 3 Jul 2026 · 2:00 PM ET",
    "kickoffET": "2026-07-03 14:00 ET",
    "kickoffUtc": "2026-07-03T18:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-089",
    "slug": "mundial-2026-partido-089",
    "fifaId": "400021533",
    "matchNumber": 89,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W74",
    "awayPlaceholder": "W77",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Philadelphia Stadium",
    "venueName": "Philadelphia Stadium",
    "city": "Philadelphia",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 4 Jul 2026 · 5:00 PM ET",
    "kickoffET": "2026-07-04 17:00 ET",
    "kickoffUtc": "2026-07-04T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-090",
    "slug": "mundial-2026-partido-090",
    "fifaId": "400021530",
    "matchNumber": 90,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W73",
    "awayPlaceholder": "W75",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Houston Stadium",
    "venueName": "Houston Stadium",
    "city": "Houston",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Sáb, 4 Jul 2026 · 1:00 PM ET",
    "kickoffET": "2026-07-04 13:00 ET",
    "kickoffUtc": "2026-07-04T17:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-091",
    "slug": "mundial-2026-partido-091",
    "fifaId": "400021532",
    "matchNumber": 91,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W76",
    "awayPlaceholder": "W78",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Dom, 5 Jul 2026 · 4:00 PM ET",
    "kickoffET": "2026-07-05 16:00 ET",
    "kickoffUtc": "2026-07-05T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-092",
    "slug": "mundial-2026-partido-092",
    "fifaId": "400021531",
    "matchNumber": 92,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W79",
    "awayPlaceholder": "W80",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Mexico City Stadium",
    "venueName": "Mexico City Stadium",
    "city": "Mexico City",
    "country": "México",
    "venueTimezone": "America/Mexico_City",
    "kickoffLabel": "Dom, 5 Jul 2026 · 8:00 PM ET",
    "kickoffET": "2026-07-05 20:00 ET",
    "kickoffUtc": "2026-07-06T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-093",
    "slug": "mundial-2026-partido-093",
    "fifaId": "400021529",
    "matchNumber": 93,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W83",
    "awayPlaceholder": "W84",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Lun, 6 Jul 2026 · 3:00 PM ET",
    "kickoffET": "2026-07-06 15:00 ET",
    "kickoffUtc": "2026-07-06T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-094",
    "slug": "mundial-2026-partido-094",
    "fifaId": "400021534",
    "matchNumber": 94,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W81",
    "awayPlaceholder": "W82",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Seattle Stadium",
    "venueName": "Seattle Stadium",
    "city": "Seattle",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Lun, 6 Jul 2026 · 8:00 PM ET",
    "kickoffET": "2026-07-06 20:00 ET",
    "kickoffUtc": "2026-07-07T00:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-095",
    "slug": "mundial-2026-partido-095",
    "fifaId": "400021528",
    "matchNumber": 95,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W86",
    "awayPlaceholder": "W88",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mar, 7 Jul 2026 · 12:00 PM ET",
    "kickoffET": "2026-07-07 12:00 ET",
    "kickoffUtc": "2026-07-07T16:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-096",
    "slug": "mundial-2026-partido-096",
    "fifaId": "400021535",
    "matchNumber": 96,
    "stage": "Octavos de final",
    "stageEn": "Round of 16",
    "group": "Octavos de final",
    "groupCode": "Octavos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W85",
    "awayPlaceholder": "W87",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "BC Place Vancouver",
    "venueName": "BC Place Vancouver",
    "city": "Vancouver",
    "country": "Canadá",
    "venueTimezone": "America/Vancouver",
    "kickoffLabel": "Mar, 7 Jul 2026 · 4:00 PM ET",
    "kickoffET": "2026-07-07 16:00 ET",
    "kickoffUtc": "2026-07-07T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-097",
    "slug": "mundial-2026-partido-097",
    "fifaId": "400021536",
    "matchNumber": 97,
    "stage": "Cuartos de final",
    "stageEn": "Quarter-final",
    "group": "Cuartos de final",
    "groupCode": "Cuartos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W89",
    "awayPlaceholder": "W90",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Boston Stadium",
    "venueName": "Boston Stadium",
    "city": "Boston",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Jue, 9 Jul 2026 · 4:00 PM ET",
    "kickoffET": "2026-07-09 16:00 ET",
    "kickoffUtc": "2026-07-09T20:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-098",
    "slug": "mundial-2026-partido-098",
    "fifaId": "400021538",
    "matchNumber": 98,
    "stage": "Cuartos de final",
    "stageEn": "Quarter-final",
    "group": "Cuartos de final",
    "groupCode": "Cuartos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W93",
    "awayPlaceholder": "W94",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Los Angeles Stadium",
    "venueName": "Los Angeles Stadium",
    "city": "Los Angeles",
    "country": "Estados Unidos",
    "venueTimezone": "America/Los_Angeles",
    "kickoffLabel": "Vie, 10 Jul 2026 · 3:00 PM ET",
    "kickoffET": "2026-07-10 15:00 ET",
    "kickoffUtc": "2026-07-10T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-099",
    "slug": "mundial-2026-partido-099",
    "fifaId": "400021539",
    "matchNumber": 99,
    "stage": "Cuartos de final",
    "stageEn": "Quarter-final",
    "group": "Cuartos de final",
    "groupCode": "Cuartos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W91",
    "awayPlaceholder": "W92",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 11 Jul 2026 · 5:00 PM ET",
    "kickoffET": "2026-07-11 17:00 ET",
    "kickoffUtc": "2026-07-11T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-100",
    "slug": "mundial-2026-partido-100",
    "fifaId": "400021537",
    "matchNumber": 100,
    "stage": "Cuartos de final",
    "stageEn": "Quarter-final",
    "group": "Cuartos de final",
    "groupCode": "Cuartos de final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W95",
    "awayPlaceholder": "W96",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Kansas City Stadium",
    "venueName": "Kansas City Stadium",
    "city": "Kansas City",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Sáb, 11 Jul 2026 · 9:00 PM ET",
    "kickoffET": "2026-07-11 21:00 ET",
    "kickoffUtc": "2026-07-12T01:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-101",
    "slug": "mundial-2026-partido-101",
    "fifaId": "400021541",
    "matchNumber": 101,
    "stage": "Semifinal",
    "stageEn": "Semi-final",
    "group": "Semifinal",
    "groupCode": "Semifinal",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W97",
    "awayPlaceholder": "W98",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Dallas Stadium",
    "venueName": "Dallas Stadium",
    "city": "Dallas",
    "country": "Estados Unidos",
    "venueTimezone": "America/Chicago",
    "kickoffLabel": "Mar, 14 Jul 2026 · 3:00 PM ET",
    "kickoffET": "2026-07-14 15:00 ET",
    "kickoffUtc": "2026-07-14T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-102",
    "slug": "mundial-2026-partido-102",
    "fifaId": "400021540",
    "matchNumber": 102,
    "stage": "Semifinal",
    "stageEn": "Semi-final",
    "group": "Semifinal",
    "groupCode": "Semifinal",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W99",
    "awayPlaceholder": "W100",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Atlanta Stadium",
    "venueName": "Atlanta Stadium",
    "city": "Atlanta",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Mié, 15 Jul 2026 · 3:00 PM ET",
    "kickoffET": "2026-07-15 15:00 ET",
    "kickoffUtc": "2026-07-15T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-103",
    "slug": "mundial-2026-partido-103",
    "fifaId": "400021542",
    "matchNumber": 103,
    "stage": "Tercer puesto",
    "stageEn": "Play-off for third place",
    "group": "Tercer puesto",
    "groupCode": "Tercer puesto",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "RU101",
    "awayPlaceholder": "RU102",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "Miami Stadium",
    "venueName": "Miami Stadium",
    "city": "Miami",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Sáb, 18 Jul 2026 · 5:00 PM ET",
    "kickoffET": "2026-07-18 17:00 ET",
    "kickoffUtc": "2026-07-18T21:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  },
  {
    "id": "mundial-2026-partido-104",
    "slug": "mundial-2026-partido-104",
    "fifaId": "400021543",
    "matchNumber": 104,
    "stage": "Final",
    "stageEn": "Final",
    "group": "Final",
    "groupCode": "Final",
    "homeTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "awayTeam": {
      "name": "Por definir",
      "flagEmoji": "🏳️"
    },
    "homeTeamCode": null,
    "awayTeamCode": null,
    "homePlaceholder": "W101",
    "awayPlaceholder": "W102",
    "homeFlag": "🏳️",
    "awayFlag": "🏳️",
    "venue": "New York/New Jersey Stadium",
    "venueName": "New York/New Jersey Stadium",
    "city": "New Jersey",
    "country": "Estados Unidos",
    "venueTimezone": "America/New_York",
    "kickoffLabel": "Dom, 19 Jul 2026 · 3:00 PM ET",
    "kickoffET": "2026-07-19 15:00 ET",
    "kickoffUtc": "2026-07-19T19:00:00Z",
    "status": "scheduled",
    "sourceLabel": SOURCE_LABEL,
    "sourceCheckedAt": SOURCE_CHECKED_AT
  }
] as WorldCupMatch[];

const localizedTeamNames: Record<string, Record<Locale, string>> = {
  "MEX": {
    "es": "México",
    "en": "Mexico"
  },
  "RSA": {
    "es": "Sudáfrica",
    "en": "South Africa"
  },
  "KOR": {
    "es": "Corea del Sur",
    "en": "South Korea"
  },
  "CZE": {
    "es": "Chequia",
    "en": "Czechia"
  },
  "CAN": {
    "es": "Canadá",
    "en": "Canada"
  },
  "BIH": {
    "es": "Bosnia y Herzegovina",
    "en": "Bosnia and Herzegovina"
  },
  "QAT": {
    "es": "Qatar",
    "en": "Qatar"
  },
  "SUI": {
    "es": "Suiza",
    "en": "Switzerland"
  },
  "BRA": {
    "es": "Brasil",
    "en": "Brazil"
  },
  "MAR": {
    "es": "Marruecos",
    "en": "Morocco"
  },
  "HAI": {
    "es": "Haití",
    "en": "Haiti"
  },
  "SCO": {
    "es": "Escocia",
    "en": "Scotland"
  },
  "USA": {
    "es": "Estados Unidos",
    "en": "United States"
  },
  "PAR": {
    "es": "Paraguay",
    "en": "Paraguay"
  },
  "AUS": {
    "es": "Australia",
    "en": "Australia"
  },
  "TUR": {
    "es": "Turquía",
    "en": "Türkiye"
  },
  "GER": {
    "es": "Alemania",
    "en": "Germany"
  },
  "CUW": {
    "es": "Curazao",
    "en": "Curaçao"
  },
  "CIV": {
    "es": "Costa de Marfil",
    "en": "Ivory Coast"
  },
  "ECU": {
    "es": "Ecuador",
    "en": "Ecuador"
  },
  "NED": {
    "es": "Países Bajos",
    "en": "Netherlands"
  },
  "JPN": {
    "es": "Japón",
    "en": "Japan"
  },
  "SWE": {
    "es": "Suecia",
    "en": "Sweden"
  },
  "TUN": {
    "es": "Túnez",
    "en": "Tunisia"
  },
  "BEL": {
    "es": "Bélgica",
    "en": "Belgium"
  },
  "EGY": {
    "es": "Egipto",
    "en": "Egypt"
  },
  "IRN": {
    "es": "Irán",
    "en": "Iran"
  },
  "NZL": {
    "es": "Nueva Zelanda",
    "en": "New Zealand"
  },
  "ESP": {
    "es": "España",
    "en": "Spain"
  },
  "CPV": {
    "es": "Cabo Verde",
    "en": "Cape Verde"
  },
  "KSA": {
    "es": "Arabia Saudita",
    "en": "Saudi Arabia"
  },
  "URU": {
    "es": "Uruguay",
    "en": "Uruguay"
  },
  "FRA": {
    "es": "Francia",
    "en": "France"
  },
  "SEN": {
    "es": "Senegal",
    "en": "Senegal"
  },
  "IRQ": {
    "es": "Irak",
    "en": "Iraq"
  },
  "NOR": {
    "es": "Noruega",
    "en": "Norway"
  },
  "ARG": {
    "es": "Argentina",
    "en": "Argentina"
  },
  "ALG": {
    "es": "Argelia",
    "en": "Algeria"
  },
  "AUT": {
    "es": "Austria",
    "en": "Austria"
  },
  "JOR": {
    "es": "Jordania",
    "en": "Jordan"
  },
  "POR": {
    "es": "Portugal",
    "en": "Portugal"
  },
  "COD": {
    "es": "RD Congo",
    "en": "DR Congo"
  },
  "UZB": {
    "es": "Uzbekistán",
    "en": "Uzbekistan"
  },
  "COL": {
    "es": "Colombia",
    "en": "Colombia"
  },
  "ENG": {
    "es": "Inglaterra",
    "en": "England"
  },
  "CRO": {
    "es": "Croacia",
    "en": "Croatia"
  },
  "GHA": {
    "es": "Ghana",
    "en": "Ghana"
  },
  "PAN": {
    "es": "Panamá",
    "en": "Panama"
  }
};

const localizedStages: Record<string, Record<Locale, string>> = {
  "Fase de grupos": { es: "Fase de grupos", en: "Group Stage" },
  "Dieciseisavos de final": { es: "Dieciseisavos de final", en: "Round of 32" },
  "Octavos de final": { es: "Octavos de final", en: "Round of 16" },
  "Cuartos de final": { es: "Cuartos de final", en: "Quarter-finals" },
  Semifinal: { es: "Semifinal", en: "Semi-finals" },
  "Tercer puesto": { es: "Tercer puesto", en: "Third-Place Play-off" },
  Final: { es: "Final", en: "Final" },
};

const localizedCountries: Record<string, Record<Locale, string>> = {
  "Canadá": { es: "Canadá", en: "Canada" },
  "Estados Unidos": { es: "Estados Unidos", en: "United States" },
  "México": { es: "México", en: "Mexico" },
};

function localizeGroupCode(groupCode: string, locale: Locale) {
  const groupMatch = groupCode.match(/^Grupo ([A-L])$/);

  if (groupMatch) {
    return locale === "es" ? groupCode : "Group " + groupMatch[1];
  }

  return localizedStages[groupCode as WorldCupStage]?.[locale] ?? groupCode;
}

export function getLocalizedTeamName(teamCode: string | null | undefined, locale: Locale) {
  if (!teamCode) return locale === "es" ? "Por definir" : "TBD";
  return localizedTeamNames[teamCode]?.[locale] ?? teamCode;
}

export function getLocalizedPlaceholder(placeholder: string | undefined, locale: Locale) {
  if (!placeholder) return locale === "es" ? "Por definir" : "TBD";

  const groupWinner = placeholder.match(/^1([A-L])$/);
  if (groupWinner) {
    return locale === "es" ? "Ganador Grupo " + groupWinner[1] : "Winner Group " + groupWinner[1];
  }

  const groupRunnerUp = placeholder.match(/^2([A-L])$/);
  if (groupRunnerUp) {
    return locale === "es" ? "Segundo Grupo " + groupRunnerUp[1] : "Runner-up Group " + groupRunnerUp[1];
  }

  if (/^3[A-L]+$/.test(placeholder)) {
    return locale === "es" ? "Mejor tercero" : "Best Third-Place Team";
  }

  const winnerMatch = placeholder.match(/^W(\d+)$/);
  if (winnerMatch) {
    return locale === "es" ? "Ganador Partido " + winnerMatch[1] : "Winner Match " + winnerMatch[1];
  }

  const runnerUpMatch = placeholder.match(/^RU(\d+)$/);
  if (runnerUpMatch) {
    return locale === "es" ? "Perdedor Partido " + runnerUpMatch[1] : "Loser Match " + runnerUpMatch[1];
  }

  return locale === "es" ? "Por definir" : "TBD";
}

export function localizeWorldCupMatch(match: WorldCupMatch, locale: Locale): WorldCupMatch {
  const homeName = match.homeTeamCode
    ? getLocalizedTeamName(match.homeTeamCode, locale)
    : getLocalizedPlaceholder(match.homePlaceholder, locale);
  const awayName = match.awayTeamCode
    ? getLocalizedTeamName(match.awayTeamCode, locale)
    : getLocalizedPlaceholder(match.awayPlaceholder, locale);

  return {
    ...match,
    stage: localizedStages[match.stage]?.[locale] ?? match.stage,
    group: localizeGroupCode(match.group, locale),
    groupCode: localizeGroupCode(match.groupCode, locale),
    homeTeam: { ...match.homeTeam, name: homeName },
    awayTeam: { ...match.awayTeam, name: awayName },
    country: localizedCountries[match.country]?.[locale] ?? match.country,
  };
}

export function localizeWorldCupMatches(matches: readonly WorldCupMatch[], locale: Locale) {
  return matches.map((match) => localizeWorldCupMatch(match, locale));
}

export function localizeWorldCupGroupStandings(standings: readonly GroupStanding[], locale: Locale): GroupStanding[] {
  const namesBySpanishName = new Map(
    Object.values(localizedTeamNames).map((names) => [names.es, names[locale]]),
  );

  return standings.map((group) => ({
    ...group,
    groupName: localizeGroupCode(group.groupName, locale),
    teams: group.teams.map((team) => ({
      ...team,
      teamName: namesBySpanishName.get(team.teamName) ?? team.teamName,
    })),
  }));
}
