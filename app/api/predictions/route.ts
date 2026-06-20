import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatMessage, getDictionary, localeCookieName, normalizeLocale, type Dictionary } from "@/lib/i18n";
import { normalizeGroupCode } from "@/lib/group-code";
import { worldCup2026Matches } from "@/lib/world-cup-2026-matches";

type PredictionPayload = {
  match_slug?: unknown;
  alias?: unknown;
  whatsapp_phone?: unknown;
  favorite_team?: unknown;
  score_a?: unknown;
  score_b?: unknown;
  advancing_team?: unknown;
  comment?: unknown;
  group_code?: unknown;
  client_submission_id?: unknown;
};

const predictionSelect =
  "id, match_slug, alias, whatsapp_phone, favorite_team, score_a, score_b, advancing_team, comment, group_code, created_at";

type SavedPrediction = {
  id: string;
  match_slug: string;
  whatsapp_phone?: string | null;
  group_code: string | null;
};

function getRequestDictionary(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${localeCookieName}=`));
  const locale = normalizeLocale(cookie?.split("=")[1]);

  return getDictionary(locale);
}

function friendlyError(message: string, status = 400, code?: string) {
  return Response.json(
    { ok: false, message, ...(code ? { code } : {}) },
    { status },
  );
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

async function recordPredictionSubmittedEvent(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  prediction: SavedPrediction,
) {
  if (!prediction.id) {
    console.error("[predictions-api] missing prediction id for state event", {
      match_slug: prediction.match_slug,
    });
    return;
  }

  const { error } = await supabase.rpc("record_state_change_event", {
    p_event_type: "PredictionSubmitted",
    p_entity_type: "prediction_intake",
    p_entity_id: prediction.id,
    p_match_slug: prediction.match_slug,
    p_group_code: prediction.group_code,
    p_dedupe_key: `PredictionSubmitted:${prediction.id}`,
    p_payload: { source: "web" },
    p_source: "web",
  });

  if (error) {
    logSupabaseError(error);
  }
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

function optionalWhatsAppPhone(payload: PredictionPayload, dict: Dictionary) {
  const value = optionalText(
    payload,
    "whatsapp_phone",
    dict.api.whatsappPhone,
    20,
    dict,
  );

  if (!value) {
    return null;
  }

  const normalizedPhone = value.replace(/[\s().-]/g, "");

  if (!/^\+[1-9]\d{6,14}$/.test(normalizedPhone)) {
    throw new Error(dict.api.whatsappPhoneFormat);
  }

  return normalizedPhone;
}

function requiredWhatsAppPhone(payload: PredictionPayload, dict: Dictionary) {
  const normalizedPhone = optionalWhatsAppPhone(payload, dict);

  if (!normalizedPhone) {
    throw new Error(formatMessage(dict.api.required, { label: dict.api.whatsappPhone }));
  }

  return normalizedPhone;
}

async function findExistingPredictionIdentity(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  prediction: {
    whatsapp_phone: string;
    match_slug: string;
    group_code: string;
  },
) {
  return supabase
    .from("prediction_intake")
    .select(predictionSelect)
    .eq("whatsapp_phone", prediction.whatsapp_phone)
    .eq("match_slug", prediction.match_slug)
    .eq("group_code", prediction.group_code)
    .maybeSingle();
}

async function findExistingPredictionBySubmissionId(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  clientSubmissionId: string,
) {
  return supabase
    .from("prediction_intake")
    .select(predictionSelect)
    .eq("client_submission_id", clientSubmissionId)
    .maybeSingle();
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
    advancing_team: optionalText(
      predictionPayload,
      "advancing_team",
      "advancing_team",
      80,
      dict,
    ),
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
      const { data: existingPrediction, error: existingPredictionError } =
        await findExistingPredictionBySubmissionId(supabase, prediction.client_submission_id);

      if (existingPredictionError) {
        logSupabaseError(existingPredictionError);

        return friendlyError(
          dict.api.saveError,
          500,
        );
      }

      if (existingPrediction) {
        await recordPredictionSubmittedEvent(supabase, existingPrediction);

        return Response.json({ ok: true, prediction: existingPrediction });
      }
    }

    const { data: existingPredictionIdentity, error: existingPredictionIdentityError } =
      await findExistingPredictionIdentity(supabase, prediction);

    if (existingPredictionIdentityError) {
      logSupabaseError(existingPredictionIdentityError);

      return friendlyError(
        dict.api.saveError,
        500,
      );
    }

    if (existingPredictionIdentity) {
      return friendlyError(dict.api.duplicatePrediction, 409);
    }

    const { data, error } = await supabase
      .from("prediction_intake")
      .insert({
        ...prediction,
        status: "accepted",
        source: "web",
      })
      .select(predictionSelect)
      .single();

    if (error) {
      if (prediction.client_submission_id && isUniqueViolation(error)) {
        const { data: existingPrediction, error: existingPredictionError } =
          await findExistingPredictionBySubmissionId(supabase, prediction.client_submission_id);

        if (!existingPredictionError && existingPrediction) {
          await recordPredictionSubmittedEvent(supabase, existingPrediction);

          return Response.json({ ok: true, prediction: existingPrediction });
        }

        if (existingPredictionError) {
          logSupabaseError(existingPredictionError);
        }

        return friendlyError(dict.api.saveError, 503, "high_traffic");
      }

      if (isUniqueViolation(error)) {
        const {
          data: existingPredictionIdentityAfterConflict,
          error: existingPredictionIdentityAfterConflictError,
        } = await findExistingPredictionIdentity(supabase, prediction);

        if (!existingPredictionIdentityAfterConflictError && existingPredictionIdentityAfterConflict) {
          return friendlyError(dict.api.duplicatePrediction, 409);
        }

        if (existingPredictionIdentityAfterConflictError) {
          logSupabaseError(existingPredictionIdentityAfterConflictError);
        }

        return friendlyError(dict.api.saveError, 503, "high_traffic");
      }

      logSupabaseError(error);

      return friendlyError(
        dict.api.saveError,
        500,
      );
    }

    await recordPredictionSubmittedEvent(supabase, data);

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
