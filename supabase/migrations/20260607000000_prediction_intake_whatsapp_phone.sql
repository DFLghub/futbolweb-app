ALTER TABLE public.prediction_intake
  ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;
