-- ============================================================
-- Migration 008: Reports System
-- ============================================================

-- Individual sprint reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  report_type TEXT DEFAULT 'sprint_completion',
  summary JSONB,
  strengths JSONB,
  weaknesses JSONB,
  recommendations JSONB,
  telemetry_summary JSONB,
  report_embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_sprint ON reports(sprint_id);

-- Enterprise-level reports
CREATE TABLE IF NOT EXISTS enterprise_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  report_name TEXT,
  report_type TEXT,  -- 'capability_map', 'leadership_readiness', 'skill_gap', 'risk'
  insights JSONB,
  trends JSONB,
  risk_analysis JSONB,
  skill_heatmaps JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enterprise_reports_org ON enterprise_reports(organization_id);
