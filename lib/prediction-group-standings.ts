import { unstable_cache } from "next/cache";

import { SOLISTA_GROUP_CODE } from "@/lib/group-code";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type PredictionScoreRow = {
  alias: string;
  group_code: string | null;
  points: number | string;
  calculated_at: string;
};

export type PredictionGroupStanding = {
  rank: number;
  alias: string;
  groupCode: string;
  totalPoints: number;
  predictionsCounted: number;
  latestCalculatedAt: string;
};

function normalizeStandingGroupCode(groupCode: string | null | undefined) {
  const cleaned = groupCode?.replace(/\s+/g, " ").trim();
  return cleaned || SOLISTA_GROUP_CODE;
}

function isSolistaGroupCode(groupCode: string | null | undefined) {
  return normalizeStandingGroupCode(groupCode).toLocaleUpperCase("es") === SOLISTA_GROUP_CODE;
}

function sortGroupCodes(groupA: string, groupB: string) {
  if (groupA === SOLISTA_GROUP_CODE) return -1;
  if (groupB === SOLISTA_GROUP_CODE) return 1;
  return groupA.localeCompare(groupB, "es", { sensitivity: "base" });
}

export const getPredictionStandingGroupCodes = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("prediction_scores").select("group_code");

      if (error || !data) return [];

      return Array.from(
        new Set(
          data.map((row) => normalizeStandingGroupCode(row.group_code)),
        ),
      ).sort(sortGroupCodes);
    } catch {
      return [];
    }
  },
  ["prediction-standing-group-codes"],
  { revalidate: 60 },
);

export const getPredictionGroupStandings = unstable_cache(
  async (groupCode: string = SOLISTA_GROUP_CODE): Promise<PredictionGroupStanding[]> => {
    const selectedGroupCode = normalizeStandingGroupCode(groupCode);

    try {
      const supabase = createSupabaseServerClient();
      let query = supabase
        .from("prediction_scores")
        .select("alias, group_code, points, calculated_at");

      if (isSolistaGroupCode(selectedGroupCode)) {
        query = query.or(`group_code.eq.${SOLISTA_GROUP_CODE},group_code.is.null`);
      } else {
        query = query.eq("group_code", selectedGroupCode);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      const standingsByAlias = new Map<string, Omit<PredictionGroupStanding, "rank">>();

      for (const row of data as PredictionScoreRow[]) {
        const rowGroupCode = normalizeStandingGroupCode(row.group_code);

        if (
          !isSolistaGroupCode(selectedGroupCode) &&
          rowGroupCode !== selectedGroupCode
        ) {
          continue;
        }

        const current = standingsByAlias.get(row.alias);

        if (!current) {
          standingsByAlias.set(row.alias, {
            alias: row.alias,
            groupCode: selectedGroupCode,
            totalPoints: Number(row.points),
            predictionsCounted: 1,
            latestCalculatedAt: row.calculated_at,
          });
          continue;
        }

        current.totalPoints += Number(row.points);
        current.predictionsCounted += 1;

        if (Date.parse(row.calculated_at) > Date.parse(current.latestCalculatedAt)) {
          current.latestCalculatedAt = row.calculated_at;
        }
      }

      return Array.from(standingsByAlias.values())
        .sort((standingA, standingB) => (
          standingB.totalPoints - standingA.totalPoints ||
          standingB.predictionsCounted - standingA.predictionsCounted ||
          standingA.alias.localeCompare(standingB.alias, "es", { sensitivity: "base" })
        ))
        .map((standing, index) => ({
          ...standing,
          rank: index + 1,
          totalPoints: Number(standing.totalPoints.toFixed(1)),
        }));
    } catch {
      return [];
    }
  },
  ["prediction-group-standings"],
  { revalidate: 60 },
);
