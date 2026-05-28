-- ============================================================
-- Migration 006: Telemetry System
-- Flexible event_type + payload pattern
-- ============================================================

CREATE TABLE IF NOT EXISTS telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,  -- e.g., 'voice_analysis', 'reasoning_eval', 'behavior_signal'
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_telemetry_user ON telemetry_events(user_id);
CREATE INDEX idx_telemetry_sprint ON telemetry_events(sprint_id);
CREATE INDEX idx_telemetry_type ON telemetry_events(event_type);
CREATE INDEX idx_telemetry_created ON telemetry_events(created_at);
