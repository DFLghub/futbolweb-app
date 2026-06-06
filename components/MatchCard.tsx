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
  variant?: "compact" | "calendar";
};

export default function MatchCard({ match, variant = "compact" }: MatchCardProps) {
  const { dict, locale } = useI18n();
  const [shareFeedback, setShareFeedback] = useState<"idle" | "copied" | "shared" | "error">(
    "idle",
  );
  const isOpen = canPredict(match);
  const shareText = buildWhatsAppShareText(match, dict.matchCard.shareText, locale);
  const predictHref = `/match/${match.slug ?? match.id}/predict`;
  const groupHref = `/standings?group=${encodeURIComponent(groupCodeToStandingGroupId(match.groupCode) || match.groupCode)}`;
  const statusTone = getStatusTone(match);
  const isCalendar = variant === "calendar";

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
    <article
      className={`relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70 ${
        isCalendar ? "p-3 md:p-4" : "p-3.5"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-red-500" />

      <div className={`flex items-start justify-between gap-3 ${isCalendar ? "md:items-center" : ""}`}>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-slate-500">
            {match.stage}
          </p>
          <Link className="mt-1 inline-flex text-xs font-black text-emerald-700 hover:text-emerald-900" href={groupHref}>
            {match.groupCode}
          </Link>
        </div>
        <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-black ${statusTone}`}>
          {getPrimaryStatusLabel(match, dict.matchCard.status)}
        </span>
      </div>

      <div
        className={`mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 ${
          isCalendar ? "md:mt-2" : ""
        }`}
      >
        <TeamBlock align="left" flagEmoji={match.homeTeam.flagEmoji} name={match.homeTeam.name} />
        <div className="flex min-w-14 items-center justify-center">
          {match.status === "final" ? (
            <span className="rounded-md border border-slate-200 bg-slate-950 px-3 py-1 font-black text-white">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-700">
              {dict.matchCard.vs}
            </span>
          )}
        </div>
        <TeamBlock align="right" flagEmoji={match.awayTeam.flagEmoji} name={match.awayTeam.name} />
      </div>

      <div
        className={`mt-4 grid gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 ${
          isCalendar ? "md:grid-cols-[1fr_1.35fr] md:items-center" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-black text-slate-950">{match.kickoffLabel ?? formatMatchTime(match.kickoffUtc, locale)}</span>
          <span className="shrink-0 text-slate-500">{getTimezoneLabel(match.venueTimezone, dict.timezones)}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800">{match.venueName}</span>
        <span className="text-slate-400"> · </span>
          <span>{dict.matchCard.actionAvailable}: {isOpen ? dict.matchCard.predict : dict.matchCard.closedAction}</span>
        </div>
        {match.sourceLabel ? (
          <span className="text-slate-500">{match.sourceLabel}</span>
        ) : null}
      </div>

      <div className={`mt-3 grid gap-2 ${isCalendar ? "grid-cols-[1fr_1fr_auto] md:flex md:justify-end" : "grid-cols-[1.25fr_1fr_auto]"}`}>
        {isOpen ? (
          <Link
            className={`inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800 ${
              isCalendar ? "md:min-w-32" : ""
            }`}
            href={predictHref}
          >
            {dict.matchCard.predict}
          </Link>
        ) : (
          <button
            className={`min-h-11 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-400 ${
              isCalendar ? "md:min-w-32" : ""
            }`}
            disabled
            type="button"
          >
            {dict.matchCard.predict}
          </button>
        )}
        <button
          className={`min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100 ${
            isCalendar ? "md:min-w-28" : ""
          }`}
          onClick={handleShare}
          type="button"
        >
          {dict.matchCard.share}
        </button>
        <Link
          aria-label={`${dict.nav.groups}: ${match.groupCode}`}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          href={groupHref}
        >
          {dict.matchCard.groupShort}
        </Link>
      </div>

      <p className="mt-3 min-h-5 text-sm font-semibold text-emerald-700" role="status" aria-live="polite">
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
      <h2 className="mt-1 text-lg font-black leading-tight text-slate-950">{name}</h2>
    </div>
  );
}

function getStatusTone(match: FootballMatch) {
  if (match.status === "live") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (match.status === "final") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
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
