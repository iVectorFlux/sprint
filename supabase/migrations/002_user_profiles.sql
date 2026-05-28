-- ============================================================
-- Migration 002: User Cognitive Profiles (Learning Genome)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Personality & Behavioral
  personality_model JSONB,        -- DISC, Big Five, MBTI data
  communication_style JSONB,      -- Preferred communication patterns
  behavioral_patterns JSONB,      -- Observed behavioral tendencies
  emotional_patterns JSONB,       -- Emotional response patterns

  -- Scores
  learning_velocity_score FLOAT,
  adaptability_score FLOAT,
  confidence_score FLOAT,
  stress_response_profile JSONB,

  -- Strengths & Weaknesses
  strengths JSONB,
  weaknesses JSONB,
  motivations JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
