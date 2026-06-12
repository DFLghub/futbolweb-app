import { unstable_cache } from "next/cache";

import type { RankingParticipant } from "@/lib/ranking-types";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function deriveStatus(position: number, points: number): RankingParticipant["status"] {
  if (points <= 0) return "red";
  if (position === 1) return "gold";
  if (position <= 3) return "green";
  if (position <= 5) return "yellow";
  if (position <= 7) return "purple";
  return "red";
}

async function fetchRanking(groupCode?: string): Promise<RankingParticipant[]> {
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
      status: deriveStatus(groupCode ? index + 1 : r.position, Number(r.points)),
      isBocon: false,
    }));
  } catch {
    return [];
  }
}

export function getRanking(groupCode?: string): Promise<RankingParticipant[]> {
  const cacheKey = groupCode ? `real-ranking-${groupCode}` : "real-ranking-global";
  return unstable_cache(
    () => fetchRanking(groupCode),
    [cacheKey],
    { revalidate: 60 },
  )();
}
