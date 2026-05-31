import type { CognitivePattern } from './cognitive-patterns'

/**
 * Maps learner intent phrases → cognitive patterns (capability inference).
 * Rules-first resolver (~90% catalog path); LLM augmentation comes in Copilot phase.
 */
export const INTENT_PATTERN_KEYWORDS: Record<CognitivePattern, string[]> = {
  assumption_detection: ['assume', 'assumption', 'bias', 'blind spot'],
  evidence_evaluation: ['evidence', 'data', 'proof', 'metric', 'validate'],
  counterfactual_reasoning: ['what if', 'counterfactual', 'alternative'],
  causal_analysis: ['cause', 'why', 'driver', 'because'],
  hypothesis_generation: ['hypothesis', 'theory', 'guess'],
  root_cause: ['root cause', 'incident', 'failure', '5 whys'],
  prioritization: ['prioritize', 'priority', 'backlog', 'rank', 'focus'],
  tradeoff_analysis: ['tradeoff', 'trade-off', 'versus', ' vs ', 'allocate', 'budget'],
  framing: ['frame', 'position', 'narrative', 'pitch'],
  dialogue: ['conversation', 'discuss', 'meeting', 'talk', 'dialogue'],
  pushback: ['pushback', 'objection', 'resist', 'disagree'],
  stakeholder_alignment: ['stakeholder', 'align', 'buy-in', 'consensus'],
  ethical_judgment: ['ethical', 'ethics', 'fair', 'integrity'],
  systems_mapping: ['system', 'feedback loop', 'interconnect'],
  pattern_recognition: ['pattern', 'trend', 'signal'],
  self_awareness: ['self-aware', 'trigger', 'my reaction'],
  emotional_regulation: ['stress', 'emotion', 'calm', 'regulate'],
  strategic_thinking: ['strategy', 'strategic', 'roadmap', 'geo', 'seo', 'market'],
  influence: ['influence', 'persuade', 'convince', 'negotiat'],
  judgment: ['decide', 'decision', 'judgment', 'choose', 'allocation'],
}

/** Workplace challenge phrases → patterns (Challenge Graph input). */
export const CHALLENGE_PATTERN_HINTS: { phrase: string; patterns: CognitivePattern[] }[] = [
  { phrase: 'budget allocation', patterns: ['tradeoff_analysis', 'judgment', 'strategic_thinking', 'influence'] },
  { phrase: 'executive presentation', patterns: ['framing', 'dialogue', 'stakeholder_alignment'] },
  { phrase: 'difficult conversation', patterns: ['dialogue', 'pushback', 'emotional_regulation'] },
  { phrase: 'performance review', patterns: ['dialogue', 'self_awareness', 'stakeholder_alignment'] },
]
