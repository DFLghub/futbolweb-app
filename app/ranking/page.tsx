import BrandHeader from "@/components/BrandHeader";
import RankingTable from "@/components/RankingTable";
import SimpleNav from "@/components/SimpleNav";
import { formatMessage } from "@/lib/i18n";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { normalizeGroupCode, SOLISTA_GROUP_CODE } from "@/lib/group-code";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { RankingParticipant } from "@/lib/ranking-types";

export const dynamic = "force-dynamic";

function deriveStatus(position: number, points: number): RankingParticipant["status"] {
  if (points <= 0) return "red";
  if (position === 1) return "gold";
  if (position <= 3) return "green";
  if (position <= 5) return "yellow";
  if (position <= 7) return "purple";
  return "red";
}

async function getRanking(groupCode?: string): Promise<RankingParticipant[]> {
  try {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from("ranking_summary")
      .select("position, name, group_code, points, exact_scores, correct_results")
      .order("position", { ascending: true });

    if (groupCode) {
      query = query.eq("group_code", groupCode);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r, index) => ({
      position: groupCode ? index + 1 : r.position,
      name: r.name,
      points: Number(r.points),
      exactScores: Number(r.exact_scores),
      correctResults: Number(r.correct_results),
      groupCode: r.group_code ?? undefined,
      status: deriveStatus(groupCode ? index + 1 : r.position, Number(r.points)),
      isBocon: false,
    }));
  } catch {
    return [];
  }
}

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
              <a
                href="/ranking"
                className="mt-3 inline-block text-sm font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
              >
                {dict.ranking.globalLink}
              </a>
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
