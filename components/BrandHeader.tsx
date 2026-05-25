type BrandHeaderProps = {
  className?: string;
};

export default function BrandHeader({ className = "" }: BrandHeaderProps) {
  return (
    <div
      className={`rounded-lg border border-cyan-200/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(8,18,34,0.96))] px-4 py-4 shadow-xl shadow-black/15 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-200/30 bg-amber-300/10 text-2xl shadow-inner shadow-amber-200/5">
            🐯
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-white">
              FutbolWeb.app
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/85">
              El Oráculo Futbolero
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <p className="text-sm font-medium text-slate-300">
            El Tigre juega en equipo.
          </p>
          <span className="w-fit rounded-md border border-emerald-200/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
            Modo Mundial v0.1
          </span>
        </div>
      </div>
    </div>
  );
}
