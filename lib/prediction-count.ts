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

export const getCachedPredictionCount = unstable_cache(
  fetchPredictionCount,
  ["prediction-count"],
  { revalidate: 120 },
);
