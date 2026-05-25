INSERT INTO public.tournaments (
  id,
  name,
  slug,
  year,
  status,
  starts_at,
  ends_at
) VALUES (
  '11111111-1111-4111-8111-111111111111',
  'World Cup 2026 Test',
  'world-cup-2026-test',
  2026,
  'draft',
  now(),
  now() + interval '45 days'
);

INSERT INTO public.groups (
  id,
  tournament_id,
  name,
  slug,
  whatsapp_label,
  description
) VALUES (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Grupo Demo WhatsApp',
  'grupo-demo-whatsapp',
  'Demo WhatsApp',
  'Grupo de prueba para Oraculo Futbolero'
);

INSERT INTO public.teams (
  id,
  name,
  country,
  flag_emoji,
  fifa_code,
  group_code
) VALUES
  ('33333333-3333-4333-8333-333333333331', 'Colombia', 'Colombia', '🇨🇴', 'COL', 'A'),
  ('33333333-3333-4333-8333-333333333332', 'Japón', 'Japan', '🇯🇵', 'JPN', 'A'),
  ('33333333-3333-4333-8333-333333333333', 'Brasil', 'Brazil', '🇧🇷', 'BRA', 'B'),
  ('33333333-3333-4333-8333-333333333334', 'Argentina', 'Argentina', '🇦🇷', 'ARG', 'A');

INSERT INTO public.venues (
  id,
  name,
  city,
  country,
  timezone
) VALUES
  ('44444444-4444-4444-8444-444444444441', 'Miami Stadium', 'Miami', 'United States', 'America/New_York'),
  ('44444444-4444-4444-8444-444444444442', 'NY Arena', 'New York', 'United States', 'America/New_York');

INSERT INTO public.matches (
  id,
  tournament_id,
  home_team_id,
  away_team_id,
  venue_id,
  kickoff_utc,
  venue_timezone,
  stage,
  group_code,
  status,
  home_score,
  away_score,
  result_status,
  data_source,
  verified_at
) VALUES
  (
    '55555555-5555-4555-8555-555555555551',
    '11111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333331',
    '33333333-3333-4333-8333-333333333332',
    '44444444-4444-4444-8444-444444444441',
    now() + interval '2 days',
    'America/New_York',
    'group_stage',
    'A',
    'scheduled',
    NULL,
    NULL,
    'pending',
    'test_seed',
    NULL
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    '11111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333331',
    '33333333-3333-4333-8333-333333333334',
    '44444444-4444-4444-8444-444444444442',
    now() - interval '1 day',
    'America/New_York',
    'group_stage',
    'A',
    'final',
    2,
    1,
    'confirmed',
    'test_seed',
    now()
  );

INSERT INTO public.participants (
  id,
  group_id,
  display_name,
  phone_label
) VALUES
  ('66666666-6666-4666-8666-666666666661', '22222222-2222-4222-8222-222222222222', 'Jorge', '+1 demo jorge'),
  ('66666666-6666-4666-8666-666666666662', '22222222-2222-4222-8222-222222222222', 'Ana', '+1 demo ana'),
  ('66666666-6666-4666-8666-666666666663', '22222222-2222-4222-8222-222222222222', 'Carlos', '+1 demo carlos');

INSERT INTO public.team_affiliations (
  id,
  participant_id,
  team_id,
  tournament_id,
  affiliation_type,
  phase,
  reason
) VALUES
  (
    '77777777-7777-4777-8777-777777777771',
    '66666666-6666-4666-8666-666666666661',
    '33333333-3333-4333-8333-333333333331',
    '11111111-1111-4111-8111-111111111111',
    'favorite',
    'group_stage',
    'Afinidad original'
  ),
  (
    '77777777-7777-4777-8777-777777777772',
    '66666666-6666-4666-8666-666666666662',
    '33333333-3333-4333-8333-333333333334',
    '11111111-1111-4111-8111-111111111111',
    'favorite',
    'group_stage',
    'Afinidad original'
  ),
  (
    '77777777-7777-4777-8777-777777777773',
    '66666666-6666-4666-8666-666666666663',
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    'favorite',
    'group_stage',
    'Afinidad original'
  );

