import BrandHeader from "@/components/BrandHeader";
import RankingTable from "@/components/RankingTable";
import SimpleNav from "@/components/SimpleNav";
import { mockRankingParticipants } from "@/lib/mock-ranking-data";

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-4" />
        <SimpleNav />

        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Ranking del Grupo</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Zona de gloria, zona de pelea y zona roja.
            </p>
          </div>
          <div className="w-fit rounded-md border border-amber-200/25 bg-amber-300/10 px-3 py-2 text-sm font-bold text-amber-100">
            Demo local — datos de prueba
          </div>
        </header>

        <RankingTable participants={mockRankingParticipants} />
      </div>
    </main>
  );
}
