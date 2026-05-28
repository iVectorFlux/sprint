"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SKILLS_TAXONOMY } from "@/data/skills-taxonomy";

/**
 * LearningChatFAB — Floating chat button on the dashboard.
 * Opens a conversational interface where users can describe what they want to learn.
 * The AI (or smart matching) maps their intent → skills → sprint.
 * Renders via portal to document.body to avoid layout clipping.
 */
export default function LearningChatFAB() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"ask" | "context" | "match">("ask");
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [matches, setMatches] = useState<typeof SKILLS_TAXONOMY>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, step]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setStep("context");
  };

  const handleFindSkills = () => {
    // Smart matching: search query + context against taxonomy
    const q = `${query} ${context}`.toLowerCase();
    const scored = SKILLS_TAXONOMY.map((skill) => {
      let score = 0;
      // Match skill name
      if (q.includes(skill.name.toLowerCase())) score += 10;
      // Match category
      if (q.includes(skill.category.toLowerCase())) score += 5;
      // Match description words
      const descWords = skill.description.toLowerCase().split(/\s+/);
      descWords.forEach((w) => {
        if (w.length > 3 && q.includes(w)) score += 2;
      });
      // Match sub-skill names
      skill.sub_skills.forEach((sub) => {
        if (q.includes(sub.name.toLowerCase())) score += 8;
        const subWords = sub.description.toLowerCase().split(/\s+/);
        subWords.forEach((w) => {
          if (w.length > 4 && q.includes(w)) score += 1;
        });
      });
      return { skill, score };
    })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.skill);

    // If no matches, show top 3 as suggestions
    if (scored.length === 0) {
      setMatches(SKILLS_TAXONOMY.slice(0, 3));
    } else {
      setMatches(scored);
    }
    setStep("match");
  };

  const handleStartSprint = (skillName: string) => {
    const slug = skillName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    setOpen(false);
    setStep("ask");
    setQuery("");
    setContext("");
    router.push(`/dashboard/sprint/${slug}`);
  };

  const handleReset = () => {
    setStep("ask");
    setQuery("");
    setContext("");
    setMatches([]);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating Action Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="learning-chat-fab"
          id="learning-chat-fab"
          title="What do you want to learn?"
        >
          <span style={{ fontSize: 22 }}>✨</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="learning-chat-panel">
          <div className="learning-chat-header">
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>✨ Lumi6 Learning Guide</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Tell me what you want to learn</div>
            </div>
            <button
              onClick={() => { setOpen(false); handleReset(); }}
              style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-muted)" }}
            >
              ✕
            </button>
          </div>

          <div className="learning-chat-body">
            {step === "ask" && (
              <div className="learning-chat-step">
                <div className="learning-chat-bubble learning-chat-bubble-ai">
                  <p>What would you like to learn or improve? Describe it in your own words.</p>
                  <p className="body-sm" style={{ color: "var(--text-muted)", marginTop: 8 }}>
                    Examples: &quot;I want to handle difficult conversations better&quot;, &quot;improve my negotiation skills&quot;, &quot;think more strategically&quot;
                  </p>
                </div>
                <div className="learning-chat-input-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="I want to learn..."
                    className="learning-chat-input"
                  />
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary btn-sm"
                    disabled={!query.trim()}
                  >
                    →
                  </button>
                </div>
              </div>
            )}

            {step === "context" && (
              <div className="learning-chat-step">
                <div className="learning-chat-bubble learning-chat-bubble-user">
                  {query}
                </div>
                <div className="learning-chat-bubble learning-chat-bubble-ai">
                  <p>Great! Can you tell me more about your context?</p>
                  <p className="body-sm" style={{ color: "var(--text-muted)", marginTop: 8 }}>
                    Your role, industry, a specific situation you faced, or what triggered this learning goal. This helps me find the right skill and sub-skills.
                  </p>
                </div>
                <div className="learning-chat-input-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFindSkills()}
                    placeholder="Optional: your role, situation, or goal..."
                    className="learning-chat-input"
                  />
                  <button
                    onClick={handleFindSkills}
                    className="btn btn-primary btn-sm"
                  >
                    Find Skills
                  </button>
                </div>
              </div>
            )}

            {step === "match" && (
              <div className="learning-chat-step">
                <div className="learning-chat-bubble learning-chat-bubble-user">
                  {query}{context ? ` — ${context}` : ""}
                </div>
                <div className="learning-chat-bubble learning-chat-bubble-ai">
                  <p style={{ marginBottom: 12 }}>
                    Based on your goal, I recommend these skills. Each has sub-skills you can drill into:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {matches.map((skill) => (
                      <button
                        key={skill.name}
                        onClick={() => handleStartSprint(skill.name)}
                        className="learning-chat-match"
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 24 }}>{skill.icon}</span>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{skill.name}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                              {skill.sub_skills.length} sub-skills · {skill.category}
                            </div>
                          </div>
                        </div>
                        <span className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Start →</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="btn btn-ghost btn-sm"
                  style={{ alignSelf: "center", marginTop: 8 }}
                >
                  ← Try a different search
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
