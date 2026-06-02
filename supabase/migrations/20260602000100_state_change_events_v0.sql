-- ============================================================
-- 12A — State Change Event Layer v0
-- Eventos de negocio persistidos, idempotentes y sin side effects externos.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.state_change_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT        NOT NULL,
  entity_type  TEXT        NOT NULL,
  entity_id    UUID,
  match_slug   TEXT,
  group_code   TEXT,
  dedupe_key   TEXT        NOT NULL,
  payload      JSONB       NOT NULL DEFAULT '{}'::JSONB,
  source       TEXT        NOT NULL DEFAULT 'system',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT state_change_events_event_type_check CHECK (
    event_type IN (
      'PredictionSubmitted',
      'MatchResultEntered',
      'ScoringCompleted',
      'RankingUpdated'
    )
  ),
  CONSTRAINT state_change_events_payload_size_check CHECK (
    pg_column_size(payload) <= 2048
  ),
  CONSTRAINT state_change_events_dedupe_key_unique UNIQUE (dedupe_key)
);

CREATE INDEX IF NOT EXISTS state_change_events_created_at_desc_idx
  ON public.state_change_events (created_at DESC);

CREATE INDEX IF NOT EXISTS state_change_events_event_type_idx
  ON public.state_change_events (event_type);

CREATE INDEX IF NOT EXISTS state_change_events_match_slug_idx
  ON public.state_change_events (match_slug);

CREATE INDEX IF NOT EXISTS state_change_events_group_code_idx
  ON public.state_change_events (group_code);

ALTER TABLE public.state_change_events ENABLE ROW LEVEL SECURITY;

-- MatchResultEntered queda reservado para un punto explicito de carga de resultados.
-- En 12A, run_scoring_for_match solo emite ScoringCompleted y RankingUpdated.
CREATE OR REPLACE FUNCTION public.record_state_change_event(
  p_event_type  TEXT,
  p_entity_type TEXT,
  p_entity_id   UUID,
  p_match_slug  TEXT,
  p_group_code  TEXT,
  p_dedupe_key  TEXT,
  p_payload     JSONB DEFAULT '{}'::JSONB,
  p_source      TEXT DEFAULT 'system'
) RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO public.state_change_events (
    event_type,
    entity_type,
    entity_id,
    match_slug,
    group_code,
    dedupe_key,
    payload,
    source
  )
  VALUES (
    p_event_type,
    p_entity_type,
    p_entity_id,
    p_match_slug,
    p_group_code,
    p_dedupe_key,
    COALESCE(p_payload, '{}'::JSONB),
    COALESCE(p_source, 'system')
  )
  ON CONFLICT (dedupe_key) DO NOTHING
  RETURNING id INTO v_event_id;

  IF v_event_id IS NULL THEN
    SELECT id
      INTO v_event_id
      FROM public.state_change_events
     WHERE dedupe_key = p_dedupe_key;
  END IF;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT SELECT, INSERT ON TABLE public.state_change_events TO service_role;
GRANT EXECUTE ON FUNCTION public.record_state_change_event(
  TEXT,
  TEXT,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  JSONB,
  TEXT
) TO service_role;

CREATE OR REPLACE FUNCTION run_scoring_for_match(p_match_slug TEXT)
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

GRANT EXECUTE ON FUNCTION run_scoring_for_match(TEXT) TO service_role;
