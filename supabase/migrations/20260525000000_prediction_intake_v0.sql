CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.prediction_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_slug TEXT NOT NULL,
  alias TEXT NOT NULL,
  favorite_team TEXT,
  score_a INTEGER NOT NULL,
  score_b INTEGER NOT NULL,
  comment TEXT,
  group_code TEXT,
  client_submission_id TEXT,
  source TEXT NOT NULL DEFAULT 'web',
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT prediction_intake_score_a_range CHECK (score_a BETWEEN 0 AND 20),
  CONSTRAINT prediction_intake_score_b_range CHECK (score_b BETWEEN 0 AND 20),
  CONSTRAINT prediction_intake_status_check CHECK (
    status IN ('pending_review', 'accepted', 'rejected', 'demo_received')
  ),
  CONSTRAINT prediction_intake_source_check CHECK (
    source IN ('web', 'whatsapp_manual', 'admin')
  )
);

CREATE INDEX prediction_intake_created_at_desc_idx
  ON public.prediction_intake (created_at DESC);

CREATE INDEX prediction_intake_match_slug_idx
  ON public.prediction_intake (match_slug);

CREATE INDEX prediction_intake_group_code_idx
  ON public.prediction_intake (group_code);

ALTER TABLE public.prediction_intake ENABLE ROW LEVEL SECURITY;
