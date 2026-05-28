"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEvaluationStore } from "@/stores/useEvaluationStore";
import { useSprintStore } from "@/stores/useSprintStore";

const DIM_LABELS: Record<string, string> = {
  clarity: "Clarity",
  empathy: "Empathy",
  assertiveness: "Assertiveness",
  listening: "Active Listening",
  conflictManagement: "Conflict Mgmt",
  escalationControl: "De-escalation",
  composure: "Composure",
};

export default function ReplayPage() {
  const router = useRouter();
  const { id: sprintId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const simId = searchParams.get("simId") || "";
  const { updateStage } = useSprintStore();
  const { replay, loading, fetchReplay } = useEvaluationStore();

  useEffect(() => {
    if (simId) fetchReplay(sprintId, simId);
  }, [sprintId, simId, fetchReplay]);

  const handleContinue = () => {
    updateStage(sprintId, "reflection", 60);
    router.push(`/dashboard/sprint/${sprintId}/reflection?simId=${simId}`);
  };

  if (loading || !replay) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: "center", paddingTop: 100 }}>
        <div className="skeleton skeleton-card" style={{ marginBottom: 16 }} />
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  const ev = replay.evaluation;

  return (
    <div className="sprint-stage-container sprint-stage-container-wide" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="sprint-stage-badge">Replay Analysis</span>
        <h1 className="headline-md" style={{ marginBottom: 8 }}>
          🔄 {replay.simulation.scenarioTitle}
        </h1>
        <p className="body-sm">
          vs <strong>{replay.simulation.aiCharacterName}</strong> · {replay.simulation.mode} mode
        </p>
      </div>

      {ev && (
        <>
          {/* Overall Score */}
          <div className="card" style={{ padding: 36, textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: ev.overallScore >= 70 ? "var(--success)" : ev.overallScore >= 50 ? "var(--warning)" : "var(--error)",
              }}
            >
              {ev.overallScore}
            </div>
            <div className="label-mono" style={{ marginTop: 4 }}>Overall Score</div>
            <p className="body-ui" style={{ marginTop: 16, maxWidth: 500, margin: "16px auto 0" }}>
              {ev.summary}
            </p>
          </div>

          {/* Dimension Bars */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {Object.entries(DIM_LABELS).map(([key, label]) => {
              const score = (ev as unknown as Record<string, number>)[key] || 0;
              const color = score >= 70 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--error)";
              return (
                <div key={key} className="card" style={{ padding: "16px 20px" }}>
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${score}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Events */}
          {ev.timelineEvents && ev.timelineEvents.length > 0 && (
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <div className="label-mono" style={{ marginBottom: 16 }}>Key Moments</div>
              {ev.timelineEvents.map((event, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: i < ev.timelineEvents.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <span
                    className="label-mono"
                    style={{
                      minWidth: 60,
                      color: event.type === "strength" ? "var(--success)" : event.type === "weakness" ? "var(--error)" : undefined,
                    }}
                  >
                    {event.timestamp}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: event.type === "strength" ? "var(--success)" : event.type === "weakness" ? "var(--error)" : undefined }}>
                      {event.type === "strength" ? "✅" : event.type === "weakness" ? "⚠️" : "○"} {event.event}
                    </div>
                    {event.quote && (
                      <div className="body-sm" style={{ fontStyle: "italic", marginTop: 4 }}>
                        &ldquo;{event.quote}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths / Weaknesses / Retry */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <FeedbackCard title="What Worked" items={ev.strengths} color="var(--success)" icon="✅" />
            <FeedbackCard title="What Failed" items={ev.weaknesses} color="var(--error)" icon="❌" />
            <FeedbackCard title="Retry Suggestions" items={ev.retryRecommendations} color="var(--info)" icon="💡" />
          </div>
        </>
      )}

      {/* Transcript */}
      <div className="card" style={{ padding: 24, marginBottom: 36 }}>
        <div className="label-mono" style={{ marginBottom: 16 }}>Full Transcript</div>
        {replay.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((msg) => (
            <div
              key={msg.id}
              className="guidance-box"
              style={{
                marginBottom: 12,
                borderLeftColor: msg.role === "user" ? "var(--primary-container)" : "var(--border-medium)",
              }}
            >
              <div className="label-mono" style={{ marginBottom: 4 }}>
                {msg.role === "user" ? "You" : replay.simulation.aiCharacterName}
              </div>
              <p className="body-ui">{msg.content}</p>
            </div>
          ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button className="btn btn-primary btn-lg" onClick={handleContinue} id="replay-continue">
          Reflect on This →
        </button>
      </div>
    </div>
  );
}

function FeedbackCard({ title, items, color, icon }: { title: string; items: string[]; color: string; icon: string }) {
  return (
    <div className="card" style={{ padding: "20px 16px", borderColor: color, borderWidth: 2 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span> <span>{title}</span>
      </div>
      {items &&
        items.map((item, i) => (
          <div key={i} className="body-sm" style={{ padding: "4px 0", borderBottom: i < items.length - 1 ? "1px dashed var(--border-subtle)" : "none" }}>
            • {item}
          </div>
        ))}
    </div>
  );
}
