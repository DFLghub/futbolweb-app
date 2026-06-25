import { unstable_cache } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

async function fetchPredictionCount(): Promise<number> {
  try {
    const supabase = createSupabaseServerClient();
    const { count, error } = await supabase
      .from("prediction_intake")
      .select("*", { count: "exact", head: true });

    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

export const PREDICTION_COUNT_TAG = "prediction-count";

export const getCachedPredictionCount = unstable_cache(
  fetchPredictionCount,
  [PREDICTION_COUNT_TAG],
  { revalidate: 120, tags: [PREDICTION_COUNT_TAG] },
);
