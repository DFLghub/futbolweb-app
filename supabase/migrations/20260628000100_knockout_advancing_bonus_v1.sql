-- ============================================================
-- Knockout advancing bonus v1
-- Keeps 90-minute score scoring separate from the independent
-- +2 advancing-team bonus.
-- ============================================================

CREATE OR REPLACE FUNCTION public.puntaje_tigre_knockout(
  pred_a          INTEGER,
  pred_b          INTEGER,
  pred_advancing  TEXT,
  real_90_a       INTEGER,
  real_90_b       INTEGER,
  real_120_a      INTEGER,
  real_120_b      INTEGER,
  real_advancing  TEXT
) RETURNS NUMERIC(4,1) AS $$
DECLARE
  pred_dir          INTEGER;
  real_dir          INTEGER;
  exact_a           BOOLEAN;
  exact_b           BOOLEAN;
  reference_a       INTEGER;
  reference_b       INTEGER;
  marker_points     NUMERIC(4,1);
  marker_penalty    NUMERIC(4,1);
  advancing_bonus   NUMERIC(4,1);
BEGIN
  IF pred_a = pred_b THEN
    reference_a := COALESCE(real_120_a, real_90_a);
    reference_b := COALESCE(real_120_b, real_90_b);
    marker_points := CASE
      WHEN real_90_a = real_90_b THEN 3.0
      ELSE 0.0
    END;
    marker_penalty :=
      CASE WHEN pred_a = reference_a THEN 0.0 ELSE 0.5 END +
      CASE WHEN pred_b = reference_b THEN 0.0 ELSE 0.5 END;
    advancing_bonus := CASE
      WHEN pred_advancing = real_advancing THEN 2.0
      ELSE 0.0
    END;

    RETURN GREATEST(0.0, marker_points - marker_penalty) + advancing_bonus;
  END IF;

  pred_dir := CASE
    WHEN pred_a > pred_b THEN -1
    WHEN pred_a < pred_b THEN  1
    ELSE 0
  END;
  real_dir := CASE
    WHEN real_90_a > real_90_b THEN -1
    WHEN real_90_a < real_90_b THEN  1
    ELSE 0
  END;
  exact_a := (pred_a = real_90_a);
  exact_b := (pred_b = real_90_b);

  IF pred_dir = real_dir THEN
    IF exact_a AND exact_b THEN
      RETURN 3.0;
    ELSIF exact_a OR exact_b THEN
      RETURN 2.5;
    ELSE
      RETURN 2.0;
    END IF;
  ELSIF exact_a OR exact_b THEN
    RETURN 0.5;
  ELSE
    RETURN 0.0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.run_scoring_for_match_knockout(p_match_slug TEXT)
RETURNS TABLE (
  alias        TEXT,
  points       NUMERIC(4,1),
  score_detail TEXT
) AS $$
DECLARE
  v_90_a         INTEGER;
  v_90_b         INTEGER;
  v_120_a        INTEGER;
  v_120_b        INTEGER;
  v_advancing    TEXT;
  v_scored_count INTEGER;
  v_score_hash   TEXT;
BEGIN
  SELECT score_a, score_b, score_a_120, score_b_120, advancing_team
    INTO v_90_a, v_90_b, v_120_a, v_120_b, v_advancing
    FROM public.match_results
   WHERE match_slug = p_match_slug
     AND is_knockout = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No knockout result found for match_slug: %', p_match_slug;
  END IF;

  IF v_advancing IS NULL THEN
    RAISE EXCEPTION 'advancing_team must be set before scoring knockout match: %', p_match_slug;
  END IF;

  DELETE FROM public.prediction_scores
   WHERE match_slug = p_match_slug;

  INSERT INTO public.prediction_scores (
    prediction_id, match_slug, alias, group_code, points, score_detail
  )
  SELECT
    scored.id,
    scored.match_slug,
    scored.alias,
    scored.group_code,
    scored.points,
    CASE
      WHEN scored.predicted_draw AND scored.advancing_bonus THEN scored.regulation_detail || ' + clasificado correcto'
      WHEN scored.predicted_draw THEN scored.regulation_detail || ' + clasificado incorrecto'
      ELSE scored.regulation_detail
    END
  FROM (
    SELECT
      pi.id,
      pi.match_slug,
      pi.alias,
      pi.group_code,
      (pi.score_a = pi.score_b) AS predicted_draw,
      (pi.advancing_team = v_advancing) AS advancing_bonus,
      public.puntaje_tigre(pi.score_a, pi.score_b, v_90_a, v_90_b) AS regulation_points,
      CASE
        WHEN public.puntaje_tigre(pi.score_a, pi.score_b, v_90_a, v_90_b) = 3.0 THEN 'Le pego al partido + ambos marcadores exactos'
        WHEN public.puntaje_tigre(pi.score_a, pi.score_b, v_90_a, v_90_b) = 2.5 THEN 'Le pego al partido + un marcador exacto'
        WHEN public.puntaje_tigre(pi.score_a, pi.score_b, v_90_a, v_90_b) = 2.0 THEN 'Le pego al partido'
        WHEN public.puntaje_tigre(pi.score_a, pi.score_b, v_90_a, v_90_b) = 0.5 THEN 'Se descacho + un marcador exacto'
        ELSE 'Falla total'
      END AS regulation_detail,
      public.puntaje_tigre_knockout(
        pi.score_a,
        pi.score_b,
        pi.advancing_team,
        v_90_a,
        v_90_b,
        v_120_a,
        v_120_b,
        v_advancing
      ) AS points
    FROM public.prediction_intake pi
    WHERE pi.match_slug = p_match_slug
      AND pi.status     = 'accepted'
  ) scored;

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
      'score_hash',   v_score_hash,
      'match_phase',  'knockout'
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
      'score_hash',   v_score_hash,
      'match_phase',  'knockout'
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

GRANT EXECUTE ON FUNCTION public.puntaje_tigre_knockout(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, INTEGER, INTEGER, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.run_scoring_for_match_knockout(TEXT) TO service_role;
