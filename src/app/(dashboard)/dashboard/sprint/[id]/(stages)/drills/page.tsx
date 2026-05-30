"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useTelemetryStore } from "@/stores/useTelemetryStore";
import { useSprintContext } from "@/hooks/useSprintContext";
import { useArchetypeFlow } from "@/hooks/useArchetypeFlow";
import type { SkillTaxonomyEntry, SubSkillEntry } from "@/data/skills-taxonomy";

interface Drill {
  id: string;
  microSkill: string;
  type: "scenario" | "analysis" | "reflection" | "decision";
  prompt: string;
  context: string;
  expectedBehavior: string;
}

/**
 * Build drills that match the skill's archetype.
 * Each archetype uses a different drill style.
 */
function buildDrills(skill: SkillTaxonomyEntry): Drill[] {
  const archetype = skill.archetype;

  // Drill templates by archetype
  const drillGenerators: Record<string, (sub: { name: string; description: string }, i: number) => Drill> = {
    conversational: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "scenario",
      context: `You're in a team meeting. A stakeholder challenges your approach, and the room is watching your response. This tests your ${sub.name.toLowerCase()}.`,
      prompt: `In this situation, what would you do first, and why? What specific words would you choose? What outcome are you optimizing for?`,
      expectedBehavior: sub.description,
    }),
    analytical: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "analysis",
      context: `You're reviewing a proposal from your team. Something feels off but you can't immediately pinpoint it. This requires ${sub.name.toLowerCase()}.`,
      prompt: `Walk through how you would systematically apply ${sub.name.toLowerCase()} to evaluate this proposal. What questions would you ask? What frameworks would you use? Where would most people go wrong?`,
      expectedBehavior: sub.description,
    }),
    reflective: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "reflection",
      context: `Think of a recent situation where ${sub.name.toLowerCase()} was relevant — a time you handled it well, or wish you had handled it differently.`,
      prompt: `Describe the situation briefly. What did you actually do? Looking back, what would you change? What does this tell you about your default patterns with ${sub.name.toLowerCase()}?`,
      expectedBehavior: sub.description,
    }),
    // Phase 2 stubs
    creation: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "scenario",
      context: `A creation challenge for ${sub.name.toLowerCase()}.`,
      prompt: `Describe how you would approach this.`,
      expectedBehavior: sub.description,
    }),
    performance: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "scenario",
      context: `A performance challenge for ${sub.name.toLowerCase()}.`,
      prompt: `Describe how you would approach this.`,
      expectedBehavior: sub.description,
    }),
    systems: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "decision",
      context: `You need to design a solution with severe constraints — limited time, budget, and a demanding stakeholder. This tests your ${sub.name.toLowerCase()}.`,
      prompt: `How do you approach this? What trade-offs do you make first? Walk through your reasoning.`,
      expectedBehavior: sub.description,
    }),
  };

  const generator = drillGenerators[archetype] || drillGenerators.conversational;
  return skill.sub_skills.slice(0, 6).map((sub, i) => generator(sub, i));
}

