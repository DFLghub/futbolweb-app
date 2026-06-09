import BrandHeader from "@/components/BrandHeader";
import MatchCard from "@/components/MatchCard";
import SimpleNav from "@/components/SimpleNav";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import { localizeWorldCupMatches, worldCup2026Matches } from "@/lib/world-cup-2026-matches";

export default async function UpcomingPage() {
  const dict = await getCurrentDictionary();
  const locale = await getCurrentLocale();
  const now = new Date();
  const matches = localizeWorldCupMatches(worldCup2026Matches, locale)
    .filter((match) => new Date(match.kickoffUtc).getTime() > now.getTime())
    .sort((left, right) => {
      return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
    });
  const firstMatch = matches[0];
  const lastMatch = matches[matches.length - 1];

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-5xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <header className="flex flex-col gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
              {dict.today.calendarEyebrow}
            </p>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              {dict.today.calendarTitle}
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-black text-sky-700">
                {dict.today.calendarBadge.replace("{count}", String(matches.length))}
              </span>
            </h1>
            <p className="mt-2 text-sm font-black text-slate-800">
              {dict.today.calendarActionLine}
            </p>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
              {dict.today.calendarText}
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-3 border-y border-slate-200 py-4 text-xs text-slate-600 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-black uppercase text-slate-500">{dict.today.calendarLoadedLabel}</p>
            <p className="mt-1 text-lg font-black text-slate-950">{matches.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-black uppercase text-slate-500">{dict.today.calendarStartsLabel}</p>
            <p className="mt-1 font-black text-slate-950">{firstMatch?.kickoffLabel ?? dict.today.emptyTitle}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-black uppercase text-slate-500">{dict.today.calendarEndsLabel}</p>
            <p className="mt-1 font-black text-slate-950">{lastMatch?.kickoffLabel ?? dict.today.emptyTitle}</p>
          </div>
        </section>

        {matches.length > 0 ? (
          <section className="mt-5 grid gap-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} variant="calendar" />
            ))}
          </section>
        ) : (
          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p className="font-black text-slate-950">{dict.today.emptyTitle}</p>
            <p className="mt-2">{dict.today.emptyText}</p>
          </section>
        )}
      </div>
    </main>
  );
}
