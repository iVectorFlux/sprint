import type { StageType } from '@/types'

/**
 * Grouped practice blocks (v1) — maps stages to coarse block types.
 * @see docs/ARCHITECTURE.md — "practice block" is future; today = stage.
 */
export type PracticeBlockGroup = 'input' | 'thinking' | 'practice' | 'output'

export const PRACTICE_BLOCK_LABELS: Record<PracticeBlockGroup, string> = {
  input: 'Input',
  thinking: 'Thinking',
  practice: 'Practice',
  output: 'Output',
}

/** Which block group each stage belongs to. */
export const STAGE_TO_BLOCK: Record<StageType, PracticeBlockGroup> = {
  primer: 'input',
  micro_skills: 'input',
  micro_drills: 'practice',
  guided_simulation: 'practice',
  independent_simulation: 'practice',
  replay_analysis: 'thinking',
  reflection: 'thinking',
  escalated_retry: 'practice',
  final_assessment: 'output',
  report: 'output',
  reinforcement: 'output',
  reasoning_workspace: 'thinking',
  evidence_analysis: 'thinking',
  counterfactual_challenge: 'thinking',
  reasoning_assessment: 'output',
  guided_reflection: 'thinking',
  pattern_detection: 'thinking',
  behavior_analysis: 'thinking',
  growth_plan: 'output',
}

export function getBlockForStage(stage: StageType): PracticeBlockGroup {
  return STAGE_TO_BLOCK[stage] ?? 'practice'
}
