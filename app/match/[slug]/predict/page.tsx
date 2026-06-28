import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import CopyPredictionInviteButton from "@/components/CopyPredictionInviteButton";
import GroupStandingsTable from "@/components/GroupStandingsTable";
import PredictDemoForm from "@/components/PredictDemoForm";
import SimpleNav from "@/components/SimpleNav";
import { groupCodeToStandingGroupId } from "@/lib/group-code";
import { getTimezoneLabel } from "@/lib/football-utils";
import { getCurrentDictionary, getCurrentLocale } from "@/lib/i18n-server";
import { isKnockoutPredictionMatch } from "@/lib/knockout-predictions";
import { mockWorldCupGroupStandings } from "@/lib/mock-group-standings";
import { getCachedRealGroupStandings } from "@/lib/real-group-standings";
import {
  localizeWorldCupGroupStandings,
  localizeWorldCupMatch,
  worldCup2026Matches,
  type WorldCupMatch,
} from "@/lib/world-cup-2026-matches";

type PredictPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    edit?: string;
    group?: string;
  }>;
};

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatMatchLabel(slug: string, unknownMatchLabel: string, match?: WorldCupMatch) {
  if (match) {
    return `${match.homeTeam.name} vs ${match.awayTeam.name} (${match.kickoffET})`;
  }

  const normalized = slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return unknownMatchLabel;
  }

  const dateMatch = normalized.match(/\b(20\d{2})\s+(\d{2})\s+(\d{2})\b/);
  const dateLabel = dateMatch
    ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
    : "";
  const teamsText = dateMatch
    ? normalized.slice(0, dateMatch.index).trim()
    : normalized;
  const teams = teamsText.split(" ").filter(Boolean);

  if (teams.length >= 2) {
    const midpoint = Math.ceil(teams.length / 2);
    const firstTeam = titleCase(teams.slice(0, midpoint).join(" "));
    const secondTeam = titleCase(teams.slice(midpoint).join(" "));
    return dateLabel
      ? `${firstTeam} vs ${secondTeam} (${dateLabel})`
      : `${firstTeam} vs ${secondTeam}`;
  }

  return titleCase(normalized);
}

export default async function PredictPage({ params, searchParams }: PredictPageProps) {
  const dict = await getCurrentDictionary();
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const { edit, group } = await searchParams;
  const initialGroupCode = group?.trim() || "";
  const knownMatchBase = worldCup2026Matches.find((match) => match.slug === slug);
  const knownMatch = knownMatchBase ? localizeWorldCupMatch(knownMatchBase, locale) : undefined;
  const matchLabel = formatMatchLabel(slug, dict.predict.unknownMatch, knownMatch);
  const homeTeamName = knownMatch?.homeTeam.name || dict.predict.fallbackHome;
  const awayTeamName = knownMatch?.awayTeam.name || dict.predict.fallbackAway;
  const knockoutTeamOptions = isKnockoutPredictionMatch(knownMatchBase)
    ? [
        { value: homeTeamName, label: `${knownMatch?.homeTeam.flagEmoji ?? ""} ${homeTeamName}`.trim() },
        { value: awayTeamName, label: `${knownMatch?.awayTeam.flagEmoji ?? ""} ${awayTeamName}`.trim() },
      ]
    : undefined;
  const relatedGroupId = groupCodeToStandingGroupId(knownMatchBase?.groupCode);
  let rawStandings = mockWorldCupGroupStandings;
  try {
    rawStandings = await getCachedRealGroupStandings();
  } catch {
    // fallback to mock on error
  }
  const localizedStandings = localizeWorldCupGroupStandings(rawStandings, locale);
  const relatedGroup = localizedStandings.find((groupStanding) => {
    return groupStanding.groupId === relatedGroupId;
  });

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-5 py-6 text-slate-950 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-3" />
        <div className="mb-5 border-b border-slate-200 pb-4">
          <SimpleNav compact />
        </div>

        <header className="mb-5">
          <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
            {dict.predict.badge}
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {dict.predict.title}
          </h1>

          {initialGroupCode ? (
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {dict.predict.invitedGroup}{" "}
              <span className="font-black">{initialGroupCode}</span>
            </div>
          ) : null}

          <CopyPredictionInviteButton
            groupCode={initialGroupCode || undefined}
            matchLabel={matchLabel}
            matchSlug={slug}
          />
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section className="space-y-5">
            <MatchContextPanel
              groupHref={relatedGroupId ? `/standings?group=${encodeURIComponent(relatedGroupId)}` : "/standings"}
              labels={{
                kickoff: dict.predict.contextKickoff,
                match: dict.predict.matchLabel,
                venue: dict.predict.contextVenue,
              }}
              matchLabel={matchLabel}
              match={knownMatch}
              timezoneLabels={dict.timezones}
            />

            <PredictDemoForm
              awayTeamName={awayTeamName}
              editingPredictionId={edit?.trim() || undefined}
              homeTeamName={homeTeamName}
              initialGroupCode={initialGroupCode}
              knockoutTeamOptions={knockoutTeamOptions}
              matchLabel={matchLabel}
              matchSlug={slug}
            />
          </section>

          {relatedGroup ? (
            <aside className="lg:sticky lg:top-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">{dict.nav.groups}</p>
                  <h2 className="text-xl font-black text-slate-950">{relatedGroup.groupName}</h2>
                </div>
                <div className="flex gap-2">
                  <Link
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
                    href={`/standings?group=${encodeURIComponent(relatedGroup.groupId)}`}
                  >
                    {dict.standings.selectorLabel}
                  </Link>
                  {initialGroupCode ? (
                    <Link
                      className="rounded-md border border-green-600 bg-green-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-green-700"
                      href={`/match/${slug}/grupo?group=${encodeURIComponent(initialGroupCode)}`}
                    >
                      {dict.groupPredictions.viewLink}
                    </Link>
                  ) : null}
                </div>
              </div>
              <GroupStandingsTable group={relatedGroup} />
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function MatchContextPanel({
  groupHref,
  labels,
  match,
  matchLabel,
  timezoneLabels,
}: {
  groupHref: string;
  labels: {
    kickoff: string;
    match: string;
    venue: string;
  };
  match?: WorldCupMatch;
  matchLabel: string;
  timezoneLabels: {
    eastern: string;
    local: string;
    pacific: string;
  };
}) {
  if (!match) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        <span className="font-semibold text-slate-950">{labels.match}</span>{" "}
        <span>{matchLabel}</span>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-500">{match.stage}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">
            {match.homeTeam.flagEmoji} {match.homeTeam.name} <span className="text-slate-500">vs</span>{" "}
            {match.awayTeam.flagEmoji} {match.awayTeam.name}
          </h2>
        </div>
        <Link
          className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-black text-sky-700 transition hover:bg-sky-100"
          href={groupHref}
        >
          {match.groupCode}
        </Link>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-black uppercase text-slate-500">{labels.kickoff}</p>
          <p className="mt-1 font-bold text-slate-950">{match.kickoffLabel}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-black uppercase text-slate-500">{labels.venue}</p>
          <p className="mt-1 font-bold text-slate-950">{match.venueName}</p>
          <p className="text-xs text-slate-500">{getTimezoneLabel(match.venueTimezone, timezoneLabels)}</p>
        </div>
      </div>
    </section>
  );
}
