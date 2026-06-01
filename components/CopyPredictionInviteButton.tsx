"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { formatMessage } from "@/lib/i18n";

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
  const { dict } = useI18n();
  const inviteDict = dict.predict.invite;
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const clearFeedbackTimeout = useRef<number | null>(null);

  const predictionPath = groupCode
    ? `/match/${matchSlug}/predict?group=${encodeURIComponent(groupCode)}`
    : `/match/${matchSlug}/predict`;

  const predictionUrl = `https://www.futbolweb.app${predictionPath}`;

  const inviteText = [
    inviteDict.title,
    "",
    inviteDict.line,
    "",
    matchLabel,
    predictionUrl,
    "",
    groupCode ? formatMessage(inviteDict.group, { group: groupCode }) : inviteDict.global,
    inviteDict.challenge,
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
      ? inviteDict.copied
      : copyStatus === "error"
        ? inviteDict.error
        : "";

  return (
    <div className="mt-3 rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3">
      <button
        className="min-h-11 w-full rounded-md bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 active:bg-cyan-100"
        onClick={handleCopyInvite}
        type="button"
      >
        {inviteDict.button}
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
