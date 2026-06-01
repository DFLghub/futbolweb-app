import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatMessage, getDictionary, localeCookieName, normalizeLocale, type Dictionary } from "@/lib/i18n";
import { normalizeGroupCode } from "@/lib/group-code";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

type PredictionPayload = {
  match_slug?: unknown;
  alias?: unknown;
  favorite_team?: unknown;
  score_a?: unknown;
  score_b?: unknown;
  comment?: unknown;
  group_code?: unknown;
  client_submission_id?: unknown;
};

const predictionSelect =
  "id, match_slug, alias, favorite_team, score_a, score_b, comment, group_code, created_at";

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

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function errorName(error: unknown) {
  if (!(error instanceof Error)) {
    return undefined;
  }

  return error.name || error.constructor.name;
}

function logSupabaseError(error: {
  message: string;
  code?: unknown;
  details?: unknown;
  hint?: unknown;
  status?: unknown;
}) {
  console.error("[predictions-api] supabase error", {
    message: error.message,
    ...(error.code !== undefined ? { code: error.code } : {}),
    ...(error.details !== undefined ? { details: error.details } : {}),
    ...(error.hint !== undefined ? { hint: error.hint } : {}),
    ...(error.status !== undefined ? { status: error.status } : {}),
  });
}

function isUniqueViolation(error: { code?: unknown }) {
  return error.code === "23505";
}

function findKnownMatch(matchSlug: string) {
  return worldCup2026Matches.find((match) => match.slug === matchSlug);
}

function canAcceptPrediction(match: NonNullable<ReturnType<typeof findKnownMatch>>) {
  return match.status !== "final" && new Date(match.kickoffUtc).getTime() > Date.now();
}

function cleanText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function requiredText(
  payload: PredictionPayload,
  key: keyof PredictionPayload,
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
  payload: PredictionPayload,
  key: keyof PredictionPayload,
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

function requiredScore(
  payload: PredictionPayload,
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

function parsePredictionPayload(payload: unknown, dict: Dictionary) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(dict.api.invalidPrediction);
  }

  const predictionPayload = payload as PredictionPayload;

  return {
    match_slug: requiredText(predictionPayload, "match_slug", dict.api.matchRequired, 120, dict),
    alias: requiredText(predictionPayload, "alias", dict.api.aliasRequired, 40, dict),
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
    group_code: normalizeGroupCode(
      optionalText(predictionPayload, "group_code", dict.api.groupCode, 40, dict),
    ),
    client_submission_id: optionalText(
      predictionPayload,
      "client_submission_id",
      dict.api.clientSubmissionId,
      80,
      dict,
    ),
  };
}

export async function POST(request: Request) {
  const dict = getRequestDictionary(request);
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return friendlyError(dict.api.readError);
  }

  let prediction;

  try {
    prediction = parsePredictionPayload(payload, dict);
  } catch (error) {
    return friendlyError(
      error instanceof Error ? error.message : dict.api.reviewError,
    );
  }

  const knownMatch = findKnownMatch(prediction.match_slug);

  if (!knownMatch) {
    return friendlyError(dict.api.unknownMatch, 400);
  }

  if (!canAcceptPrediction(knownMatch)) {
    return friendlyError(dict.api.closedMatch, 400);
  }

  try {
    console.log("[predictions-api] insert attempt", {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      match_slug: prediction.match_slug,
      alias_length: prediction.alias.length,
      score_a: prediction.score_a,
      score_b: prediction.score_b,
    });

    const supabase = createSupabaseServerClient();

    if (prediction.client_submission_id) {
      const { data: existingPrediction, error: existingPredictionError } = await supabase
        .from("prediction_intake")
        .select(predictionSelect)
        .eq("client_submission_id", prediction.client_submission_id)
        .maybeSingle();

      if (existingPredictionError) {
        logSupabaseError(existingPredictionError);

        return friendlyError(
          dict.api.saveError,
          500,
        );
      }

      if (existingPrediction) {
        return Response.json({ ok: true, prediction: existingPrediction });
      }
    }

    const { data, error } = await supabase
      .from("prediction_intake")
      .insert({
        ...prediction,
        status: "pending_review",
        source: "web",
      })
      .select(predictionSelect)
      .single();

    if (error) {
      if (prediction.client_submission_id && isUniqueViolation(error)) {
        const { data: existingPrediction, error: existingPredictionError } = await supabase
          .from("prediction_intake")
          .select(predictionSelect)
          .eq("client_submission_id", prediction.client_submission_id)
          .single();

        if (!existingPredictionError && existingPrediction) {
          return Response.json({ ok: true, prediction: existingPrediction });
        }

        if (existingPredictionError) {
          logSupabaseError(existingPredictionError);
        }
      }

      logSupabaseError(error);

      return friendlyError(
        dict.api.saveError,
        500,
      );
    }

    return Response.json({ ok: true, prediction: data });
  } catch (error) {
    console.error("[predictions-api] unhandled error", {
      message: errorMessage(error),
      ...(errorName(error) ? { name: errorName(error) } : {}),
    });

    return friendlyError(
      dict.api.saveError,
      500,
    );
  }
}
