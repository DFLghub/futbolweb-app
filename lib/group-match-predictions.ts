import { unstable_cache } from "next/cache";

import { SOLISTA_GROUP_CODE } from "@/lib/group-code";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function isSolista(groupCode: string) {
  return groupCode.toLocaleUpperCase("es") === SOLISTA_GROUP_CODE;
}

export type GroupMatchPrediction = {
  id: string;
  alias: string;
  scoreA: number;
  scoreB: number;
  comment: string | null;
  points: number | null;
  scoreDetail: string | null;
};

export const getGroupMatchPredictions = unstable_cache(
  async (matchSlug: string, groupCode: string): Promise<GroupMatchPrediction[]> => {
    try {
      const supabase = createSupabaseServerClient();

      let query = supabase
        .from("prediction_intake")
        .select("id, alias, score_a, score_b, comment")
        .eq("match_slug", matchSlug)
        .in("status", ["pending_review", "accepted"])
        .order("created_at", { ascending: true });

      if (isSolista(groupCode)) {
        query = query.or(`group_code.eq.${SOLISTA_GROUP_CODE},group_code.is.null`);
      } else {
        query = query.eq("group_code", groupCode);
      }

      const { data: predictions, error } = await query;
      if (error || !predictions || predictions.length === 0) return [];

      const predictionIds = predictions.map((p) => p.id);
      const { data: scores } = await supabase
        .from("prediction_scores")
        .select("prediction_id, points, score_detail")
        .in("prediction_id", predictionIds);

      const scoreMap = new Map(
        (scores ?? []).map((s) => [
          s.prediction_id,
          { points: Number(s.points), scoreDetail: s.score_detail as string | null },
        ]),
      );

      return predictions.map((p) => ({
        id: p.id as string,
        alias: p.alias as string,
        scoreA: p.score_a as number,
        scoreB: p.score_b as number,
        comment: (p.comment ?? null) as string | null,
        points: scoreMap.get(p.id as string)?.points ?? null,
        scoreDetail: scoreMap.get(p.id as string)?.scoreDetail ?? null,
      }));
    } catch {
      return [];
    }
  },
  ["group-match-predictions"],
  { revalidate: 60 },
);
