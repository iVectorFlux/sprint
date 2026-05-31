import { SKILLS_TAXONOMY } from '@/data/skills-taxonomy'
import { toSlug } from '@/lib/slug'
import type { SkillArchetype } from '@/types'
import type { CognitivePattern } from './cognitive-patterns'
import { PATTERN_LABELS } from './cognitive-patterns'
import {
  CHALLENGE_PATTERN_HINTS,
  INTENT_PATTERN_KEYWORDS,
} from './intent-keywords'
import { getSkillDNA } from './skill-dna'

export type MatchPath = 'catalog' | 'novel'
/** @deprecated Use MatchPath */
export type ResolutionPath = MatchPath

export interface MatchedSkill {
  name: string
  slug: string
  icon: string
  category: string
  archetype: SkillArchetype
  subSkillCount: number
  score: number
  matchedPatterns: CognitivePattern[]
}

export interface LearningGoalMatch {
  path: MatchPath
  confidence: 'high' | 'medium' | 'low'
  skills: MatchedSkill[]
  /** Union of patterns inferred from intent (shown to learner). */
  inferredPatterns: CognitivePattern[]
  /** Human-readable pattern labels for UI. */
  patternLabels: string[]
}

const MIN_CATALOG_SCORE = 6

function inferPatternsFromIntent(query: string): Map<CognitivePattern, number> {
  const q = query.toLowerCase()
  const scores = new Map<CognitivePattern, number>()

  const bump = (p: CognitivePattern, n: number) => {
    scores.set(p, (scores.get(p) ?? 0) + n)
  }

  for (const [pattern, keywords] of Object.entries(INTENT_PATTERN_KEYWORDS) as [
    CognitivePattern,
    string[],
  ][]) {
    for (const kw of keywords) {
      if (q.includes(kw)) bump(pattern, kw.length > 4 ? 3 : 2)
    }
  }

  for (const { phrase, patterns } of CHALLENGE_PATTERN_HINTS) {
    if (q.includes(phrase)) {
      patterns.forEach((p) => bump(p, 5))
    }
  }

  return scores
}

/** @deprecated Use MatchedSkill */
export type ResolvedSkill = MatchedSkill
/** @deprecated Use LearningGoalMatch */
export type CapabilityResolution = LearningGoalMatch

/**
 * Match a learner goal or challenge to catalog skills + practice patterns.
 */
export function matchLearningGoal(intent: string): LearningGoalMatch {
  const q = intent.toLowerCase().trim()
  if (!q) {
    return {
      path: 'novel',
      confidence: 'low',
      skills: [],
      inferredPatterns: [],
      patternLabels: [],
    }
  }

  const patternScores = inferPatternsFromIntent(q)
  const inferredPatterns = [...patternScores.entries()]
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([p]) => p)

  const words = q.split(/\s+/).filter((w) => w.length > 2)

  const skillResults = SKILLS_TAXONOMY.map((skill) => {
    let score = 0
    const matchedPatterns = new Set<CognitivePattern>()
    const dna = getSkillDNA(skill.name, skill.archetype)
    const name = skill.name.toLowerCase()

    if (q.includes(name)) score += 12
    if (q.includes(skill.category.toLowerCase())) score += 4

    words.forEach((w) => {
      if (name.includes(w)) score += 5
      skill.sub_skills.forEach((sub) => {
        const subName = sub.name.toLowerCase()
        if (q.includes(subName)) score += 9
        else if (subName.includes(w)) score += 3
      })
      skill.description.toLowerCase().split(/\s+/).forEach((dw) => {
        if (dw.length > 4 && dw.includes(w)) score += 1
      })
    })

    for (const pattern of dna.cognitive_patterns) {
      const ps = patternScores.get(pattern) ?? 0
      if (ps > 0) {
        score += ps
        matchedPatterns.add(pattern)
      }
    }

    return {
      skill,
      score,
      matchedPatterns: [...matchedPatterns],
    }
  })
    .filter((r) => r.score >= MIN_CATALOG_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  const topScore = skillResults[0]?.score ?? 0
  const path: MatchPath = skillResults.length > 0 ? 'catalog' : 'novel'
  const confidence: LearningGoalMatch['confidence'] =
    topScore >= 14 ? 'high' : topScore >= 8 ? 'medium' : 'low'

  const skills: MatchedSkill[] = skillResults.map((r) => ({
    name: r.skill.name,
    slug: toSlug(r.skill.name),
    icon: r.skill.icon,
    category: r.skill.category,
    archetype: r.skill.archetype,
    subSkillCount: r.skill.sub_skills.length,
    score: r.score,
    matchedPatterns: r.matchedPatterns,
  }))

  const patternLabels = inferredPatterns.map((p) => PATTERN_LABELS[p])

  return {
    path,
    confidence,
    skills,
    inferredPatterns,
    patternLabels,
  }
}

/** @deprecated Use matchLearningGoal */
export const resolveCapabilities = matchLearningGoal
