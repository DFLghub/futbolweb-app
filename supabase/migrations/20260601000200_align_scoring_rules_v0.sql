-- ============================================================
-- 010B — Align Scoring Rules v0
-- Regla MVP visible: marcador exacto = 3, resultado correcto = 1, fallo = 0.
-- Mantiene scoring manual e idempotente por match_slug.
-- ============================================================

CREATE OR REPLACE FUNCTION puntaje_tigre(
  pred_a INTEGER, pred_b INTEGER,
  real_a INTEGER, real_b INTEGER
) RETURNS NUMERIC(4,1) AS $$
DECLARE
  pred_result INTEGER;
  real_result INTEGER;
BEGIN
  IF pred_a = real_a AND pred_b = real_b THEN
    RETURN 3.0;
  END IF;

  pred_result := CASE WHEN pred_a > pred_b THEN -1 WHEN pred_a < pred_b THEN 1 ELSE 0 END;
  real_result := CASE WHEN real_a > real_b THEN -1 WHEN real_a < real_b THEN 1 ELSE 0 END;

  IF pred_result = real_result THEN
    RETURN 1.0;
  END IF;

  RETURN 0.0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

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
    scored_prediction.id,
    scored_prediction.match_slug,
    scored_prediction.alias,
    scored_prediction.group_code,
    scored_prediction.points,
    CASE
      WHEN scored_prediction.points = 3.0 THEN 'Marcador exacto'
      WHEN scored_prediction.points = 1.0 THEN 'Resultado correcto'
      ELSE 'Falla total'
    END
  FROM (
    SELECT
      pi.id,
      pi.match_slug,
      pi.alias,
      pi.group_code,
      puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b) AS points
    FROM public.prediction_intake pi
    WHERE pi.match_slug = p_match_slug
      AND pi.status     = 'accepted'
  ) scored_prediction;

  RETURN QUERY
    SELECT ps.alias, ps.points, ps.score_detail
      FROM public.prediction_scores ps
     WHERE ps.match_slug = p_match_slug
     ORDER BY ps.points DESC, ps.alias;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION puntaje_tigre(INTEGER, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION run_scoring_for_match(TEXT) TO service_role;
