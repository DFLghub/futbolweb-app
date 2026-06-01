-- ============================================================
-- 010C — Prediction Intake Idempotency v0
-- Evita duplicados cuando el cliente reintenta el mismo envio.
-- ============================================================

WITH duplicated_submission_ids AS (
  SELECT client_submission_id
  FROM public.prediction_intake
  WHERE client_submission_id IS NOT NULL
  GROUP BY client_submission_id
  HAVING COUNT(*) > 1
),
ranked_duplicates AS (
  SELECT
    pi.id,
    pi.client_submission_id,
    ROW_NUMBER() OVER (
      PARTITION BY pi.client_submission_id
      ORDER BY pi.created_at ASC, pi.id ASC
    ) AS duplicate_rank
  FROM public.prediction_intake pi
  INNER JOIN duplicated_submission_ids dsi
    ON dsi.client_submission_id = pi.client_submission_id
)
UPDATE public.prediction_intake pi
   SET client_submission_id = ranked_duplicates.client_submission_id || ':duplicate:' || pi.id::TEXT
  FROM ranked_duplicates
 WHERE ranked_duplicates.id = pi.id
   AND ranked_duplicates.duplicate_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS prediction_intake_client_submission_id_unique_idx
  ON public.prediction_intake (client_submission_id)
  WHERE client_submission_id IS NOT NULL;
