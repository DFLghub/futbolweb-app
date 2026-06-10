"use client";

import { FormEvent, useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { formatMessage } from "@/lib/i18n";
import { normalizeGroupCode } from "@/lib/group-code";
import { predictionNationalTeamOptions } from "@/lib/prediction-national-teams";

type SavedPrediction = {
  id: string;
  match_slug: string;
  alias: string;
  whatsapp_phone: string | null;
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
  whatsappPhone: "",
  supportedTeam: "",
  favoriteTeam: "",
  scoreA: "",
  scoreB: "",
  comment: "",
  groupCode: "",
};

const participantIdentityStorageKey = "futbolweb.participantIdentity.v1";

type FormState = typeof emptyForm;

type ParticipantIdentity = Pick<FormState, "alias" | "whatsappPhone" | "supportedTeam" | "favoriteTeam" | "groupCode">;

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
      whatsappPhone: clampText(parsedValue.whatsappPhone, 20),
      supportedTeam: clampText(parsedValue.supportedTeam, 60),
      favoriteTeam: clampText(parsedValue.favoriteTeam, 60),
      groupCode: clampText(parsedValue.groupCode, 40),
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
  const { dict, locale } = useI18n();
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
  const [clientSubmissionId, setClientSubmissionId] = useState(() => createClientSubmissionId());

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
        whatsappPhone: storedIdentity.whatsappPhone,
        supportedTeam: storedIdentity.supportedTeam,
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
      whatsappPhone: "",
      supportedTeam: "",
      favoriteTeam: "",
      groupCode: initialGroupCode ? normalizedInitialGroupCode : "",
    }));
    setErrorMessage("");
    setCopyMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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
          whatsapp_phone: form.whatsappPhone,
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
          response.status === 503 || result.code === "high_traffic"
            ? formDict.highTrafficError
            : typeof result.message === "string"
            ? result.message
            : formDict.genericError,
        );
        return;
      }

      setSavedPrediction(result.prediction);
      setClientSubmissionId(createClientSubmissionId());
      setHasStoredIdentity(writeStoredParticipantIdentity({
        alias: form.alias,
        whatsappPhone: form.whatsappPhone,
        supportedTeam: form.supportedTeam,
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
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {hasStoredIdentity ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2">
            <p className="text-xs font-bold text-sky-800">
              {formDict.identitySaved}
            </p>
            <button
              className="rounded border border-sky-200 bg-white px-2 py-1 text-xs font-black text-sky-800 transition hover:bg-sky-100"
              onClick={forgetStoredIdentity}
              type="button"
            >
              {formDict.forgetIdentity}
            </button>
          </div>
        ) : null}

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
          <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="alias">
            {formDict.alias}
          </label>
          <input
            className="mt-2 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            id="alias"
            maxLength={40}
            name="alias"
            onChange={(event) => updateField("alias", event.target.value)}
            required
            value={form.alias}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
              <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="supportedTeam">
                {formDict.supportedTeam}
              </label>
              <select
                className="mt-2 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                id="supportedTeam"
                name="supportedTeam"
                onChange={(event) => updateField("supportedTeam", event.target.value)}
                value={form.supportedTeam}
              >
                <option value="">{formDict.teamPlaceholder}</option>
                {predictionNationalTeamOptions.map((team) => (
                  <option key={team.value} value={team.value}>
                    {team.labels[locale]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                {formDict.supportedTeamHelp}
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
              <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="favoriteTeam">
                {formDict.favoriteTeam}
              </label>
              <select
                className="mt-2 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                id="favoriteTeam"
                name="favoriteTeam"
                onChange={(event) => updateField("favoriteTeam", event.target.value)}
                value={form.favoriteTeam}
              >
                <option value="">{formDict.teamPlaceholder}</option>
                {predictionNationalTeamOptions.map((team) => (
                  <option key={team.value} value={team.value}>
                    {team.labels[locale]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                {formDict.favoriteTeamHelp}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
            <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="groupCode">
              {formDict.groupCode}
            </label>
            <input
              className="mt-2 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              id="groupCode"
              maxLength={40}
              name="groupCode"
              onChange={(event) => updateField("groupCode", event.target.value)}
              value={form.groupCode}
            />
            {initialGroupCode ? (
              <p className="mt-2 text-xs font-semibold text-emerald-700">
                {formDict.invitedHelp}
              </p>
            ) : null}
            <p className="mt-2 text-xs font-semibold text-slate-600">
              {formDict.groupFriendsHelp}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              {formDict.solistaHelp}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              {formDict.groupParticipationHelp}
            </p>
            <p className="mt-2 text-xs font-black text-slate-700">
              {formDict.groupRule}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
          <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="whatsappPhone">
            {formDict.whatsappPhone}
          </label>
          <input
            className="mt-2 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            id="whatsappPhone"
            inputMode="tel"
            maxLength={20}
            name="whatsappPhone"
            onChange={(event) => updateField("whatsappPhone", event.target.value)}
            pattern="^\+[1-9][0-9]{6,14}$"
            placeholder="+573001234567"
            required
            title={formDict.whatsappPhoneFormat}
            type="tel"
            value={form.whatsappPhone}
          />
          <p className="mt-2 text-xs font-semibold text-slate-600">
            {formDict.whatsappPhoneHelp}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 shadow-sm ring-1 ring-emerald-100">
          <div className="grid grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)] items-end gap-2 sm:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] sm:gap-4">
            <div className="min-w-0 text-center">
              <label className="block text-base font-black leading-tight text-slate-950 sm:text-lg" htmlFor="scoreA">
                <span className="block truncate">{homeTeamName}</span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                  {formatMessage(formDict.scoreHome, { team: homeTeamName })}
                </span>
              </label>
              <input
                className="mt-3 min-h-24 w-full rounded-lg border-2 border-emerald-400 bg-white px-2 py-3 text-center text-5xl font-black leading-none text-slate-950 shadow-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-200 sm:min-h-28 sm:text-6xl"
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

            <div className="flex h-24 items-center justify-center pb-1 sm:h-28">
              <span aria-hidden="true" className="text-4xl font-black leading-none text-slate-400 sm:text-5xl">
                -
              </span>
            </div>

            <div className="min-w-0 text-center">
              <label className="block text-base font-black leading-tight text-slate-950 sm:text-lg" htmlFor="scoreB">
                <span className="block truncate">{awayTeamName}</span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                  {formatMessage(formDict.scoreAway, { team: awayTeamName })}
                </span>
              </label>
              <input
                className="mt-3 min-h-24 w-full rounded-lg border-2 border-emerald-400 bg-white px-2 py-3 text-center text-5xl font-black leading-none text-slate-950 shadow-sm outline-none transition placeholder:text-slate-300 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-200 sm:min-h-28 sm:text-6xl"
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
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
          <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="comment">
            {formDict.comment}
          </label>
          <textarea
            className="mt-2 min-h-20 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            id="comment"
            maxLength={160}
            name="comment"
            onChange={(event) => updateField("comment", event.target.value)}
            value={form.comment}
          />
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="min-h-12 rounded-md bg-emerald-600 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? formDict.submitting : formDict.submit}
        </button>
      </form>

      {savedPrediction ? (
        <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-800">
            {formDict.received}
          </p>
          <button
            className="mt-4 min-h-11 w-full rounded-md border border-emerald-300 bg-white px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
            onClick={copyForWhatsApp}
            type="button"
          >
            {formDict.copyButton}
          </button>
          {copyMessage ? (
            <p className="mt-3 text-sm font-semibold text-emerald-700">{copyMessage}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
