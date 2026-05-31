"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { matchLearningGoal, PATTERN_LABELS } from "@/domain/goal-matching";
import type { CognitivePattern } from "@/domain/goal-matching";
import { emitPracticeEvent } from "@/lib/telemetry";
import { api } from "@/lib/api";

/**
 * LearningComposer — dashboard entry for describing a learning goal or challenge.
 * Uses the rules-first capability resolver (~90% catalog path).
 */

type SkillSuggestion = {
  name: string;
  icon: string;
  subtitle: string;
  href: string;
};

function buildSuggestions(resolution: ReturnType<typeof matchLearningGoal>): {
  skills: SkillSuggestion[];
  patternLabels: string[];
  path: "catalog" | "novel";
} {
  const skills = resolution.skills.map((s) => {
    const patternHint =
      s.matchedPatterns.length > 0
        ? ` · ${s.matchedPatterns
            .slice(0, 2)
            .map((p) => PATTERN_LABELS[p as CognitivePattern])
            .join(", ")}`
        : "";
    return {
      name: s.name,
      icon: s.icon,
      subtitle: `${s.subSkillCount} sub-skills · ${s.category}${patternHint}`,
      href: `/dashboard/sprint/${s.slug}`,
    };
  });

  return {
    skills,
    patternLabels: resolution.patternLabels,
    path: resolution.path,
  };
}

export default function LearningComposer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [goal, setGoal] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SkillSuggestion[] | null>(null);
  const [patternLabels, setPatternLabels] = useState<string[] | null>(null);
  const [resolutionPath, setResolutionPath] = useState<"catalog" | "novel" | null>(
    null
  );

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).map((f) => f.name);
    if (picked.length) setFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  };

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f !== name));

  const handleStartPlan = async () => {
    if (!goal.trim()) return;
    const resolution = matchLearningGoal(goal);
    const result = buildSuggestions(resolution);
    setSuggestions(result.skills);
    setPatternLabels(result.patternLabels);
    setResolutionPath(result.path);

    void emitPracticeEvent({
      event_type: "goal_submitted",
      cognitive_patterns: resolution.inferredPatterns,
    });

    try {
      await api.post("/api/v1/challenges", {
        title: goal.trim().slice(0, 200),
        raw_context: goal.trim(),
        inferred_skill_slugs: resolution.skills.map((s) => s.slug),
        inferred_patterns: resolution.inferredPatterns,
      });
    } catch {
      // Offline or unauthenticated — composer still works
    }
  };

  return (
    <section aria-label="Describe what you want to learn">
      <div className="composer">
        {files.length > 0 && (
          <div className="composer-attachments">
            {files.map((name) => (
              <span key={name} className="chip">
                📎 {name}
                <button
                  type="button"
                  onClick={() => removeFile(name)}
                  aria-label={`Remove ${name}`}
                  style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 4 }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="composer-input"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            autoGrow();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleStartPlan();
          }}
          placeholder="Describe a challenge or what you want to practice…"
          rows={1}
          id="learning-composer-input"
        />

        <div className="composer-toolbar">
          <div className="composer-tools">
            <button
              type="button"
              className="btn-round"
              onClick={() => fileInputRef.current?.click()}
              title="Attach a report or summary document"
              aria-label="Attach a document"
            >
              <span aria-hidden="true" style={{ fontSize: 16 }}>📎</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv,.md,.rtf"
              onChange={handleAttach}
              style={{ display: "none" }}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-pill"
            onClick={handleStartPlan}
            disabled={!goal.trim()}
            id="learning-composer-start"
          >
            Find practice →
          </button>
        </div>
      </div>

      <p className="body-sm" style={{ color: "var(--text-muted)", marginTop: 8 }}>
        Describe a workplace challenge or skill goal. We map it to capabilities in our catalog—no
        random suggestions.
      </p>

      {suggestions && suggestions.length === 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="guidance-box" style={{ padding: 16 }}>
            <p className="body-sm" style={{ margin: 0, color: "var(--text-secondary)" }}>
              {resolutionPath === "novel" ? (
                <>
                  This goal doesn&apos;t map cleanly to our catalog yet (custom learning paths
                  coming later). Try framing it as a capability—e.g. communication, judgment,
                  negotiation—or browse the{" "}
                </>
              ) : (
                <>No close match. Try different words or browse the </>
              )}
              <button
                type="button"
                onClick={() => router.push("/dashboard/catalog")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--primary-container)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Skills Catalog
              </button>
              .
            </p>
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {patternLabels && patternLabels.length > 0 && (
            <p className="body-sm" style={{ color: "var(--text-muted)", marginBottom: 10 }}>
              Capabilities we detected:{" "}
              {patternLabels.slice(0, 5).join(" · ")}
            </p>
          )}
          <h3 className="headline-sm" style={{ marginBottom: 12 }}>
            Suggested sprints
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {suggestions.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => router.push(s.href)}
                className="card card-interactive"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: 16,
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <span>
                    <span
                      style={{
                        display: "block",
                        fontWeight: 600,
                        color: "var(--text-heading)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span className="body-sm" style={{ color: "var(--text-muted)" }}>
                      {s.subtitle}
                    </span>
                  </span>
                </span>
                <span className="chip chip-primary">Start →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
