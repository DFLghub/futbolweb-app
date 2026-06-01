import BrandHeader from "@/components/BrandHeader";
import GroupStandingsSelector from "@/components/GroupStandingsSelector";
import SimpleNav from "@/components/SimpleNav";
import { groupCodeToStandingGroupId } from "@/lib/group-code";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { mockWorldCupGroupStandings } from "@/lib/mock-group-standings";

type StandingsPageProps = {
  searchParams: Promise<{
    group?: string;
  }>;
};

export default async function StandingsPage({ searchParams }: StandingsPageProps) {
  const dict = await getCurrentDictionary();
  const { group } = await searchParams;
  const initialGroupId = groupCodeToStandingGroupId(group);

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
              {dict.standings.eyebrow}
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {dict.standings.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {dict.standings.description}
            </p>
          </div>
        </header>

        <GroupStandingsSelector groups={mockWorldCupGroupStandings} initialGroupId={initialGroupId} />
      </div>
    </main>
  );
}
