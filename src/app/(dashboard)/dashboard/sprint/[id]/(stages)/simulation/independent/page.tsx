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

export default function IndependentSimulationPage() {
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
      .get<{ scenarios: Scenario[] }>("/api/v1/sprint/content/scenarios")
      .then((data) => setScenarios(data.scenarios))
      .catch(() => {
        setScenarios([
          { id: "s4", title: "Cross-Team Conflict", difficulty: "medium", context: "Two teams are blaming each other for a project failure. You must mediate a meeting between both team leads.", aiCharacterName: "Jordan Blake" },
          { id: "s5", title: "Executive Pushback", difficulty: "hard", context: "You're presenting a controversial recommendation to a C-suite executive who strongly disagrees with your approach.", aiCharacterName: "Patricia Kensington" },
        ]);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim.messages]);

  const handleStart = async (scenarioId: string) => {
    sim.reset();
    await sim.startSimulation(sprintId, scenarioId, "independent");
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
    const evalData = await sim.endSimulation(sprintId);
    updateStage(sprintId, "replay", 55);
    const simId = sim.simulationId || "latest";
    router.push(`/dashboard/sprint/${sprintId}/replay?simId=${simId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!started) {
    return (
      <div className="sprint-stage-container sprint-stage-container-wide">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="sprint-stage-badge">Independent Simulation</span>
          <h1 className="headline-md" style={{ marginTop: 16, marginBottom: 8 }}>
            Solo Mode — No Coaching
          </h1>
          <p className="body-sm" style={{ maxWidth: 550, margin: "0 auto" }}>
            This time you&apos;re on your own. Apply the micro-skills you&apos;ve learned without AI coaching assistance.
          </p>
        </div>

        <div className="guidance-box guidance-box-warning" style={{ marginBottom: 24 }}>
          <div className="guidance-box-title">⚠️ No coaching hints</div>
          <div className="guidance-box-text">
            The AI coach panel is disabled. You must rely on what you&apos;ve practiced.
          </div>
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
                  <span className={`chip ${s.difficulty === "hard" ? "chip-error" : "chip-warning"}`}>{s.difficulty}</span>
                </div>
                <p className="body-sm">vs <strong>{s.aiCharacterName}</strong> — {s.context.substring(0, 120)}...</p>
              </div>
              <span className="btn btn-primary btn-sm">Start</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const dialogueMessages = sim.messages.filter((m) => m.role === "user" || m.role === "assistant");

  return (
    <div className="sim-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="sim-chat-col" style={{ borderRight: "none" }}>
        <div className="sim-chat-header">
          <div className="flex-row">
            <span style={{ fontSize: 20 }}>🎭</span>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Independent Simulation</h2>
              <span className="label-micro" style={{ color: "var(--warning)" }}>NO COACHING</span>
            </div>
          </div>
          <span className="chip">Turn {sim.state?.turn_count || 0}</span>
        </div>

        <div className="sim-messages">
          {dialogueMessages.map((msg, i) => (
            <div key={msg.id || i} className={`sim-bubble ${msg.role === "user" ? "sim-bubble-user" : "sim-bubble-ai"}`}>
              <div className={`sim-bubble-content ${msg.role === "user" ? "sim-bubble-content-user" : "sim-bubble-content-ai"}`}>
                {msg.role === "assistant" && <div className="sim-bubble-label">AI Character</div>}
                <p style={{ margin: 0 }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {sim.sending && (
            <div className="sim-bubble sim-bubble-ai">
              <div className="sim-bubble-content sim-bubble-content-ai">
                <div className="typing-dots"><span>●</span><span>●</span><span>●</span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="sim-input-area">
          <div className="sim-input-row">
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Respond on your own..." rows={2} />
            <button className={`btn ${input.trim() ? "btn-primary" : "btn-ghost"}`} onClick={handleSend} disabled={!input.trim() || sim.sending}>
              Send
            </button>
          </div>
          <div className="flex-between" style={{ marginTop: 8 }}>
            <span className="body-sm">Enter to Send</span>
            {(sim.state?.turn_count || 0) >= 3 && (
              <button className="btn btn-ghost btn-sm" onClick={handleEnd} style={{ color: "var(--error)" }}>
                End & Get Score
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
