"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSimulationStore } from "@/stores/useSimulationStore";
import { useSprintStore } from "@/stores/useSprintStore";

export default function EscalatedSimulationPage() {
  const router = useRouter();
  const { id: sprintId } = useParams<{ id: string }>();
  const { updateStage } = useSprintStore();
  const sim = useSimulationStore();
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim.messages]);

  const handleStart = async () => {
    sim.reset();
    await sim.startSimulation(sprintId, "escalated-default", "escalated");
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
    updateStage(sprintId, "final-test", 80);
    router.push(`/dashboard/sprint/${sprintId}/assessment`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!started) {
    return (
      <div className="sprint-stage-container">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="sprint-stage-badge" style={{ backgroundColor: "var(--error-container)", color: "var(--error)", borderColor: "var(--error)" }}>
            Escalated Retry
          </span>
          <h1 className="headline-md" style={{ marginTop: 16, marginBottom: 8 }}>
            🔥 High-Pressure Retry
          </h1>
          <p className="body-sm" style={{ maxWidth: 550, margin: "0 auto" }}>
            The AI character is more aggressive and emotional. Multiple stakeholders may weigh in. Your composure and de-escalation skills will be tested.
          </p>
        </div>

        <div className="guidance-box guidance-box-error" style={{ marginBottom: 24 }}>
          <div className="guidance-box-title">⚠️ Difficulty: High</div>
          <div className="guidance-box-text">
            The character will interrupt, raise voice, and challenge your credibility. Stay composed and apply your reflection insights.
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button className="btn btn-primary btn-lg" onClick={handleStart} id="escalated-start">
            Begin Escalated Simulation →
          </button>
        </div>
      </div>
    );
  }

  const dialogueMessages = sim.messages.filter((m) => m.role === "user" || m.role === "assistant");

  return (
    <div className="sim-layout" style={{ gridTemplateColumns: "1fr" }}>
      <div className="sim-chat-col" style={{ borderRight: "none" }}>
        <div className="sim-chat-header" style={{ backgroundColor: "var(--error-container)" }}>
          <div className="flex-row">
            <span style={{ fontSize: 20 }}>🔥</span>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Escalated Retry</h2>
              <span className="label-micro" style={{ color: "var(--error)" }}>HIGH PRESSURE</span>
            </div>
          </div>
          <span className="chip chip-error">Turn {sim.state?.turn_count || 0}</span>
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
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Stay composed..." rows={2} />
            <button className={`btn ${input.trim() ? "btn-primary" : "btn-ghost"}`} onClick={handleSend} disabled={!input.trim() || sim.sending}>
              Send
            </button>
          </div>
          <div className="flex-between" style={{ marginTop: 8 }}>
            <span className="body-sm">Enter to Send</span>
            {(sim.state?.turn_count || 0) >= 3 && (
              <button className="btn btn-ghost btn-sm" onClick={handleEnd} style={{ color: "var(--error)" }}>
                End & Proceed to Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
