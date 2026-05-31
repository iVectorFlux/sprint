/**
 * Telemetry contract for practice steps (sprint stages + future plan runtime).
 * Payloads stored in `telemetry_events` (see supabase/migrations/006_telemetry.sql).
 */

export type PracticeTelemetryEventType =
  | 'goal_submitted'
  | 'step_started'
  | 'step_completed'
  | 'drill_submitted'
  | 'simulation_turn'
  | 'simulation_ended'
  | 'reasoning_mode_completed'
  | 'report_viewed'

export interface PracticeTelemetryBase {
  event_type: PracticeTelemetryEventType
  sprint_id?: string
  skill_slug?: string
  sub_skill_slug?: string
  stage?: string
  /** Skill DNA patterns targeted in this step */
  cognitive_patterns?: string[]
  duration_ms?: number
}

export interface StepCompletedPayload extends PracticeTelemetryBase {
  event_type: 'step_completed'
  score?: number
  passed?: boolean
}

export type PracticeTelemetryPayload = PracticeTelemetryBase | StepCompletedPayload
