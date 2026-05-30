'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useSprintStore } from '@/stores/useSprintStore'
import { useSprintContext } from '@/hooks/useSprintContext'
import { useArchetypeFlow } from '@/hooks/useArchetypeFlow'

type Phase = 'intro' | 'prompts' | 'pattern-detection' | 'growth-plan' | 'complete'

interface ReflectionPrompt {
  id: string
  question: string
  follow_up: string
  focus_area: string
}

interface ReflectionSession {
  session_title: string
  opening_frame: string
  reflection_prompts: ReflectionPrompt[]
  closing_challenge: string
}

interface EntryFeedback {
  depth_score: number
  depth_label: string
  feedback: string
  follow_up_question: string
  detected_emotions: string[]
  detected_patterns: string[]
}

interface DetectedPatterns {
  primary_patterns: Array<{ pattern_name: string; description: string; evidence: string; category: string }>
  triggers: string[]
  default_responses: string[]
  growth_edges: string[]
  self_awareness_level: string
  insight: string
}

interface GrowthPlan {
  growth_theme: string
  week_1: { focus: string; daily_practice: string; weekly_experiment: string; reflection_question: string }
  week_2: { focus: string; daily_practice: string; weekly_experiment: string; reflection_question: string }
  week_3: { focus: string; daily_practice: string; weekly_experiment: string; reflection_question: string }
  week_4: { focus: string; daily_practice: string; weekly_experiment: string; reflection_question: string }
  success_indicators: string[]
  accountability_prompt: string
}

