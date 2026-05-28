-- ============================================================
-- Migration 005: Simulations System
-- ============================================================

CREATE TYPE simulation_type AS ENUM (
  'roleplay', 'stress', 'reasoning', 'consequence', 'recovery', 'conflict'
);

-- Simulations
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  simulation_type simulation_type NOT NULL,
  scenario TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  context JSONB,
  ai_configuration JSONB,
  generated_by TEXT,  -- 'system' or 'ai_agent'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_simulations_sprint ON simulations(sprint_id);

-- Simulation attempts
CREATE TABLE IF NOT EXISTS simulation_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id UUID NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transcript TEXT,
  evaluation JSONB,
  telemetry JSONB,
  score FLOAT,
  emotional_score FLOAT,
  clarity_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sim_attempts_sim ON simulation_attempts(simulation_id);
CREATE INDEX idx_sim_attempts_user ON simulation_attempts(user_id);
