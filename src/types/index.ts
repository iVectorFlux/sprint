/* ============================================================
   Lumi6 Skill Lab — TypeScript Type Definitions
   ============================================================ */

// --- Enums ---

export type UserRole = 'learner' | 'manager' | 'admin' | 'super_admin'

export type SprintStatus = 'not_started' | 'active' | 'paused' | 'completed' | 'abandoned'

/**
 * Phase 1 archetypes.
 * Creation, performance, systems will be added in Phase 2.
 */
export type SkillArchetype =
  | 'conversational' // Roleplay / dialogue / pushback / escalation
  | 'analytical'     // Reasoning workspace / assumption mapping / counterfactuals
  | 'reflective'     // Journaling / pattern detection / behavior analysis
  | 'creation'       // Write / review / annotate / revise (Phase 2)
  | 'performance'    // Record / transcribe / analyze / re-record (Phase 2)
  | 'systems'        // Canvas / diagramming / dependency maps (Phase 2)

export type SessionEngine =
  | 'roleplay_engine'     // conversational
  | 'reasoning_engine'    // analytical
  | 'reflection_engine'   // reflective
  | 'creation_engine'     // Phase 2
  | 'performance_engine'  // Phase 2
  | 'systems_engine'      // Phase 2

// All possible stage keys across all archetypes
export type StageType =
  // Shared
  | 'primer'
  | 'micro_skills'
  | 'micro_drills'
  | 'reflection'
  | 'report'
  // Conversational engine
  | 'guided_simulation'
  | 'independent_simulation'
  | 'replay_analysis'
  | 'escalated_retry'
  | 'final_assessment'
  | 'reinforcement'
  // Analytical engine
  | 'reasoning_workspace'
  | 'evidence_analysis'
  | 'counterfactual_challenge'
  | 'reasoning_assessment'
  // Reflective engine
  | 'guided_reflection'
  | 'pattern_detection'
  | 'behavior_analysis'
  | 'growth_plan'

export type StageStatus = 'locked' | 'active' | 'completed' | 'skipped'

// --- Archetype Stage Flows ---
// Each archetype defines its own ordered stage sequence.

export const ARCHETYPE_STAGE_FLOWS: Record<SkillArchetype, StageType[]> = {
  conversational: [
    'primer',
    'micro_skills',
    'micro_drills',
    'guided_simulation',
    'independent_simulation',
    'replay_analysis',
    'reflection',
    'escalated_retry',
    'report',
  ],
  analytical: [
    'primer',
    'micro_skills',
    'micro_drills',
    'reasoning_workspace',
    'evidence_analysis',
    'counterfactual_challenge',
    'reflection',
    'reasoning_assessment',
    'report',
  ],
  reflective: [
    'primer',
    'micro_skills',
    'guided_reflection',
    'pattern_detection',
    'behavior_analysis',
    'growth_plan',
    'report',
  ],
  // Phase 2 stubs — will be expanded
  creation: ['primer', 'micro_skills', 'report'],
  performance: ['primer', 'micro_skills', 'report'],
  systems: ['primer', 'micro_skills', 'report'],
}

// Stage → URL path segment mapping
export const STAGE_URL_SEGMENT: Partial<Record<StageType, string>> = {
  primer: 'primer',
  micro_skills: 'micro-skills',
  micro_drills: 'drills',
  guided_simulation: 'simulation/guided',
  independent_simulation: 'simulation/independent',
  replay_analysis: 'replay',
  reflection: 'reflection',
  escalated_retry: 'simulation/escalated',
  final_assessment: 'assessment',
  report: 'report',
  reinforcement: 'reinforcement',
  reasoning_workspace: 'reasoning',
  evidence_analysis: 'reasoning',   // same page, different mode
  counterfactual_challenge: 'reasoning',
  reasoning_assessment: 'assessment',
  guided_reflection: 'guided-reflection',
  pattern_detection: 'guided-reflection',
  behavior_analysis: 'guided-reflection',
  growth_plan: 'guided-reflection',
}

export const STAGE_LABELS: Record<StageType, string> = {
  primer: 'Primer',
  micro_skills: 'Micro-Skills',
  micro_drills: 'Drills',
  reflection: 'Reflection',
  report: 'Report',
  guided_simulation: 'Guided Sim',
  independent_simulation: 'Independent Sim',
  replay_analysis: 'Replay',
  escalated_retry: 'Escalated',
  final_assessment: 'Assessment',
  reinforcement: 'Reinforcement',
  reasoning_workspace: 'Reasoning',
  evidence_analysis: 'Evidence',
  counterfactual_challenge: 'Counterfactuals',
  reasoning_assessment: 'Assessment',
  guided_reflection: 'Reflection',
  pattern_detection: 'Patterns',
  behavior_analysis: 'Behavior',
  growth_plan: 'Growth Plan',
}