export default function GuidedReflectionPage() {
  const router = useRouter()
  const { sprintId, skill, skillName, displayName, archetype } = useSprintContext()
  const flow = useArchetypeFlow(archetype)
  const { updateStage } = useSprintStore()

  const [phase, setPhase] = useState<Phase>('intro')
  const [session, setSession] = useState<ReflectionSession | null>(null)
  const [loadingSession, setLoadingSession] = useState(false)

  // Entry state
  const [promptIndex, setPromptIndex] = useState(0)
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [currentEntry, setCurrentEntry] = useState('')
  const [entryFeedback, setEntryFeedback] = useState<EntryFeedback | null>(null)
  const [analyzingEntry, setAnalyzingEntry] = useState(false)

  // Pattern / growth state
  const [patterns, setPatterns] = useState<DetectedPatterns | null>(null)
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(null)
  const [loadingPatterns, setLoadingPatterns] = useState(false)
  const [loadingGrowthPlan, setLoadingGrowthPlan] = useState(false)

  const loadSession = async () => {
    setLoadingSession(true)
    try {
      const data = await api.get<ReflectionSession>(
        `/api/v1/sprint/content/reflection-prompt?skill_id=${sprintId}&session_number=1`
      )
      setSession(data)
    } catch {
      setSession(getFallbackSession(skillName))
    }
    setLoadingSession(false)
  }

  const analyzeEntry = async (prompt: ReflectionPrompt, entry: string) => {
    setAnalyzingEntry(true)
    try {
      const data = await api.post<EntryFeedback>(
        `/api/v1/sprint/content/reflection-entry/analyze`,
        { skill_id: sprintId, prompt_question: prompt.question, user_entry: entry }
      )
      setEntryFeedback(data)
    } catch {
      setEntryFeedback(getFallbackFeedback(entry))
    }
    setAnalyzingEntry(false)
  }

  const detectPatterns = async () => {
    setLoadingPatterns(true)
    const entryList = Object.values(entries).filter(e => e.trim().length > 0)
    try {
      const data = await api.post<DetectedPatterns>(
        `/api/v1/sprint/content/pattern-detection`,
        { skill_id: sprintId, entries: entryList }
      )
      setPatterns(data)
    } catch {
      setPatterns(getFallbackPatterns(skillName))
    }
    setLoadingPatterns(false)
  }

  const generateGrowthPlan = async () => {
    if (!patterns) return
    setLoadingGrowthPlan(true)
    try {
      const data = await api.post<GrowthPlan>(
        `/api/v1/sprint/content/growth-plan`,
        { skill_id: sprintId, detected_patterns: patterns }
      )
      setGrowthPlan(data)
    } catch {
      setGrowthPlan(getFallbackGrowthPlan(skillName))
    }
    setLoadingGrowthPlan(false)
  }

  const handleStartReflection = () => {
    setPhase('prompts')
    loadSession()
  }

  const handleSubmitEntry = async () => {
    if (!session || !currentEntry.trim() || analyzingEntry) return
    const prompt = session.reflection_prompts[promptIndex]
    const newEntries = { ...entries, [prompt.id]: currentEntry }
    setEntries(newEntries)
    await analyzeEntry(prompt, currentEntry)
  }

  const handleNextPrompt = () => {
    if (!session) return
    if (promptIndex < session.reflection_prompts.length - 1) {
      setPromptIndex(prev => prev + 1)
      setCurrentEntry('')
      setEntryFeedback(null)
    } else {
      setPhase('pattern-detection')
      detectPatterns()
    }
  }

  const handleViewGrowthPlan = () => {
    setPhase('growth-plan')
    generateGrowthPlan()
  }

  const handleComplete = () => {
    updateStage(sprintId, 'report', 90)
    const nextUrl = flow.nextStageUrl('guided-reflection', sprintId)
    router.push(nextUrl)
  }

  const currentPrompt = session?.reflection_prompts[promptIndex]

  // ── Intro Phase ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="sprint-stage-container">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🪞</div>
          <span className="sprint-stage-badge" style={{ marginBottom: 16, display: 'inline-block' }}>
            Guided Reflection
          </span>
          <h1 className="headline-md" style={{ marginBottom: 12 }}>{displayName}</h1>
          <p className="body-reading" style={{ marginBottom: 32, color: 'var(--text-secondary)' }}>
            This isn't a quiz or a test. It's a structured space to examine your own patterns —
            how you actually respond in real situations, not how you think you should respond.
            The AI will guide you through reflection prompts and then surface the patterns it detects.
          </p>
          <div className="reflection-intro-cards">
            <div className="reflection-intro-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>💭</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Reflect</div>
              <p className="body-sm">Answer guided questions about real past situations</p>
            </div>
            <div className="reflection-intro-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Detect Patterns</div>
              <p className="body-sm">AI identifies your behavioral and emotional patterns</p>
            </div>
            <div className="reflection-intro-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>🌱</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Growth Plan</div>
              <p className="body-sm">Receive a 30-day personalized behavioral plan</p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ marginTop: 32 }}
            onClick={handleStartReflection}
            id="reflection-start"
          >
            Begin Reflection →
          </button>
        </div>
      </div>
    )
  }

  // ── Loading session ───────────────────────────────────────────────────────
  if (phase === 'prompts' && (loadingSession || !session)) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🪞</div>
        <p className="body-sm">Preparing your reflection session…</p>
        <div className="skeleton skeleton-card" style={{ marginTop: 24 }} />
      </div>
    )
  }

  // ── Prompts Phase ─────────────────────────────────────────────────────────
  if (phase === 'prompts' && session && currentPrompt) {
    const wordCount = currentEntry.trim().split(/\s+/).filter(Boolean).length
    const isDeep = wordCount > 60

    return (
      <div className="sprint-stage-container">
        {/* Session context */}
        {promptIndex === 0 && (
          <div className="reflection-opening-frame">
            <div className="reflection-opening-title">{session.session_title}</div>
            <p className="body-sm">{session.opening_frame}</p>
          </div>
        )}

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
          <span className="sprint-stage-badge">
            Prompt {promptIndex + 1} of {session.reflection_prompts.length}
          </span>
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {session.reflection_prompts.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: 3,
                  backgroundColor: i < promptIndex ? 'var(--success)' : i === promptIndex ? 'var(--primary-container)' : 'var(--border-subtle)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Focus area */}
        <div style={{ marginBottom: 8 }}>
          <span className="chip" style={{ fontSize: 11 }}>{currentPrompt.focus_area}</span>
        </div>

        {/* The question */}
        <div className="reflection-question-card">
          <p className="body-reading" style={{ fontSize: 17, lineHeight: 1.8 }}>
            {currentPrompt.question}
          </p>
        </div>

        {/* Entry input or feedback */}
        {!entryFeedback ? (
          <div>
            <textarea
              className="textarea reflection-textarea"
              placeholder="Write honestly. There are no right answers — only genuine ones. Share a specific situation, your actual thoughts and feelings, what you did, and what you noticed about yourself."
              rows={8}
              value={currentEntry}
              onChange={e => setCurrentEntry(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <div className="body-sm" style={{ color: isDeep ? 'var(--success)' : 'var(--text-muted)' }}>
                {wordCount} words {isDeep ? '· Good depth' : wordCount > 30 ? '· Getting there' : '· Aim for 60+ words'}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmitEntry}
                disabled={wordCount < 20 || analyzingEntry}
                id="reflection-submit"
              >
                {analyzingEntry ? 'Reflecting…' : 'Submit →'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* AI feedback */}
            <div className={`reflection-feedback-card ${entryFeedback.depth_score >= 70 ? 'reflection-feedback-deep' : 'reflection-feedback-surface'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div className="reflection-depth-badge" style={{
                  backgroundColor: entryFeedback.depth_score >= 70 ? 'var(--success-light)' : 'var(--warning-light)',
                  color: entryFeedback.depth_score >= 70 ? 'var(--success)' : 'var(--warning)',
                }}>
                  {entryFeedback.depth_label}
                </div>
                {entryFeedback.detected_emotions.length > 0 && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    {entryFeedback.detected_emotions.slice(0, 3).map((e, i) => (
                      <span key={i} className="chip" style={{ fontSize: 11 }}>{e}</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="body-ui">{entryFeedback.feedback}</p>
              {entryFeedback.depth_score < 70 && entryFeedback.follow_up_question && (
                <div className="reflection-followup">
                  <div className="label-micro" style={{ marginBottom: 6 }}>Go deeper:</div>
                  <p className="body-sm" style={{ fontStyle: 'italic' }}>{entryFeedback.follow_up_question}</p>
                </div>
              )}
            </div>

            {/* Entry echo */}
            <div className="card" style={{ padding: '14px 18px', marginTop: 16, marginBottom: 24 }}>
              <div className="label-mono" style={{ marginBottom: 6 }}>Your entry</div>
              <p className="body-ui" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{entries[currentPrompt.id]}</p>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleNextPrompt}
              id="reflection-next"
            >
              {promptIndex < session.reflection_prompts.length - 1 ? 'Next Question →' : 'Detect My Patterns →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Pattern Detection Phase ───────────────────────────────────────────────
  if (phase === 'pattern-detection') {
    if (loadingPatterns || !patterns) {
      return (
        <div className="sprint-stage-container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p className="body-sm">Analyzing your reflection patterns…</p>
          <p className="body-sm" style={{ color: 'var(--text-muted)', marginTop: 8 }}>This takes a moment — the AI is reading carefully</p>
          <div className="skeleton skeleton-card" style={{ marginTop: 24 }} />
          <div className="skeleton skeleton-card" style={{ marginTop: 12 }} />
        </div>
      )
    }

    return (
      <div className="sprint-stage-container">
        <span className="sprint-stage-badge" style={{ marginBottom: 16, display: 'inline-block' }}>
          Pattern Analysis
        </span>
        <h1 className="headline-md" style={{ marginBottom: 8 }}>What the AI sees in you</h1>
        <p className="body-sm" style={{ marginBottom: 32 }}>
          Based on {Object.keys(entries).length} reflection{Object.keys(entries).length > 1 ? 's' : ''}, here's what emerged:
        </p>

        {/* Self-awareness level */}
        <div className="pattern-awareness-banner">
          <div style={{ fontSize: 32 }}>🪞</div>
          <div>
            <div className="label-mono">Self-Awareness Level</div>
            <div className="headline-sm">{patterns.self_awareness_level}</div>
          </div>
        </div>

        {/* Core insight */}
        <div className="pattern-insight-card">
          <div className="label-mono" style={{ marginBottom: 8 }}>Core Insight</div>
          <p className="body-reading">{patterns.insight}</p>
        </div>

        {/* Patterns */}
        <div style={{ marginTop: 24 }}>
          <div className="headline-sm" style={{ marginBottom: 16 }}>Detected Patterns</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {patterns.primary_patterns.map((p, i) => (
              <div key={i} className="pattern-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className={`chip chip-${p.category === 'emotional' ? 'warning' : p.category === 'behavioral' ? 'primary' : ''}`} style={{ fontSize: 11 }}>
                    {p.category}
                  </span>
                  <span style={{ fontWeight: 600 }}>{p.pattern_name}</span>
                </div>
                <p className="body-sm" style={{ marginBottom: 8 }}>{p.description}</p>
                <div className="pattern-evidence">
                  <div className="label-micro" style={{ marginBottom: 4 }}>Evidence from your reflections:</div>
                  <p className="body-sm" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{p.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triggers & Growth edges */}
        <div className="grid-2" style={{ marginTop: 24, gap: 16 }}>
          <div>
            <div className="headline-sm" style={{ marginBottom: 10 }}>Your Triggers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {patterns.triggers.map((t, i) => (
                <div key={i} className="trigger-chip">⚡ {t}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="headline-sm" style={{ marginBottom: 10 }}>Growth Edges</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {patterns.growth_edges.map((g, i) => (
                <div key={i} className="growth-chip">🌱 {g}</div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: 32, width: '100%' }}
          onClick={handleViewGrowthPlan}
          id="view-growth-plan"
        >
          Create My Growth Plan →
        </button>
      </div>
    )
  }

  // ── Growth Plan Phase ─────────────────────────────────────────────────────
  if (phase === 'growth-plan') {
    if (loadingGrowthPlan || !growthPlan) {
      return (
        <div className="sprint-stage-container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
          <p className="body-sm">Building your personalized growth plan…</p>
          <div className="skeleton skeleton-card" style={{ marginTop: 24 }} />
        </div>
      )
    }

    const weeks = [
      { key: 'week_1', label: 'Week 1', data: growthPlan.week_1 },
      { key: 'week_2', label: 'Week 2', data: growthPlan.week_2 },
      { key: 'week_3', label: 'Week 3', data: growthPlan.week_3 },
      { key: 'week_4', label: 'Week 4', data: growthPlan.week_4 },
    ]

    return (
      <div className="sprint-stage-container">
        <span className="sprint-stage-badge" style={{ marginBottom: 16, display: 'inline-block' }}>30-Day Growth Plan</span>
        <h1 className="headline-md" style={{ marginBottom: 8 }}>{growthPlan.growth_theme}</h1>
        <p className="body-sm" style={{ marginBottom: 32 }}>{skillName} · Personalized to your patterns</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {weeks.map(({ key, label, data }) => (
            <div key={key} className="growth-week-card">
              <div className="growth-week-header">{label}: {data.focus}</div>
              <div className="growth-week-body">
                <div className="growth-item">
                  <div className="growth-item-label">📅 Daily Practice</div>
                  <p className="body-sm">{data.daily_practice}</p>
                </div>
                <div className="growth-item">
                  <div className="growth-item-label">🧪 Weekly Experiment</div>
                  <p className="body-sm">{data.weekly_experiment}</p>
                </div>
                <div className="growth-item">
                  <div className="growth-item-label">💭 End-of-Week Reflection</div>
                  <p className="body-sm" style={{ fontStyle: 'italic' }}>{data.reflection_question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success indicators */}
        <div className="growth-success-card" style={{ marginTop: 24 }}>
          <div className="headline-sm" style={{ marginBottom: 12 }}>You'll know it's working when…</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {growthPlan.success_indicators.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>
                <p className="body-sm" style={{ margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: 28, width: '100%' }}
          onClick={handleComplete}
          id="growth-plan-complete"
        >
          Complete Sprint & View Report →
        </button>
      </div>
    )
  }

  // ── Fallback Render (in case of an unexpected flow or phase state) ────────
  return (
    <div className="sprint-stage-container" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
      <h2 className="headline-sm">Unexpected Reflection State</h2>
      <p className="body-sm" style={{ color: 'var(--text-muted)', marginTop: 8 }}>
        The reflection session was loaded, but the engine is in an unexpected state.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <button
          className="btn btn-ghost"
          onClick={() => {
            setPhase('intro')
            setPromptIndex(0)
            setEntries({})
            setCurrentEntry('')
            setEntryFeedback(null)
            setPatterns(null)
            setGrowthPlan(null)
          }}
        >
          Reset Session
        </button>
        <button
          className="btn btn-primary"
          onClick={() => router.push(`/dashboard/sprint/${sprintId}`)}
        >
          Back to Sprint Detail
        </button>
      </div>
    </div>
  )
}

// ─── Fallback data ─────────────────────────────────────────────────────────

function getFallbackSession(skillName: string): ReflectionSession {
  return {
    session_title: `Understanding Your ${skillName} Patterns`,
    opening_frame: `This reflection session explores how ${skillName.toLowerCase()} actually shows up in your daily work — not in theory, but in real situations you've navigated.`,
    reflection_prompts: [
      {
        id: 'p1',
        question: `Think of a recent situation where ${skillName.toLowerCase()} was tested — a moment that didn't go the way you wanted. Describe what happened: the context, your response, and what you were feeling internally.`,
        follow_up: 'What specifically made this situation difficult for you? What were you most afraid of in that moment?',
        focus_area: 'Pattern recognition',
      },
      {
        id: 'p2',
        question: `Now think of a time when you handled ${skillName.toLowerCase()} well — a moment you felt genuinely capable. What was different about that situation?`,
        follow_up: 'What conditions made it easier? What internal state were you in?',
        focus_area: 'Strength identification',
      },
      {
        id: 'p3',
        question: `Looking at both situations, what patterns do you notice in yourself? What's the recurring theme in how you respond — particularly under pressure?`,
        follow_up: 'What do you think drives this default pattern? When did it first develop?',
        focus_area: 'Behavioral defaults',
      },
    ],
    closing_challenge: `This week, notice one moment where your default pattern shows up. Don't try to change it — just notice it and write down what triggered it.`,
  }
}

function getFallbackFeedback(entry: string): EntryFeedback {
  const wc = entry.trim().split(/\s+/).length
  const depth = wc > 80 ? 75 : wc > 40 ? 55 : 35
  return {
    depth_score: depth,
    depth_label: depth >= 70 ? 'Deep' : depth >= 50 ? 'Developing' : 'Surface',
    feedback: depth >= 70
      ? 'This is a thoughtful reflection. You\'re naming specific moments and internal states — that specificity is what makes reflection useful.'
      : 'You\'ve made a start. Try to go more specific: name the exact moment, the physical sensation, the precise thought. The more specific, the more useful.',
    follow_up_question: 'What were you thinking in the exact moment it started to go wrong?',
    detected_emotions: ['uncertainty', 'self-doubt'],
    detected_patterns: ['avoidance under pressure'],
  }
}

function getFallbackPatterns(skillName: string): DetectedPatterns {
  return {
    primary_patterns: [
      {
        pattern_name: 'Performance Under Observation',
        description: `You show up differently when you know you're being watched. Your ${skillName.toLowerCase()} quality improves with autonomy and drops with perceived scrutiny.`,
        evidence: 'Across reflections, situations where leadership was present triggered more cautious responses.',
        category: 'behavioral',
      },
      {
        pattern_name: 'Delayed Processing',
        description: 'Your best thinking happens after the fact, not in the moment. You often know the right response 10 minutes too late.',
        evidence: 'Multiple entries described "wishing I had said X" in hindsight.',
        category: 'cognitive',
      },
    ],
    triggers: ['Authority in the room', 'Ambiguous expectations', 'Public visibility'],
    default_responses: ['Over-explanation under pressure', 'Withdrawal when uncertain'],
    growth_edges: ['In-the-moment calibration', 'Distinguishing anxiety from insight', 'Speaking before certainty'],
    self_awareness_level: 'Developing',
    insight: `Your ${skillName.toLowerCase()} is most available to you when you feel safe. The growth work is learning to access it when you don't.`,
  }
}

function getFallbackGrowthPlan(skillName: string): GrowthPlan {
  return {
    growth_theme: `Accessing ${skillName} Under Pressure`,
    week_1: {
      focus: 'Pattern observation (no intervention)',
      daily_practice: 'At the end of each day, note one situation where your default pattern appeared. 5 minutes.',
      weekly_experiment: 'In one low-stakes meeting, deliberately pause for 3 seconds before responding.',
      reflection_question: 'What did I notice about when my default pattern was most active this week?',
    },
    week_2: {
      focus: 'Trigger identification',
      daily_practice: 'Before each significant conversation, name the specific thing you\'re most anxious about. 2 minutes.',
      weekly_experiment: 'In one difficult conversation, state your uncertainty aloud: "I\'m still processing this."',
      reflection_question: 'What triggers most reliably brought out my default pattern?',
    },
    week_3: {
      focus: 'Micro-interventions',
      daily_practice: 'Practice one specific new behavior in a safe context. Note the result.',
      weekly_experiment: 'Choose one situation where you\'d normally default — try the alternative.',
      reflection_question: 'What happened when I tried the alternative? What felt different?',
    },
    week_4: {
      focus: 'Integration and consolidation',
      daily_practice: 'Review your Week 1-3 notes. What has changed? What hasn\'t?',
      weekly_experiment: 'Apply your new approach in a genuinely challenging situation.',
      reflection_question: 'What has actually changed in how I show up? What\'s still a work in progress?',
    },
    success_indicators: [
      'You notice your default pattern activating in real time (not just afterwards)',
      'You have at least one alternative response ready before the conversation starts',
      `Others comment that something feels different about how you handle ${skillName.toLowerCase()} situations`,
    ],
    accountability_prompt: 'At the end of each week, spend 10 minutes writing down one situation where you tried something different. What happened? What did you learn?',
  }
}
