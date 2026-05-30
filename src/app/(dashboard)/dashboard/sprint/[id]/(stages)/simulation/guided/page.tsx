"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useSimulationStore } from "@/stores/useSimulationStore";
import { useSprintStore } from "@/stores/useSprintStore";

interface Scenario {
  id: string;
  title: string;
  difficulty: string;
  context: string;
  aiCharacterName: string;
}

export default function GuidedSimulationPage() {
  const router = useRouter();
  const { id: sprintId } = useParams<{ id: string }>();
  const { updateStage } = useSprintStore();
  const sim = useSimulationStore();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    api
      .get<{ scenarios: Scenario[] }>(`/api/v1/sprint/content/scenarios?skill_id=${sprintId}`)
      .then((data) => setScenarios(data.scenarios))
      .catch(() => {
        setScenarios([
          { id: "s1", title: "Missed Deadline Confrontation", difficulty: "medium", context: "Your team missed a major client deliverable. The VP of Client Relations is furious and demands answers in a 1-on-1 meeting.", aiCharacterName: "Sarah Chen" },
          { id: "s2", title: "Performance Review Pushback", difficulty: "easy", context: "A team member disagrees with their performance rating and becomes emotional during the review conversation.", aiCharacterName: "Marcus Webb" },
          { id: "s3", title: "Budget Cut Negotiation", difficulty: "hard", context: "Leadership wants to cut your team's budget by 30%. You need to negotiate to keep critical resources while showing fiscal responsibility.", aiCharacterName: "Dr. Elena Torres" },
        ]);
      });
  }, [sprintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim.messages]);

  const handleStart = async (scenarioId: string) => {
    await sim.startSimulation(sprintId, scenarioId, "guided");
    setStarted(true);
  };

  const handleSend = async () => {
    if (!input.trim() || sim.sending) return;
    const msg = input;
    setInput("");
    await sim.sendMessage(sprintId, msg);
    inputRef.current?.focus();
  };

  const handleEnd = async () => {
    await sim.endSimulation(sprintId);
    updateStage(sprintId, "independent-sim", 45);
    router.push(`/dashboard/sprint/${sprintId}/simulation/independent`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scenario selection
  if (!started) {
    return (
      <div className="sprint-stage-container sprint-stage-container-wide">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="sprint-stage-badge">Guided Simulation</span>
          <h1 className="headline-md" style={{ marginTop: 16, marginBottom: 8 }}>
            Select a Scenario
          </h1>
          <p className="body-sm" style={{ maxWidth: 550, margin: "0 auto" }}>
            Practice difficult workplace dialogues with real-time coaching suggestions. Select a scenario to begin:
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStart(s.id)}
              className="card card-interactive"
              style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", cursor: "pointer", width: "100%" }}
            >
              <div style={{ flex: 1 }}>
                <div className="flex-row" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{s.title}</span>
                  <span className={`chip ${s.difficulty === "easy" ? "chip-success" : s.difficulty === "hard" ? "chip-error" : "chip-warning"}`}>
                    {s.difficulty}
                  </span>
                </div>
                <p className="body-sm">
                  vs <strong>{s.aiCharacterName}</strong> — {s.context.substring(0, 120)}...
                </p>
              </div>
              <span className="btn btn-primary btn-sm">Start</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const dialogueMessages = sim.messages.filter((m) => m.role === "user" || m.role === "assistant");
  const latestHint = sim.coachHints.length > 0 ? sim.coachHints[sim.coachHints.length - 1] : null;

  return (
    <div className="sim-layout">
      {/* Chat Column */}
      <div className="sim-chat-col">
        <div className="sim-chat-header">
          <div className="flex-row">
            <span style={{ fontSize: 20 }}>🎭</span>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Guided Simulation</h2>
              <span className="label-micro" style={{ color: "var(--success)" }}>COACHING ACTIVE</span>
            </div>
          </div>
          <span className="chip chip-primary">Turn {sim.state?.turn_count || 0}</span>
        </div>

        {/* Messages */}
        <div className="sim-messages">
          {dialogueMessages.map((msg, i) => (
            <div key={msg.id || i} className={`sim-bubble ${msg.role === "user" ? "sim-bubble-user" : "sim-bubble-ai"}`}>
              <div className={`sim-bubble-content ${msg.role === "user" ? "sim-bubble-content-user" : "sim-bubble-content-ai"}`}>
                {msg.role === "assistant" && (
                  <div className="sim-bubble-label">AI Character</div>
                )}
                <p style={{ margin: 0 }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {sim.sending && (
            <div className="sim-bubble sim-bubble-ai">
              <div className="sim-bubble-content sim-bubble-content-ai">
                <div className="sim-bubble-label">Thinking...</div>
                <div className="typing-dots"><span>●</span><span>●</span><span>●</span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sim-input-area">
          <div className="sim-input-row">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Respond professionally..."
              rows={2}
            />
            <button
              className={`btn ${input.trim() ? "btn-primary" : "btn-ghost"}`}
              onClick={handleSend}
              disabled={!input.trim() || sim.sending}
            >
              Send
            </button>
          </div>
          <div className="flex-between" style={{ marginTop: 8 }}>
            <span className="body-sm">Shift+Enter for newline · Enter to Send</span>
            {(sim.state?.turn_count || 0) >= 3 && (
              <button className="btn btn-ghost btn-sm" onClick={handleEnd} style={{ color: "var(--error)" }}>
                End & Get Score
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coach Panel */}
      <div className="coach-panel">
        <div className="flex-row">
          <span style={{ fontSize: 20 }}>💡</span>
          <h3 className="coach-panel-title">AI Coach</h3>
        </div>

        {/* Telemetry */}
        {sim.state && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="label-mono">Live Telemetry</div>
            <TelemetryBar label="Trust / Cooperation" value={sim.state.trust_level} color="var(--success)" />
            <TelemetryBar label="Stress Level" value={sim.state.stress_level} color="var(--error)" />
            <TelemetryBar label="Escalation Risk" value={sim.state.escalation_risk} color="var(--warning)" />
          </div>
        )}

        {/* Coach Hints */}
        <div>
          <div className="label-mono" style={{ marginBottom: 8 }}>Recommendations</div>
          {latestHint ? (
            <div className="coach-hint">{latestHint}</div>
          ) : (
            <p className="body-sm">Coach feedback will appear here after each exchange.</p>
          )}
        </div>

        {/* Turn Scores */}
        {sim.lastTurnScores && (
          <div>
            <div className="label-mono" style={{ marginBottom: 8 }}>Last Turn Scores</div>
            <div className="grid-2" style={{ gap: 8 }}>
              <MiniScore label="Empathy" value={sim.lastTurnScores.empathy} />
              <MiniScore label="Clarity" value={sim.lastTurnScores.clarity} />
              <MiniScore label="Composure" value={sim.lastTurnScores.composure} />
              <MiniScore label="Listening" value={sim.lastTurnScores.listening} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TelemetryBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="telemetry-bar">
      <div className="telemetry-bar-header">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="telemetry-bar-track">
        <div className="telemetry-bar-fill" style={{ backgroundColor: color, width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "var(--success)" : value >= 45 ? "var(--warning)" : "var(--error)";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0" }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontWeight: 700, color }}>{value}</span>
    </div>
  );
}
