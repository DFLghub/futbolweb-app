"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { formatMatchTime } from "@/lib/football-utils";
import { formatMessage } from "@/lib/i18n";
import { localizeWorldCupMatch, worldCup2026Matches, type WorldCupMatch } from "@/lib/world-cup-2026-matches";

type StoredIdentity = {
  alias: string;
  whatsappPhone: string;
  favoriteTeam: string;
  groupCode: string;
};

type PredictionScore = {
  points: number;
  score_detail: string;
};

type SavedPrediction = {
  id: string;
  match_slug: string;
  alias: string;
  favorite_team: string | null;
  score_a: number;
  score_b: number;
  advancing_team: string | null;
  comment: string | null;
  group_code: string | null;
  status: string;
  created_at: string;
  score: PredictionScore | null;
};

type LoadState = "checking-identity" | "missing-identity" | "loading" | "loaded" | "error";

const participantIdentityStorageKey = "futbolweb.participantIdentity.v1";
const predictionCutoffMs = 5 * 60 * 1000;

function clampText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function readStoredParticipantIdentity(): StoredIdentity | null {
  try {
    const storedValue = window.localStorage.getItem(participantIdentityStorageKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<StoredIdentity>;
    const whatsappPhone = clampText(parsedValue.whatsappPhone, 20);

    if (!whatsappPhone) {
      return null;
    }

    return {
      alias: clampText(parsedValue.alias, 40),
      whatsappPhone,
      favoriteTeam: clampText(parsedValue.favoriteTeam, 60),
      groupCode: clampText(parsedValue.groupCode, 40),
    };
  } catch {
    return null;
  }
}

function normalizePhone(value: string) {
  return value.replace(/[\s().-]/g, "");
}

function canEditPrediction(match?: WorldCupMatch) {
  if (!match) {
    return false;
  }

  return match.status !== "final" && new Date(match.kickoffUtc).getTime() - predictionCutoffMs > Date.now();
}

function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MyPredictionsClient() {
  const { dict, locale } = useI18n();
  const labels = dict.myPredictions;
  const [identity, setIdentity] = useState<StoredIdentity | null>(null);
  const [predictions, setPredictions] = useState<SavedPrediction[]>([]);
  const [state, setState] = useState<LoadState>("checking-identity");

  const matchesBySlug = useMemo(() => {
    return new Map(
      worldCup2026Matches.map((match) => [
        match.slug,
        localizeWorldCupMatch(match, locale),
      ]),
    );
  }, [locale]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedIdentity = readStoredParticipantIdentity();

      if (!storedIdentity) {
        setState("missing-identity");
        return;
      }

      const whatsappPhone = normalizePhone(storedIdentity.whatsappPhone);
      setIdentity({ ...storedIdentity, whatsappPhone });
      setState("loading");

      fetch(`/api/my-predictions?whatsapp_phone=${encodeURIComponent(whatsappPhone)}`)
        .then(async (response) => {
          const result = await response.json();

          if (!response.ok || !result.ok || !Array.isArray(result.predictions)) {
            throw new Error("Could not load predictions.");
          }

          setPredictions(result.predictions);
          setState("loaded");
        })
        .catch(() => {
          setState("error");
        });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (state === "checking-identity" || state === "loading") {
    return (
      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black text-slate-950">{labels.loadingTitle}</p>
        <p className="mt-2 text-sm text-slate-600">{labels.loadingText}</p>
      </section>
    );
  }

  if (state === "missing-identity") {
    return (
      <EmptyState
        ctaHref="/upcoming"
        ctaLabel={labels.firstPredictionCta}
        text={labels.unrecognizedText}
        title={labels.unrecognizedTitle}
      />
    );
  }

  if (state === "error") {
    return (
      <section className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p className="font-black">{labels.errorTitle}</p>
        <p className="mt-2 font-semibold">{labels.errorText}</p>
      </section>
    );
  }

  if (predictions.length === 0) {
    return (
      <EmptyState
        ctaHref="/upcoming"
        ctaLabel={labels.firstPredictionCta}
        text={labels.emptyText}
        title={labels.emptyTitle}
      />
    );
  }

  return (
    <section className="mt-5">
      <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
          {labels.identityLabel}
        </p>
        <p className="mt-1 text-lg font-black text-slate-950">
          {identity?.alias || labels.playerFallback}
        </p>
        <p className="text-sm font-semibold text-emerald-800">
          {identity?.whatsappPhone}
        </p>
      </div>

      <div className="grid gap-3">
        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            labels={labels}
            locale={locale}
            match={matchesBySlug.get(prediction.match_slug)}
            prediction={prediction}
          />
        ))}
      </div>
    </section>
  );
}

