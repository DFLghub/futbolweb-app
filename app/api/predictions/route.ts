import { createSupabaseServerClient } from "@/lib/supabase-server";

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

function friendlyError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
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
) {
  const value = payload[key];

  if (typeof value !== "string") {
    throw new Error(`${label} es requerido.`);
  }

  const cleaned = cleanText(value);

  if (!cleaned) {
    throw new Error(`${label} es requerido.`);
  }

  if (cleaned.length > maxLength) {
    throw new Error(`${label} debe tener máximo ${maxLength} caracteres.`);
  }

  return cleaned;
}

function optionalText(
  payload: PredictionPayload,
  key: keyof PredictionPayload,
  label: string,
  maxLength: number,
) {
  const value = payload[key];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${label} debe ser texto.`);
  }

  const cleaned = cleanText(value);

  if (!cleaned) {
    return null;
  }

  if (cleaned.length > maxLength) {
    throw new Error(`${label} debe tener máximo ${maxLength} caracteres.`);
  }

  return cleaned;
}

function requiredScore(
  payload: PredictionPayload,
  key: "score_a" | "score_b",
  label: string,
) {
  const value = payload[key];

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${label} debe ser un número entero.`);
  }

  if (value < 0 || value > 20) {
    throw new Error(`${label} debe estar entre 0 y 20.`);
  }

  return value;
}

function parsePredictionPayload(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Envía un pronóstico válido.");
  }

  const predictionPayload = payload as PredictionPayload;

  return {
    match_slug: requiredText(predictionPayload, "match_slug", "El partido", 120),
    alias: requiredText(predictionPayload, "alias", "Alias o nombre", 40),
    favorite_team: optionalText(
      predictionPayload,
      "favorite_team",
      "Equipo favorito",
      60,
    ),
    score_a: requiredScore(predictionPayload, "score_a", "Marcador equipo A"),
    score_b: requiredScore(predictionPayload, "score_b", "Marcador equipo B"),
    comment: optionalText(predictionPayload, "comment", "Boconeo", 160),
    group_code: optionalText(predictionPayload, "group_code", "Código de grupo", 40),
    client_submission_id: optionalText(
      predictionPayload,
      "client_submission_id",
      "ID de envío",
      80,
    ),
  };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return friendlyError("No pudimos leer el pronóstico. Revisa los datos e intenta otra vez.");
  }

  let prediction;

  try {
    prediction = parsePredictionPayload(payload);
  } catch (error) {
    return friendlyError(
      error instanceof Error ? error.message : "Revisa tu pronóstico e intenta otra vez.",
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("prediction_intake")
      .insert({
        ...prediction,
        status: "pending_review",
        source: "web",
      })
      .select(
        "id, match_slug, alias, favorite_team, score_a, score_b, comment, group_code, created_at",
      )
      .single();

    if (error) {
      return friendlyError(
        "No pudimos guardar el pronóstico ahora mismo. Intenta de nuevo en unos minutos.",
        500,
      );
    }

    return Response.json({ ok: true, prediction: data });
  } catch {
    return friendlyError(
      "No pudimos guardar el pronóstico ahora mismo. Intenta de nuevo en unos minutos.",
      500,
    );
  }
}