const CUSTOM_DRILLS: Record<string, { context: string; prompt: string }> = {
  // Active Listening
  "Paraphrasing": {
    context: `A teammate (Jordan) pushes back on your proposal to adopt a new task tracking tool in a meeting:

Jordan (COUNTERPART):
"I don't see why we need to change our approach, it's worked fine so far."`,
    prompt: `Respond using Paraphrasing to restate their concern in your own words before introducing the change.

💡 COACH INSTRUCTION
How can you respond using objective framing to refocus the conversation on the specific issue at hand?`,
  },
  "Reflective Questioning": {
    context: `Your colleague (Alex) is highly concerned about an upcoming database migration:

Alex (COUNTERPART):
"I'm really worried about this database migration. If anything goes wrong, the whole system could be down for hours and clients will be furious."`,
    prompt: `Ask a Reflective Question that digs into their underlying concern instead of just giving a superficial reassurance.

💡 COACH INSTRUCTION
Probe their deeper concern—is it the technical complexity of the migration, or do they feel the rollback plans are insufficient?`,
  },
  "Non-verbal Acknowledgment": {
    context: `A junior designer (Maria) is sharing a creative concept. She seems nervous, speaking fast and looking for confirmation:

Maria (COUNTERPART):
"So... this is the layout I was thinking of. It's a bit different, but I think it could work..."`,
    prompt: `Describe how you would use Non-verbal Acknowledgment to make Maria feel comfortable, valued, and heard.

💡 COACH INSTRUCTION
Detail your body language, eye contact, and brief vocal cues to signal engagement without interrupting her flow.`,
  },
  "Emotional Validation": {
    context: `An engineering lead (Taylor) is visibly frustrated:

Taylor (COUNTERPART):
"Product just shifted the scope on us again. That's the third time this month! We're never going to ship this on time."`,
    prompt: `Formulate a response that uses Emotional Validation to acknowledge Taylor's frustration before discussing timeline solutions.

💡 COACH INSTRUCTION
Acknowledge the emotional impact of shifted goalposts and validate Taylor's feelings directly before turning to factual resource/deadline planning.`,
  },
  "Summarizing": {
    context: `Your manager (Marcus) spent the last five minutes explaining multiple different concerns regarding an upcoming client demo: latency issues in the dashboard, lack of clean sample data, and the marketing team's availability.`,
    prompt: `Provide a crisp, clear Summary of the key points Marcus raised.

💡 COACH INSTRUCTION
Synthesize the multiple concerns into 2-3 logical bullet points and ask for confirmation to ensure full alignment.`,
  },
  "Silence Management": {
    context: `A client is explaining a critical bug, but hesitates and trails off:

Client (COUNTERPART):
"Well, we ran the script, and... I don't know, it just didn't feel right..." [Silence falls]`,
    prompt: `Describe how you would handle this pause using Silence Management.

💡 COACH INSTRUCTION
Explain the benefit of holding back instead of immediately jumping in to fill the gap. What is the optimal pause duration, and why?`,
  },

  // Storytelling
  "Narrative Arc Construction": {
    context: `You want to pitch a bug-fix prioritization to the leadership team. You have the raw data showing a 40% drop in user checkout retention.`,
    prompt: `Outline a brief narrative arc (Tension, Climax, Resolution) to present this problem to the team.

💡 COACH INSTRUCTION
Avoid simply listing raw numbers. Structure a story where the user's frustration is the core obstacle and the consolidation of checkout is the resolution.`,
  },
  "Emotional Hook Setting": {
    context: `You are opening a presentation about cybersecurity training to a group of distracted employees.`,
    prompt: `Draft an opening hook (1-2 sentences) to immediately capture the room's attention.

💡 COACH INSTRUCTION
Start with a vivid, relatable moment (e.g. a 9:00 AM panic) rather than a dry definition of cybersecurity.`,
  },
  "Concrete Detail Selection": {
    context: `You are reporting a database outage in a post-mortem review. The initial draft says: "The server crashed due to high traffic."`,
    prompt: `Rewrite this using Concrete Detail Selection to make the technical situation tangible and clear.

💡 COACH INSTRUCTION
Replace abstractions with specific technical metrics (e.g., database latency, memory spikes) to create a clear mental image.`,
  },
  "Audience-Relevant Framing": {
    context: `You are presenting the migration from legacy software to two different groups: the Finance team and the Engineering team.`,
    prompt: `Provide the specific focus or stake you would highlight for each of these two audiences.

💡 COACH INSTRUCTION
Differentiate what each team cares about: ROI and cost efficiency vs. developer velocity and API maintenance.`,
  },
  "Punchline Delivery": {
    context: `You are concluding a presentation about why the design team should prioritize product simplicity.`,
    prompt: `Draft a memorable concluding punchline that lands your key message with maximum impact.

💡 COACH INSTRUCTION
Keep it brief, highly quotable, and directly connected to the core theme (e.g., 'a feature the user cannot find is a feature that does not exist').`,
  },
};

/**
 * Build drills specifically for a sub-skill using its atomic skills.
 */
