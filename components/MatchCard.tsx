"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import {
  buildWhatsAppShareText,
  canPredict,
  formatMatchTime,
  getTimezoneLabel,
  type FootballMatch,
} from "@/lib/football-utils";
import { groupCodeToStandingGroupId } from "@/lib/group-code";

type MatchCardProps = {
  match: FootballMatch;
};

export default function MatchCard({ match }: MatchCardProps) {
  const { dict, locale } = useI18n();
  const [shareFeedback, setShareFeedback] = useState<"idle" | "copied" | "shared" | "error">(
    "idle",
  );
  const isOpen = canPredict(match);
  const shareText = buildWhatsAppShareText(match, dict.matchCard.shareText, locale);
  const predictHref = `/match/${match.slug ?? match.id}/predict`;
  const groupHref = `/standings?group=${encodeURIComponent(groupCodeToStandingGroupId(match.groupCode) || match.groupCode)}`;
  const statusTone = getStatusTone(match);

  function clearFeedbackLater() {
    window.setTimeout(() => {
      setShareFeedback("idle");
    }, 2200);
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        setShareFeedback("shared");
        clearFeedbackLater();
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setShareFeedback("copied");
        clearFeedbackLater();
        return;
      }

      setShareFeedback("error");
      clearFeedbackLater();
    } catch {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          setShareFeedback("copied");
          clearFeedbackLater();
          return;
        }
        setShareFeedback("error");
        clearFeedbackLater();
      } catch {
        setShareFeedback("error");
        clearFeedbackLater();
      }
    }
  }

  const feedbackMessage =
    shareFeedback === "copied"
      ? dict.matchCard.copied
      : shareFeedback === "shared"
        ? dict.matchCard.shared
        : shareFeedback === "error"
          ? dict.matchCard.copyError
          : "";

  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-3.5 shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-slate-400">
            {match.stage}
          </p>
          <Link className="mt-1 inline-flex text-xs font-black text-cyan-100 hover:text-white" href={groupHref}>
            {match.groupCode}
          </Link>
        </div>
        <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-black ${statusTone}`}>
          {getPrimaryStatusLabel(match, dict.matchCard.status)}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock align="left" flagEmoji={match.homeTeam.flagEmoji} name={match.homeTeam.name} />
        <div className="flex min-w-14 items-center justify-center">
          {match.status === "final" ? (
            <span className="rounded-md border border-white/15 bg-slate-950/80 px-3 py-1 font-black text-white">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-2 text-sm font-black text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              {dict.matchCard.vs}
            </span>
          )}
        </div>
        <TeamBlock align="right" flagEmoji={match.awayTeam.flagEmoji} name={match.awayTeam.name} />
      </div>

      <div className="mt-4 grid gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <span className="font-black text-slate-100">{match.kickoffLabel ?? formatMatchTime(match.kickoffUtc, locale)}</span>
          <span className="shrink-0 text-slate-400">{getTimezoneLabel(match.venueTimezone, dict.timezones)}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-200">{match.venueName}</span>
        <span className="text-slate-400"> · </span>
          <span>{dict.matchCard.actionAvailable}: {isOpen ? dict.matchCard.predict : dict.matchCard.closedAction}</span>
        </div>
        {match.sourceLabel ? (
          <span className="text-slate-500">{match.sourceLabel}</span>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-[1.25fr_1fr_auto] gap-2">
        {isOpen ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-300 px-3 py-2 text-sm font-black text-slate-950 shadow-lg shadow-cyan-300/15 ring-1 ring-cyan-100/40 transition hover:bg-cyan-200 active:bg-cyan-100"
            href={predictHref}
          >
            {dict.matchCard.predict}
          </Link>
        ) : (
          <button
            className="min-h-11 rounded-md border border-white/10 bg-slate-900/70 px-3 py-2 text-sm font-bold text-slate-400"
            disabled
            type="button"
          >
            {dict.matchCard.predict}
          </button>
        )}
        <button
          className="min-h-11 rounded-md border border-white/20 bg-slate-900 px-3 py-2 text-sm font-bold text-white shadow-md shadow-black/15 transition hover:border-emerald-200/35 hover:bg-slate-800 active:bg-slate-700"
          onClick={handleShare}
          type="button"
        >
          {dict.matchCard.share}
        </button>
        <Link
          aria-label={`${dict.nav.groups}: ${match.groupCode}`}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 bg-white/[0.06] px-3 py-2 text-sm font-black text-cyan-100 transition hover:bg-white/10 hover:text-white"
          href={groupHref}
        >
          {dict.matchCard.groupShort}
        </Link>
      </div>

      <p className="mt-3 min-h-5 text-sm font-semibold text-cyan-100" role="status" aria-live="polite">
        {feedbackMessage}
      </p>
    </article>
  );
}

function TeamBlock({
  align,
  flagEmoji,
  name,
}: {
  align: "left" | "right";
  flagEmoji: string;
  name: string;
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className="text-3xl leading-none">{flagEmoji}</div>
      <h2 className="mt-1 text-lg font-black leading-tight text-white">{name}</h2>
    </div>
  );
}

function getStatusTone(match: FootballMatch) {
  if (match.status === "live") {
    return "border-red-300/35 bg-red-400/15 text-red-50 shadow-[0_0_18px_rgba(248,113,113,0.14)]";
  }

  if (match.status === "final") {
    return "border-slate-300/25 bg-slate-300/10 text-slate-100";
  }

  return "border-emerald-300/30 bg-emerald-400/15 text-emerald-50 shadow-[0_0_18px_rgba(52,211,153,0.12)]";
}

function getPrimaryStatusLabel(
  match: FootballMatch,
  labels: { final: string; live: string; upcoming: string },
) {
  if (match.status === "final") {
    return labels.final;
  }

  if (match.status === "live") {
    return labels.live;
  }

  return labels.upcoming;
}
