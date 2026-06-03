"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { formatMessage } from "@/lib/i18n";
import { normalizeGroupCode } from "@/lib/group-code";

type SavedPrediction = {
  id: string;
  match_slug: string;
  alias: string;
  favorite_team: string | null;
  score_a: number;
  score_b: number;
  comment: string | null;
  group_code: string | null;
  created_at: string;
};

type PredictDemoFormProps = {
  matchSlug: string;
  matchLabel: string;
  homeTeamName: string;
  awayTeamName: string;
  initialGroupCode?: string;
};

const emptyForm = {
  alias: "",
  favoriteTeam: "",
  scoreA: "",
  scoreB: "",
  comment: "",
  groupCode: "",
};

const participantIdentityStorageKey = "futbolweb.participantIdentity.v1";

type FormState = typeof emptyForm;

type ParticipantIdentity = Pick<FormState, "alias" | "favoriteTeam" | "groupCode">;

function createClientSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function readStoredParticipantIdentity(): ParticipantIdentity | null {
  try {
    const storedValue = window.localStorage.getItem(participantIdentityStorageKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<ParticipantIdentity>;

    return {
      alias: clampText(parsedValue.alias, 40),
      favoriteTeam: clampText(parsedValue.favoriteTeam, 60),
      groupCode: clampText(parsedValue.groupCode, 80),
    };
  } catch {
    return null;
  }
}

function writeStoredParticipantIdentity(identity: ParticipantIdentity) {
  try {
    window.localStorage.setItem(participantIdentityStorageKey, JSON.stringify(identity));
    return true;
  } catch {
    return false;
  }
}

function removeStoredParticipantIdentity() {
  try {
    window.localStorage.removeItem(participantIdentityStorageKey);
  } catch {
    // localStorage can be unavailable in private or restricted browser contexts.
  }
}

export default function PredictDemoForm({
  matchSlug,
  matchLabel,
  homeTeamName,
  awayTeamName,
  initialGroupCode = "",
}: PredictDemoFormProps) {
  const { dict } = useI18n();
  const formDict = dict.predict.form;
  const normalizedInitialGroupCode = normalizeGroupCode(initialGroupCode);
  const [form, setForm] = useState({
    ...emptyForm,
    groupCode: initialGroupCode ? normalizedInitialGroupCode : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [hasStoredIdentity, setHasStoredIdentity] = useState(false);
  const [savedPrediction, setSavedPrediction] = useState<SavedPrediction | null>(null);
  const clientSubmissionId = useMemo(() => createClientSubmissionId(), []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedIdentity = readStoredParticipantIdentity();

      if (!storedIdentity) {
        return;
      }

      setHasStoredIdentity(true);
      setForm((current) => ({
        ...current,
        alias: storedIdentity.alias,
        favoriteTeam: storedIdentity.favoriteTeam,
        groupCode: initialGroupCode
          ? normalizedInitialGroupCode
          : storedIdentity.groupCode,
      }));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [initialGroupCode, normalizedInitialGroupCode]);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrorMessage("");
    setCopyMessage("");
  }

  function forgetStoredIdentity() {
    removeStoredParticipantIdentity();
    setHasStoredIdentity(false);
    setForm((current) => ({
      ...current,
      alias: "",
      favoriteTeam: "",
      groupCode: initialGroupCode ? normalizedInitialGroupCode : "",
    }));
    setErrorMessage("");
    setCopyMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setCopyMessage("");

    const scoreA = Number(form.scoreA);
    const scoreB = Number(form.scoreB);

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match_slug: matchSlug,
          alias: form.alias,
          favorite_team: form.favoriteTeam,
          score_a: scoreA,
          score_b: scoreB,
          comment: form.comment,
          group_code: form.groupCode,
          client_submission_id: clientSubmissionId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(
          typeof result.message === "string"
            ? result.message
            : formDict.genericError,
        );
        return;
      }

      setSavedPrediction(result.prediction);
      setHasStoredIdentity(writeStoredParticipantIdentity({
        alias: form.alias,
        favoriteTeam: form.favoriteTeam,
        groupCode: form.groupCode,
      }));
    } catch {
      setErrorMessage(formDict.connectionError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyForWhatsApp() {
    const prediction = savedPrediction;

    if (!prediction) {
      return;
    }

    const rankingPath = prediction.group_code
      ? `/ranking?group=${encodeURIComponent(prediction.group_code)}`
      : "/ranking";

    const text = [
      formDict.shareTitle,
      formatMessage(formDict.shareMatch, { match: matchLabel }),
      formatMessage(formDict.sharePlayer, { alias: prediction.alias }),
      formatMessage(formDict.shareFavorite, { team: prediction.favorite_team || formDict.noFavorite }),
      formatMessage(formDict.shareScore, { scoreA: prediction.score_a, scoreB: prediction.score_b }),
      formatMessage(formDict.shareComment, { comment: prediction.comment || formDict.noComment }),
      formatMessage(formDict.shareGroup, { group: prediction.group_code || normalizedInitialGroupCode }),
      formDict.mode,
      formatMessage(formDict.ranking, { url: `https://www.futbolweb.app${rankingPath}` }),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(formDict.copied);
    } catch {
      setCopyMessage(formDict.copyError);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10 sm:p-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {hasStoredIdentity ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-cyan-200/20 bg-cyan-300/10 px-3 py-2">
            <p className="text-xs font-bold text-cyan-100">
              {formDict.identitySaved}
            </p>
            <button
              className="rounded border border-white/15 px-2 py-1 text-xs font-black text-white transition hover:bg-white/10"
              onClick={forgetStoredIdentity}
              type="button"
            >
              {formDict.forgetIdentity}
            </button>
          </div>
        ) : null}

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="alias">
            {formDict.alias}
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="alias"
            maxLength={40}
            name="alias"
            onChange={(event) => updateField("alias", event.target.value)}
            required
            value={form.alias}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="favoriteTeam">
            {formDict.favoriteTeam}
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="favoriteTeam"
            maxLength={60}
            name="favoriteTeam"
            onChange={(event) => updateField("favoriteTeam", event.target.value)}
            value={form.favoriteTeam}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-slate-100" htmlFor="scoreA">
              {formatMessage(formDict.scoreHome, { team: homeTeamName })}
            </label>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
              id="scoreA"
              inputMode="numeric"
              max={20}
              min={0}
              name="scoreA"
              onChange={(event) => updateField("scoreA", event.target.value)}
              required
              type="number"
              value={form.scoreA}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-100" htmlFor="scoreB">
              {formatMessage(formDict.scoreAway, { team: awayTeamName })}
            </label>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
              id="scoreB"
              inputMode="numeric"
              max={20}
              min={0}
              name="scoreB"
              onChange={(event) => updateField("scoreB", event.target.value)}
              required
              type="number"
              value={form.scoreB}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="comment">
            {formDict.comment}
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-y rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="comment"
            maxLength={160}
            name="comment"
            onChange={(event) => updateField("comment", event.target.value)}
            value={form.comment}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-100" htmlFor="groupCode">
            {formDict.groupCode}
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/60"
            id="groupCode"
            maxLength={80}
            name="groupCode"
            onChange={(event) => updateField("groupCode", event.target.value)}
            value={form.groupCode}
          />
          {initialGroupCode ? (
            <p className="mt-2 text-xs font-semibold text-emerald-100">
              {formDict.invitedHelp}
            </p>
          ) : (
            <p className="mt-2 text-xs font-semibold text-slate-300">
              {formDict.solistaHelp}
            </p>
          )}
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="min-h-11 rounded-md bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? formDict.submitting : formDict.submit}
        </button>
      </form>

      {savedPrediction ? (
        <div className="mt-5 rounded-md border border-emerald-200/20 bg-emerald-300/10 p-4">
          <p className="text-sm font-bold text-emerald-100">
            {formDict.received}
          </p>
          <button
            className="mt-4 min-h-11 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
            onClick={copyForWhatsApp}
            type="button"
          >
            {formDict.copyButton}
          </button>
          {copyMessage ? (
            <p className="mt-3 text-sm font-semibold text-cyan-100">{copyMessage}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
