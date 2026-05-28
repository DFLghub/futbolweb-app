import BrandHeader from "@/components/BrandHeader";
import GroupStandingsSelector from "@/components/GroupStandingsSelector";
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

        <header className="border-b border-white/10 pb-6">
          <div>
            <p className="mb-3 inline-flex rounded-md border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">
              Mundial 2026
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Grupos
            </h1>
          </div>
        </header>

        <GroupStandingsSelector groups={mockWorldCupGroupStandings} />
      </div>
    </main>
  );
}
