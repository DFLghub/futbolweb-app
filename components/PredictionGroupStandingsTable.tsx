"use client";

import type { PredictionGroupStanding } from "@/lib/prediction-group-standings";
import { useI18n } from "@/components/I18nProvider";

type PredictionGroupStandingsTableProps = {
  standings: PredictionGroupStanding[];
};

function formatPoints(points: number, locale: string) {
  return points.toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(points) ? 0 : 1,
  });
}

function formatCalculatedAt(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function PredictionGroupStandingsTable({
  standings,
}: PredictionGroupStandingsTableProps) {
  const { dict, locale } = useI18n();
  const tableDict = dict.groupStandings.table;

  if (standings.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200/50 bg-amber-50 px-4 py-5 text-sm text-amber-900">
        <p className="font-black">{dict.groupStandings.emptyTitle}</p>
        <p className="mt-2 text-amber-900/80">{dict.groupStandings.emptyText}</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className="hidden grid-cols-[70px_1.2fr_1fr_120px_150px_190px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-slate-500 md:grid">
        <span>{tableDict.headers.rank}</span>
        <span>{tableDict.headers.alias}</span>
        <span>{tableDict.headers.groupCode}</span>
        <span>{tableDict.headers.points}</span>
        <span>{tableDict.headers.predictions}</span>
        <span>{tableDict.headers.latestCalculatedAt}</span>
      </div>

      <div className="divide-y divide-slate-200">
        {standings.map((standing) => (
          <article
            className="grid gap-3 px-4 py-4 md:grid-cols-[70px_1.2fr_1fr_120px_150px_190px] md:items-center"
            key={`${standing.groupCode}-${standing.alias}`}
          >
            <Stat label={tableDict.headers.rank} value={`#${standing.rank}`} strong />
            <Stat label={tableDict.headers.alias} value={standing.alias} strong />
            <Stat label={tableDict.headers.groupCode} value={standing.groupCode} />
            <Stat label={tableDict.headers.points} value={formatPoints(standing.totalPoints, locale)} strong />
            <Stat label={tableDict.headers.predictions} value={standing.predictionsCounted} />
            <Stat
              label={tableDict.headers.latestCalculatedAt}
              value={formatCalculatedAt(standing.latestCalculatedAt, locale)}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number | string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 md:block">
      <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 md:hidden">
        {label}
      </span>
      <span className={strong ? "font-black text-slate-950" : "font-semibold text-slate-700"}>
        {value}
      </span>
    </div>
  );
}
