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
    <article className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            {match.stage} · {match.groupCode}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {match.kickoffLabel ?? formatMatchTime(match.kickoffUtc)}
          </p>
        </div>
        <span className="w-fit rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-100">
          {getStatusLabel(match)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock align="left" flagEmoji={match.homeTeam.flagEmoji} name={match.homeTeam.name} />
        <div className="flex min-w-12 items-center justify-center">
          {match.status === "final" ? (
            <span className="rounded-md bg-white/10 px-2 py-1 font-black text-white">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="text-sm font-black text-cyan-200">VS</span>
          )}
        </div>
        <TeamBlock align="right" flagEmoji={match.awayTeam.flagEmoji} name={match.awayTeam.name} />
      </div>

      <div className="mt-5 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">{match.venueName}</span>
        <span className="text-slate-500"> · </span>
        <span>{getTimezoneLabel(match.venueTimezone)}</span>
        {match.sourceLabel ? (
          <>
            <span className="text-slate-500"> · </span>
            <span>{match.sourceLabel}</span>
          </>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {isOpen ? (
          <Link
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            href={predictHref}
          >
            Pronosticar
          </Link>
        ) : (
          <button
            className="min-h-11 flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-500"
            disabled
            type="button"
          >
            Pronosticar
          </button>
        )}
        <button
          className="min-h-11 flex-1 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
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
