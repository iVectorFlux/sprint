import type { SkillArchetype } from '@/types'
import type { CognitivePattern } from './cognitive-patterns'

/** Skill DNA — patterns + eval/telemetry dimensions per catalog skill. */
export interface SkillDNA {
  cognitive_patterns: CognitivePattern[]
  evaluation_dimensions: string[]
  telemetry_dimensions: string[]
}

const ARCHETYPE_DEFAULT_PATTERNS: Record<SkillArchetype, CognitivePattern[]> = {
  conversational: ['dialogue', 'framing', 'pushback', 'stakeholder_alignment'],
  analytical: ['assumption_detection', 'evidence_evaluation', 'causal_analysis', 'judgment'],
  reflective: ['self_awareness', 'emotional_regulation', 'pattern_recognition'],
  creation: ['hypothesis_generation', 'prioritization', 'framing'],
  performance: ['emotional_regulation', 'dialogue', 'pushback'],
  systems: ['systems_mapping', 'causal_analysis', 'pattern_recognition'],
}

const ARCHETYPE_EVAL: Record<SkillArchetype, string[]> = {
  conversational: ['clarity', 'adaptability', 'empathy_signal'],
  analytical: ['reasoning_quality', 'evidence_quality'],
  reflective: ['insight_depth', 'self_awareness_signal'],
  creation: ['originality', 'feasibility'],
  performance: ['composure', 'execution_quality'],
  systems: ['systems_thinking', 'leverage_identification'],
}

const ARCHETYPE_TELEMETRY: Record<SkillArchetype, string[]> = {
  conversational: ['turn_taking', 'recovery_after_pushback'],
  analytical: ['revision_speed', 'hypothesis_updates'],
  reflective: ['reflection_depth', 'pattern_mentions'],
  creation: ['iteration_count', 'constraint_handling'],
  performance: ['stress_recovery', 'pace_control'],
  systems: ['loop_identification', 'dependency_mentions'],
}

/** Per-skill overrides (skill name → DNA). Unlisted skills use archetype defaults. */
export const SKILL_DNA_BY_NAME: Record<string, Partial<SkillDNA>> = {
  Communication: {
    cognitive_patterns: ['dialogue', 'framing', 'stakeholder_alignment', 'influence'],
  },
  'Influence & Negotiation': {
    cognitive_patterns: ['influence', 'framing', 'pushback', 'stakeholder_alignment', 'dialogue'],
  },
  'Strategic Sales': {
    cognitive_patterns: ['strategic_thinking', 'framing', 'influence', 'evidence_evaluation'],
  },
  'Leadership Essentials': {
    cognitive_patterns: ['judgment', 'stakeholder_alignment', 'prioritization', 'dialogue'],
  },
  'Critical Thinking': {
    cognitive_patterns: [
      'assumption_detection',
      'evidence_evaluation',
      'counterfactual_reasoning',
      'ethical_judgment',
    ],
  },
  'Problem Solving': {
    cognitive_patterns: ['root_cause', 'hypothesis_generation', 'prioritization', 'causal_analysis'],
  },
  'Creative Thinking': {
    cognitive_patterns: ['hypothesis_generation', 'counterfactual_reasoning', 'pattern_recognition'],
  },
  Judgment: {
    cognitive_patterns: ['judgment', 'tradeoff_analysis', 'evidence_evaluation', 'strategic_thinking'],
  },
  'Emotional Intelligence': {
    cognitive_patterns: ['self_awareness', 'emotional_regulation', 'dialogue', 'stakeholder_alignment'],
  },
  Metacognition: {
    cognitive_patterns: ['assumption_detection', 'pattern_recognition', 'self_awareness'],
  },
  Adaptability: {
    cognitive_patterns: ['pattern_recognition', 'emotional_regulation', 'prioritization'],
  },
  'Systems Thinking': {
    cognitive_patterns: ['systems_mapping', 'causal_analysis', 'pattern_recognition'],
  },
  'System Design': {
    cognitive_patterns: ['systems_mapping', 'tradeoff_analysis', 'prioritization'],
  },
  'AI Literacy': {
    cognitive_patterns: ['evidence_evaluation', 'assumption_detection', 'ethical_judgment'],
  },
}

export function getSkillDNA(skillName: string, archetype: SkillArchetype): SkillDNA {
  const override = SKILL_DNA_BY_NAME[skillName]
  return {
    cognitive_patterns:
      override?.cognitive_patterns ?? ARCHETYPE_DEFAULT_PATTERNS[archetype],
    evaluation_dimensions: override?.evaluation_dimensions ?? ARCHETYPE_EVAL[archetype],
    telemetry_dimensions:
      override?.telemetry_dimensions ?? ARCHETYPE_TELEMETRY[archetype],
  }
}
