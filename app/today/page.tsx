import Link from "next/link";
import { connection } from "next/server";
import BrandHeader from "@/components/BrandHeader";
import MatchCard from "@/components/MatchCard";
import OracleAskBox from "@/components/OracleAskBox";
import SimpleNav from "@/components/SimpleNav";
import SupportContactBlock from "@/components/SupportContactBlock";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import { getCachedPredictionCount } from "@/lib/prediction-count";
import { getTournamentReality, type TournamentReality } from "@/lib/tournament-reality";

function daysUntilWorldCup(now: Date) {
  const opener = new Date("2026-06-11T19:00:00Z");
  const diff = opener.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function TodayPage() {
  await connection();

  const dict = await getCurrentDictionary();
  const locale = await getCurrentLocale();
  const now = new Date();
  let tournamentState: TournamentReality;
  try {
    tournamentState = await getTournamentReality(locale, now);
  } catch (error) {
    console.error("[today-page] could not load live tournament state", error);
    tournamentState = await getTournamentReality(locale, now, []);
  }

  const daysLeft = daysUntilWorldCup(now);
  const predictionCount = await getCachedPredictionCount();
  const todayMatches = [
    ...tournamentState.todayFinishedMatches,
    ...tournamentState.liveMatches,
    ...tournamentState.todayFinishedPendingResultMatches,
    ...tournamentState.todayUpcomingMatches,
  ].sort((left, right) => new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime());
  const visibleMatches = todayMatches.length > 0
    ? todayMatches
    : tournamentState.nextMatch
      ? [tournamentState.nextMatch]
      : [];
  const mobileVisibleMatches = visibleMatches.slice(0, 3);
  const nextFeaturedMatch = tournamentState.liveMatches[0] ?? tournamentState.nextMatch;
  const latestFinishedMatch = tournamentState.latestFinishedMatch;
  const hasTodayMatches = todayMatches.length > 0;
  const todaySummary = dict.today.todayStateSummary
    .replace("{finished}", String(tournamentState.todayFinishedMatches.length))
    .replace("{live}", String(tournamentState.liveMatches.length))
    .replace("{upcoming}", String(tournamentState.todayUpcomingMatches.length));

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70 md:rounded-2xl">
          <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-sky-500 to-red-600 md:h-2" />
          <div className="grid gap-3 p-4 md:grid-cols-[1.25fr_0.75fr] md:gap-6 md:p-8">
            <div>
              <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 md:px-3 md:py-1 md:text-[11px] md:tracking-[0.18em]">
                {dict.today.heroBadge}
              </p>

              <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[0.95] tracking-tight text-slate-950 md:mt-5 md:text-6xl">
                {dict.today.heroTitle}
                <span className="block text-emerald-700">{dict.today.heroTitleAccent}</span>
              </h1>

              <p className="mt-3 max-w-2xl line-clamp-2 text-sm font-bold leading-5 text-slate-700 md:mt-5 md:line-clamp-none md:text-lg md:leading-7">
                {dict.today.heroText}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
                <a
                  href="#partidos"
                  className="rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700 md:px-5 md:py-3 md:text-sm"
                >
                  {dict.today.heroMatchesCta}
                </a>
                <a
                  href="#tribuna"
                  className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-50 md:px-5 md:py-3 md:text-sm"
                >
                  {dict.today.heroStandCta}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-[0.72fr_1.28fr] gap-2 md:grid-cols-1 md:gap-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 md:p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.12em] text-amber-700 md:text-xs md:tracking-[0.14em]">
                  {latestFinishedMatch ? dict.today.latestResultLabel : dict.today.countdownLabel}
                </p>
                {latestFinishedMatch ? (
                  <>
                    <p className="mt-0.5 text-xl font-black leading-tight text-slate-950 md:mt-3 md:text-3xl">
                      {latestFinishedMatch.homeTeam.name} {latestFinishedMatch.homeScore} - {latestFinishedMatch.awayScore} {latestFinishedMatch.awayTeam.name}
                    </p>
                    <p className="mt-0.5 text-[0.65rem] font-bold uppercase leading-tight text-slate-600 md:mt-2 md:text-sm">
                      {dict.today.finalLabel}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-0.5 text-3xl font-black leading-none text-slate-950 md:mt-3 md:text-6xl">{daysLeft}</p>
                    <p className="mt-0.5 text-[0.65rem] font-bold leading-tight text-slate-600 md:mt-2 md:text-sm">
                      {dict.today.countdownText}
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-lg border border-sky-200 bg-sky-50 p-2.5 md:p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.12em] text-sky-700 md:text-xs md:tracking-[0.14em]">
                  {nextFeaturedMatch?.status === "live" ? dict.today.liveLabel : dict.today.nextMatchLabel}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs font-black leading-tight text-slate-950 md:mt-3 md:line-clamp-none md:text-xl">
                  {nextFeaturedMatch
                    ? `${nextFeaturedMatch.homeTeam.flagEmoji} ${nextFeaturedMatch.homeTeam.name} vs ${nextFeaturedMatch.awayTeam.flagEmoji} ${nextFeaturedMatch.awayTeam.name}`
                    : dict.today.emptyTitle}
                </p>
                <p className="mt-0.5 text-[0.65rem] font-bold leading-tight text-slate-600 md:mt-2 md:text-sm">
                  {nextFeaturedMatch ? nextFeaturedMatch.kickoffLabel : dict.today.emptyText}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-sky-300/30 bg-slate-950 p-4 text-white shadow-lg shadow-slate-300/40 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <p className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
                {dict.today.oracleEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-black leading-none text-white md:text-3xl">
                {dict.today.oracleTitle}
              </h2>
              <p className="mt-2 text-sm font-bold leading-5 text-slate-200 md:text-base">
                {dict.today.oracleText}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-center">
              {dict.today.oracleQuickLinks.map(([icon, label, href]) => (
                <a
                  key={label}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-black text-white transition hover:bg-white/10"
                  href={href}
                >
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </a>
              ))}
            </div>
            <a
              href="#tribuna"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/20 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-sky-50 md:w-auto md:min-w-56"
            >
              {dict.today.oracleCta}
            </a>
          </div>
        </section>

        <OracleAskBox />

        <SupportContactBlock className="mt-5" />

        <section className="mt-5 hidden rounded-lg border border-emerald-200 bg-emerald-50 p-4 md:block">
          <p className="text-xs font-black uppercase text-emerald-700">
            {dict.today.livePanelLabel}
          </p>
          <p className="mt-2 text-2xl font-black leading-none text-slate-950">
            {hasTodayMatches ? todaySummary : dict.today.featuredCount.replace("{count}", String(visibleMatches.length))}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            {hasTodayMatches ? dict.today.livePanelText : dict.today.lineupText}
          </p>
        </section>

        {visibleMatches.length > 0 ? (
          <section id="partidos" className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {hasTodayMatches ? dict.today.liveSectionTitle : dict.today.upcomingTitle}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {hasTodayMatches ? todaySummary : dict.today.upcomingText}
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:hidden">
              {mobileVisibleMatches.map((match) => (
                <MatchCard key={match.id} match={match} variant="compact" />
              ))}
              {visibleMatches.length > mobileVisibleMatches.length ? (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
                  href="/upcoming"
                >
                  {dict.today.viewAllMatches}
                </Link>
              ) : null}
            </div>
            <div className="hidden gap-3 md:grid lg:grid-cols-2">
              {visibleMatches.map((match) => (
                <MatchCard key={match.id} match={match} variant="compact" />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p className="font-black text-slate-950">{dict.today.emptyTitle}</p>
            <p className="mt-2">{dict.today.emptyText}</p>
          </section>
        )}

        <section className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase text-amber-700">{dict.today.chantLabel}</p>
          <p className="mt-2 text-lg font-black leading-tight text-slate-950">
            {dict.today.chantTitle}
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-600">
            {dict.today.chantText}
          </p>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
                {dict.today.socialProofEyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
                {dict.today.socialProofTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                {dict.today.socialProofText}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-3xl font-black text-slate-950">{predictionCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                {dict.today.demoPredictionsLabel}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {dict.today.demoPredictions.map(([name, pick, comment]) => (
              <article key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">{name}</p>
                <p className="mt-3 text-lg font-black text-slate-950">{pick}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">“{comment}”</p>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-500">
            {dict.today.socialProofFooter}
          </p>
        </section>
      </div>
    </main>
  );
}
