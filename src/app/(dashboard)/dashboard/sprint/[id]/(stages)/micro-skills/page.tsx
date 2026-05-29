"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSprintContext } from "@/hooks/useSprintContext";
import type { SkillTaxonomyEntry } from "@/data/skills-taxonomy";

interface MicroSkill {
  id: string;
  name: string;
  whatItIs: string;
  whyItMatters: string;
  howToApply: string;
  commonMistake: string;
}

/**
 * Build rich micro-skill content from taxonomy.
 * Each micro-skill gets 4 educational ingredients: What, Why, How, and Pitfalls.
 * Content varies by skill category & learning engine type.
 */
function buildMicroSkills(skill: SkillTaxonomyEntry): MicroSkill[] {
  const archetype = skill.archetype;
  const category = skill.category;

  return skill.sub_skills.map((sub, i) => {
    // Generate contextual "why" based on category
    const whyContexts: Record<string, string> = {
      "Human Skills": `In team environments and stakeholder interactions, ${sub.name.toLowerCase()} directly impacts trust, collaboration quality, and how others perceive your leadership potential. It's often the invisible factor behind why some professionals advance faster than others.`,
      "Cognitive Skills": `Strong ${sub.name.toLowerCase()} separates thoughtful decision-makers from reactive ones. In complex environments where information is ambiguous and stakes are high, this capability determines the quality of your judgments and the outcomes you produce.`,
      "Technical Skills": `As technology landscapes shift rapidly, ${sub.name.toLowerCase()} ensures you can operate effectively with modern tools and systems. It's not about knowing every tool — it's about having the mental framework to evaluate, adopt, and leverage them strategically.`,
      "Strategic Skills": `Organizations need people who can see beyond their immediate tasks. ${sub.name.toLowerCase()} gives you the ability to understand interconnections, anticipate consequences, and make decisions that account for the bigger picture.`,
      "Leadership Skills": `Leaders who demonstrate ${sub.name.toLowerCase()} build stronger teams, resolve conflicts faster, and create environments where people do their best work. It's a multiplier on every other skill you have.`,
      "Business Skills": `In revenue-driving roles, ${sub.name.toLowerCase()} is the difference between transactional interactions and strategic partnerships. Mastering it creates compounding value over time.`,
    };

    // Generate contextual "how to apply" based on archetype
    const howContexts: Record<string, string> = {
      conversational: `Practice this through realistic role-play scenarios. Start by observing what ${sub.name.toLowerCase()} looks like in action, then try applying it in low-stakes situations. Pay attention to how others respond differently when you use it deliberately versus when you don't.`,
      reflective: `Build this through structured self-reflection. After any significant interaction, ask yourself: "How did I apply ${sub.name.toLowerCase()} here? What would I do differently?" Track your patterns over time — the goal is to move from unconscious habit to conscious choice.`,
      analytical: `Develop this through deliberate analysis exercises. When facing problems or decisions, explicitly apply ${sub.name.toLowerCase()} as a distinct step in your process. Over time, it becomes a natural part of how you think, not an extra effort.`,
      creation: `Develop this through deliberate creation practice. Draft → get feedback → revise. The key is to produce work, expose it to critique, and iterate systematically.`,
      performance: `Build this through progressive exposure. Start with mild challenges that require ${sub.name.toLowerCase()}, then gradually increase the complexity and pressure.`,
      systems: `Practice this within deliberately limited environments. Constraints actually improve ${sub.name.toLowerCase()} because they force you to be creative and systematic rather than defaulting to the first approach.`,
    };

    // Generate contextual "common mistake" based on sub-skill
    const commonMistakes: Record<string, string> = {};
    // Use difficulty level to indicate sophistication of the mistake
    const mistakeByDifficulty = [
      "",
      `Confusing knowing about ${sub.name.toLowerCase()} with actually being able to do it. Knowledge and application are different — you need deliberate practice, not just awareness.`,
      `Applying ${sub.name.toLowerCase()} only in comfortable situations. The real test is whether you can maintain it under pressure, uncertainty, or when dealing with difficult people.`,
      `Treating ${sub.name.toLowerCase()} as a technique to deploy rather than a capability to embody. People can tell when you're "performing" a skill versus genuinely applying it.`,
      `Overcomplicating ${sub.name.toLowerCase()} by trying to be perfect. Start simple — even a 20% improvement in how you apply this skill creates noticeable results in how others respond to you.`,
      `Underestimating how long it takes to truly master ${sub.name.toLowerCase()}. This is a deep skill that takes months of deliberate practice to internalize. Be patient with yourself, but be consistent.`,
    ];

    return {
      id: String(i + 1),
      name: sub.name,
      whatItIs: sub.description + ` At difficulty level ${sub.difficulty_level}/5, this is ${sub.difficulty_level <= 2 ? "one of the more accessible skills to start building" : sub.difficulty_level <= 3 ? "a moderately challenging skill that requires consistent practice" : "an advanced capability that takes significant deliberate effort to develop"}.`,
      whyItMatters: whyContexts[category] || whyContexts["Human Skills"],
      howToApply: howContexts[archetype] || howContexts["conversational"],
      commonMistake: commonMistakes[sub.name] || mistakeByDifficulty[Math.min(sub.difficulty_level, 5)] || mistakeByDifficulty[3],
    };
  });
}