function buildAtomicDrills(skill: SkillTaxonomyEntry, subSkill: SubSkillEntry): Drill[] {
  const archetype = skill.archetype;

  // Drill templates tailored by archetype and centered on atomic skills of the sub-skill
  const drillGenerators: Record<string, (atom: { name: string; description: string }, i: number) => Drill> = {
    conversational: (atom, i) => {
      const custom = CUSTOM_DRILLS[atom.name];
      return {
        id: String(i + 1),
        microSkill: atom.name,
        type: "scenario",
        context: custom ? custom.context : `You're practicing ${subSkill.name.toLowerCase()}. In this dynamic work scenario, you are challenged to apply ${atom.name.toLowerCase()} effectively.`,
        prompt: custom ? custom.prompt : `Given this conversational focus, what specific words or approach would you use to demonstrate ${atom.name.toLowerCase()}? Describe your response and the rationale behind it.`,
        expectedBehavior: atom.description,
      };
    },
    analytical: (atom, i) => ({
      id: String(i + 1),
      microSkill: atom.name,
      type: "analysis",
      context: `You are analyzing a complex problem that requires ${subSkill.name.toLowerCase()}. Specifically, you must employ ${atom.name.toLowerCase()} to break down the details.`,
      prompt: `Walk through how you would systematically apply ${atom.name.toLowerCase()} to analyze the situation. What frameworks, logic, or questions would you prioritize?`,
      expectedBehavior: atom.description,
    }),
    reflective: (atom, i) => ({
      id: String(i + 1),
      microSkill: atom.name,
      type: "reflection",
      context: `Reflect on a past situation where ${subSkill.name.toLowerCase()} was at play, focusing on how you handled (or could have handled) the aspect of ${atom.name.toLowerCase()}.`,
      prompt: `Describe the context briefly. How did you apply ${atom.name.toLowerCase()}? What did you learn about your default habits with this atomic building block?`,
      expectedBehavior: atom.description,
    }),
    creation: (atom, i) => ({
      id: String(i + 1),
      microSkill: atom.name,
      type: "scenario",
      context: `A core creation challenge under the sub-skill ${subSkill.name}. You need to apply ${atom.name.toLowerCase()} to draft or build a solution.`,
      prompt: `Outline your step-by-step creation approach. How will you integrate ${atom.name.toLowerCase()} to optimize the final artifact?`,
      expectedBehavior: atom.description,
    }),
    performance: (atom, i) => ({
      id: String(i + 1),
      microSkill: atom.name,
      type: "scenario",
      context: `A performance event requiring ${subSkill.name}. Specifically, your mastery of ${atom.name.toLowerCase()} will determine the outcome.`,
      prompt: `Describe how you would execute this under pressure. What key indicators of ${atom.name.toLowerCase()} will you highlight?`,
      expectedBehavior: atom.description,
    }),
    systems: (atom, i) => ({
      id: String(i + 1),
      microSkill: atom.name,
      type: "decision",
      context: `You are designing or managing a system involving ${subSkill.name}. You need to balance design trade-offs utilizing ${atom.name.toLowerCase()}.`,
      prompt: `What architectural or procedural choices do you make? How does ${atom.name.toLowerCase()} help you decide where to compromise?`,
      expectedBehavior: atom.description,
    }),
  };

  const generator = drillGenerators[archetype] || drillGenerators.conversational;
  return (subSkill.atomic_skills || []).slice(0, 6).map((atom, i) => generator(atom, i));
}

const DRILL_TYPE_LABELS: Record<string, string> = {
  scenario: "Scenario Response",
  analysis: "Analysis Exercise",
  reflection: "Reflection Prompt",
  decision: "Decision Challenge",
};

