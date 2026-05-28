-- ============================================================
-- Migration 003: Skills Ontology
-- ============================================================

-- Learning engine types
CREATE TYPE learning_engine_type AS ENUM (
  'simulation_based',
  'structured_reasoning',
  'consequence_simulation',
  'stress_simulation',
  'reflective_ai_mirror',
  'recovery_conditioning',
  'cognitive_conflict',
  'constraint_architecture'
);

-- Skills (top-level capabilities)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  learning_engine_type learning_engine_type NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sub-skills (micro-skills within each skill)
CREATE TABLE IF NOT EXISTS sub_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  telemetry_schema JSONB,
  evaluation_schema JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_skills_skill ON sub_skills(skill_id);

-- Skill dependencies (prerequisite graph)
CREATE TABLE IF NOT EXISTS skill_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_skill_id UUID NOT NULL REFERENCES sub_skills(id) ON DELETE CASCADE,
  dependent_skill_id UUID NOT NULL REFERENCES sub_skills(id) ON DELETE CASCADE,
  UNIQUE(parent_skill_id, dependent_skill_id)
);
