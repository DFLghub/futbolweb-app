import BrandHeader from "@/components/BrandHeader";
import GroupStandingsSelector from "@/components/GroupStandingsSelector";
import SimpleNav from "@/components/SimpleNav";
import { groupCodeToStandingGroupId } from "@/lib/group-code";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import { mockWorldCupGroupStandings } from "@/lib/mock-group-standings";
import { getCachedRealGroupStandings } from "@/lib/real-group-standings";
import { localizeWorldCupGroupStandings } from "@/lib/world-cup-2026-matches";

type StandingsPageProps = {
  searchParams: Promise<{
    group?: string;
  }>;
};

export default async function StandingsPage({ searchParams }: StandingsPageProps) {
  const dict = await getCurrentDictionary();
  const locale = await getCurrentLocale();
  const { group } = await searchParams;
  const initialGroupId = groupCodeToStandingGroupId(group);
  let standings = mockWorldCupGroupStandings;

  try {
    standings = await getCachedRealGroupStandings();
  } catch (error) {
    console.error("[standings-page] fallback to mock standings", error);
  }

  standings = localizeWorldCupGroupStandings(standings, locale);

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <header className="border-b border-slate-200 pb-6">
          <div>
            <p className="mb-3 inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
              {dict.standings.eyebrow}
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {dict.standings.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {dict.standings.description}
            </p>
          </div>
        </header>

        <GroupStandingsSelector groups={standings} initialGroupId={initialGroupId} />
      </div>
    </main>
  );
}
