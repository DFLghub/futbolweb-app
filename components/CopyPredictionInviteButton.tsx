"use client";

import { useRef, useState } from "react";

type CopyPredictionInviteButtonProps = {
  matchLabel: string;
  matchSlug: string;
  groupCode?: string;
};

export default function CopyPredictionInviteButton({
  matchLabel,
  matchSlug,
  groupCode,
}: CopyPredictionInviteButtonProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const clearFeedbackTimeout = useRef<number | null>(null);

  const predictionPath = groupCode
    ? `/match/${matchSlug}/predict?group=${encodeURIComponent(groupCode)}`
    : `/match/${matchSlug}/predict`;

  const predictionUrl = `https://www.futbolweb.app${predictionPath}`;

  const inviteText = [
    "🐯 Entra al Oráculo Futbolero",
    matchLabel,
    "",
    "Haz tu pronóstico aquí:",
    predictionUrl,
    "",
    groupCode ? `Grupo: ${groupCode}` : "Ranking Global",
    "Modo Mundial v0.1",
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

  async function handleCopyInvite() {
    try {
      if (!navigator.clipboard) {
        setCopyStatus("error");
        clearFeedbackLater();
        return;
      }

      await navigator.clipboard.writeText(inviteText);
      setCopyStatus("copied");
      clearFeedbackLater();
    } catch {
      setCopyStatus("error");
      clearFeedbackLater();
    }
  }

  const feedbackMessage =
    copyStatus === "copied"
      ? "Invitación copiada para WhatsApp"
      : copyStatus === "error"
        ? "No se pudo copiar"
        : "";

  return (
    <div className="mt-3 rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3">
      <button
        className="min-h-11 w-full rounded-md bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 active:bg-cyan-100"
        onClick={handleCopyInvite}
        type="button"
      >
        Copiar invitación para WhatsApp
      </button>
      <p
        className={`mt-2 min-h-5 text-sm font-semibold ${
          copyStatus === "error" ? "text-rose-100" : "text-cyan-100"
        }`}
        role="status"
        aria-live="polite"
      >
        {feedbackMessage}
      </p>
    </div>
  );
}
