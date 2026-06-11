-- Temporary manual official result seed for the FIFA World Cup 2026 opener.
-- FIFA match id: 400021443
-- FIFA match centre: https://www.fifa.com/en/match-centre/match/17/285023/289273/400021443
-- Backup verification: AP, 2026-06-11, Mexico opened with a 2-0 win over South Africa.
-- This only records the official result row. It does not run scoring or change RLS/ranking rules.
INSERT INTO public.match_results (
  match_slug,
  score_a,
  score_b,
  confirmed_at,
  confirmed_by
)
VALUES (
  'mexico-south-africa-2026-06-11',
  2,
  0,
  '2026-06-11T17:35:18Z',
  'manual-ap-fifa-match-centre'
)
ON CONFLICT (match_slug) DO UPDATE
SET
  score_a = EXCLUDED.score_a,
  score_b = EXCLUDED.score_b,
  confirmed_at = EXCLUDED.confirmed_at,
  confirmed_by = EXCLUDED.confirmed_by;
