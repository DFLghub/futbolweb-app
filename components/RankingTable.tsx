"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { formatMessage } from "@/lib/i18n";
import type { RankingParticipant, RankingStatus } from "@/lib/ranking-types";

type RankingTableProps = {
  participants: RankingParticipant[];
  groupCode?: string;
};

const statusClasses: Record<RankingStatus, string> = {
  gold: "border-amber-200/50 bg-amber-300/15 text-amber-100",
  green: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  yellow: "border-yellow-200/40 bg-yellow-300/10 text-yellow-100",
  purple: "border-violet-300/45 bg-violet-400/15 text-violet-100",
  red: "border-rose-300/45 bg-rose-400/15 text-rose-100",
};

const rowClasses: Record<RankingStatus, string> = {
  gold: "border-amber-200/35 bg-amber-300/15",
  green: "border-white/10 bg-slate-950/70",
  yellow: "border-yellow-200/30 bg-yellow-300/10",
  purple: "border-violet-300/35 bg-violet-400/15",
  red: "border-rose-300/40 bg-rose-500/15",
};

function formatPoints(points: number, singular: string, plural: string): string {
  return points === 1 ? singular : formatMessage(plural, { points });
}

export default function RankingTable({ participants, groupCode }: RankingTableProps) {
  const { dict } = useI18n();
  const rankingDict = dict.ranking.table;
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const clearFeedbackTimeout = useRef<number | null>(null);
  const topThree = participants.slice(0, 3);
  const topThreePositions = new Set(topThree.map((participant) => participant.position));
  const redZone = participants.filter(
    (participant) => participant.status === "red" && !topThreePositions.has(participant.position),
  );
  const rankingPath = groupCode ? `/ranking?group=${encodeURIComponent(groupCode)}` : "/ranking";
  const rankingUrl = `https://www.futbolweb.app${rankingPath}`;
  const rankingTitle = groupCode
    ? formatMessage(rankingDict.groupShareTitle, { group: groupCode })
    : rankingDict.globalShareTitle;

  const topLines =
    topThree.length > 0
      ? topThree
          .map((participant) => `#${participant.position} ${participant.name} — ${formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}`)
          .join("\n")
      : rankingDict.noScores;

  const redLines =
    redZone.length > 0
      ? ["", rankingDict.redZone, ...redZone.map((participant) => `#${participant.position} ${participant.name} — ${formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}`)]
      : [];

  const shareText = [
    rankingDict.shareHeader,
    rankingTitle,
    "",
    rankingDict.topThree,
    topLines,
    ...redLines,
    "",
    formatMessage(rankingDict.viewRanking, { url: rankingUrl }),
  ].join("\n");

  function clearFeedbackLater() {
    if (clearFeedbackTimeout.current) {
      window.clearTimeout(clearFeedbackTimeout.current);
    }

    clearFeedbackTimeout.current = window.setTimeout(() => {
      setCopyStatus("idle");
      clearFeedbackTimeout.current = null;
    }, 2400);
  }

  async function handleCopySummary() {
    try {
      if (!navigator.clipboard) {
        setCopyStatus("error");
        clearFeedbackLater();
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setCopyStatus("copied");
      clearFeedbackLater();
    } catch {
      setCopyStatus("error");
      clearFeedbackLater();
    }
  }

  const feedbackMessage =
    copyStatus === "copied"
      ? rankingDict.copied
      : copyStatus === "error"
        ? rankingDict.copyError
        : "";

  return (
    <section className="mt-8">
      <div className="grid gap-3 md:grid-cols-3">
        {topThree.map((participant) => (
          <PodiumCard key={participant.position} participant={participant} />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/20">
        <div className="hidden grid-cols-[80px_1.25fr_100px_130px_140px_190px] gap-3 border-b border-white/10 bg-[#07111f] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 md:grid">
          <span>{rankingDict.headers.position}</span>
          <span>{rankingDict.headers.name}</span>
          <span>{rankingDict.headers.points}</span>
          <span>{rankingDict.headers.exact}</span>
          <span>{rankingDict.headers.results}</span>
          <span>{rankingDict.headers.status}</span>
        </div>

        <div className="divide-y divide-white/10">
          {participants.map((participant) => (
            <article
              className={`grid gap-3 border-l-4 px-4 py-4 md:grid-cols-[80px_1.25fr_100px_130px_140px_190px] md:items-center ${rowClasses[participant.status]}`}
              key={participant.position}
            >
              <div className="flex items-center justify-between gap-3 md:block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:hidden">
                  {rankingDict.headers.positionLong}
                </span>
                <span className="font-black text-slate-100">#{participant.position}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black leading-tight text-white">{participant.name}</h2>
                  {participant.isBocon ? (
                    <span className="rounded-full border border-cyan-200/35 bg-cyan-300/10 px-2.5 py-1 text-xs font-black text-cyan-100">
                      {rankingDict.bocon}
                    </span>
                  ) : null}
                </div>
              </div>

              <Stat label={rankingDict.headers.points} value={formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)} strong />
              <Stat label={rankingDict.headers.exactScores} value={participant.exactScores} />
              <Stat label={rankingDict.headers.correctResults} value={participant.correctResults} />

              <div className="flex items-center justify-between gap-3 md:block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:hidden">
                  {rankingDict.headers.status}
                </span>
                <StatusBadge status={participant.status} labels={rankingDict.statuses} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="min-h-11 rounded-md bg-cyan-300 px-5 py-2 text-sm font-black text-slate-950 shadow-lg shadow-cyan-300/20 ring-1 ring-cyan-100/40 transition hover:bg-cyan-200 active:bg-cyan-100"
          onClick={handleCopySummary}
          type="button"
        >
          {rankingDict.copyButton}
        </button>
        <p
          className={`min-h-5 text-sm font-semibold ${
            copyStatus === "error" ? "text-rose-100" : "text-cyan-100"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedbackMessage}
        </p>
      </div>
    </section>
  );
}

function PodiumCard({ participant }: { participant: RankingParticipant }) {
  const { dict } = useI18n();
  const rankingDict = dict.ranking.table;
  const placeLabel =
    participant.position === 1
      ? rankingDict.podium.leader
      : participant.position === 2
        ? rankingDict.podium.second
        : rankingDict.podium.podium;
  const tone =
    participant.position === 1
      ? "border-amber-200/40 bg-slate-950 shadow-amber-950/25"
      : participant.position === 2
        ? "border-cyan-200/30 bg-slate-950 shadow-cyan-950/20"
        : "border-emerald-200/30 bg-slate-950 shadow-emerald-950/20";
  const accentLine =
    participant.position === 1
      ? "via-amber-200/50"
      : participant.position === 2
        ? "via-cyan-200/45"
        : "via-emerald-200/45";
  const badgeTone =
    participant.position === 1
      ? "border-amber-200/45 bg-amber-300/20 text-amber-50"
      : "border-cyan-200/35 bg-cyan-300/10 text-cyan-50";

  return (
    <article className={`relative overflow-hidden rounded-lg border p-4 shadow-2xl ${tone}`}>
      <div className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${accentLine}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">{placeLabel}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{participant.name}</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-sm font-black ${badgeTone}`}>
          #{participant.position}
        </span>
      </div>
      <p className="mt-4 text-3xl font-black text-white">
        {formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}
      </p>
      <p className="mt-1 text-sm text-slate-200">
        {formatMessage(rankingDict.podium.exactResults, {
          exact: participant.exactScores,
          results: participant.correctResults,
        })}
      </p>
    </article>
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
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:hidden">
        {label}
      </span>
      <span className={strong ? "font-black text-white" : "font-semibold text-slate-200"}>{value}</span>
    </div>
  );
}

function StatusBadge({
  labels,
  status,
}: {
  labels: Record<RankingStatus, string>;
  status: RankingStatus;
}) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses[status]}`}>
      {labels[status]}
    </span>
  );
}
