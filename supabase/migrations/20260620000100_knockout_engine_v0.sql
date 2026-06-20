-- ============================================================
-- Knockout Engine v0
-- Adds schema support and scoring logic for elimination-stage
-- matches. Purely additive — no existing columns modified.
-- ============================================================

-- ── Schema additions ──────────────────────────────────────

ALTER TABLE public.match_results
  ADD COLUMN is_knockout    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN score_a_120    INTEGER,
  ADD COLUMN score_b_120    INTEGER,
  ADD COLUMN advancing_team TEXT;

ALTER TABLE public.prediction_intake
  ADD COLUMN advancing_team TEXT;

-- ── puntaje_tigre_knockout() ──────────────────────────────
--
-- Business rules:
--
-- CASE 1 (non-draw prediction):
--   Evaluated against the 90-min scoreline using the same
--   puntaje_tigre logic as group stage.
--
-- CASE 2 (draw prediction + advancing team):
--   Evaluated against the 120-min scoreline.
--   Exact 120-min score + correct advancing team  → 3.0
--   Exact 120-min score + wrong advancing team    → 2.5
--   Anything else                                 → 0.0

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
  predicted_draw BOOLEAN;
  pred_dir       INTEGER;
  real_dir       INTEGER;
  exact_a        BOOLEAN;
  exact_b        BOOLEAN;
BEGIN
  predicted_draw := (pred_a = pred_b);

  -- CASE 1: non-draw prediction
  IF NOT predicted_draw THEN
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
      IF exact_a AND exact_b THEN RETURN 3.0; END IF;
      IF exact_a OR  exact_b THEN RETURN 2.5; END IF;
      RETURN 2.0;
    END IF;

    IF exact_a OR exact_b THEN RETURN 0.5; END IF;
    RETURN 0.0;
  END IF;

  -- CASE 2: draw prediction
  IF real_120_a IS NULL OR real_120_b IS NULL THEN
    RETURN 0.0;
  END IF;

  IF pred_a = real_120_a AND pred_b = real_120_b THEN
    IF pred_advancing = real_advancing THEN
      RETURN 3.0;
    END IF;
    RETURN 2.5;
  END IF;

  RETURN 0.0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ── run_scoring_for_match_knockout() ─────────────────────
--
-- Knockout equivalent of run_scoring_for_match().
-- Reads is_knockout from match_results — caller must ensure
-- the match was inserted with is_knockout = true and a non-null
-- advancing_team before invoking this function.

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
      WHEN scored.points = 3.0 THEN 'Marcador exacto + clasificado correcto'
      WHEN scored.points = 2.5 AND scored.predicted_draw THEN 'Marcador exacto + clasificado incorrecto'
      WHEN scored.points = 2.5 THEN 'Le pego al partido + un marcador exacto'
      WHEN scored.points = 2.0 THEN 'Le pego al partido'
      WHEN scored.points = 0.5 THEN 'Se descacho + un marcador exacto'
      ELSE 'Falla total'
    END
  FROM (
    SELECT
      pi.id,
      pi.match_slug,
      pi.alias,
      pi.group_code,
      (pi.score_a = pi.score_b) AS predicted_draw,
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
