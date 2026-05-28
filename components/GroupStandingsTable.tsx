import type {
  GroupStanding,
  GroupStandingStatus,
  GroupStandingTeam,
} from "@/lib/mock-group-standings";

type GroupStandingsTableProps = {
  group: GroupStanding;
};

const statusLabels: Record<GroupStandingStatus, string> = {
  qualified: "Clasifica",
  at_risk: "En riesgo",
  pending: "Pendiente",
  eliminated: "Eliminado",
};

const statusClasses: Record<GroupStandingStatus, string> = {
  qualified: "border-emerald-200/35 bg-emerald-300/10 text-emerald-100",
  at_risk: "border-amber-200/35 bg-amber-300/10 text-amber-100",
  pending: "border-cyan-200/30 bg-cyan-300/10 text-cyan-100",
  eliminated: "border-rose-200/35 bg-rose-400/10 text-rose-100",
};

function formatGoalDifference(goalDifference: number) {
  if (goalDifference > 0) return `+${goalDifference}`;
  return String(goalDifference);
}

export default function GroupStandingsTable({ group }: GroupStandingsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/75 shadow-xl shadow-black/15">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#07111f] px-4 py-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Clasificacion</p>
          <h2 className="mt-1 text-2xl font-black text-white">{group.groupName}</h2>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-black text-slate-200">
          En vivo demo
        </span>
      </header>

      <div className="hidden grid-cols-[52px_1.4fr_repeat(7,52px)_72px] gap-2 border-b border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-400 md:grid">
        <span>#</span>
        <span>Equipo</span>
        <span className="text-center">PJ</span>
        <span className="text-center">G</span>
        <span className="text-center">E</span>
        <span className="text-center">P</span>
        <span className="text-center">GF</span>
        <span className="text-center">GC</span>
        <span className="text-center">DG</span>
        <span className="text-center">Pts</span>
      </div>

      <div className="divide-y divide-white/10">
        {group.teams.map((team) => (
          <StandingRow key={team.teamId} team={team} />
        ))}
      </div>
    </section>
  );
}

function StandingRow({ team }: { team: GroupStandingTeam }) {
  return (
    <article className="px-4 py-4 md:grid md:grid-cols-[52px_1.4fr_repeat(7,52px)_72px] md:items-center md:gap-2 md:py-3">
      <div className="grid grid-cols-[42px_1fr_auto] items-center gap-3 md:contents">
        <span className="font-black text-slate-100 md:block">#{team.rank}</span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-white">{team.teamName}</h3>
          <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-black md:hidden ${statusClasses[team.status]}`}>
            {statusLabels[team.status]}
          </span>
        </div>
        <span className="rounded-md bg-cyan-300 px-2.5 py-1 text-sm font-black text-slate-950 md:hidden">
          {team.points} pts
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-sm md:contents">
        <MobileStat label="PJ" value={team.played} />
        <MobileStat label="G" value={team.won} />
        <MobileStat label="E" value={team.drawn} />
        <MobileStat label="P" value={team.lost} />
        <MobileStat label="GF" value={team.goalsFor} />
        <MobileStat label="GC" value={team.goalsAgainst} />
        <MobileStat label="DG" value={formatGoalDifference(team.goalDifference)} strong={team.goalDifference > 0} />
      </div>

      <span className="hidden text-center font-black text-white md:block">{team.played}</span>
      <span className="hidden text-center font-semibold text-slate-200 md:block">{team.won}</span>
      <span className="hidden text-center font-semibold text-slate-200 md:block">{team.drawn}</span>
      <span className="hidden text-center font-semibold text-slate-200 md:block">{team.lost}</span>
      <span className="hidden text-center font-semibold text-slate-200 md:block">{team.goalsFor}</span>
      <span className="hidden text-center font-semibold text-slate-200 md:block">{team.goalsAgainst}</span>
      <span className="hidden text-center font-semibold text-slate-200 md:block">
        {formatGoalDifference(team.goalDifference)}
      </span>
      <div className="hidden items-center justify-center gap-2 md:flex">
        <span className="font-black text-white">{team.points}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${statusClasses[team.status]}`}>
          {statusLabels[team.status]}
        </span>
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
    <div className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-2 md:hidden">
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
      <p className={strong ? "mt-1 font-black text-emerald-100" : "mt-1 font-bold text-slate-100"}>{value}</p>
    </div>
  );
}
