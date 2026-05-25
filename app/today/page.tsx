import BrandHeader from "@/components/BrandHeader";
import MatchCard from "@/components/MatchCard";
import SimpleNav from "@/components/SimpleNav";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

export default function TodayPage() {
  const matches = [...worldCup2026Matches].sort((left, right) => {
    return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.13),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(251,191,36,0.1),transparent_28%),#07111f] px-5 py-6 text-white md:px-10 md:py-8">
      <div className="mx-auto max-w-5xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-white/10 pb-4">
          <SimpleNav compact />
        </div>

        <header className="flex flex-col gap-3">
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              Partidos del Mundial 2026
              <span className="rounded-full border border-amber-200/25 bg-amber-300/10 px-2 py-0.5 text-xs font-black text-amber-100">
                Calendario inicial
              </span>
            </h1>
            <p className="mt-2 text-sm font-black text-cyan-100">
              Elige marcador. Reta al grupo. Comparte por WhatsApp.
            </p>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Partidos reales cargados como subset inicial · pronósticos demo · hoy se juega con amigos.
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </section>
      </div>
    </main>
  );
}
