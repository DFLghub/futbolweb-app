"use client";

import { useRef, useState } from "react";
import type { RankingParticipant, RankingStatus } from "@/lib/mock-ranking-data";

type RankingTableProps = {
  participants: RankingParticipant[];
};

const statusLabels: Record<RankingStatus, string> = {
  gold: "Zona de gloria",
  green: "En pelea",
  yellow: "Cuidado",
  purple: "Resucitado",
  red: "Zona roja",
};

const statusClasses: Record<RankingStatus, string> = {
  gold: "border-amber-200/50 bg-amber-300/15 text-amber-100",
  green: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  yellow: "border-yellow-200/40 bg-yellow-300/10 text-yellow-100",
  purple: "border-violet-300/45 bg-violet-400/15 text-violet-100",
  red: "border-rose-300/45 bg-rose-400/15 text-rose-100",
};

const rowClasses: Record<RankingStatus, string> = {
  gold: "border-amber-200/30 bg-amber-300/10",
  green: "border-white/10 bg-white/[0.055]",
  yellow: "border-yellow-200/25 bg-yellow-300/5",
  purple: "border-violet-300/30 bg-violet-400/10",
  red: "border-rose-300/35 bg-rose-500/10",
};

function formatPoints(points: number): string {
  return points === 1 ? "1 pt" : `${points} pts`;
}

export default function RankingTable({ participants }: RankingTableProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const clearFeedbackTimeout = useRef<number | null>(null);
  const topThree = participants.slice(0, 3);
  const redZone = participants.filter((participant) => participant.status === "red");

  const topLines = topThree
    .map((participant) => `${participant.position}. ${participant.name} — ${formatPoints(participant.points)}`)
    .join("\n");
  const redLines = redZone
    .map((participant) => `${participant.position}. ${participant.name} — ${formatPoints(participant.points)}`)
    .join("\n");
  const shareText = [
    "🏆 Ranking del Grupo — Oráculo Futbolero",
    "Top 3:",
    topLines,
    "Zona roja:",
    redLines,
    "Revisa el ranking: https://www.futbolweb.app/ranking",
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
      ? "Resumen copiado para WhatsApp"
      : copyStatus === "error"
        ? "No se pudo copiar"
        : "";

  return (
    <section className="mt-8">
      <div className="grid gap-3 md:grid-cols-3">
        {topThree.map((participant) => (
          <PodiumCard key={participant.position} participant={participant} />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/10">
        <div className="hidden grid-cols-[80px_1.25fr_100px_130px_140px_190px] gap-3 border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 md:grid">
          <span>Pos.</span>
          <span>Nombre</span>
          <span>Puntos</span>
          <span>Exactos</span>
          <span>Resultados</span>
          <span>Estado</span>
        </div>

        <div className="divide-y divide-white/10">
          {participants.map((participant) => (
            <article
              className={`grid gap-3 border-l-4 px-4 py-4 md:grid-cols-[80px_1.25fr_100px_130px_140px_190px] md:items-center ${rowClasses[participant.status]}`}
              key={participant.position}
            >
              <div className="flex items-center justify-between gap-3 md:block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:hidden">
                  Posición
                </span>
                <span className="font-black text-slate-100">#{participant.position}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black leading-tight text-white">{participant.name}</h2>
                  {participant.isBocon ? (
                    <span className="rounded-full border border-cyan-200/35 bg-cyan-300/10 px-2.5 py-1 text-xs font-black text-cyan-100">
                      Bocón Mode
                    </span>
                  ) : null}
                </div>
              </div>

              <Stat label="Puntos" value={formatPoints(participant.points)} strong />
              <Stat label="Marcadores exactos" value={participant.exactScores} />
              <Stat label="Resultados acertados" value={participant.correctResults} />

              <div className="flex items-center justify-between gap-3 md:block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:hidden">
                  Estado
                </span>
                <StatusBadge status={participant.status} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="min-h-11 rounded-md bg-cyan-300 px-5 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          onClick={handleCopySummary}
          type="button"
        >
          Copiar resumen para WhatsApp
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
  const placeLabel =
    participant.position === 1 ? "Líder" : participant.position === 2 ? "Escolta" : "Podio";

  return (
    <article className="rounded-lg border border-amber-200/20 bg-gradient-to-br from-amber-300/15 to-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">{placeLabel}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{participant.name}</h2>
        </div>
        <span className="rounded-full border border-amber-200/35 bg-amber-300/15 px-3 py-1 text-sm font-black text-amber-100">
          #{participant.position}
        </span>
      </div>
      <p className="mt-4 text-3xl font-black text-white">{formatPoints(participant.points)}</p>
      <p className="mt-1 text-sm text-slate-300">
        {participant.exactScores} exactos · {participant.correctResults} resultados
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
      <span className={strong ? "font-black text-white" : "font-semibold text-slate-200"}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: RankingStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
