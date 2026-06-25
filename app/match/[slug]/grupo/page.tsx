import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import GroupMatchPredictionsTable from "@/components/GroupMatchPredictionsTable";
import SimpleNav from "@/components/SimpleNav";
import { normalizeGroupCode, SOLISTA_GROUP_CODE } from "@/lib/group-code";
import { getGroupMatchPredictions } from "@/lib/group-match-predictions";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import { localizeWorldCupMatch, worldCup2026Matches } from "@/lib/world-cup-2026-matches";

type GrupoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ group?: string }>;
};

export default async function GrupoPage({ params, searchParams }: GrupoPageProps) {
  const { slug } = await params;
  const { group } = await searchParams;
  const locale = await getCurrentLocale();
  const dict = await getCurrentDictionary();
  const labels = dict.groupPredictions;

  const rawGroup = normalizeGroupCode(group);
  const displayGroup = rawGroup === SOLISTA_GROUP_CODE ? labels.solistaGroup : rawGroup;

  const matchData = worldCup2026Matches.find((m) => m.slug === slug);
  const match = matchData ? localizeWorldCupMatch(matchData, locale) : null;

  const predictions = await getGroupMatchPredictions(slug, rawGroup);
  const isScored = predictions.some((p) => p.points !== null);

  const matchLabel = match
    ? `${match.homeTeam.flagEmoji} ${match.homeTeam.name} ${labels.vs} ${match.awayTeam.flagEmoji} ${match.awayTeam.name}`
    : slug.replace(/[-_]+/g, " ");

  const actualScore =
    match &&
    match.status === "final" &&
    match.homeScore != null &&
    match.awayScore != null
      ? `${match.homeScore} – ${match.awayScore}`
      : null;

  const backHref = group
    ? `/match/${encodeURIComponent(slug)}/predict?group=${encodeURIComponent(rawGroup)}`
    : `/match/${encodeURIComponent(slug)}/predict`;

  return (
    <>
      <BrandHeader />
      <SimpleNav />
      <main className="mx-auto max-w-xl px-4 pb-16 pt-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-600">
          {displayGroup}
        </p>
        <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950">
          {labels.title}
        </h1>
        <p className="mt-1 text-lg font-black text-slate-700">{matchLabel}</p>

        {actualScore ? (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              {labels.resultLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 text-sm font-black text-slate-800">
              {actualScore}
            </span>
          </div>
        ) : null}

        <GroupMatchPredictionsTable
          dict={labels}
          predictions={predictions}
          isScored={isScored}
        />

        <div className="mt-8">
          <Link
            className="text-sm font-black text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
            href={backHref}
          >
            ← {labels.backToMatch}
          </Link>
        </div>
      </main>
    </>
  );
}
