"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useReflectionStore } from "@/stores/useReflectionStore";
import { useSprintStore } from "@/stores/useSprintStore";

export default function ReflectionPage() {
  const router = useRouter();
  const { id: sprintId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const simId = searchParams.get("simId");
  const { updateStage } = useSprintStore();
  const { analysis, loading, error, submitReflection, reset } = useReflectionStore();

  const [trigger, setTrigger] = useState("");
  const [change, setChange] = useState("");
  const [pattern, setPattern] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim() || !change.trim() || !pattern.trim() || loading) return;
    await submitReflection(sprintId, simId, { trigger, change, pattern });
    setSubmitted(true);
  };

  const handleNext = () => {
    updateStage(sprintId, "escalated", 70);
    router.push(`/dashboard/sprint/${sprintId}/simulation/escalated`);
  };

  return (
    <div className="sprint-stage-container" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <span className="sprint-stage-badge">Reflection</span>
        <h1 className="headline-md" style={{ marginTop: 16, marginBottom: 8 }}>
          Deliberate Self-Reflection
        </h1>
        <p className="body-sm" style={{ maxWidth: 600, margin: "0 auto" }}>
          AI practice is most effective when paired with self-awareness. Decode your emotional patterns and triggers.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label className="input-label" style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>
                1. What triggered you emotionally during the simulation?
              </label>
              <p className="body-sm" style={{ marginBottom: 8 }}>
                Identify exact statements or attitudes that made you defensive, nervous, or impatient.
              </p>
              <textarea
                required
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="e.g. When the character interrupted me and said my team was incompetent, I felt defensive..."
                rows={4}
                className="textarea"
              />
            </div>
            <div>
              <label className="input-label" style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>
                2. What would you change if you could redo it?
              </label>
              <p className="body-sm" style={{ marginBottom: 8 }}>
                Choose a specific moment and describe a more effective, micro-skill aligned approach.
              </p>
              <textarea
                required
                value={change}
                onChange={(e) => setChange(e.target.value)}
                placeholder="e.g. Instead of defending the timeline immediately, I would use active listening..."
                rows={4}
                className="textarea"
              />
            </div>
            <div>
              <label className="input-label" style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>
                3. What behavioral patterns do you notice in yourself?
              </label>
              <p className="body-sm" style={{ marginBottom: 8 }}>
                Do you automatically appease, fight back, over-explain, avoid the main issue, or get quiet?
              </p>
              <textarea
                required
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. I tend to over-explain technical reasons to protect my self-image..."
                rows={4}
                className="textarea"
              />
            </div>

            {error && <div style={{ color: "var(--error)", fontSize: 14, fontWeight: 600 }}>{error}</div>}

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} id="reflection-submit" style={{ width: "100%" }}>
              {loading ? "Analyzing with AI..." : "Submit Reflection & Get AI Decode"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div className="skeleton skeleton-card" />
            </div>
          ) : (
            <>
              {/* Analysis Card */}
              <div className="card" style={{ padding: 32 }}>
                <div className="flex-row" style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>🧠</span>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Self-Awareness Analysis</h2>
                    <span className="chip chip-success" style={{ marginTop: 4 }}>
                      Level: {analysis?.self_awareness_level || "Developing"}
                    </span>
                  </div>
                </div>

                <p className="body-reading" style={{ fontStyle: "italic", marginBottom: 24, color: "var(--text-secondary)" }}>
                  &ldquo;{analysis?.encouragement || "Great job reflecting. Deliberate practice is the key to mastering difficult conversations."}&rdquo;
                </p>

                <div className="grid-2" style={{ marginBottom: 24 }}>
                  <div className="guidance-box guidance-box-error">
                    <div className="guidance-box-title">⚡ Detected Triggers</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {analysis?.emotional_triggers?.map((t, i) => (
                        <span key={i} className="chip chip-error">{t}</span>
                      )) || <span className="body-sm">None identified</span>}
                    </div>
                  </div>
                  <div className="guidance-box guidance-box-accent">
                    <div className="guidance-box-title">🔄 Behavioral Patterns</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {analysis?.behavior_patterns?.map((p, i) => (
                        <span key={i} className="chip chip-primary">{p}</span>
                      )) || <span className="body-sm">None identified</span>}
                    </div>
                  </div>
                </div>

                <div className="guidance-box guidance-box-success" style={{ marginBottom: 24 }}>
                  <div className="guidance-box-title">🚀 Recommended Growth Areas</div>
                  <ul style={{ margin: 0, paddingLeft: 20, marginTop: 8 }}>
                    {analysis?.growth_areas?.map((ga, i) => (
                      <li key={i} className="body-sm" style={{ marginBottom: 4 }}>{ga}</li>
                    )) || <li className="body-sm">Commit to active listening under high pressure.</li>}
                  </ul>
                </div>

                <div className="guidance-box">
                  <div className="guidance-box-title">Next Phase Focus</div>
                  <div className="guidance-box-text">
                    {analysis?.next_focus || "Prepare for the Escalated Retry where higher stress tests your composure."}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <button className="btn btn-primary btn-lg" onClick={handleNext} id="reflection-continue">
                  Enter Escalated Retry →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
