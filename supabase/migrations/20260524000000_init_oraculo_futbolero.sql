CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  year INTEGER,
  status TEXT DEFAULT 'draft',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  whatsapp_label TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tournament_id, slug)
);

CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  phone_label TEXT,
  joined_at TIMESTAMPTZ DEFAULT now(),
  entry_phase TEXT DEFAULT 'group_stage',
  eligible_for_overall_prize BOOLEAN DEFAULT true,
  eligible_for_phase_prize BOOLEAN DEFAULT true,
  participant_type TEXT DEFAULT 'regular',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT,
  flag_emoji TEXT,
  fifa_code TEXT,
  group_code TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES public.teams(id),
  away_team_id UUID REFERENCES public.teams(id),
  venue_id UUID REFERENCES public.venues(id),
  kickoff_utc TIMESTAMPTZ NOT NULL,
  venue_timezone TEXT DEFAULT 'America/New_York',
  stage TEXT DEFAULT 'group_stage',
  group_code TEXT,
  status TEXT DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  result_status TEXT DEFAULT 'pending',
  data_source TEXT DEFAULT 'unofficial_import',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  status TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  locked_at TIMESTAMPTZ,
  confidence_mode TEXT DEFAULT 'normal',
  is_bocon BOOLEAN DEFAULT false,
  bocon_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participant_id, match_id)
);

CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  exact_score BOOLEAN DEFAULT false,
  correct_outcome BOOLEAN DEFAULT false,
  reason TEXT,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participant_id, match_id)
);

CREATE TABLE public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  phase TEXT DEFAULT 'overall',
  points INTEGER DEFAULT 0,
  exact_scores INTEGER DEFAULT 0,
  correct_outcomes INTEGER DEFAULT 0,
  rank_position INTEGER,
  status_color TEXT DEFAULT 'green',
  snapshot_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.social_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  output_type TEXT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  target_channel TEXT DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.team_affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  affiliation_type TEXT DEFAULT 'favorite',
  phase TEXT DEFAULT 'group_stage',
  reason TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.resurrection_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  phase TEXT DEFAULT 'group_stage',
  challenge_type TEXT DEFAULT 'penitencia_whatsapp',
  description TEXT NOT NULL,
  required_action TEXT,
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_tournaments_updated_at
BEFORE UPDATE ON public.tournaments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_participants_updated_at
BEFORE UPDATE ON public.participants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_predictions_updated_at
BEFORE UPDATE ON public.predictions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_scores_updated_at
BEFORE UPDATE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_rankings_updated_at
BEFORE UPDATE ON public.rankings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_social_outputs_updated_at
BEFORE UPDATE ON public.social_outputs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_team_affiliations_updated_at
BEFORE UPDATE ON public.team_affiliations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_resurrection_challenges_updated_at
BEFORE UPDATE ON public.resurrection_challenges
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_groups_tournament_id ON public.groups(tournament_id);
CREATE INDEX idx_participants_group_id ON public.participants(group_id);
CREATE INDEX idx_teams_group_code ON public.teams(group_code);
CREATE INDEX idx_matches_tournament_id ON public.matches(tournament_id);
CREATE INDEX idx_matches_kickoff_utc ON public.matches(kickoff_utc);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_data_source ON public.matches(data_source);
CREATE INDEX idx_predictions_participant_id ON public.predictions(participant_id);
CREATE INDEX idx_predictions_match_id ON public.predictions(match_id);
CREATE INDEX idx_predictions_status ON public.predictions(status);
CREATE INDEX idx_scores_participant_id ON public.scores(participant_id);
CREATE INDEX idx_scores_match_id ON public.scores(match_id);
CREATE INDEX idx_rankings_group_id ON public.rankings(group_id);
CREATE INDEX idx_rankings_participant_id ON public.rankings(participant_id);
CREATE INDEX idx_social_outputs_group_id ON public.social_outputs(group_id);
CREATE INDEX idx_social_outputs_match_id ON public.social_outputs(match_id);
CREATE INDEX idx_social_outputs_status ON public.social_outputs(status);
CREATE INDEX idx_team_affiliations_participant_id ON public.team_affiliations(participant_id);
CREATE INDEX idx_team_affiliations_tournament_id ON public.team_affiliations(tournament_id);
CREATE INDEX idx_team_affiliations_status ON public.team_affiliations(status);
CREATE INDEX idx_resurrection_challenges_participant_id ON public.resurrection_challenges(participant_id);
CREATE INDEX idx_resurrection_challenges_group_id ON public.resurrection_challenges(group_id);
CREATE INDEX idx_resurrection_challenges_tournament_id ON public.resurrection_challenges(tournament_id);
CREATE INDEX idx_resurrection_challenges_status ON public.resurrection_challenges(status);
