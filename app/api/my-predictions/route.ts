import { createSupabaseServerClient } from "@/lib/supabase-server";

type MyPredictionsQuery = {
  whatsapp_phone?: unknown;
};

const predictionSelect =
  "id, match_slug, alias, favorite_team, score_a, score_b, comment, group_code, status, created_at";

function cleanPhone(value: string) {
  return value.replace(/[\s().-]/g, "");
}

function parseQuery(url: string): MyPredictionsQuery {
  const searchParams = new URL(url).searchParams;

  return {
    whatsapp_phone: searchParams.get("whatsapp_phone"),
  };
}

function friendlyError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}

export async function GET(request: Request) {
  const query = parseQuery(request.url);

  if (typeof query.whatsapp_phone !== "string") {
    return friendlyError("whatsapp_phone is required.");
  }

  const whatsappPhone = cleanPhone(query.whatsapp_phone);

  if (!/^\+[1-9]\d{6,14}$/.test(whatsappPhone)) {
    return friendlyError("whatsapp_phone must use international format.");
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("prediction_intake")
      .select(predictionSelect)
      .eq("whatsapp_phone", whatsappPhone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[my-predictions-api] supabase error", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return friendlyError("Could not load predictions.", 500);
    }

    return Response.json({ ok: true, predictions: data ?? [] });
  } catch (error) {
    console.error("[my-predictions-api] unhandled error", {
      message: error instanceof Error ? error.message : String(error),
    });

    return friendlyError("Could not load predictions.", 500);
  }
}
