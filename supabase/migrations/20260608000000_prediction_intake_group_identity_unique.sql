-- ============================================================
-- 017 — Prediction Intake Group Identity
-- Enforce one phone-backed prediction per match inside each FutbolWeb group.
-- Historical rows without whatsapp_phone are left untouched.
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS prediction_intake_phone_match_group_unique_idx
  ON public.prediction_intake (whatsapp_phone, match_slug, group_code)
  WHERE whatsapp_phone IS NOT NULL;
