"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useTelemetryStore } from "@/stores/useTelemetryStore";
import { useSprintContext } from "@/hooks/useSprintContext";
import { useArchetypeFlow } from "@/hooks/useArchetypeFlow";
import {
  buildDrills,
  buildAtomicDrills,
  type Drill,
} from "@/lib/drills/fallback-drills";

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
