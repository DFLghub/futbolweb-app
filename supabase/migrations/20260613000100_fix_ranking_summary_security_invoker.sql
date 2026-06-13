-- Fix: ranking_summary view changed from SECURITY DEFINER to SECURITY INVOKER
-- Resolves Supabase Security Advisor CRITICAL warning
ALTER VIEW public.ranking_summary SET (security_invoker = true);