INSERT INTO public.predictions (
  id,
  participant_id,
  match_id,
  home_score,
  away_score,
  status
) VALUES
  (
    '88888888-8888-4888-8888-888888888881',
    '66666666-6666-4666-8666-666666666661',
    '55555555-5555-4555-8555-555555555551',
    2,
    0,
    'submitted'
  ),
  (
    '88888888-8888-4888-8888-888888888882',
    '66666666-6666-4666-8666-666666666661',
    '55555555-5555-4555-8555-555555555552',
    2,
    1,
    'submitted'
  ),
  (
    '88888888-8888-4888-8888-888888888883',
    '66666666-6666-4666-8666-666666666662',
    '55555555-5555-4555-8555-555555555552',
    1,
    0,
    'submitted'
  ),
  (
    '88888888-8888-4888-8888-888888888884',
    '66666666-6666-4666-8666-666666666663',
    '55555555-5555-4555-8555-555555555552',
    0,
    2,
    'submitted'
  );

INSERT INTO public.scores (
  id,
  participant_id,
  match_id,
  points,
  exact_score,
  correct_outcome,
  reason
) VALUES
  (
    '99999999-9999-4999-8999-999999999991',
    '66666666-6666-4666-8666-666666666661',
    '55555555-5555-4555-8555-555555555552',
    3,
    true,
    true,
    'Marcador exacto'
  ),
  (
    '99999999-9999-4999-8999-999999999992',
    '66666666-6666-4666-8666-666666666662',
    '55555555-5555-4555-8555-555555555552',
    1,
    false,
    true,
    'Ganador correcto'
  ),
  (
    '99999999-9999-4999-8999-999999999993',
    '66666666-6666-4666-8666-666666666663',
    '55555555-5555-4555-8555-555555555552',
    0,
    false,
    false,
    'Falló predicción'
  );

INSERT INTO public.rankings (
  id,
  group_id,
  participant_id,
  tournament_id,
  phase,
  points,
  exact_scores,
  correct_outcomes,
  rank_position,
  status_color
) VALUES
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '22222222-2222-4222-8222-222222222222',
    '66666666-6666-4666-8666-666666666661',
    '11111111-1111-4111-8111-111111111111',
    'overall',
    3,
    1,
    1,
    1,
    'gold'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '22222222-2222-4222-8222-222222222222',
    '66666666-6666-4666-8666-666666666662',
    '11111111-1111-4111-8111-111111111111',
    'overall',
    1,
    0,
    1,
    2,
    'green'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '22222222-2222-4222-8222-222222222222',
    '66666666-6666-4666-8666-666666666663',
    '11111111-1111-4111-8111-111111111111',
    'overall',
    0,
    0,
    0,
    3,
    'red'
  );

INSERT INTO public.social_outputs (
  id,
  group_id,
  match_id,
  output_type,
  title,
  body,
  status,
  target_channel
) VALUES (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '22222222-2222-4222-8222-222222222222',
  '55555555-5555-4555-8555-555555555551',
  'today_matches',
  'Partidos de hoy',
  'Hoy el Oraculo tiene Colombia vs Japon como partido destacado del grupo demo.',
  'draft',
  'whatsapp'
);

INSERT INTO public.resurrection_challenges (
  id,
  participant_id,
  group_id,
  tournament_id,
  phase,
  challenge_type,
  description,
  required_action,
  status
) VALUES (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '66666666-6666-4666-8666-666666666663',
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'group_stage',
  'penitencia_whatsapp',
  'Carlos debe completar una penitencia de resurreccion por quedar en zona roja.',
  'Enviar una prediccion cantada al grupo antes del proximo partido.',
  'pending'
);
