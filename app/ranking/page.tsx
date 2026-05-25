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

async function getRanking(): Promise<RankingParticipant[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ranking_summary")
      .select("position, name, group_code, points, exact_scores, correct_results")
      .order("position", { ascending: true });

    if (error || !data) return [];

    return data.map((r) => ({
      position: r.position,
      name: r.name,
      points: Number(r.points),
      exactScores: Number(r.exact_scores),
      correctResults: Number(r.correct_results),
      groupCode: r.group_code ?? undefined,
      status: deriveStatus(r.position),
      isBocon: false,
    }));
  } catch {
    return [];
  }
}

export default async function RankingPage() {
  const participants = await getRanking();
  const isLive = participants.length > 0;

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <BrandHeader className="mb-4" />
        <SimpleNav />

        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Ranking del Grupo</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Zona de gloria, zona de pelea y zona roja. Cada punto se presume en el grupo.
            </p>
          </div>
          <div
            className={`w-fit rounded-md border px-3 py-2 text-sm font-black shadow-lg ${
              isLive
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100 shadow-emerald-950/20"
                : "border-amber-200/30 bg-amber-300/10 text-amber-100 shadow-amber-950/10"
            }`}
          >
            {isLive ? "En vivo — datos reales" : "Sin datos aún"}
          </div>
        </header>

        <RankingTable participants={participants} />
      </div>
    </main>
  );
}
