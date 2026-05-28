-- ============================================================
-- Migration 010: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sub_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Skills & Sub-skills: Readable by all authenticated users
-- ============================================================

CREATE POLICY "Skills are readable by all authenticated users"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sub-skills are readable by all authenticated users"
  ON sub_skills FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Users: Users can read/update their own record
-- ============================================================

CREATE POLICY "Users can read own record"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- ============================================================
-- User Profiles: Own data only
-- ============================================================

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- Sprints: Own data only
-- ============================================================

CREATE POLICY "Users can read own sprints"
  ON sprints FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sprints"
  ON sprints FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sprints"
  ON sprints FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Sprint stages: Via sprint ownership
CREATE POLICY "Users can read own sprint stages"
  ON sprint_stages FOR SELECT
  TO authenticated
  USING (
    sprint_id IN (SELECT id FROM sprints WHERE user_id = auth.uid())
  );

-- ============================================================
-- Mastery: Own data
-- ============================================================

CREATE POLICY "Users can read own skill mastery"
  ON user_skill_mastery FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own sub-skill mastery"
  ON user_sub_skill_mastery FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- Simulations & Attempts: Via sprint ownership
-- ============================================================

CREATE POLICY "Users can read own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (
    sprint_id IN (SELECT id FROM sprints WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can read own simulation attempts"
  ON simulation_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- Telemetry, Memory, Reports, Uploads: Own data
-- ============================================================

CREATE POLICY "Users can read own telemetry"
  ON telemetry_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own conversation memory"
  ON conversation_memory FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own memory nodes"
  ON memory_nodes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own uploads"
  ON uploaded_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own uploads"
  ON uploaded_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- Organizations: Members can read their org
-- ============================================================

CREATE POLICY "Org members can read their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Enterprise reports: Admins of the org
CREATE POLICY "Org admins can read enterprise reports"
  ON enterprise_reports FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );
