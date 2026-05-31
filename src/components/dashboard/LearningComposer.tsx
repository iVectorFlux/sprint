"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SKILLS_TAXONOMY } from "@/data/skills-taxonomy";
import { toSlug } from "@/hooks/useSprintContext";

/**
 * LearningComposer — the dashboard entry point for describing a learning goal.
 *
 * The learner types what they want to learn (with optional context + attached
 * documents), then "Start Plan" matches the intent to skills that exist in the
 * catalog. Only real catalog matches are suggested — no fallback guesses.
 */

type SkillMatch = { name: string; icon: string; subtitle: string; href: string };

function matchSuggestions(query: string): SkillMatch[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  return SKILLS_TAXONOMY.map((skill) => {
    let score = 0;
    const name = skill.name.toLowerCase();
    if (q.includes(name)) score += 10;
    if (q.includes(skill.category.toLowerCase())) score += 4;

    // Token overlap against name + sub-skills (more reliable than substring).
    words.forEach((w) => {
      if (name.includes(w)) score += 4;
      skill.sub_skills.forEach((sub) => {
        const subName = sub.name.toLowerCase();
        if (q.includes(subName)) score += 8;
        else if (subName.includes(w)) score += 3;
      });
    });
    return { skill, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map<SkillMatch>((s) => ({
      name: s.skill.name,
      icon: s.skill.icon,
      subtitle: `${s.skill.sub_skills.length} sub-skills · ${s.skill.category}`,
      href: `/dashboard/sprint/${toSlug(s.skill.name)}`,
    }));
}

export default function LearningComposer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [goal, setGoal] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SkillMatch[] | null>(null);

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

  const handleStartPlan = () => {
    if (!goal.trim()) return;
    setSuggestions(matchSuggestions(goal));
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
          placeholder="Describe what you want to learn…"
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
            Start Plan →
          </button>
        </div>
      </div>

      <p className="body-sm" style={{ color: "var(--text-muted)", marginTop: 8 }}>
        Tell us what you want to learn and any context (your role, a situation, or attach a
        recent report or performance summary). We&apos;ll suggest the right practice.
      </p>

      {suggestions && suggestions.length === 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="guidance-box" style={{ padding: 16 }}>
            <p className="body-sm" style={{ margin: 0, color: "var(--text-secondary)" }}>
              We don&apos;t have a sprint for that yet. Try describing it differently, or browse
              the{" "}
              <button
                type="button"
                onClick={() => router.push("/dashboard/catalog")}
                style={{ background: "none", border: "none", padding: 0, color: "var(--primary-container)", cursor: "pointer", fontWeight: 600 }}
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
          <h3 className="headline-sm" style={{ marginBottom: 12 }}>
            Suggested practice
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
                    <span style={{ display: "block", fontWeight: 600, color: "var(--text-heading)" }}>
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
