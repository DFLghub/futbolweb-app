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
  gold: "border-amber-200 bg-amber-50 text-amber-800",
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
  purple: "border-violet-200 bg-violet-50 text-violet-800",
  red: "border-rose-200 bg-rose-50 text-rose-800",
};

const rowClasses: Record<RankingStatus, string> = {
  gold: "border-amber-400 bg-amber-50",
  green: "border-emerald-400 bg-white",
  yellow: "border-yellow-400 bg-yellow-50",
  purple: "border-violet-400 bg-violet-50",
  red: "border-rose-400 bg-rose-50",
};

function formatPoints(points: number, singular: string, plural: string): string {
  return points === 1 ? singular : formatMessage(plural, { points });
}

export default function RankingTable({ participants, groupCode }: RankingTableProps) {
  const { dict } = useI18n();
  const rankingDict = dict.ranking.table;
  const [copyStatus, setCopyStatus] = useState<{ type: "idle" | "copied" | "error"; key?: string }>({ type: "idle" });
  const clearFeedbackTimeout = useRef<number | null>(null);
  const isGlobalRanking = !groupCode;
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
  const participantLabel = (participant: RankingParticipant) => (
    isGlobalRanking && participant.groupCode
      ? `${participant.name} (${participant.groupCode})`
      : participant.name
  );

  const topLines =
    topThree.length > 0
      ? topThree
          .map((participant) => `#${participant.position} ${participantLabel(participant)} — ${formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}`)
          .join("\n")
      : rankingDict.noScores;

  const redLines =
    redZone.length > 0
      ? ["", rankingDict.redZone, ...redZone.map((participant) => `#${participant.position} ${participantLabel(participant)} — ${formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}`)]
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

  function participantKey(participant: RankingParticipant) {
    return `${participant.position}-${participant.name}-${participant.groupCode ?? "global"}`;
  }

  function participantShareText(participant: RankingParticipant) {
    const groupLine = participant.groupCode
      ? `${rankingDict.shareGroup}: ${participant.groupCode}`
      : null;

    return [
      rankingDict.playerShareHeader,
      `${rankingDict.shareAlias}: ${participant.name}`,
      `${rankingDict.headers.points}: ${formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}`,
      groupLine,
      `${rankingDict.shareResult}: ${participant.exactScores > 0 ? rankingDict.shareExactHit : rankingDict.shareKeepPlaying}`,
      `${rankingDict.headers.positionLong}: #${participant.position}${participant.groupCode ? ` ${rankingDict.shareInGroup} ${participant.groupCode}` : ""}`,
      "futbolweb.app",
    ].filter(Boolean).join("\n");
  }

  function clearFeedbackLater() {
    if (clearFeedbackTimeout.current) {
      window.clearTimeout(clearFeedbackTimeout.current);
    }

    clearFeedbackTimeout.current = window.setTimeout(() => {
      setCopyStatus({ type: "idle" });
      clearFeedbackTimeout.current = null;
    }, 2400);
  }

  async function copyText(text: string, key: string) {
    try {
      if (!navigator.clipboard) {
        setCopyStatus({ type: "error", key });
        clearFeedbackLater();
        return;
      }

      await navigator.clipboard.writeText(text);
      setCopyStatus({ type: "copied", key });
      clearFeedbackLater();
    } catch {
      setCopyStatus({ type: "error", key });
      clearFeedbackLater();
    }
  }

  async function handleCopySummary() {
    await copyText(shareText, "ranking");
  }

  function feedbackMessage(key: string) {
    if (copyStatus.key !== key) return "";

    return copyStatus.type === "copied"
      ? rankingDict.copied
      : copyStatus.type === "error"
        ? rankingDict.copyError
        : "";
  }

  return (
    <section className="mt-8">
      <div className="grid gap-3 md:grid-cols-3">
        {topThree.map((participant) => (
          <PodiumCard key={participantKey(participant)} participant={participant} showGroup={isGlobalRanking} />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
        <div className="hidden grid-cols-[80px_1.25fr_100px_130px_140px_190px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid">
          <span>{rankingDict.headers.position}</span>
          <span>{rankingDict.headers.name}</span>
          <span>{rankingDict.headers.points}</span>
          <span>{rankingDict.headers.exact}</span>
          <span>{rankingDict.headers.results}</span>
          <span>{rankingDict.headers.status}</span>
        </div>

        <div className="divide-y divide-slate-200">
          {participants.map((participant) => {
            const key = participantKey(participant);

            return (
            <article
              className={`grid gap-3 border-l-4 px-4 py-4 md:grid-cols-[80px_1.25fr_100px_130px_140px_190px] md:items-center ${rowClasses[participant.status]}`}
              key={key}
            >
              <div className="flex items-center justify-between gap-3 md:block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:hidden">
                  {rankingDict.headers.positionLong}
                </span>
                <span className="font-black text-slate-950">#{participant.position}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black leading-tight text-slate-950">{participant.name}</h2>
                  {isGlobalRanking && participant.groupCode ? (
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-700">
                      {participant.groupCode}
                    </span>
                  ) : null}
                  {participant.isBocon ? (
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-black text-sky-700">
                      {rankingDict.bocon}
                    </span>
                  ) : null}
                </div>
              </div>

              <Stat label={rankingDict.headers.points} value={formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)} strong />
              <Stat label={rankingDict.headers.exactScores} value={participant.exactScores} />
              <Stat label={rankingDict.headers.correctResults} value={participant.correctResults} />

              <div className="flex items-center justify-between gap-3 md:block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:hidden">
                  {rankingDict.headers.status}
                </span>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={participant.status} labels={rankingDict.statuses} />
                  <button
                    className="w-fit rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800 transition hover:bg-slate-50"
                    onClick={() => copyText(participantShareText(participant), key)}
                    type="button"
                  >
                    {rankingDict.copyPlayerButton}
                  </button>
                  <span
                    className={`min-h-4 text-xs font-semibold ${
                      copyStatus.type === "error" ? "text-rose-700" : "text-emerald-700"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {feedbackMessage(key)}
                  </span>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="min-h-11 rounded-md bg-slate-950 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 active:bg-slate-700"
          onClick={handleCopySummary}
          type="button"
        >
          {rankingDict.copyButton}
        </button>
        <p
          className={`min-h-5 text-sm font-semibold ${
            copyStatus.type === "error" ? "text-rose-700" : "text-emerald-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedbackMessage("ranking")}
        </p>
      </div>
    </section>
  );
}

function PodiumCard({ participant, showGroup }: { participant: RankingParticipant; showGroup: boolean }) {
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
      ? "border-amber-200 bg-amber-50 shadow-amber-100/70"
      : participant.position === 2
        ? "border-sky-200 bg-sky-50 shadow-sky-100/70"
        : "border-emerald-200 bg-emerald-50 shadow-emerald-100/70";
  const accentLine =
    participant.position === 1
      ? "via-amber-400"
      : participant.position === 2
        ? "via-sky-400"
        : "via-emerald-400";
  const badgeTone =
    participant.position === 1
      ? "border-amber-200 bg-white text-amber-800"
      : "border-sky-200 bg-white text-sky-800";

  return (
    <article className={`relative overflow-hidden rounded-lg border p-4 shadow-sm ${tone}`}>
      <div className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${accentLine}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">{placeLabel}</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{participant.name}</h2>
          {showGroup && participant.groupCode ? (
            <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-600">{participant.groupCode}</p>
          ) : null}
        </div>
        <span className={`rounded-full border px-3 py-1 text-sm font-black ${badgeTone}`}>
          #{participant.position}
        </span>
      </div>
      <p className="mt-4 text-3xl font-black text-slate-950">
        {formatPoints(participant.points, rankingDict.pointsSingular, rankingDict.pointsPlural)}
      </p>
      <p className="mt-1 text-sm text-slate-600">
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
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:hidden">
        {label}
      </span>
      <span className={strong ? "font-black text-slate-950" : "font-semibold text-slate-700"}>{value}</span>
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
