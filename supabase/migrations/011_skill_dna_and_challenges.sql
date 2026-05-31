-- ============================================================
-- Migration 011: Skill DNA + Challenge Graph foundation
-- ============================================================

-- Align skills table with frontend taxonomy (archetype + Skill DNA arrays)
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS archetype TEXT,
  ADD COLUMN IF NOT EXISTS cognitive_patterns TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS evaluation_dimensions TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS telemetry_dimensions TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_skills_archetype ON skills(archetype);

-- Forward-compatible blueprint link on sprints (Learning Plan runtime)
ALTER TABLE sprints
  ADD COLUMN IF NOT EXISTS practice_blueprint_id UUID;

-- Challenge Graph: user-stated workplace goals
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  raw_context TEXT,
  inferred_skill_slugs TEXT[] DEFAULT '{}',
  inferred_patterns TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'archived')),
  score_current INTEGER CHECK (score_current IS NULL OR score_current BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);
