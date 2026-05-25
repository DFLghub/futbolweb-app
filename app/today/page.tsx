import MatchCard from "@/components/MatchCard";
import { mockMatches } from "@/lib/mock-football-data";

export default function TodayPage() {
  const matches = [...mockMatches]
    .sort((left, right) => {
      return new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime();
    })
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
              Modo Mundial activo
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Modo Mundial — Pronósticos
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Elige tus pronósticos antes del cierre y comparte el reto con tu grupo.
            </p>
          </div>
          <div className="w-fit rounded-md border border-amber-200/25 bg-amber-300/10 px-3 py-2 text-sm font-bold text-amber-100">
            Demo local — datos de prueba
          </div>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </section>
      </div>
    </main>
  );
}
