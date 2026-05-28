/* ============================================================
   Lumi6 Skill Lab — TypeScript Type Definitions
   ============================================================ */

// --- Enums ---

export type UserRole = 'learner' | 'manager' | 'admin' | 'super_admin'

export type SprintStatus = 'not_started' | 'active' | 'paused' | 'completed' | 'abandoned'

export type StageType =
  | 'primer'
  | 'micro_skills'
  | 'micro_drills'
  | 'guided_simulation'
  | 'independent_simulation'
  | 'replay_analysis'
  | 'reflection'
  | 'escalated_retry'
  | 'final_assessment'
  | 'report'
  | 'reinforcement'

export type StageStatus = 'locked' | 'active' | 'completed' | 'skipped'

export type LearningEngineType =
  | 'simulation_based'
  | 'structured_reasoning'
  | 'consequence_simulation'
  | 'stress_simulation'
  | 'reflective_ai_mirror'
  | 'recovery_conditioning'
  | 'cognitive_conflict'
  | 'constraint_architecture'

export type SimulationType =
  | 'roleplay'
  | 'stress'
  | 'reasoning'
  | 'consequence'
  | 'recovery'
  | 'conflict'

// --- Core Entities ---

export interface Organization {
  id: string
  name: string
  domain: string | null
  industry: string | null
  size_range: string | null
  country: string | null
  created_at: string
}

export interface User {
  id: string
  organization_id: string | null
  email: string
  full_name: string | null
  role: UserRole
  department: string | null
  seniority: string | null
  country: string | null
  timezone: string | null
  years_experience: number | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  personality_model: Record<string, unknown> | null
  communication_style: Record<string, unknown> | null
  behavioral_patterns: Record<string, unknown> | null
  emotional_patterns: Record<string, unknown> | null
  learning_velocity_score: number | null
  adaptability_score: number | null
  confidence_score: number | null
  stress_response_profile: Record<string, unknown> | null
  strengths: string[] | null
  weaknesses: string[] | null
  motivations: string[] | null
  created_at: string
  updated_at: string
}

// --- Skills ---

export interface Skill {
  id: string
  name: string
  category: string | null
  description: string | null
  learning_engine_type: LearningEngineType
  icon: string | null
  created_at: string
}

export interface SubSkill {
  id: string
  skill_id: string
  name: string
  description: string | null
  difficulty_level: number
  telemetry_schema: Record<string, unknown> | null
  evaluation_schema: Record<string, unknown> | null
  created_at: string
}

export interface SkillWithSubSkills extends Skill {
  sub_skills: SubSkill[]
}

// --- Sprints ---

export interface Sprint {
  id: string
  user_id: string
  title: string | null
  primary_skill_id: string
  status: SprintStatus
  current_stage: StageType | null
  target_hours: number
  completed_hours: number
  readiness_score: number | null
  confidence_score: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  skill?: Skill
}

export interface SprintStage {
  id: string
  sprint_id: string
  stage_key: StageType
  sequence_number: number
  status: StageStatus
  score: number | null
  telemetry: Record<string, unknown> | null
  ai_feedback: Record<string, unknown> | null
  started_at: string | null
  completed_at: string | null
}

// --- Simulations ---

export interface Simulation {
  id: string
  sprint_id: string
  simulation_type: SimulationType
  scenario: string | null
  difficulty_level: number
  context: Record<string, unknown> | null
  ai_configuration: Record<string, unknown> | null
  generated_by: string | null
  created_at: string
}

export interface SimulationAttempt {
  id: string
  simulation_id: string
  user_id: string
  transcript: string | null
  evaluation: Record<string, unknown> | null
  telemetry: Record<string, unknown> | null
  score: number | null
  emotional_score: number | null
  clarity_score: number | null
  created_at: string
}

// --- Telemetry ---

export interface TelemetryEvent {
  id: string
  user_id: string
  sprint_id: string
  event_type: string
  payload: Record<string, unknown>
  created_at: string
}

// --- Reports ---

export interface Report {
  id: string
  user_id: string
  sprint_id: string
  report_type: string
  summary: Record<string, unknown> | null
  strengths: string[] | null
  weaknesses: string[] | null
  recommendations: string[] | null
  telemetry_summary: Record<string, unknown> | null
  created_at: string
}

// --- User Skill Mastery ---

export interface UserSkillMastery {
  id: string
  user_id: string
  skill_id: string
  mastery_score: number
  confidence_score: number
  retention_score: number
  practice_hours: number
  last_practiced_at: string | null
  updated_at: string
  skill?: Skill
}

// --- Navigation ---

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

// --- Stage metadata ---

export const STAGE_ORDER: StageType[] = [
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
  'reinforcement',
]

export const STAGE_LABELS: Record<StageType, string> = {
  primer: 'Primer',
  micro_skills: 'Micro-Skills',
  micro_drills: 'Micro Drills',
  guided_simulation: 'Guided Simulation',
  independent_simulation: 'Independent Simulation',
  replay_analysis: 'Replay Analysis',
  reflection: 'Reflection',
  escalated_retry: 'Escalated Retry',
  final_assessment: 'Final Assessment',
  report: 'Report',
  reinforcement: 'Reinforcement Loop',
}

export const ENGINE_TYPE_LABELS: Record<LearningEngineType, string> = {
  simulation_based: 'Simulation-Based',
  structured_reasoning: 'Structured Reasoning',
  consequence_simulation: 'Consequence Simulation',
  stress_simulation: 'Stress Simulation',
  reflective_ai_mirror: 'Reflective AI Mirror',
  recovery_conditioning: 'Recovery Conditioning',
  cognitive_conflict: 'Cognitive Conflict',
  constraint_architecture: 'Constraint Architecture',
}
