import BrandHeader from "@/components/BrandHeader";
import MatchCard from "@/components/MatchCard";
import SimpleNav from "@/components/SimpleNav";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

function dateKeyInEasternTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).format(date);
}

export default async function TodayPage() {
  const dict = await getCurrentDictionary();
  const matches = [...worldCup2026Matches].sort((left, right) => {
    return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
  });
  const now = new Date();
  const todayKey = dateKeyInEasternTime(now);
  const todayMatches = matches.filter((match) => {
    return dateKeyInEasternTime(new Date(match.kickoffUtc)) === todayKey;
  });
  const upcomingMatches = matches.filter((match) => new Date(match.kickoffUtc).getTime() > now.getTime());
  const hasTodayMatches = todayMatches.length > 0;
  const visibleMatches = hasTodayMatches ? todayMatches : upcomingMatches.slice(0, 3);
  const nextFeaturedMatch = upcomingMatches[0];

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-6 text-white md:px-10 md:py-8">
      <div className="mx-auto max-w-5xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-white/10 pb-4">
          <SimpleNav compact />
        </div>

        <header className="flex flex-col gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
              {dict.today.eyebrow}
            </p>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              {hasTodayMatches ? dict.today.titleToday : dict.today.titleFallback}
              <span className="rounded-full border border-amber-200/25 bg-amber-300/10 px-2 py-0.5 text-xs font-black text-amber-100">
                {hasTodayMatches ? dict.today.badge : dict.today.fallbackBadge}
              </span>
            </h1>
            <p className="mt-2 text-sm font-black text-cyan-100">
              {hasTodayMatches ? dict.today.actionLine : dict.today.fallbackActionLine}
            </p>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300">
              {hasTodayMatches ? dict.today.todayText : dict.today.fallbackText}
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-emerald-200/20 bg-emerald-300/10 p-4">
            <p className="text-xs font-black uppercase text-emerald-100">
              {hasTodayMatches ? dict.today.livePanelLabel : dict.today.featuredSectionTitle}
            </p>
            <p className="mt-2 text-2xl font-black leading-none text-white">
              {hasTodayMatches
                ? dict.today.todayCount.replace("{count}", String(todayMatches.length))
                : dict.today.featuredCount.replace("{count}", String(visibleMatches.length))}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {hasTodayMatches ? dict.today.livePanelText : dict.today.featuredPanelText}
            </p>
          </div>
          <div className="rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-4">
            <p className="text-xs font-black uppercase text-cyan-100">{dict.today.nextKickoffLabel}</p>
            <p className="mt-2 text-lg font-black leading-tight text-white">
              {nextFeaturedMatch
                ? `${nextFeaturedMatch.homeTeam.flagEmoji} ${nextFeaturedMatch.homeTeam.name} vs ${nextFeaturedMatch.awayTeam.flagEmoji} ${nextFeaturedMatch.awayTeam.name}`
                : dict.today.emptyTitle}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-300">
              {nextFeaturedMatch ? nextFeaturedMatch.kickoffLabel : dict.today.emptyText}
            </p>
          </div>
        </section>

        {visibleMatches.length > 0 ? (
          <section className="mt-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white">
                  {hasTodayMatches ? dict.today.liveSectionTitle : dict.today.featuredSectionTitle}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {hasTodayMatches ? dict.today.liveSectionText : dict.today.featuredSectionText}
                </p>
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
            {visibleMatches.map((match) => (
              <MatchCard key={match.id} match={match} variant="compact" />
            ))}
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-lg border border-white/10 bg-slate-950/75 p-5 text-sm text-slate-300">
            <p className="font-black text-white">{dict.today.emptyTitle}</p>
            <p className="mt-2">{dict.today.emptyText}</p>
          </section>
        )}
      </div>
    </main>
  );
}
