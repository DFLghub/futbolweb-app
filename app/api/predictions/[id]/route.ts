import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatMessage, getDictionary, localeCookieName, normalizeLocale, type Dictionary } from "@/lib/i18n";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

type PredictionUpdatePayload = {
  alias?: unknown;
  whatsapp_phone?: unknown;
  favorite_team?: unknown;
  score_a?: unknown;
  score_b?: unknown;
  comment?: unknown;
};

type PredictionUpdateRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const predictionSelect =
  "id, match_slug, alias, whatsapp_phone, favorite_team, score_a, score_b, comment, group_code, created_at";

function getRequestDictionary(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${localeCookieName}=`));
  const locale = normalizeLocale(cookie?.split("=")[1]);

  return getDictionary(locale);
}

function friendlyError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}

function findKnownMatch(matchSlug: string) {
  return worldCup2026Matches.find((match) => match.slug === matchSlug);
}

function canAcceptPrediction(match: NonNullable<ReturnType<typeof findKnownMatch>>) {
  const predictionCutoffMs = 5 * 60 * 1000;

  return match.status !== "final" && new Date(match.kickoffUtc).getTime() - predictionCutoffMs > Date.now();
}

function cleanText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function requiredText(
  payload: PredictionUpdatePayload,
  key: keyof PredictionUpdatePayload,
  label: string,
  maxLength: number,
  dict: Dictionary,
) {
  const value = payload[key];

  if (typeof value !== "string") {
    throw new Error(formatMessage(dict.api.required, { label }));
  }

  const cleaned = cleanText(value);

  if (!cleaned) {
    throw new Error(formatMessage(dict.api.required, { label }));
  }

  if (cleaned.length > maxLength) {
    throw new Error(formatMessage(dict.api.maxLength, { label, maxLength }));
  }

  return cleaned;
}

function optionalText(
  payload: PredictionUpdatePayload,
  key: keyof PredictionUpdatePayload,
  label: string,
  maxLength: number,
  dict: Dictionary,
) {
  const value = payload[key];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(formatMessage(dict.api.textOnly, { label }));
  }

  const cleaned = cleanText(value);

  if (!cleaned) {
    return null;
  }

  if (cleaned.length > maxLength) {
    throw new Error(formatMessage(dict.api.maxLength, { label, maxLength }));
  }

  return cleaned;
}

function requiredWhatsAppPhone(payload: PredictionUpdatePayload, dict: Dictionary) {
  const value = requiredText(payload, "whatsapp_phone", dict.api.whatsappPhone, 20, dict);
  const normalizedPhone = value.replace(/[\s().-]/g, "");

  if (!/^\+[1-9]\d{6,14}$/.test(normalizedPhone)) {
    throw new Error(dict.api.whatsappPhoneFormat);
  }

  return normalizedPhone;
}

function requiredScore(
  payload: PredictionUpdatePayload,
  key: "score_a" | "score_b",
  label: string,
  dict: Dictionary,
) {
  const value = payload[key];

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(formatMessage(dict.api.integer, { label }));
  }

  if (value < 0 || value > 20) {
    throw new Error(formatMessage(dict.api.scoreRange, { label }));
  }

  return value;
}

function parsePredictionUpdatePayload(payload: unknown, dict: Dictionary) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(dict.api.invalidPrediction);
  }

  const predictionPayload = payload as PredictionUpdatePayload;

  return {
    alias: requiredText(predictionPayload, "alias", dict.api.aliasRequired, 40, dict),
    whatsapp_phone: requiredWhatsAppPhone(predictionPayload, dict),
    favorite_team: optionalText(
      predictionPayload,
      "favorite_team",
      dict.api.favoriteTeam,
      60,
      dict,
    ),
    score_a: requiredScore(predictionPayload, "score_a", dict.api.scoreA, dict),
    score_b: requiredScore(predictionPayload, "score_b", dict.api.scoreB, dict),
    comment: optionalText(predictionPayload, "comment", dict.api.comment, 160, dict),
  };
}

export async function PATCH(request: Request, { params }: PredictionUpdateRouteProps) {
  const dict = getRequestDictionary(request);
  const { id } = await params;
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return friendlyError(dict.api.readError);
  }

  let predictionUpdate;

  try {
    predictionUpdate = parsePredictionUpdatePayload(payload, dict);
  } catch (error) {
    return friendlyError(
      error instanceof Error ? error.message : dict.api.reviewError,
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: existingPrediction, error: existingPredictionError } = await supabase
      .from("prediction_intake")
      .select(predictionSelect)
      .eq("id", id)
      .eq("whatsapp_phone", predictionUpdate.whatsapp_phone)
      .maybeSingle();

    if (existingPredictionError) {
      console.error("[predictions-update-api] supabase error", existingPredictionError);
      return friendlyError(dict.api.saveError, 500);
    }

    if (!existingPrediction) {
      return friendlyError(dict.api.unknownPrediction, 404);
    }

    const knownMatch = findKnownMatch(existingPrediction.match_slug);

    if (!knownMatch) {
      return friendlyError(dict.api.unknownMatch, 400);
    }

    if (!canAcceptPrediction(knownMatch)) {
      return friendlyError(dict.api.closedMatch, 400);
    }

    const { data, error } = await supabase
      .from("prediction_intake")
      .update({
        alias: predictionUpdate.alias,
        favorite_team: predictionUpdate.favorite_team,
        score_a: predictionUpdate.score_a,
        score_b: predictionUpdate.score_b,
        comment: predictionUpdate.comment,
      })
      .eq("id", existingPrediction.id)
      .eq("whatsapp_phone", predictionUpdate.whatsapp_phone)
      .select(predictionSelect)
      .single();

    if (error) {
      console.error("[predictions-update-api] supabase error", error);
      return friendlyError(dict.api.saveError, 500);
    }

    return Response.json({ ok: true, prediction: data });
  } catch (error) {
    console.error("[predictions-update-api] unhandled error", {
      message: error instanceof Error ? error.message : String(error),
    });

    return friendlyError(dict.api.saveError, 500);
  }
}
