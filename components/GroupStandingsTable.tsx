"use client";

import { useI18n } from "@/components/I18nProvider";
import type {
  GroupStanding,
  GroupStandingTeam,
} from "@/lib/mock-group-standings";

type GroupStandingsTableProps = {
  group: GroupStanding;
};

function formatGoalDifference(goalDifference: number) {
  if (goalDifference > 0) return `+${goalDifference}`;
  return String(goalDifference);
}

export default function GroupStandingsTable({ group }: GroupStandingsTableProps) {
  const { dict } = useI18n();
  const hasResults = group.teams.some((team) => team.played > 0);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <header className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h2 className="text-2xl font-black text-slate-950">{group.groupName}</h2>
        {!hasResults ? (
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {dict.standings.tableNote}
          </p>
        ) : null}
      </header>

      <div className="hidden grid-cols-[52px_1.4fr_repeat(7,52px)_72px] gap-2 border-b border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-500 md:grid">
        <span>#</span>
        <span>{dict.standings.headers.team}</span>
        <span className="text-center">{dict.standings.headers.played}</span>
        <span className="text-center">{dict.standings.headers.won}</span>
        <span className="text-center">{dict.standings.headers.drawn}</span>
        <span className="text-center">{dict.standings.headers.lost}</span>
        <span className="text-center">{dict.standings.headers.goalsFor}</span>
        <span className="text-center">{dict.standings.headers.goalsAgainst}</span>
        <span className="text-center">{dict.standings.headers.goalDifference}</span>
        <span className="text-center">{dict.standings.headers.points}</span>
      </div>

      <div className="divide-y divide-slate-200">
        {group.teams.map((team) => (
          <StandingRow key={team.teamId} team={team} />
        ))}
      </div>
    </section>
  );
}

function StandingRow({ team }: { team: GroupStandingTeam }) {
  const { dict } = useI18n();

  return (
    <article className="px-4 py-4 md:grid md:grid-cols-[52px_1.4fr_repeat(7,52px)_72px] md:items-center md:gap-2 md:py-3">
      <div className="grid grid-cols-[42px_1fr_auto] items-center gap-3 md:contents">
        <span className="font-black text-slate-950 md:block">#{team.rank}</span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-slate-950">{team.teamName}</h3>
        </div>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-black text-slate-950 md:hidden">
          {team.points} {dict.standings.headers.points}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-sm md:contents">
        <MobileStat label={dict.standings.headers.played} value={team.played} />
        <MobileStat label={dict.standings.headers.won} value={team.won} />
        <MobileStat label={dict.standings.headers.drawn} value={team.drawn} />
        <MobileStat label={dict.standings.headers.lost} value={team.lost} />
        <MobileStat label={dict.standings.headers.goalsFor} value={team.goalsFor} />
        <MobileStat label={dict.standings.headers.goalsAgainst} value={team.goalsAgainst} />
        <MobileStat label={dict.standings.headers.goalDifference} value={formatGoalDifference(team.goalDifference)} strong={team.goalDifference > 0} />
      </div>

      <span className="hidden text-center font-black text-slate-950 md:block">{team.played}</span>
      <span className="hidden text-center font-semibold text-slate-700 md:block">{team.won}</span>
      <span className="hidden text-center font-semibold text-slate-700 md:block">{team.drawn}</span>
      <span className="hidden text-center font-semibold text-slate-700 md:block">{team.lost}</span>
      <span className="hidden text-center font-semibold text-slate-700 md:block">{team.goalsFor}</span>
      <span className="hidden text-center font-semibold text-slate-700 md:block">{team.goalsAgainst}</span>
      <span className="hidden text-center font-semibold text-slate-700 md:block">
        {formatGoalDifference(team.goalDifference)}
      </span>
      <div className="hidden items-center justify-center gap-2 md:flex">
        <span className="font-black text-slate-950">{team.points}</span>
      </div>
    </article>
  );
}

function MobileStat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number | string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-2 md:hidden">
      <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
      <p className={strong ? "mt-1 font-black text-emerald-700" : "mt-1 font-bold text-slate-950"}>{value}</p>
    </div>
  );
}
