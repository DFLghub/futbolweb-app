import type { Locale } from "@/lib/i18n";
import { getRanking } from "@/lib/real-ranking";
import { getTournamentReality, type RealityMatch, type TournamentReality } from "@/lib/tournament-reality";

export type RealityHub = {
  generatedAt: string;
  reality: TournamentReality;
  rankingLeader: Awaited<ReturnType<typeof getRanking>>[number] | null;
  tickerItems: string[];
};

function formatMatchScore(match: RealityMatch) {
  return `${match.homeTeam.flagEmoji} ${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.name}`;
}

function formatMatchFixture(match: RealityMatch) {
  return `${match.homeTeam.flagEmoji} ${match.homeTeam.name} vs ${match.awayTeam.flagEmoji} ${match.awayTeam.name} ${match.kickoffLabel}`;
}

function fallbackTickerItems(locale: Locale) {
  if (locale === "en") {
    return [
      "FutbolWeb is live with confirmed results, fixtures, and ranking.",
      "Ask the Oracle about matches, groups, rules, or the leaderboard.",
      "Copy your summary and share it in WhatsApp.",
    ];
  }

  return [
    "FutbolWeb está vivo con resultados confirmados, calendario y ranking.",
    "Pregúntale al Oráculo por partidos, grupos, reglas o ranking.",
    "Copia tu resumen y muévelo por WhatsApp.",
  ];
}

function buildTickerItems(locale: Locale, reality: TournamentReality, leader: RealityHub["rankingLeader"]) {
  const items: string[] = [];

  if (reality.latestFinishedMatch) {
    items.push(`${locale === "en" ? "Latest" : "Última hora"}: ${formatMatchScore(reality.latestFinishedMatch)}`);
  }

  if (leader) {
    const groupLabel = leader.groupCode
      ? `${locale === "en" ? " in " : " en "}${leader.groupCode}`
      : "";
    items.push(`${locale === "en" ? "Leader" : "Líder"}: ${leader.name}${groupLabel} · ${leader.points} pts`);
  }

  if (reality.nextMatch) {
    items.push(`${locale === "en" ? "Next" : "Próximo"}: ${formatMatchFixture(reality.nextMatch)}`);
  }

  items.push(locale === "en" ? "Ask the Oracle" : "Pregúntale al Oráculo");

  return items.length > 1 ? items : fallbackTickerItems(locale);
}

export async function getRealityHub(locale: Locale): Promise<RealityHub> {
  let reality: TournamentReality;

  try {
    reality = await getTournamentReality(locale);
  } catch (error) {
    console.error("[reality-hub] could not load tournament reality", error);
    reality = await getTournamentReality(locale, new Date(), []);
  }

  const ranking = await getRanking();
  const rankingLeader = ranking[0] ?? null;

  return {
    generatedAt: new Date().toISOString(),
    reality,
    rankingLeader,
    tickerItems: buildTickerItems(locale, reality, rankingLeader),
  };
}

export async function getRealityHubLiveContext(question: string, locale: Locale): Promise<string> {
  const hub = await getRealityHub(locale);
  const liveOrRecent = hub.reality.liveMatches.length > 0
    ? hub.reality.liveMatches.slice(0, 3).map(formatMatchFixture)
    : hub.reality.latestFinishedMatch
      ? [formatMatchScore(hub.reality.latestFinishedMatch)]
      : [];

  const nextLine = hub.reality.nextMatch
    ? `${locale === "en" ? "Next match" : "Próximo partido"}: ${formatMatchFixture(hub.reality.nextMatch)}`
    : null;
  const leaderLine = hub.rankingLeader
    ? `${locale === "en" ? "Ranking leader" : "Líder del ranking"}: ${hub.rankingLeader.name} · ${hub.rankingLeader.points} pts${hub.rankingLeader.groupCode ? ` · ${hub.rankingLeader.groupCode}` : ""}`
    : null;
  const sourceLine = locale === "en"
    ? "Live ESPN data was unavailable or empty. FutbolWeb is using confirmed match_results plus the loaded FIFA fixture list; check ESPN or FIFA for minute-by-minute play."
    : "ESPN en vivo no devolvió datos confiables o vino vacío. FutbolWeb usa match_results confirmados y el calendario FIFA cargado; para minuto a minuto revisa ESPN o FIFA.";

  return [
    sourceLine,
    liveOrRecent.length > 0 ? liveOrRecent.join("\n") : null,
    nextLine,
    leaderLine,
    question.trim() ? null : locale === "en" ? "Ask about a team or match for a narrower answer." : "Pregunta por un equipo o partido para afinar la respuesta.",
  ].filter(Boolean).join("\n");
}
