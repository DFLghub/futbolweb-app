-- ============================================================
-- 010A — Ranking Summary v0
-- Fuente minima para /ranking.
-- Agrega puntos calculados por alias y grupo desde prediction_scores.
-- ============================================================

CREATE OR REPLACE VIEW public.ranking_summary AS
WITH player_scores AS (
  SELECT
    ps.alias AS name,
    ps.group_code,
    SUM(ps.points)::NUMERIC(10,1) AS points,
    COUNT(*) FILTER (WHERE ps.points = 3.0)::INTEGER AS exact_scores,
    COUNT(*) FILTER (WHERE ps.points = 1.0)::INTEGER AS correct_results
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

GRANT SELECT ON public.ranking_summary TO service_role;
