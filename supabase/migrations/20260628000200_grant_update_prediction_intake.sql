-- service_role needs UPDATE to support prediction edits via the PATCH API route.
-- Without this, /api/predictions/[id] PATCH returns 500 for all users.
GRANT UPDATE ON public.prediction_intake TO service_role;
