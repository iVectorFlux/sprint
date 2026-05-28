-- ============================================================
-- Migration 004: Sprints System
-- ============================================================

-- Sprint status
CREATE TYPE sprint_status AS ENUM (
  'not_started', 'active', 'paused', 'completed', 'abandoned'
);

-- Stage types (11-stage learning flow)
CREATE TYPE stage_type AS ENUM (
  'primer',
  'micro_skills',
  'micro_drills',
  'guided_simulation',
  'independent_simulation',
  'replay_analysis',
  'reflection',
  'escalated_retry',
  'final_assessment',
  'report',
  'reinforcement'
);

-- Stage status
CREATE TYPE stage_status AS ENUM ('locked', 'active', 'completed', 'skipped');

-- Sprints
CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  primary_skill_id UUID NOT NULL REFERENCES skills(id),
  status sprint_status DEFAULT 'not_started',
  current_stage stage_type,
  target_hours INTEGER DEFAULT 20,
  completed_hours FLOAT DEFAULT 0,
  readiness_score FLOAT,
  confidence_score FLOAT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sprints_user ON sprints(user_id);
CREATE INDEX idx_sprints_status ON sprints(status);

-- Sprint stages
CREATE TABLE IF NOT EXISTS sprint_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  stage_key stage_type NOT NULL,
  sequence_number INTEGER NOT NULL,
  status stage_status DEFAULT 'locked',
  score FLOAT,
  telemetry JSONB,
  ai_feedback JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(sprint_id, stage_key)
);

CREATE INDEX idx_sprint_stages_sprint ON sprint_stages(sprint_id);

-- User skill mastery tracking
CREATE TABLE IF NOT EXISTS user_skill_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id),
  mastery_score FLOAT DEFAULT 0,
  confidence_score FLOAT DEFAULT 0,
  retention_score FLOAT DEFAULT 1.0,
  practice_hours FLOAT DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skill_mastery_user ON user_skill_mastery(user_id);

-- User sub-skill mastery
CREATE TABLE IF NOT EXISTS user_sub_skill_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sub_skill_id UUID NOT NULL REFERENCES sub_skills(id),
  mastery_score FLOAT DEFAULT 0,
  confidence_score FLOAT DEFAULT 0,
  decay_probability FLOAT DEFAULT 0,
  reinforcement_needed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sub_skill_id)
);
