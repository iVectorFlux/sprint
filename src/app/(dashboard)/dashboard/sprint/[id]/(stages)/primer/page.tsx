"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSprintContext } from "@/hooks/useSprintContext";
import type { SkillTaxonomyEntry } from "@/data/skills-taxonomy";

interface PrimerCard {
  title: string;
  body: string;
  detail?: string;
}

/**
 * Build rich, educational primer cards from taxonomy data.
 * No emojis — clean, substantive text that actually teaches.
 */
function buildPrimerCards(skill: SkillTaxonomyEntry): PrimerCard[] {
  const subList = skill.sub_skills.map((s) => s.name).join(", ");
  const topDifficulty = [...skill.sub_skills].sort((a, b) => b.difficulty_level - a.difficulty_level);
  const hardest = topDifficulty[0];
  const easiest = topDifficulty[topDifficulty.length - 1];

  return [
    {
      title: `What is ${skill.name}?`,
      body: skill.description,
      detail: `${skill.name} belongs to the ${skill.category} family. It's a compound capability — not a single thing you either "have" or "don't." It's composed of ${skill.sub_skills.length} distinct micro-skills that can each be developed independently: ${subList}. Most professionals are strong in some of these areas and weaker in others, which is exactly what this sprint will help you identify and address.`,
    },
    {
      title: "Why This Matters Now",
      body: `In a world where technical knowledge is increasingly commoditized by AI, ${skill.category.toLowerCase()} like ${skill.name.toLowerCase()} are becoming the primary differentiators in career advancement. Organizations consistently rank these capabilities among their most critical hiring and promotion criteria — yet they are rarely taught formally.`,
      detail: `Research from leading organizational psychologists shows that professionals who deliberately develop ${skill.name.toLowerCase()} see measurable improvements in performance reviews, team dynamics, and leadership readiness within 8-12 weeks of focused practice. The key word is "deliberately" — passive awareness doesn't create lasting change.`,
    },
    {
      title: "The Sub-Skills You'll Develop",
      body: `This sprint breaks ${skill.name.toLowerCase()} into ${skill.sub_skills.length} learnable micro-skills. Each one is a specific, practicable behavior — not an abstract concept.`,
      detail: skill.sub_skills
        .map((s, i) => `${i + 1}. ${s.name} — ${s.description}`)
        .join("\n"),
    },
    {
      title: "How Difficulty Works",
      body: `Not all micro-skills are equally challenging. "${easiest.name}" (Level ${easiest.difficulty_level}/5) is the most accessible starting point — you'll build confidence here first. "${hardest.name}" (Level ${hardest.difficulty_level}/5) is the most advanced and will be introduced gradually as your baseline improves.`,
      detail: `The AI monitors your performance across every practice interaction and adjusts the complexity, context, and challenge level in real time. Early exercises focus on recognition and understanding. Later exercises require application under pressure, ambiguity, and competing priorities.`,
    },
    {
      title: "What to Expect in This Sprint",
      body: `This is not a passive course. You won't be watching videos or reading articles. Every stage of this sprint requires active engagement — responding to scenarios, making decisions, analyzing outcomes, and reflecting on your patterns.`,
      detail: `Here's the flow: After this primer, you'll learn the core micro-skills with concrete examples. Then you'll practice with quick drills, enter guided AI simulations where you get real-time coaching, progress to independent simulations without help, review your performance, reflect on your patterns, face an escalated challenge, and complete a final assessment. The AI generates a comprehensive competency report at the end.`,
    },
  ];
}

export default function PrimerPage() {
  const router = useRouter();
  const { sprintId, skill, skillName, displayName, subSkill, isSubSkillSprint, skillSlug, subSkillSlug } = useSprintContext();
  const { updateStage } = useSprintStore();
  const { startSubSkill, setStage } = useProgressStore();
  const [cards, setCards] = useState<PrimerCard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skill) {
      setLoading(false);
      return;
    }
    // Track progress
    if (isSubSkillSprint) {
      startSubSkill(skillSlug, subSkillSlug);
      setStage(skillSlug, subSkillSlug, "primer");
    }

    // Try AI-generated primers via backend
    api
      .get<{ cards: PrimerCard[] }>(`/api/v1/sprint/content/primer?skill_id=${sprintId}`)
      .then((data) => {
        setCards(data.cards?.length ? data.cards : buildPrimerCards(skill));
        setLoading(false);
      })
      .catch(() => {
        setCards(buildPrimerCards(skill));
        setLoading(false);
      });
  }, [sprintId, skill]);

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard((prev) => prev + 1);
    } else {
      updateStage(sprintId, "micro-skill", 10);
      router.push(`/dashboard/sprint/${sprintId}/micro-skills`);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) setCurrentCard((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: "center", paddingTop: 100 }}>
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  const card = cards[currentCard];
  if (!card) return null;

  return (
    <div className="sprint-stage-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="sprint-stage-badge">
          Primer · {currentCard + 1} of {cards.length}
        </span>
        <h1 className="headline-md" style={{ marginTop: 16, marginBottom: 4 }}>
          {displayName}
        </h1>
        <p className="body-sm">
          {isSubSkillSprint ? `${skillName} · ` : ""}Foundation &amp; context · ~5 min read
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              flex: i === currentCard ? 3 : 1,
              height: 3,
              backgroundColor:
                i < currentCard
                  ? "var(--success)"
                  : i === currentCard
                    ? "var(--primary-container)"
                    : "var(--border-subtle)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Card content */}
      <div className="card" style={{ padding: "36px 32px", minHeight: 280 }}>
        <h2
          className="headline-sm"
          style={{ marginBottom: 16, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}
        >
          {card.title}
        </h2>
        <p
          className="body-reading"
          style={{ marginBottom: card.detail ? 20 : 0, color: "var(--text-secondary)" }}
        >
          {card.body}
        </p>
        {card.detail && (
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--surface-container-low)",
              borderLeft: "3px solid var(--primary-container)",
              fontSize: 14,
              lineHeight: 1.75,
              color: "var(--on-surface)",
              whiteSpace: "pre-line",
            }}
          >
            {card.detail}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 28,
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={handlePrev}
          disabled={currentCard === 0}
          id="primer-back"
        >
          ← Back
        </button>
        <span className="body-sm" style={{ color: "var(--text-muted)" }}>
          {currentCard + 1} / {cards.length}
        </span>
        <button className="btn btn-primary" onClick={handleNext} id="primer-next">
          {currentCard < cards.length - 1 ? "Continue →" : "Start Micro-Skills →"}
        </button>
      </div>
    </div>
  );
}
