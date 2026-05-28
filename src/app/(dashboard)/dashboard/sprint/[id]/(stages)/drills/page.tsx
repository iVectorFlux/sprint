"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useTelemetryStore } from "@/stores/useTelemetryStore";
import { useSprintContext } from "@/hooks/useSprintContext";
import type { SkillTaxonomyEntry } from "@/data/skills-taxonomy";

interface Drill {
  id: string;
  microSkill: string;
  type: "scenario" | "analysis" | "reflection" | "decision";
  prompt: string;
  context: string;
  expectedBehavior: string;
}

/**
 * Build drills that match the skill's learning engine type.
 * NOT everything is a conversation — some skills need analysis, reflection, or decision drills.
 */
function buildDrills(skill: SkillTaxonomyEntry): Drill[] {
  const engine = skill.learning_engine_type;

  // Drill templates by learning engine type
  const drillGenerators: Record<string, (sub: { name: string; description: string }, i: number) => Drill> = {
    simulation_based: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "scenario",
      context: `You're in a team meeting. A stakeholder challenges your approach, and the room is watching your response. This tests your ${sub.name.toLowerCase()}.`,
      prompt: `In this situation, what would you do first, and why? What specific words would you choose? What outcome are you optimizing for?`,
      expectedBehavior: sub.description,
    }),
    reflective_ai_mirror: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "reflection",
      context: `Think of a recent situation where ${sub.name.toLowerCase()} was relevant — a time you handled it well, or wish you had handled it differently.`,
      prompt: `Describe the situation briefly. What did you actually do? Looking back, what would you change? What does this tell you about your default patterns with ${sub.name.toLowerCase()}?`,
      expectedBehavior: sub.description,
    }),
    structured_reasoning: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "analysis",
      context: `You're reviewing a proposal from your team. Something feels off but you can't immediately pinpoint it. This requires ${sub.name.toLowerCase()}.`,
      prompt: `Walk through how you would systematically apply ${sub.name.toLowerCase()} to evaluate this proposal. What questions would you ask? What frameworks would you use? Where would most people go wrong?`,
      expectedBehavior: sub.description,
    }),
    consequence_simulation: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "decision",
      context: `You're facing a decision with incomplete information. You have 3 options, each with different trade-offs. This tests your ${sub.name.toLowerCase()}.`,
      prompt: `Option A: Act fast with limited data. Option B: Delay for more information. Option C: Delegate to someone closer to the problem. Which do you choose, and what's your reasoning? What are the second-order effects of each?`,
      expectedBehavior: sub.description,
    }),
    recovery_conditioning: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "reflection",
      context: `Plans have changed suddenly — a project you were leading just lost half its budget and your timeline was cut by 3 weeks. This tests your ${sub.name.toLowerCase()}.`,
      prompt: `What's your immediate internal reaction to this change? Now, separate your emotional response from your strategic response. What would you do in the next 24 hours? How do you communicate this to your team?`,
      expectedBehavior: sub.description,
    }),
    cognitive_conflict: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "analysis",
      context: `Your team is split 50/50 on a major decision. Both sides have compelling arguments. This requires ${sub.name.toLowerCase()}.`,
      prompt: `Instead of picking a side, apply ${sub.name.toLowerCase()} to this deadlock. How would you reframe the problem? What perspective is neither side considering? What new option might emerge if you challenge the assumptions both groups share?`,
      expectedBehavior: sub.description,
    }),
    constraint_architecture: (sub, i) => ({
      id: String(i + 1),
      microSkill: sub.name,
      type: "decision",
      context: `You need to design a solution with severe constraints — limited time, limited budget, and a demanding stakeholder. This tests your ${sub.name.toLowerCase()}.`,
      prompt: `How do you approach this? What trade-offs do you make first? How do you decide what to cut vs. what to protect? Walk through your reasoning, not just your answer.`,
      expectedBehavior: sub.description,
    }),
  };

  const generator = drillGenerators[engine] || drillGenerators.simulation_based;
  return skill.sub_skills.slice(0, 6).map((sub, i) => generator(sub, i));
}

const DRILL_TYPE_LABELS: Record<string, string> = {
  scenario: "Scenario Response",
  analysis: "Analysis Exercise",
  reflection: "Reflection Prompt",
  decision: "Decision Challenge",
};

export default function DrillsPage() {
  const router = useRouter();
  const { sprintId, skill, skillName, displayName, isSubSkillSprint, skillSlug, subSkillSlug } = useSprintContext();
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
    api
      .get<{ drills: Drill[] }>(`/api/v1/sprint/content/drills?skill_id=${sprintId}`)
      .then((data) => {
        setDrills(data.drills?.length ? data.drills : buildDrills(skill));
      })
      .catch(() => {
        setDrills(buildDrills(skill));
      });
  }, [sprintId, skill]);

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
      updateStage(sprintId, "guided-sim", 35);
      router.push(`/dashboard/sprint/${sprintId}/simulation/guided`);
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
              {skillName} · Think carefully, then respond
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
        <p className="body-ui" style={{ lineHeight: 1.7 }}>{drill.context}</p>
      </div>

      {/* The actual question */}
      <div className="card" style={{ padding: "20px 24px", marginBottom: 24, borderColor: "var(--primary-container)" }}>
        <div className="label-mono" style={{ marginBottom: 8 }}>Your Challenge</div>
        <p className="body-reading" style={{ fontSize: 15, lineHeight: 1.75 }}>{drill.prompt}</p>
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
              {currentDrill < drills.length - 1 ? "Next Drill →" : "Start Guided Simulation →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