export default function MicroSkillsPage() {
  const router = useRouter();
  const { sprintId, skill, skillName, displayName, isSubSkillSprint, skillSlug, subSkillSlug } = useSprintContext();
  const { updateStage } = useSprintStore();
  const { setStage } = useProgressStore();
  const [skills, setSkills] = useState<MicroSkill[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skill) { setLoading(false); return; }
    if (isSubSkillSprint) setStage(skillSlug, subSkillSlug, "micro-skill");

    api
      .get<{ microSkills: MicroSkill[] }>(`/api/v1/sprint/content/micro-skills?skill_id=${sprintId}`)
      .then((data) => {
        setSkills(data.microSkills?.length ? data.microSkills : buildMicroSkills(skill));
        setLoading(false);
      })
      .catch(() => {
        setSkills(buildMicroSkills(skill));
        setLoading(false);
      });
  }, [sprintId, skill]);

  const allCompleted = skills.length > 0 && completed.size >= skills.length;

  const handleContinue = () => {
    updateStage(sprintId, "drill", 25);
    router.push(`/dashboard/sprint/${sprintId}/drills`);
  };

  if (loading) {
    return (
      <div className="sprint-stage-container">
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  return (
    <div className="sprint-stage-container">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="sprint-stage-badge">
          Micro-Skills · {completed.size} of {skills.length} reviewed
        </span>
        <h1 className="headline-md" style={{ marginBottom: 8 }}>
          {skillName} — Core Building Blocks
        </h1>
        <p className="body-sm" style={{ marginBottom: 16 }}>
          Each micro-skill has 4 key ingredients. Read through each one carefully — you&apos;ll need this foundation for the drills and simulations ahead.
        </p>
        <div className="progress-track">
          <div
            className="progress-fill progress-fill-success"
            style={{ width: `${(completed.size / Math.max(1, skills.length)) * 100}%` }}
          />
        </div>
      </div>

      {/* Skill cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {skills.map((ms, i) => {
          const isExpanded = expanded === ms.id;
          const isDone = completed.has(ms.id);

          return (
            <div
              key={ms.id}
              className="card"
              style={{
                padding: 0,
                borderColor: isDone ? "var(--success)" : isExpanded ? "var(--primary-container)" : undefined,
              }}
            >
              {/* Collapsed header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : ms.id)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    backgroundColor: isDone ? "var(--success)" : "var(--surface-container-high)",
                    color: isDone ? "white" : "var(--text-secondary)",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                >
                  {isDone ? "✓" : String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-heading)" }}>
                    {ms.name}
                  </div>
                  <div className="body-sm" style={{ marginTop: 2 }}>
                    Difficulty: {"●".repeat(skill!.sub_skills[i]?.difficulty_level || 2)}{"○".repeat(5 - (skill!.sub_skills[i]?.difficulty_level || 2))}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▾
                </span>
              </button>

              {/* Expanded: 4 ingredients */}
              {isExpanded && (
                <div
                  style={{
                    padding: "0 20px 20px",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  {/* 1. What It Is */}
                  <div style={{ margin: "16px 0" }}>
                    <div className="label-mono" style={{ marginBottom: 8, color: "var(--primary-container)" }}>
                      What It Is
                    </div>
                    <p className="body-ui" style={{ lineHeight: 1.7 }}>{ms.whatItIs}</p>
                  </div>

                  {/* 2. Why It Matters */}
                  <div style={{ marginBottom: 16 }}>
                    <div className="label-mono" style={{ marginBottom: 8, color: "var(--primary-container)" }}>
                      Why It Matters
                    </div>
                    <p className="body-ui" style={{ lineHeight: 1.7 }}>{ms.whyItMatters}</p>
                  </div>

                  {/* 3. How To Apply */}
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "14px 18px",
                      backgroundColor: "var(--surface-container-low)",
                      borderLeft: "3px solid var(--success)",
                    }}
                  >
                    <div className="label-mono" style={{ marginBottom: 8, color: "var(--success)" }}>
                      How To Apply
                    </div>
                    <p className="body-ui" style={{ lineHeight: 1.7 }}>{ms.howToApply}</p>
                  </div>

                  {/* 4. Common Mistake */}
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "14px 18px",
                      backgroundColor: "var(--error-container)",
                      borderLeft: "3px solid var(--error)",
                    }}
                  >
                    <div className="label-mono" style={{ marginBottom: 8, color: "var(--error)" }}>
                      Common Mistake
                    </div>
                    <p className="body-ui" style={{ lineHeight: 1.7 }}>{ms.commonMistake}</p>
                  </div>

                  {!isDone && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setCompleted((prev) => new Set(prev).add(ms.id))
                      }
                    >
                      I&apos;ve reviewed this ✓
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue button */}
      <div style={{ textAlign: "center", marginTop: 36 }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleContinue}
          disabled={!allCompleted}
          id="micro-skills-continue"
        >
          {allCompleted
            ? "Start Practice Drills →"
            : `Review all ${skills.length} micro-skills to continue`}
        </button>
      </div>
    </div>
  );
}