export default function DrillsPage() {
  const router = useRouter();
  const { sprintId, skill, subSkill, skillName, displayName, isSubSkillSprint, skillSlug, subSkillSlug, archetype } = useSprintContext();
  const flow = useArchetypeFlow(archetype);
  const { updateStage } = useSprintStore();
  const { setStage, addDrillScore } = useProgressStore();
  const { track } = useTelemetryStore();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [currentDrill, setCurrentDrill] = useState(0);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; isGood: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(90);
  const [timerActive, setTimerActive] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!skill) return;
    if (isSubSkillSprint) setStage(skillSlug, subSkillSlug, "drill");
    track({ type: "stage_enter", skillSlug, subSkillSlug, data: { stage: "drill" } });
    
    const fallbackDrills = isSubSkillSprint && subSkill 
      ? buildAtomicDrills(skill, subSkill) 
      : buildDrills(skill);

    const focusQuery = isSubSkillSprint && subSkill ? `&focus_sub_skill=${encodeURIComponent(subSkill.name)}` : '';
    const atomicQuery = isSubSkillSprint && subSkill?.atomic_skills ? `&atomic_skills=${encodeURIComponent(subSkill.atomic_skills.map(a => a.name).join(','))}` : '';

    // Use the new archetype-aware /drills endpoint
    api
      .get<{ drills: Drill[] }>(`/api/v1/sprint/content/drills?skill_id=${sprintId}${focusQuery}${atomicQuery}`)
      .then((data) => {
        setDrills(data.drills?.length ? data.drills : fallbackDrills);
      })
      .catch(() => {
        setDrills(fallbackDrills);
      });
  }, [sprintId, skill, isSubSkillSprint, subSkill]);

  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, timer]);

  useEffect(() => {
    if (timer <= 0 && !feedback) handleSubmit();
  }, [timer]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    if (submitting || feedback) return;
    setSubmitting(true);
    setTimerActive(false);

    const drill = drills[currentDrill];
    if (!drill) return;

    try {
      // Try dev endpoint first (no auth needed), then auth endpoint
      let result: { score: number; feedback: string; isGood: boolean };
      try {
        result = await api.post<{ score: number; feedback: string; isGood: boolean }>(
          `/api/v1/dev/evaluate-drill`,
          { userResponse: response || "(no response)", drillPrompt: drill.prompt, expectedBehavior: drill.expectedBehavior }
        );
      } catch {
        result = await api.post<{ score: number; feedback: string; isGood: boolean }>(
          `/api/v1/sprint/${sprintId}/drill/evaluate`,
          { userResponse: response || "(no response)", drillPrompt: drill.prompt, expectedBehavior: drill.expectedBehavior }
        );
      }
      setFeedback(result);
      if (isSubSkillSprint) addDrillScore(skillSlug, subSkillSlug, result.score);
      track({
        type: "drill_submit",
        skillSlug,
        subSkillSlug,
        data: { score: result.score, wordCount: response.trim().split(/\s+/).length, microSkill: drill.microSkill, responseTimeMs: (90 - timer) * 1000, source: "ai" },
      });
    } catch {
      // Smart fallback scoring based on response quality
      const wordCount = response.trim().split(/\s+/).length;
      const hasReasoning = /because|therefore|since|however|although|considering|reason|means/i.test(response);
      const hasSpecifics = /first|then|next|specifically|for example|such as|instance|step/i.test(response);
      const hasNuance = /trade-off|depend|context|on the other hand|alternatively|balance|risk/i.test(response);
      const asksQuestions = /\?/.test(response);

      let score = 55;
      if (wordCount > 20) score += 10;
      if (wordCount > 50) score += 8;
      if (wordCount > 100) score += 7;
      if (hasReasoning) score += 8;
      if (hasSpecifics) score += 7;
      if (hasNuance) score += 5;
      if (asksQuestions) score += 5;
      score = Math.min(score, 95);

      const isGood = score >= 70;
      setFeedback({
        score,
        feedback: isGood
          ? `Good thinking on ${drill.microSkill.toLowerCase()}. You demonstrated thoughtful reasoning and engaged with the challenge meaningfully. The upcoming simulation will let you apply this in a more dynamic, interactive context.`
          : `Your response shows a starting understanding of ${drill.microSkill.toLowerCase()}, but could go deeper. Try explaining your reasoning step by step, considering what could go wrong, and describing the specific actions you would take. Depth matters more than length.`,
        isGood,
      });
      // Track score
      if (isSubSkillSprint) addDrillScore(skillSlug, subSkillSlug, score);
      track({
        type: "drill_submit",
        skillSlug,
        subSkillSlug,
        data: { score, wordCount, microSkill: drill.microSkill, responseTimeMs: (90 - timer) * 1000 },
      });
    }
    setSubmitting(false);
  };

  const nextDrill = () => {
    if (currentDrill < drills.length - 1) {
      setCurrentDrill((prev) => prev + 1);
      setResponse("");
      setFeedback(null);
      setTimer(90);
      setTimerActive(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // Route to the next stage for this archetype
      const nextUrl = flow.nextStageUrl("drills", sprintId);
      updateStage(sprintId, "drills-complete", 35);
      router.push(nextUrl);
    }
  };

  if (drills.length === 0) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: "center", paddingTop: 100 }}>
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  const drill = drills[currentDrill];
  const timerMinutes = Math.floor(timer / 60);
  const timerSeconds = timer % 60;
  const timerClass = timer > 45 ? "" : timer > 15 ? "drill-timer-warning" : "drill-timer-danger";

  return (
    <div className="sprint-stage-container">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <span className="sprint-stage-badge">
              Drill {currentDrill + 1} of {drills.length} · {DRILL_TYPE_LABELS[drill.type] || "Exercise"}
            </span>
            <h1 className="headline-md" style={{ marginTop: 12, marginBottom: 4 }}>
              {drill.microSkill}
            </h1>
            <p className="body-sm">
              {isSubSkillSprint && subSkill ? `${skillName} · ${subSkill.name}` : skillName} · Think carefully, then respond
            </p>
          </div>
          {!feedback && (
            <div className={`drill-timer ${timerClass}`}>
              {timerMinutes}:{String(timerSeconds).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      {/* Situation context */}
      <div
        style={{
          padding: "18px 22px",
          backgroundColor: "var(--surface-container-low)",
          borderLeft: "3px solid var(--primary-container)",
          marginBottom: 16,
        }}
      >
        <div className="label-mono" style={{ marginBottom: 8, color: "var(--primary-container)" }}>Situation</div>
        <p className="body-ui" style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>{drill.context}</p>
      </div>

      {/* The actual question */}
      <div className="card" style={{ padding: "20px 24px", marginBottom: 24, borderColor: "var(--primary-container)" }}>
        <div className="label-mono" style={{ marginBottom: 8 }}>Your Challenge</div>
        <p className="body-reading" style={{ fontSize: 15, lineHeight: 1.75, whiteSpace: "pre-line" }}>{drill.prompt}</p>
      </div>

      {/* Response Input or Feedback */}
      {!feedback ? (
        <div>
          <textarea
            ref={inputRef}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Think through your answer carefully. Explain your reasoning, not just your conclusion."
            autoFocus
            className="textarea"
            style={{ minHeight: 160, marginBottom: 20 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="body-sm">
              {response.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !response.trim()}
              id="drill-submit"
            >
              {submitting ? "Evaluating..." : "Submit →"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Score card */}
          <div
            className="card"
            style={{
              padding: 24,
              marginBottom: 16,
              borderColor: feedback.isGood ? "var(--success)" : "var(--warning)",
              borderWidth: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  backgroundColor: feedback.isGood ? "var(--success-light)" : "var(--warning-light)",
                  color: feedback.isGood ? "var(--success)" : "var(--warning)",
                  borderRadius: "50%",
                }}
              >
                {feedback.score}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: feedback.isGood ? "var(--success)" : "var(--warning)" }}>
                  {feedback.isGood ? "Strong Response" : "Needs Development"}
                </div>
                <div className="body-sm">
                  {feedback.isGood ? "You demonstrated the core skill effectively" : "Review the micro-skill and try a different approach"}
                </div>
              </div>
            </div>
            <p className="body-ui" style={{ lineHeight: 1.7 }}>{feedback.feedback}</p>
          </div>

          {/* User response echo */}
          <div className="card" style={{ marginBottom: 28, padding: "16px 20px" }}>
            <div className="label-mono" style={{ marginBottom: 6 }}>Your response</div>
            <p className="body-ui" style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
              {response || "(no response)"}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="btn btn-primary btn-lg" onClick={nextDrill} id="drill-next">
              {currentDrill < drills.length - 1
                ? "Next Drill →"
                : archetype === "analytical"
                  ? "Enter Reasoning Workspace →"
                  : archetype === "reflective"
                    ? "Begin Guided Reflection →"
                    : "Start Guided Simulation →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
