"use client";

import Link from "next/link";
import { useState } from "react";
import {
  buildWhatsAppShareText,
  canPredict,
  formatMatchTime,
  getStatusLabel,
  getTimezoneLabel,
  type FootballMatch,
} from "@/lib/football-utils";

type MatchCardProps = {
  match: FootballMatch;
};

export default function MatchCard({ match }: MatchCardProps) {
  const [shareFeedback, setShareFeedback] = useState<"idle" | "copied" | "shared" | "error">(
    "idle",
  );
  const isOpen = canPredict(match);
  const shareText = buildWhatsAppShareText(match);
  const predictHref = `/match/${match.slug ?? match.id}/predict`;

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
      ? "Copiado para WhatsApp"
      : shareFeedback === "shared"
        ? "Compartido"
        : shareFeedback === "error"
          ? "No se pudo copiar"
          : "";

  return (
    <article className="relative overflow-hidden rounded-lg border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(7,17,31,0.98))] p-4 shadow-xl shadow-black/25">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-4 top-20 h-px bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_20px,transparent_20px_34px)]" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            {match.stage} · {match.groupCode}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            {match.kickoffLabel ?? formatMatchTime(match.kickoffUtc)}
          </p>
        </div>
        <span className="w-fit rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.12)]">
          {getStatusLabel(match)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock align="left" flagEmoji={match.homeTeam.flagEmoji} name={match.homeTeam.name} />
        <div className="flex min-w-14 items-center justify-center">
          {match.status === "final" ? (
            <span className="rounded-md border border-white/15 bg-slate-950/80 px-3 py-1 font-black text-white">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-2 text-sm font-black text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              VS
            </span>
          )}
        </div>
        <TeamBlock align="right" flagEmoji={match.awayTeam.flagEmoji} name={match.awayTeam.name} />
      </div>

      <div className="mt-5 rounded-md border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-200">
        <span className="font-semibold text-slate-100">{match.venueName}</span>
        <span className="text-slate-400"> · </span>
        <span>{getTimezoneLabel(match.venueTimezone)}</span>
        {match.sourceLabel ? (
          <>
            <span className="text-slate-400"> · </span>
            <span>{match.sourceLabel}</span>
          </>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {isOpen ? (
          <Link
            className="inline-flex min-h-11 flex-[1.35] items-center justify-center rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-cyan-300/20 ring-1 ring-cyan-100/40 transition hover:bg-cyan-200 active:bg-cyan-100"
            href={predictHref}
          >
            Pronosticar
          </Link>
        ) : (
          <button
            className="min-h-11 flex-[1.35] rounded-md border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-bold text-slate-400"
            disabled
            type="button"
          >
            Pronosticar
          </button>
        )}
        <button
          className="min-h-11 flex-1 rounded-md border border-white/20 bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-md shadow-black/15 transition hover:border-emerald-200/35 hover:bg-slate-800 active:bg-slate-700"
          onClick={handleShare}
          type="button"
        >
          Compartir
        </button>
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
      <div className="text-4xl leading-none">{flagEmoji}</div>
      <h2 className="mt-2 text-xl font-black leading-tight text-white">{name}</h2>
    </div>
  );
}
