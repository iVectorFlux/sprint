/**
 * Challenge Graph — workplace situations the learner wants to improve on.
 * @see futureplan.md Part 1.5 Refinement 3
 */

export type ChallengeStatus = 'active' | 'completed' | 'archived'

export interface UserChallenge {
  id: string
  user_id: string
  title: string
  raw_context?: string
  inferred_skill_slugs: string[]
  inferred_patterns: string[]
  status: ChallengeStatus
  /** 0–100; updated from practice + self/manager input over time */
  score_current?: number
  created_at: string
  updated_at: string
}
