import { create } from 'zustand'

/**
 * useReasoningStore — state for the analytical archetype reasoning workspace.
 *
 * Stores all user inputs across the three challenge modes:
 *   - assumptions: assumption list + analyses + strongest assumption
 *   - evidence: per-item ratings + notes + recommendation
 *   - counterfactual: per-cf responses + meta-insight
 *
 * Also stores the AI evaluation result once submitted.
 */

type ReasoningResponse = {
  // Assumptions mode
  assumptions?: string[]
  analyses?: string[]
  strongestAssumption?: string
  // Evidence mode
  ratings?: Record<string, string>
  evidenceNotes?: Record<string, string>
  recommendation?: string
  // Counterfactual mode
  cfResponses?: Record<string, string>
  metaInsight?: string
  // Generic field updates
  [key: string]: unknown
}

export type ReasoningStoreState = {
  response: ReasoningResponse
  evaluation: Record<string, unknown> | null
  getResponse: () => ReasoningResponse
  updateAssumption: (index: number, value: string) => void
  updateAnalysis: (index: number, value: string) => void
  updateRating: (evidenceId: string, rating: string) => void
  updateEvidenceNote: (evidenceId: string, note: string) => void
  updateCfResponse: (cfId: string, value: string) => void
  updateField: (key: string, value: string) => void
  setEvaluation: (evaluation: Record<string, unknown>) => void
  setFallbackEvaluation: (response: ReasoningResponse) => void
  reset: () => void
}

const initialResponse: ReasoningResponse = {
  assumptions: ['', '', '', ''],
  analyses: ['', '', '', ''],
  strongestAssumption: '',
  ratings: {},
  evidenceNotes: {},
  recommendation: '',
  cfResponses: {},
  metaInsight: '',
}

export const useReasoningStore = create<ReasoningStoreState>((set, get) => ({
  response: { ...initialResponse },
  evaluation: null,

  getResponse: () => get().response,

  updateAssumption: (index, value) =>
    set(s => {
      const assumptions = [...(s.response.assumptions || ['', '', '', ''])]
      assumptions[index] = value
      return { response: { ...s.response, assumptions } }
    }),

  updateAnalysis: (index, value) =>
    set(s => {
      const analyses = [...(s.response.analyses || ['', '', '', ''])]
      analyses[index] = value
      return { response: { ...s.response, analyses } }
    }),

  updateRating: (evidenceId, rating) =>
    set(s => ({
      response: {
        ...s.response,
        ratings: { ...(s.response.ratings || {}), [evidenceId]: rating },
      },
    })),

  updateEvidenceNote: (evidenceId, note) =>
    set(s => ({
      response: {
        ...s.response,
        evidenceNotes: { ...(s.response.evidenceNotes || {}), [evidenceId]: note },
      },
    })),

  updateCfResponse: (cfId, value) =>
    set(s => ({
      response: {
        ...s.response,
        cfResponses: { ...(s.response.cfResponses || {}), [cfId]: value },
      },
    })),

  updateField: (key, value) =>
    set(s => ({ response: { ...s.response, [key]: value } })),

  setEvaluation: (evaluation) => set({ evaluation }),

  setFallbackEvaluation: (response) => {
    // Score based on text volume and presence of key reasoning markers
    const allText = [
      ...(response.assumptions || []),
      ...(response.analyses || []),
      response.strongestAssumption || '',
      response.recommendation || '',
      response.metaInsight || '',
      ...Object.values(response.cfResponses || {}),
      ...Object.values(response.evidenceNotes || {}),
    ].join(' ')

    const wordCount = allText.trim().split(/\s+/).filter(Boolean).length
    const hasCausal = /because|therefore|since|means that|implies|leads to/i.test(allText)
    const hasConditional = /if|unless|assuming|provided that|given that/i.test(allText)
    const hasContrast = /however|but|although|on the other hand|alternatively/i.test(allText)
    const hasSpecifics = /specifically|for example|instance|namely|such as/i.test(allText)

    let score = 45
    if (wordCount > 50) score += 10
    if (wordCount > 120) score += 10
    if (wordCount > 250) score += 5
    if (hasCausal) score += 8
    if (hasConditional) score += 7
    if (hasContrast) score += 7
    if (hasSpecifics) score += 8
    score = Math.min(score, 90)

    set({
      evaluation: {
        overallScore: score,
        summary: score >= 70
          ? 'Your analysis demonstrates solid reasoning — you\'re identifying assumptions and evaluating evidence systematically.'
          : 'Your analysis shows a foundational approach. Focus on going deeper: explain the why behind each assumption, and consider what would change if each were false.',
        logical_rigor: score,
        assumption_awareness: Math.round(score * 0.9),
        evidence_quality: Math.round(score * 1.05),
        counterfactual_thinking: Math.round(score * 0.85),
        synthesis: Math.round(score * 0.95),
        depth_of_analysis: Math.round(score * 0.9),
        strengths: wordCount > 100 ? ['Detailed engagement with the challenge', 'Structured thinking'] : ['Attempted the exercise'],
        weaknesses: ['Deeper analysis of second-order implications', 'More explicit reasoning chains'],
        key_insight_missed: 'The strongest assumption is usually the one that feels most obvious — that\'s what makes it dangerous.',
        next_challenge_recommendation: 'Focus on making your reasoning explicit: don\'t just state conclusions, show the chain of reasoning that led there.',
      }
    })
  },

  reset: () => set({ response: { ...initialResponse }, evaluation: null }),
}))
