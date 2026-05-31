/**
 * Skill DNA — atomic cognitive patterns shared across catalog skills.
 * @see futureplan.md Part 1.5 Refinement 2
 */

export const COGNITIVE_PATTERNS = [
  'assumption_detection',
  'evidence_evaluation',
  'counterfactual_reasoning',
  'causal_analysis',
  'hypothesis_generation',
  'root_cause',
  'prioritization',
  'tradeoff_analysis',
  'framing',
  'dialogue',
  'pushback',
  'stakeholder_alignment',
  'ethical_judgment',
  'systems_mapping',
  'pattern_recognition',
  'self_awareness',
  'emotional_regulation',
  'strategic_thinking',
  'influence',
  'judgment',
] as const

export type CognitivePattern = (typeof COGNITIVE_PATTERNS)[number]

export const PATTERN_LABELS: Record<CognitivePattern, string> = {
  assumption_detection: 'Assumption detection',
  evidence_evaluation: 'Evidence evaluation',
  counterfactual_reasoning: 'Counterfactual reasoning',
  causal_analysis: 'Causal analysis',
  hypothesis_generation: 'Hypothesis generation',
  root_cause: 'Root cause analysis',
  prioritization: 'Prioritization',
  tradeoff_analysis: 'Trade-off analysis',
  framing: 'Framing',
  dialogue: 'Dialogue',
  pushback: 'Handling pushback',
  stakeholder_alignment: 'Stakeholder alignment',
  ethical_judgment: 'Ethical judgment',
  systems_mapping: 'Systems mapping',
  pattern_recognition: 'Pattern recognition',
  self_awareness: 'Self-awareness',
  emotional_regulation: 'Emotional regulation',
  strategic_thinking: 'Strategic thinking',
  influence: 'Influence',
  judgment: 'Judgment',
}
