'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useSprintStore } from '@/stores/useSprintStore'
import { useSprintContext } from '@/hooks/useSprintContext'
import { useArchetypeFlow } from '@/hooks/useArchetypeFlow'
import { useReasoningStore, type ReasoningStoreState } from '@/stores/useReasoningStore'

type WorkspaceMode = 'assumptions' | 'evidence' | 'counterfactual'

const MODE_ORDER: WorkspaceMode[] = ['assumptions', 'evidence', 'counterfactual']

const MODE_META: Record<WorkspaceMode, { label: string; icon: string; description: string }> = {
  assumptions: {
    label: 'Assumption Mapping',
    icon: '🗺️',
    description: 'Identify the hidden assumptions behind a claim or decision — then pressure-test each one.',
  },
  evidence: {
    label: 'Evidence Analysis',
    icon: '🔎',
    description: 'Evaluate a mix of strong, weak, and misleading evidence. Decide what should actually influence the decision.',
  },
  counterfactual: {
    label: 'Counterfactual Thinking',
    icon: '🔀',
    description: 'Challenge a conclusion by asking: what if a key assumption were false? What changes?',
  },
}

export default function ReasoningPage() {
  const router = useRouter()
  const { sprintId, skill, skillName, displayName, archetype } = useSprintContext()
  const flow = useArchetypeFlow(archetype)
  const { updateStage } = useSprintStore()
  const store = useReasoningStore()

  const [modeIndex, setModeIndex] = useState(0)
  const [challenge, setChallenge] = useState<Record<string, unknown> | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const currentMode: WorkspaceMode = MODE_ORDER[modeIndex]
  const isLastMode = modeIndex === MODE_ORDER.length - 1

  useEffect(() => {
    store.reset()
    loadChallenge(currentMode)
  }, [sprintId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadChallenge = async (mode: WorkspaceMode) => {
    setLoadingChallenge(true)
    setChallenge(null)
    try {
      const data = await api.get<Record<string, unknown>>(
        `/api/v1/sprint/content/reasoning-challenge?skill_id=${sprintId}&mode=${mode}`
      )
      setChallenge(data)
    } catch {
      // Fallback challenge
      setChallenge(getFallbackChallenge(mode, skillName))
    }
    setLoadingChallenge(false)
  }

  const handleSubmit = async () => {
    if (submitting || !challenge) return
    setSubmitting(true)

    const response = store.getResponse()
    try {
      const result = await api.post<Record<string, unknown>>(
        `/api/v1/sprint/content/reasoning-challenge/evaluate`,
        {
          skill_id: sprintId,
          challenge_type: currentMode,
          challenge,
          user_response: response,
        }
      )
      store.setEvaluation(result)
    } catch {
      // Local scoring fallback
      store.setFallbackEvaluation(response)
    }
    setSubmitting(false)
  }

  const handleNext = () => {
    if (!isLastMode) {
      setModeIndex(prev => prev + 1)
      store.reset()
      loadChallenge(MODE_ORDER[modeIndex + 1])
    } else {
      updateStage(sprintId, 'reflection', 75)
      const nextUrl = flow.nextStageUrl('reasoning', sprintId)
      router.push(nextUrl)
    }
  }

  const meta = MODE_META[currentMode]

  if (loadingChallenge) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div className="reasoning-loading">
          <div className="reasoning-loading-icon">🔬</div>
          <p className="body-sm" style={{ marginTop: 16 }}>Preparing reasoning workspace…</p>
          <div className="skeleton skeleton-card" style={{ marginTop: 24 }} />
        </div>
      </div>
    )
  }

  return (
    <div className="sprint-stage-container sprint-stage-container-wide">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span className="sprint-stage-badge">
            Reasoning Workspace · {modeIndex + 1} of {MODE_ORDER.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {MODE_ORDER.map((m, i) => (
              <div
                key={m}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: i < modeIndex
                    ? 'var(--success)'
                    : i === modeIndex
                      ? 'var(--primary-container)'
                      : 'var(--border-subtle)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>
        <h1 className="headline-md" style={{ marginBottom: 4 }}>
          {meta.icon} {meta.label}
        </h1>
        <p className="body-sm">{skillName} · {meta.description}</p>
      </div>

      <div className="reasoning-workspace">
        {/* Left: Challenge Panel */}
        <div className="reasoning-challenge-panel">
          {challenge && <ChallengeDisplay mode={currentMode} challenge={challenge} />}
        </div>

        {/* Right: Response Panel */}
        <div className="reasoning-response-panel">
          {store.evaluation ? (
            <EvaluationDisplay
              evaluation={store.evaluation}
              onNext={handleNext}
              isLast={isLastMode}
            />
          ) : (
            <ResponseInput
              mode={currentMode}
              challenge={challenge}
              store={store}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Challenge Display ─────────────────────────────────────────────────────

function ChallengeDisplay({ mode, challenge }: { mode: WorkspaceMode; challenge: Record<string, unknown> }) {
  if (mode === 'assumptions') {
    return (
      <div>
        <div className="reasoning-section-label">Scenario</div>
        <div className="reasoning-scenario-box">
          {challenge.scenario as string}
        </div>
        <div className="reasoning-section-label" style={{ marginTop: 20 }}>Central Claim</div>
        <div className="reasoning-claim-box">
          "{challenge.central_claim as string}"
        </div>
        <div className="reasoning-section-label" style={{ marginTop: 20 }}>Guiding Questions</div>
        <ul className="reasoning-guiding-list">
          {(challenge.guiding_questions as string[] || []).map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
        {(challenge.starter_assumptions as string[] | undefined) && (
          <>
            <div className="reasoning-section-label" style={{ marginTop: 20 }}>Starter Assumptions (to get you thinking)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(challenge.starter_assumptions as string[]).map((a, i) => (
                <div key={i} className="reasoning-starter-chip">💭 {a}</div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  if (mode === 'evidence') {
    const items = challenge.evidence_items as Array<{id: string; label: string; content: string}> || []
    return (
      <div>
        <div className="reasoning-section-label">Decision Context</div>
        <div className="reasoning-scenario-box">{challenge.decision_context as string}</div>
        <div className="reasoning-section-label" style={{ marginTop: 20 }}>Evidence Items</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => (
            <div key={item.id} className="evidence-item">
              <div className="evidence-item-label">{item.label}</div>
              <p className="body-sm" style={{ margin: 0 }}>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'counterfactual') {
    const cfs = challenge.counterfactuals as Array<{id: string; prompt: string}> || []
    return (
      <div>
        <div className="reasoning-section-label">Original Scenario</div>
        <div className="reasoning-scenario-box">{challenge.original_scenario as string}</div>
        <div className="reasoning-section-label" style={{ marginTop: 16 }}>Original Conclusion</div>
        <div className="reasoning-claim-box">"{challenge.original_conclusion as string}"</div>
        <div className="reasoning-section-label" style={{ marginTop: 20 }}>Counterfactual Challenges</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cfs.map((cf, i) => (
            <div key={cf.id} className="counterfactual-prompt">
              <span className="counterfactual-number">CF{i + 1}</span>
              <span>{cf.prompt}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

// ─── Response Input ────────────────────────────────────────────────────────

function ResponseInput({
  mode,
  challenge,
  store,
  onSubmit,
  submitting,
}: {
  mode: WorkspaceMode
  challenge: Record<string, unknown> | null
  store: ReasoningStoreState
  onSubmit: () => void
  submitting: boolean
}) {
  const response = store.getResponse()
  const hasContent = Object.values(response).some(v =>
    typeof v === 'string' ? v.trim().length > 30 : Boolean(v)
  )

  if (mode === 'assumptions') {
    return (
      <div>
        <div className="reasoning-section-label">Your Assumption Analysis</div>
        <p className="body-sm" style={{ marginBottom: 16 }}>
          List the hidden assumptions. For each, explain its validity and what changes if it's false.
        </p>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="assumption-entry">
            <div className="assumption-entry-number">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <input
                className="input"
                placeholder={`Assumption ${i + 1}…`}
                value={(response.assumptions as string[] || [])[i] || ''}
                onChange={e => {
                  const arr = [...((response.assumptions as string[] || []))];
                  arr[i] = e.target.value;
                  store.updateAssumption(i, e.target.value);
                }}
                id={`assumption-${i}`}
              />
              <textarea
                className="textarea"
                placeholder="Why is this an assumption? What happens if it's false?"
                rows={2}
                value={(response.analyses as string[] || [])[i] || ''}
                onChange={e => store.updateAnalysis(i, e.target.value)}
                style={{ marginTop: 6 }}
              />
            </div>
          </div>
        ))}
        <div className="reasoning-section-label" style={{ marginTop: 20 }}>Strongest Assumption</div>
        <textarea
          className="textarea"
          placeholder="Which assumption, if false, would most change the outcome? Explain why."
          rows={3}
          value={(response.strongestAssumption as string) || ''}
          onChange={e => store.updateField('strongestAssumption', e.target.value)}
        />
        <button
          className="btn btn-primary"
          style={{ marginTop: 20, width: '100%' }}
          onClick={onSubmit}
          disabled={!hasContent || submitting}
          id="reasoning-submit"
        >
          {submitting ? 'Evaluating…' : 'Submit Analysis →'}
        </button>
      </div>
    )
  }

  if (mode === 'evidence') {
    const items = (challenge?.evidence_items as Array<{id: string; label: string}> || [])
    return (
      <div>
        <div className="reasoning-section-label">Your Evidence Evaluation</div>
        <p className="body-sm" style={{ marginBottom: 16 }}>
          For each piece of evidence, rate its quality and explain how it should influence the decision.
        </p>
        {items.map((item) => (
          <div key={item.id} className="evidence-eval-entry">
            <div className="evidence-eval-label">{item.label}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              {(['strong', 'weak', 'misleading', 'irrelevant'] as const).map(rating => (
                <button
                  key={rating}
                  className={`chip ${(response.ratings as Record<string,string> || {})[item.id] === rating ? 'chip-primary' : ''}`}
                  onClick={() => store.updateRating(item.id, rating)}
                  style={{ cursor: 'pointer' }}
                >
                  {rating}
                </button>
              ))}
            </div>
            <textarea
              className="textarea"
              placeholder="How should this evidence influence the decision?"
              rows={2}
              value={(response.evidenceNotes as Record<string,string> || {})[item.id] || ''}
              onChange={e => store.updateEvidenceNote(item.id, e.target.value)}
            />
          </div>
        ))}
        <div className="reasoning-section-label" style={{ marginTop: 16 }}>Final Recommendation</div>
        <textarea
          className="textarea"
          placeholder="Based on this evidence, what decision would you make? What evidence was most determinative?"
          rows={3}
          value={(response.recommendation as string) || ''}
          onChange={e => store.updateField('recommendation', e.target.value)}
        />
        <button
          className="btn btn-primary"
          style={{ marginTop: 20, width: '100%' }}
          onClick={onSubmit}
          disabled={!hasContent || submitting}
          id="reasoning-submit"
        >
          {submitting ? 'Evaluating…' : 'Submit Analysis →'}
        </button>
      </div>
    )
  }

  if (mode === 'counterfactual') {
    const cfs = (challenge?.counterfactuals as Array<{id: string; prompt: string}> || [])
    return (
      <div>
        <div className="reasoning-section-label">Your Counterfactual Responses</div>
        <p className="body-sm" style={{ marginBottom: 16 }}>
          For each challenge, explain how the conclusion changes — and what it reveals about the original reasoning.
        </p>
        {cfs.map((cf, i) => (
          <div key={cf.id} className="counterfactual-response">
            <div className="counterfactual-prompt-label">CF{i + 1}: {cf.prompt}</div>
            <textarea
              className="textarea"
              placeholder="If this were true, then… Because… This reveals that…"
              rows={3}
              value={(response.cfResponses as Record<string,string> || {})[cf.id] || ''}
              onChange={e => store.updateCfResponse(cf.id, e.target.value)}
            />
          </div>
        ))}
        <div className="reasoning-section-label" style={{ marginTop: 16 }}>Meta-Insight</div>
        <textarea
          className="textarea"
          placeholder="What do these counterfactuals reveal about the fragility of the original conclusion?"
          rows={3}
          value={(response.metaInsight as string) || ''}
          onChange={e => store.updateField('metaInsight', e.target.value)}
        />
        <button
          className="btn btn-primary"
          style={{ marginTop: 20, width: '100%' }}
          onClick={onSubmit}
          disabled={!hasContent || submitting}
          id="reasoning-submit"
        >
          {submitting ? 'Evaluating…' : 'Submit Analysis →'}
        </button>
      </div>
    )
  }

  return null
}

// ─── Evaluation Display ────────────────────────────────────────────────────

function EvaluationDisplay({
  evaluation,
  onNext,
  isLast,
}: {
  evaluation: Record<string, unknown>
  onNext: () => void
  isLast: boolean
}) {
  const score = evaluation.overallScore as number
  const color = score >= 75 ? 'var(--success)' : score >= 55 ? 'var(--warning)' : 'var(--error)'
  const dims = [
    { key: 'logical_rigor', label: 'Logical Rigor' },
    { key: 'assumption_awareness', label: 'Assumption Awareness' },
    { key: 'evidence_quality', label: 'Evidence Quality' },
    { key: 'counterfactual_thinking', label: 'Counterfactual Thinking' },
    { key: 'synthesis', label: 'Synthesis' },
    { key: 'depth_of_analysis', label: 'Depth of Analysis' },
  ]

  return (
    <div>
      {/* Overall score */}
      <div className="reasoning-score-header">
        <div className="reasoning-score-ring" style={{ borderColor: color }}>
          <span className="reasoning-score-value" style={{ color }}>{score}</span>
          <span className="reasoning-score-label">/ 100</span>
        </div>
        <div>
          <div className="headline-sm" style={{ color }}>
            {score >= 75 ? 'Strong Analysis' : score >= 55 ? 'Developing' : 'Needs Work'}
          </div>
          <p className="body-sm" style={{ marginTop: 4 }}>{evaluation.summary as string}</p>
        </div>
      </div>

      {/* Dimension bars */}
      <div style={{ marginTop: 20 }}>
        <div className="reasoning-section-label">Dimension Scores</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {dims.map(({ key, label }) => {
            const val = (evaluation[key] as number) || 0
            const dimColor = val >= 75 ? 'var(--success)' : val >= 55 ? 'var(--warning)' : 'var(--error)'
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: dimColor }}>{val}</span>
                </div>
                <div style={{ height: 4, backgroundColor: 'var(--border-subtle)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${val}%`, backgroundColor: dimColor, borderRadius: 2, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key insight missed */}
      {(evaluation.key_insight_missed as string | undefined) && (
        <div className="reasoning-insight-box" style={{ marginTop: 20 }}>
          <div className="reasoning-section-label">Key Insight You Missed</div>
          <p className="body-sm" style={{ marginTop: 6 }}>{String(evaluation.key_insight_missed)}</p>
        </div>
      )}

      {/* Strengths & weaknesses */}
      <div className="grid-2" style={{ marginTop: 20, gap: 12 }}>
        <div>
          <div className="reasoning-section-label" style={{ color: 'var(--success)' }}>Strengths</div>
          <ul style={{ margin: 0, paddingLeft: 16, marginTop: 6 }}>
            {(evaluation.strengths as string[] || []).map((s, i) => (
              <li key={i} className="body-sm">{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="reasoning-section-label" style={{ color: 'var(--warning)' }}>To Develop</div>
          <ul style={{ margin: 0, paddingLeft: 16, marginTop: 6 }}>
            {(evaluation.weaknesses as string[] || []).map((w, i) => (
              <li key={i} className="body-sm">{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg"
        style={{ marginTop: 24, width: '100%' }}
        onClick={onNext}
        id="reasoning-next"
      >
        {isLast ? 'Continue to Reflection →' : 'Next Challenge →'}
      </button>
    </div>
  )
}

// ─── Fallback challenge data ───────────────────────────────────────────────

function getFallbackChallenge(mode: WorkspaceMode, skillName: string): Record<string, unknown> {
  if (mode === 'assumptions') {
    return {
      challenge_type: 'assumptions',
      title: `${skillName} — Assumption Mapping`,
      scenario: 'Your VP proposes that the team shift to fully async communication to improve productivity. The proposal cites a 20% reduction in meeting time at a competitor company.',
      central_claim: 'Eliminating synchronous meetings will improve team productivity by 20%.',
      starter_assumptions: [
        'Async communication works equally well for all types of work',
        'The 20% improvement at the competitor is replicable in different contexts',
      ],
      guiding_questions: [
        'What assumptions about team dynamics are embedded in this claim?',
        'What context-specific factors might make this work differently here?',
        'Which assumption, if false, would most undermine the proposal?',
      ],
    }
  }
  if (mode === 'evidence') {
    return {
      challenge_type: 'evidence',
      title: `${skillName} — Evidence Analysis`,
      decision_context: 'You must decide whether to launch a new product feature in Q3 or delay to Q4. You have six weeks to decide.',
      evidence_items: [
        { id: 'e1', label: 'Customer survey', content: '68% of surveyed customers said they "would likely use" the feature. Survey sample: 200 users.', actual_quality: 'weak' },
        { id: 'e2', label: 'Competitor launch', content: 'A competitor launched a similar feature last month and gained 12% new signups.', actual_quality: 'misleading' },
        { id: 'e3', label: 'Engineering estimate', content: 'Engineering estimates 95% confidence that the feature will be production-ready by end of Q3.', actual_quality: 'strong' },
        { id: 'e4', label: 'Historical data', content: 'Your last 3 feature launches had post-launch bug rates of 15%, 8%, and 22% respectively.', actual_quality: 'strong' },
      ],
      guiding_questions: [
        'Which evidence should carry the most weight?',
        'What evidence might be actively misleading?',
      ],
    }
  }
  return {
    challenge_type: 'counterfactual',
    title: `${skillName} — Counterfactual Thinking`,
    original_scenario: 'A product team decided to cut onboarding time from 30 to 10 minutes to reduce user drop-off during signup.',
    original_conclusion: 'Shorter onboarding will increase conversion rates.',
    counterfactuals: [
      { id: 'c1', prompt: 'What if the users who dropped off during long onboarding were actually the most valuable users (high LTV)?', challenge_type: 'assumption_flip' },
      { id: 'c2', prompt: 'What if 10-minute onboarding leads to users not understanding the product, increasing 30-day churn?', challenge_type: 'context_change' },
      { id: 'c3', prompt: 'What is the strongest argument that keeping long onboarding is the RIGHT decision?', challenge_type: 'steelman' },
    ],
  }
}