function EmptyState({
  ctaHref,
  ctaLabel,
  text,
  title,
}: {
  ctaHref: string;
  ctaLabel: string;
  text: string;
  title: string;
}) {
  return (
    <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="pointer-events-none mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-red-500" />
      <h2 className="text-xl font-black leading-tight text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      <Link
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
        href={ctaHref}
      >
        {ctaLabel}
      </Link>
    </section>
  );
}

function PredictionCard({
  labels,
  locale,
  match,
  prediction,
}: {
  labels: ReturnType<typeof useI18n>["dict"]["myPredictions"];
  locale: "es" | "en";
  match?: WorldCupMatch;
  prediction: SavedPrediction;
}) {
  const isEditable = canEditPrediction(match);
  const matchLabel = match
    ? `${match.homeTeam.flagEmoji} ${match.homeTeam.name} ${labels.vs} ${match.awayTeam.flagEmoji} ${match.awayTeam.name}`
    : prediction.match_slug.replace(/[-_]+/g, " ");
  const kickoffLabel = match?.kickoffLabel ?? labels.unknownKickoff;
  const editHref = `/match/${encodeURIComponent(prediction.match_slug)}/predict${
    prediction.group_code
      ? `?group=${encodeURIComponent(prediction.group_code)}&edit=${encodeURIComponent(prediction.id)}`
      : `?edit=${encodeURIComponent(prediction.id)}`
  }`;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className={`h-1.5 ${isEditable ? "bg-emerald-500" : "bg-slate-400"}`} />
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              {labels.matchLabel}
            </p>
            <h2 className="mt-1 text-xl font-black leading-tight text-slate-950">
              {matchLabel}
            </h2>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black ${
              isEditable
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            {isEditable ? labels.editableStatus : labels.closedStatus}
          </span>
        </div>

        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <InfoItem label={labels.kickoffLabel} value={kickoffLabel} />
          <InfoItem
            label={labels.predictedAtLabel}
            value={formatDateTime(prediction.created_at, locale)}
          />
          <InfoItem label={labels.aliasLabel} value={prediction.alias} />
          <InfoItem
            label={labels.predictionLabel}
            value={formatMessage(labels.scoreValue, {
              scoreA: prediction.score_a,
              scoreB: prediction.score_b,
            })}
          />
          <InfoItem label={labels.groupLabel} value={prediction.group_code || labels.solistaGroup} />
        </dl>

        {prediction.score ? (
          <div className="mt-3 flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="text-2xl font-black text-emerald-700">
              {prediction.score.points % 1 === 0
                ? `${prediction.score.points}`
                : `${prediction.score.points}`} <span className="text-sm font-semibold">{labels.pointsLabel}</span>
            </span>
            <span className="text-sm font-semibold text-emerald-800">{prediction.score.score_detail}</span>
          </div>
        ) : match && match.status === "final" ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            {labels.pendingScoreLabel}
          </p>
        ) : null}

        {prediction.comment ? (
          <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            {prediction.comment}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            {match ? formatMessage(labels.cutoffHint, { time: formatMatchTime(match.kickoffUtc, locale) }) : labels.unknownCutoffHint}
          </p>
          <div className="flex flex-wrap gap-2">
            {prediction.group_code ? (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-green-600 bg-green-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
                href={`/match/${encodeURIComponent(prediction.match_slug)}/grupo?group=${encodeURIComponent(prediction.group_code)}`}
              >
                {labels.viewGroupPredictions}
              </Link>
            ) : null}
            {isEditable ? (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                href={editHref}
              >
                {labels.editButton}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 font-black text-slate-950">{value}</dd>
    </div>
  );
}
