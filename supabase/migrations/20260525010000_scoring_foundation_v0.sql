-- ============================================================
-- 009A — Scoring Foundation v0
-- Puntaje Tigre v0.1
-- Scoring manual. Sin triggers. Solo status = accepted cuenta.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabla de resultados oficiales
CREATE TABLE public.match_results (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  match_slug    TEXT          NOT NULL UNIQUE,
  score_a       INTEGER       NOT NULL,
  score_b       INTEGER       NOT NULL,
  confirmed_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  confirmed_by  TEXT          NOT NULL DEFAULT 'admin',
  CONSTRAINT match_results_score_a_range CHECK (score_a BETWEEN 0 AND 20),
  CONSTRAINT match_results_score_b_range CHECK (score_b BETWEEN 0 AND 20)
);

-- 2. Tabla de puntos calculados
CREATE TABLE public.prediction_scores (
  id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id  UUID           NOT NULL REFERENCES public.prediction_intake(id),
  match_slug     TEXT           NOT NULL,
  alias          TEXT           NOT NULL,
  group_code     TEXT,
  points         NUMERIC(4,1)   NOT NULL,
  score_detail   TEXT           NOT NULL,
  calculated_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
  CONSTRAINT prediction_scores_prediction_id_unique UNIQUE (prediction_id)
);

CREATE INDEX prediction_scores_match_slug_idx ON public.prediction_scores (match_slug);
CREATE INDEX prediction_scores_alias_idx      ON public.prediction_scores (alias);
CREATE INDEX prediction_scores_group_code_idx ON public.prediction_scores (group_code);

-- 3. Función Puntaje Tigre v0.1
CREATE OR REPLACE FUNCTION puntaje_tigre(
  pred_a INTEGER, pred_b INTEGER,
  real_a INTEGER, real_b INTEGER
) RETURNS NUMERIC(4,1) AS $$
DECLARE
  pred_result INTEGER;
  real_result INTEGER;
  exact_a     BOOLEAN;
  exact_b     BOOLEAN;
BEGIN
  pred_result := CASE WHEN pred_a > pred_b THEN -1 WHEN pred_a < pred_b THEN 1 ELSE 0 END;
  real_result := CASE WHEN real_a > real_b THEN -1 WHEN real_a < real_b THEN 1 ELSE 0 END;
  exact_a     := (pred_a = real_a);
  exact_b     := (pred_b = real_b);

  IF pred_result = real_result THEN
    IF exact_a AND exact_b THEN RETURN 3.0; END IF;
    IF exact_a OR exact_b THEN RETURN 2.5; END IF;
    RETURN 2.0;
  ELSE
    IF exact_a OR exact_b THEN RETURN 0.5; END IF;
    RETURN 0.0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Función de scoring manual para un match_slug
--    Solo procesa predicciones con status = 'accepted'.
--    Idempotente: borra scores anteriores del mismo match antes de recalcular.
CREATE OR REPLACE FUNCTION run_scoring_for_match(p_match_slug TEXT)
RETURNS TABLE (
  alias         TEXT,
  points        NUMERIC(4,1),
  score_detail  TEXT
) AS $$
DECLARE
  v_real_a  INTEGER;
  v_real_b  INTEGER;
BEGIN
  SELECT score_a, score_b
    INTO v_real_a, v_real_b
    FROM public.match_results
   WHERE match_slug = p_match_slug;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe resultado oficial para match_slug: %', p_match_slug;
  END IF;

  DELETE FROM public.prediction_scores
   WHERE match_slug = p_match_slug;

  INSERT INTO public.prediction_scores (
    prediction_id, match_slug, alias, group_code, points, score_detail
  )
  SELECT
    pi.id,
    pi.match_slug,
    pi.alias,
    pi.group_code,
    puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b),
    CASE
      WHEN puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b) = 3.0
        THEN 'Resultado correcto + marcador exacto'
      WHEN puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b) = 2.5
        THEN 'Resultado correcto + un marcador exacto'
      WHEN puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b) = 2.0
        THEN 'Resultado correcto'
      WHEN puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b) = 0.5
        THEN 'Resultado incorrecto + un marcador exacto'
      ELSE 'Falla total'
    END
  FROM public.prediction_intake pi
  WHERE pi.match_slug = p_match_slug
    AND pi.status     = 'accepted';

  RETURN QUERY
    SELECT ps.alias, ps.points, ps.score_detail
      FROM public.prediction_scores ps
     WHERE ps.match_slug = p_match_slug
     ORDER BY ps.points DESC, ps.alias;
END;
$$ LANGUAGE plpgsql;

-- 5. RLS
ALTER TABLE public.match_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_scores ENABLE ROW LEVEL SECURITY;

-- 6. GRANTs explícitos para service_role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.match_results TO service_role;
GRANT SELECT, INSERT, DELETE ON TABLE public.prediction_scores TO service_role;
GRANT EXECUTE ON FUNCTION puntaje_tigre(INTEGER, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION run_scoring_for_match(TEXT) TO service_role;
