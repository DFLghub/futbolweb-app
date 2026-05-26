import BrandHeader from "@/components/BrandHeader";
import RankingTable from "@/components/RankingTable";
import SimpleNav from "@/components/SimpleNav";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { RankingParticipant } from "@/lib/ranking-types";

export const dynamic = "force-dynamic";

function deriveStatus(position: number): RankingParticipant["status"] {
  if (position === 1) return "gold";
  if (position <= 3) return "green";
  if (position <= 5) return "yellow";
  if (position <= 7) return "purple";
  return "red";
}

async function getRanking(groupCode?: string): Promise<RankingParticipant[]> {
  try {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from("ranking_summary")
      .select("position, name, group_code, points, exact_scores, correct_results")
      .order("position", { ascending: true });

    if (groupCode) {
      query = query.eq("group_code", groupCode);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r, index) => ({
      position: groupCode ? index + 1 : r.position,
      name: r.name,
      points: Number(r.points),
      exactScores: Number(r.exact_scores),
      correctResults: Number(r.correct_results),
      groupCode: r.group_code ?? undefined,
      status: deriveStatus(groupCode ? index + 1 : r.position),
      isBocon: false,
    }));
  } catch {
    return [];
  }
}

type PageProps = {
  searchParams: Promise<{ group?: string }>;
};

export default async function RankingPage({ searchParams }: PageProps) {
  const { group } = await searchParams;
  const groupCode = group?.trim() || undefined;
  const participants = await getRanking(groupCode);
  const isLive = participants.length > 0;
  const isFiltered = Boolean(groupCode);

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-4" />
        <SimpleNav />

        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              {isFiltered ? `Ranking — Grupo ${groupCode}` : "Ranking Global"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              {isFiltered
                ? `Posiciones dentro del grupo ${groupCode}. Cada punto se presume.`
                : "Zona de gloria, zona de pelea y zona roja. Cada punto se presume en el grupo."}
            </p>

            {isFiltered && (
              <a
                href="/ranking"
                className="mt-3 inline-block text-sm font-semibold text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
              >
                Ver ranking global
              </a>
            )}
          </div>

          <div
            className={`w-fit rounded-md border px-3 py-2 text-sm font-black shadow-lg ${
              isLive
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100 shadow-emerald-950/20"
                : "border-amber-200/30 bg-amber-300/10 text-amber-100 shadow-amber-950/10"
            }`}
          >
            {isLive
              ? isFiltered
                ? `Grupo ${groupCode}`
                : "En vivo — datos reales"
              : "Sin datos aún"}
          </div>
        </header>

        {isFiltered && !isLive && (
          <div className="mt-8 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-5 text-sm text-amber-100">
            <p className="font-black">No hay datos todavía para este grupo.</p>
            <p className="mt-2 text-amber-100/80">
              Cuando haya pronósticos aceptados y puntuados, aparecerán aquí.
            </p>
          </div>
        )}

        <RankingTable participants={participants} groupCode={groupCode} />
      </div>
    </main>
  );
}