// Stage nav items shown in the top bar per archetype
export const ARCHETYPE_STAGE_NAV: Record<SkillArchetype, { key: string; label: string; icon: string }[]> = {
  conversational: [
    { key: 'primer', label: 'Primer', icon: '📖' },
    { key: 'micro-skills', label: 'Micro-Skills', icon: '🧩' },
    { key: 'drills', label: 'Drills', icon: '⚡' },
    { key: 'simulation', label: 'Simulation', icon: '🎭' },
    { key: 'replay', label: 'Replay', icon: '🔄' },
    { key: 'reflection', label: 'Reflect', icon: '💭' },
    { key: 'report', label: 'Report', icon: '📊' },
  ],
  analytical: [
    { key: 'primer', label: 'Primer', icon: '📖' },
    { key: 'micro-skills', label: 'Concepts', icon: '🧩' },
    { key: 'drills', label: 'Drills', icon: '⚡' },
    { key: 'reasoning', label: 'Workspace', icon: '🔬' },
    { key: 'reflection', label: 'Reflect', icon: '💭' },
    { key: 'assessment', label: 'Assessment', icon: '🏆' },
    { key: 'report', label: 'Report', icon: '📊' },
  ],
  reflective: [
    { key: 'primer', label: 'Primer', icon: '📖' },
    { key: 'micro-skills', label: 'Concepts', icon: '🧩' },
    { key: 'guided-reflection', label: 'Reflection', icon: '💭' },
    { key: 'report', label: 'Report', icon: '📊' },
  ],
  creation: [
    { key: 'primer', label: 'Primer', icon: '📖' },
    { key: 'micro-skills', label: 'Concepts', icon: '🧩' },
    { key: 'report', label: 'Report', icon: '📊' },
  ],
  performance: [
    { key: 'primer', label: 'Primer', icon: '📖' },
    { key: 'micro-skills', label: 'Concepts', icon: '🧩' },
    { key: 'report', label: 'Report', icon: '📊' },
  ],
  systems: [
    { key: 'primer', label: 'Primer', icon: '📖' },
    { key: 'micro-skills', label: 'Concepts', icon: '🧩' },
    { key: 'report', label: 'Report', icon: '📊' },
  ],
}

export const ARCHETYPE_LABELS: Record<SkillArchetype, string> = {
  conversational: 'Conversational',
  analytical: 'Analytical',
  reflective: 'Reflective',
  creation: 'Creation',
  performance: 'Performance',
  systems: 'Systems',
}

export const ARCHETYPE_DESCRIPTIONS: Record<SkillArchetype, string> = {
  conversational: 'Live dialogue roleplay with AI characters — pushback, escalation, and coaching',
  analytical: 'Structured reasoning workspace — assumptions, evidence, and counterfactual thinking',
  reflective: 'Guided journaling and pattern detection — understand your own behavioral patterns',
  creation: 'Write, review, annotate, revise — deliberate creation practice (coming soon)',
  performance: 'Record, transcribe, analyze, re-record — delivery and presence practice (coming soon)',
  systems: 'Canvas diagramming, dependency maps, constraint injection (coming soon)',
}

export const ARCHETYPE_ICONS: Record<SkillArchetype, string> = {
  conversational: '🎭',
  analytical: '🔬',
  reflective: '🪞',
  creation: '✍️',
  performance: '🎤',
  systems: '🗺️',
}

export const SESSION_ENGINE_LABELS: Record<SessionEngine, string> = {
  roleplay_engine: 'Roleplay Engine',
  reasoning_engine: 'Reasoning Engine',
  reflection_engine: 'Reflection Engine',
  creation_engine: 'Creation Engine',
  performance_engine: 'Performance Engine',
  systems_engine: 'Systems Engine',
}

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
  archetype: SkillArchetype
  session_engine: SessionEngine
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

// --- Simulations (Conversational Engine) ---

export type SimulationType = 'roleplay' | 'stress' | 'reasoning' | 'consequence' | 'recovery' | 'conflict'

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

export * from './telemetry'
export * from './challenge'
