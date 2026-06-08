import BrandHeader from "@/components/BrandHeader";
import PredictionGroupStandingsSelector from "@/components/PredictionGroupStandingsSelector";
import PredictionGroupStandingsTable from "@/components/PredictionGroupStandingsTable";
import SimpleNav from "@/components/SimpleNav";
import { SOLISTA_GROUP_CODE } from "@/lib/group-code";
import { getCurrentDictionary } from "@/lib/i18n-server";
import {
  getPredictionGroupStandings,
  getPredictionStandingGroupCodes,
} from "@/lib/prediction-group-standings";

export const revalidate = 60;

type GroupStandingsPageProps = {
  searchParams: Promise<{
    group?: string;
  }>;
};

function normalizeRequestedGroupCode(groupCode: string | undefined) {
  const cleaned = groupCode?.replace(/\s+/g, " ").trim();
  return cleaned || SOLISTA_GROUP_CODE;
}

export default async function GroupStandingsPage({ searchParams }: GroupStandingsPageProps) {
  const dict = await getCurrentDictionary();
  const { group } = await searchParams;
  const requestedGroupCode = normalizeRequestedGroupCode(group);
  const groups = await getPredictionStandingGroupCodes();
  const groupCodes = groups.includes(requestedGroupCode)
    ? groups
    : [requestedGroupCode, ...groups.filter((groupCode) => groupCode !== requestedGroupCode)];

  const standingsEntries = await Promise.all(
    groupCodes.map(async (groupCode) => [
      groupCode,
      await getPredictionGroupStandings(groupCode),
    ] as const),
  );
  const standingsByGroup = Object.fromEntries(standingsEntries);
  const initialStandings = standingsByGroup[requestedGroupCode] ?? [];

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <header className="border-b border-slate-200 pb-6">
          <p className="mb-3 inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
            {dict.groupStandings.eyebrow}
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {dict.groupStandings.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {dict.groupStandings.description}
          </p>
        </header>

        {groupCodes.length > 0 ? (
          <PredictionGroupStandingsSelector
            groups={groupCodes}
            initialGroupCode={requestedGroupCode}
            standingsByGroup={standingsByGroup}
          />
        ) : (
          <div className="mt-6">
            <PredictionGroupStandingsTable standings={initialStandings} />
          </div>
        )}
      </div>
    </main>
  );
}
