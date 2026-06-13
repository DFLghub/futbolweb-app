-- ============================================================
-- 13A — Update Scoring Partial Points v1
-- Puntaje Tigre v1:
-- - Le pega al partido + ambos marcadores exactos = 3.0
-- - Le pega al partido + un marcador exacto = 2.5
-- - Le pega al partido + ambos marcadores fallados = 2.0
-- - Se descacha + un marcador exacto = 0.5
-- - Se descacha + ningun marcador exacto = 0.0
-- ============================================================

CREATE OR REPLACE FUNCTION public.puntaje_tigre(
  pred_a INTEGER,
  pred_b INTEGER,
  real_a INTEGER,
  real_b INTEGER
) RETURNS NUMERIC(4,1) AS $$
DECLARE
  pred_result INTEGER;
  real_result INTEGER;
  exact_a     BOOLEAN;
  exact_b     BOOLEAN;
BEGIN
  pred_result := CASE
    WHEN pred_a > pred_b THEN -1
    WHEN pred_a < pred_b THEN 1
    ELSE 0
  END;

  real_result := CASE
    WHEN real_a > real_b THEN -1
    WHEN real_a < real_b THEN 1
    ELSE 0
  END;

  exact_a := (pred_a = real_a);
  exact_b := (pred_b = real_b);

  IF pred_result = real_result THEN
    IF exact_a AND exact_b THEN
      RETURN 3.0;
    END IF;

    IF exact_a OR exact_b THEN
      RETURN 2.5;
    END IF;

    RETURN 2.0;
  END IF;

  IF exact_a OR exact_b THEN
    RETURN 0.5;
  END IF;

  RETURN 0.0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.run_scoring_for_match(p_match_slug TEXT)
RETURNS TABLE (
  alias         TEXT,
  points        NUMERIC(4,1),
  score_detail  TEXT
) AS $$
DECLARE
  v_real_a       INTEGER;
  v_real_b       INTEGER;
  v_scored_count INTEGER;
  v_score_hash   TEXT;
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
      WHEN scored_prediction.points = 3.0 THEN 'Le pego al partido + ambos marcadores exactos'
      WHEN scored_prediction.points = 2.5 THEN 'Le pego al partido + un marcador exacto'
      WHEN scored_prediction.points = 2.0 THEN 'Le pego al partido'
      WHEN scored_prediction.points = 0.5 THEN 'Se descacho + un marcador exacto'
      ELSE 'Falla total'
    END
  FROM (
    SELECT
      pi.id,
      pi.match_slug,
      pi.alias,
      pi.group_code,
      public.puntaje_tigre(pi.score_a, pi.score_b, v_real_a, v_real_b) AS points
    FROM public.prediction_intake pi
    WHERE pi.match_slug = p_match_slug
      AND pi.status     = 'accepted'
  ) scored_prediction;

  SELECT
    COUNT(*)::INTEGER,
    COALESCE(
      MD5(
        STRING_AGG(
          ps.prediction_id::TEXT || ':' || ps.points::TEXT,
          '|'
          ORDER BY ps.prediction_id::TEXT
        )
      ),
      'empty'
    )
    INTO v_scored_count, v_score_hash
    FROM public.prediction_scores ps
   WHERE ps.match_slug = p_match_slug;

  PERFORM public.record_state_change_event(
    'ScoringCompleted',
    'prediction_scores',
    NULL,
    p_match_slug,
    NULL,
    'ScoringCompleted:' || p_match_slug || ':' || v_score_hash,
    JSONB_BUILD_OBJECT(
      'scored_count', v_scored_count,
      'score_hash', v_score_hash
    ),
    'scoring'
  );

  PERFORM public.record_state_change_event(
    'RankingUpdated',
    'ranking_summary',
    NULL,
    p_match_slug,
    NULL,
    'RankingUpdated:' || p_match_slug || ':' || v_score_hash,
    JSONB_BUILD_OBJECT(
      'source_event', 'ScoringCompleted',
      'scored_count', v_scored_count,
      'score_hash', v_score_hash
    ),
    'scoring'
  );

  RETURN QUERY
    SELECT ps.alias, ps.points, ps.score_detail
      FROM public.prediction_scores ps
     WHERE ps.match_slug = p_match_slug
     ORDER BY ps.points DESC, ps.alias;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE VIEW public.ranking_summary AS
WITH player_scores AS (
  SELECT
    ps.alias AS name,
    ps.group_code,
    SUM(ps.points)::NUMERIC(10,1) AS points,
    COUNT(*) FILTER (WHERE ps.points = 3.0)::INTEGER AS exact_scores,
    COUNT(*) FILTER (WHERE ps.points IN (3.0, 2.5, 2.0))::INTEGER AS correct_results
  FROM public.prediction_scores ps
  GROUP BY ps.alias, ps.group_code
)
SELECT
  (
    RANK() OVER (
      ORDER BY
        player_scores.points DESC,
        player_scores.exact_scores DESC,
        player_scores.correct_results DESC,
        LOWER(player_scores.name) ASC
    )
  )::INTEGER AS position,
  player_scores.name,
  player_scores.group_code,
  player_scores.points,
  player_scores.exact_scores,
  player_scores.correct_results
FROM player_scores;

GRANT EXECUTE ON FUNCTION public.puntaje_tigre(INTEGER, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.run_scoring_for_match(TEXT) TO service_role;
GRANT SELECT ON public.ranking_summary TO service_role;
