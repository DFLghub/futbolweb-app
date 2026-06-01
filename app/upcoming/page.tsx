import BrandHeader from "@/components/BrandHeader";
import MatchCard from "@/components/MatchCard";
import SimpleNav from "@/components/SimpleNav";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

export default async function UpcomingPage() {
  const dict = await getCurrentDictionary();
  const now = new Date();
  const matches = [...worldCup2026Matches]
    .filter((match) => new Date(match.kickoffUtc).getTime() > now.getTime())
    .sort((left, right) => {
      return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
    });

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-6 text-white md:px-10 md:py-8">
      <div className="mx-auto max-w-5xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-white/10 pb-4">
          <SimpleNav compact />
        </div>

        <header className="flex flex-col gap-3">
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              {dict.today.titleUpcoming}
              <span className="rounded-full border border-amber-200/25 bg-amber-300/10 px-2 py-0.5 text-xs font-black text-amber-100">
                {dict.today.badge}
              </span>
            </h1>
            <p className="mt-2 text-sm font-black text-cyan-100">
              {dict.today.actionLine}
            </p>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300">
              {dict.today.upcomingText}
            </p>
          </div>
        </header>

        {matches.length > 0 ? (
          <section className="mt-5 grid gap-4 lg:grid-cols-2">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
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
