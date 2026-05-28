import BrandHeader from "@/components/BrandHeader";
import GroupStandingsTable from "@/components/GroupStandingsTable";
import SimpleNav from "@/components/SimpleNav";
import { mockWorldCupGroupStandings } from "@/lib/mock-group-standings";

export default function StandingsPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-6 text-white md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-white/10 pb-4">
          <SimpleNav compact />
        </div>

        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-md border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">
              Tablas del Mundial
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Clasificacion de grupos
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Mira quien sube, quien sufre y quien necesita el milagro sin salir del Oraculo.
            </p>
          </div>

          <div className="w-fit rounded-md border border-amber-200/25 bg-amber-300/10 px-3 py-2 text-xs font-black text-amber-100">
            Datos demo locales
          </div>
        </header>

        <section className="mt-6 grid gap-5">
          {mockWorldCupGroupStandings.map((group) => (
            <GroupStandingsTable group={group} key={group.groupId} />
          ))}
        </section>
      </div>
    </main>
  );
}
