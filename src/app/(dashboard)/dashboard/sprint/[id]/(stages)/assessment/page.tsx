"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSimulationStore } from "@/stores/useSimulationStore";
import { useSprintStore } from "@/stores/useSprintStore";

export default function AssessmentPage() {
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
    await sim.startSimulation(sprintId, "final-assessment", "final");
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
    updateStage(sprintId, "report", 95);
    router.push(`/dashboard/sprint/${sprintId}/report`);
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
          <span className="sprint-stage-badge">Final Assessment</span>
          <h1 className="headline-md" style={{ marginTop: 16, marginBottom: 8 }}>
            🏆 Final Competency Assessment
          </h1>
          <p className="body-sm" style={{ maxWidth: 550, margin: "0 auto" }}>
            This is your final graded simulation. The AI will evaluate all 7 competency dimensions to produce your official readiness score.
          </p>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>Assessment Rules</div>
          <ul className="body-ui" style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>No coaching or hints — you&apos;re fully independent</li>
            <li>The scenario will adapt difficulty based on your performance</li>
            <li>All 7 competency dimensions will be scored</li>
            <li>Minimum 5 turns for a valid assessment</li>
            <li>Your final score determines your readiness certification</li>
          </ul>
        </div>

        <div style={{ textAlign: "center" }}>
          <button className="btn btn-primary btn-lg" onClick={handleStart} id="assessment-start">
            Begin Final Assessment →
          </button>
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
            <span style={{ fontSize: 20 }}>🏆</span>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Final Assessment</h2>
              <span className="label-micro" style={{ color: "var(--warning)" }}>GRADED</span>
            </div>
          </div>
          <span className="chip chip-warning">Turn {sim.state?.turn_count || 0}</span>
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
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Final assessment — give it your best..." rows={2} />
            <button className={`btn ${input.trim() ? "btn-primary" : "btn-ghost"}`} onClick={handleSend} disabled={!input.trim() || sim.sending}>
              Send
            </button>
          </div>
          <div className="flex-between" style={{ marginTop: 8 }}>
            <span className="body-sm">Enter to Send</span>
            {(sim.state?.turn_count || 0) >= 5 && (
              <button className="btn btn-primary btn-sm" onClick={handleEnd}>
                Complete Assessment & View Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
