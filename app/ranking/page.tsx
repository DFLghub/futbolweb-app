import BrandHeader from "@/components/BrandHeader";
import RankingTable from "@/components/RankingTable";
import SimpleNav from "@/components/SimpleNav";
import { formatMessage } from "@/lib/i18n";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { normalizeGroupCode, SOLISTA_GROUP_CODE } from "@/lib/group-code";
import { getRanking } from "@/lib/real-ranking";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ group?: string }>;
};

export default async function RankingPage({ searchParams }: PageProps) {
  const dict = await getCurrentDictionary();
  const { group } = await searchParams;
  const groupCode = group === undefined ? undefined : normalizeGroupCode(group);
  const participants = await getRanking(groupCode);
  const isLive = participants.length > 0;
  const isFiltered = Boolean(groupCode);
  const isSolista = groupCode === SOLISTA_GROUP_CODE;

  const title = isSolista
    ? dict.ranking.solistaTitle
    : isFiltered
      ? formatMessage(dict.ranking.groupTitle, { group: groupCode ?? "" })
      : dict.ranking.globalTitle;

  const description = isSolista
    ? dict.ranking.solistaDescription
    : isFiltered
      ? formatMessage(dict.ranking.groupDescription, { group: groupCode ?? "" })
      : dict.ranking.globalDescription;

  const badgeText = isLive
    ? isSolista
      ? dict.ranking.liveSolista
      : isFiltered
        ? formatMessage(dict.ranking.liveGroup, { group: groupCode ?? "" })
        : dict.ranking.liveGlobal
    : isSolista
      ? dict.ranking.solistaReady
      : dict.ranking.emptyBadge;

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-4" />
        <SimpleNav />

        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">{description}</p>

            {isFiltered && (
              <div className="mt-3 flex flex-wrap gap-4">
                <a
                  href="/ranking"
                  className="text-sm font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                >
                  {dict.ranking.globalLink}
                </a>
                {!isSolista && groupCode && (
                  <a
                    href={`/group-standings?group=${encodeURIComponent(groupCode)}`}
                    className="text-sm font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                  >
                    {dict.ranking.groupStandingsLink}
                  </a>
                )}
              </div>
            )}
          </div>

          <div
            className={`w-fit rounded-md border px-3 py-2 text-sm font-black shadow-lg ${
              isLive
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100 shadow-emerald-950/20"
                : "border-amber-200/30 bg-amber-300/10 text-amber-100 shadow-amber-950/10"
            }`}
          >
            {badgeText}
          </div>
        </header>

        {isFiltered && !isLive && (
          <div className="mt-8 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-5 text-sm text-amber-100">
            <p className="font-black">
              {isSolista ? dict.ranking.emptySolistaTitle : dict.ranking.emptyGroupTitle}
            </p>
            <p className="mt-2 text-amber-100/80">
              {isSolista
                ? dict.ranking.emptySolistaText
                : dict.ranking.emptyGroupText}
            </p>
          </div>
        )}

        <RankingTable participants={participants} groupCode={groupCode} />
      </div>
    </main>
  );
}
