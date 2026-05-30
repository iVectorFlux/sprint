"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSprintContext } from "@/hooks/useSprintContext";
import type { SkillTaxonomyEntry, SubSkillEntry } from "@/data/skills-taxonomy";

interface MicroSkill {
  id: string;
  name: string;
  whatItIs: string;
  whyItMatters: string;
  goodExample: string;
  badExample: string;
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

    const goodExamples: Record<string, string> = {
      conversational: `Applying ${sub.name.toLowerCase()} thoughtfully in dialogue:\n"I hear your concern about the timeline. Let's look at the core requirements first so we can secure the launch date, then map out the nice-to-haves."`,
      reflective: `A deep, high-receptivity journal entry on ${sub.name.toLowerCase()}:\n"I noticed my default response today was slightly defensive when questioned. In retrospect, I should have acknowledged their intent first before explaining the details."`,
      analytical: `A rigorous, logically structured application of ${sub.name.toLowerCase()}:\n"Based on the data, option A has the highest probability of success. However, the critical assumption here is that user growth continues at 5% month-over-month. Let's stress-test that."`,
    };

    const badExamples: Record<string, string> = {
      conversational: `Reacting without employing ${sub.name.toLowerCase()} in dialogue:\n"No, we can't do that. The timeline is completely impossible and we don't have the resources."`,
      reflective: `A shallow, low-awareness reflection on ${sub.name.toLowerCase()}:\n"The meeting was fine but they didn't listen to me. I did my part perfectly, but the team's alignment was poor."`,
      analytical: `A superficial or biased application of ${sub.name.toLowerCase()}:\n"Option A seems like the best approach because it's what we did last quarter and everybody liked it."`,
    };

    return {
      id: String(i + 1),
      name: sub.name,
      whatItIs: sub.description,
      whyItMatters: whyContexts[category] || whyContexts["Human Skills"],
      goodExample: goodExamples[archetype] || goodExamples["conversational"],
      badExample: badExamples[archetype] || badExamples["conversational"],
    };
  });
}

/**
 * Build micro-skill content from a sub-skill's atomic skills.
 * When a learner starts e.g. "Active Listening", the micro-skills page
 * shows Paraphrasing, Reflective Questioning, etc. \u2014 not all 8 Communication sub-skills.
 */
const CUSTOM_EXAMPLES: Record<string, { good: string; bad: string }> = {
  // Storytelling
  "Narrative Arc Construction": {
    good: `Constructing a clear journey with stakes and resolution:\n"We started last quarter with a 40% drop in checkout retention (Tension). Our team did deep user testing and found a 3-step checkout form was confusing users (Climax). We consolidated it into a single page, and retention immediately rebounded to normal levels (Resolution)."`,
    bad: `Listing facts without a narrative structure:\n"We had a checkout retention drop but we fixed it by consolidating the pages in our last release."`,
  },
  "Emotional Hook Setting": {
    good: `Opening with a vivid, relatable moment to engage the audience:\n"Imagine it's 8:55 PM on a Friday. The system goes completely dark, and our biggest enterprise client is on the phone..."`,
    bad: `Starting with dry background details:\n"We had a system outage last Friday evening, which was a very difficult situation for our operations team."`,
  },
  "Concrete Detail Selection": {
    good: `Choosing sensory, tangible details over general abstractions:\n"Instead of saying 'the server crashed', say 'a database memory leak consumed 64GB of RAM in 3 seconds, triggering the hardware alarm'."`,
    bad: `Using vague, abstract language:\n"The server had a critical error and stopped working completely."`,
  },
  "Audience-Relevant Framing": {
    good: `Tailoring the stakes to what matters to the specific audience:\n"For the finance team, focus on the $50k daily revenue risk. For the engineering team, focus on the 500-error rates in the API gateway."`,
    bad: `Giving the exact same generic explanation to everyone:\n"I gave the exact same technical slideshow to the CEO, the sales team, and the operations team."`,
  },
  "Punchline Delivery": {
    good: `Landing the key takeaway with maximum clarity:\n"And that is why simplicity always wins: because a feature the user cannot find is a feature that does not exist."`,
    bad: `Trailing off with a weak summary:\n"So in conclusion, we decided to prioritize usability over adding more new features next quarter."`,
  },

  // Active Listening
  "Paraphrasing": {
    good: `Restating the core message in your own words to confirm understanding:\n"It sounds like you're saying the team is aligned on the product goals, but we lack the engineering capacity to hit the June deadline. Is that correct?"`,
    bad: `Echoing the words exactly or over-simplifying without processing:\n"So we are late on the project."`,
  },
  "Reflective Questioning": {
    good: `Asking questions that dig into the underlying meaning or feelings:\n"When you say the timeline feels 'unrealistic', is that because of the technical complexity of the database migration, or do you feel the scope itself is too broad?"`,
    bad: `Asking a superficial or interrogative question:\n"Why do you think the timeline is unrealistic?"`,
  },
  "Non-verbal Acknowledgment": {
    good: `Using physical and vocal cues to signal engagement:\n"[Maintains open body language, nods slowly to show presence, and offers brief vocal signals like 'I see' or 'Mm-hmm' without interrupting the flow.]"`,
    bad: `Ignoring the speaker or multitasking:\n"[Stares at their screen, typing Slack messages, while occasionally saying 'yeah' to indicate they are paying attention.]"`,
  },
  "Emotional Validation": {
    good: `Acknowledging the speaker's emotional state before addressing the content:\n"I can completely understand why you're frustrated by this sudden scope change. It feels like the goalposts were moved right before the finish line."`,
    bad: `Dismissing or ignoring emotions in favor of facts:\n"I understand. But let's look at the new specifications anyway since we have to implement them."`,
  },
  "Summarizing": {
    good: `Synthesizing key points from an extended dialogue:\n"To make sure we're on the same page, we've identified three key bottlenecks: first, database latency; second, a lack of documentation; and third, resource constraints. We've agreed to tackle latency first. Does that cover it?"`,
    bad: `Offering a vague, incomplete list:\n"Okay, so we have a lot of problems to solve, but we'll start with latency."`,
  },
  "Silence Management": {
    good: `Using deliberate pauses to let the speaker expand on their thoughts:\n"[Pauses for 3 seconds after the speaker finishes, allowing them to add: 'Actually, there's one more thing...', giving them space to share the underlying issue.]"`,
    bad: `Immediately filling every pause with your own thoughts:\n"[Cuts in the millisecond the speaker stops talking to pitch their own solution: 'Well, here is what we should do...']"`,
  },
};

function buildAtomicMicroSkills(
  skill: SkillTaxonomyEntry,
  subSkill: SubSkillEntry
): MicroSkill[] {
  const archetype = skill.archetype;
  const category = skill.category;
  const atomics = subSkill.atomic_skills || [];

  return atomics.map((atom, i) => {
    const whyContexts: Record<string, string> = {
      "Human Skills": `Within ${subSkill.name.toLowerCase()}, ${atom.name.toLowerCase()} is the specific behavior that separates people who are naturally good at this from those who struggle. It's the concrete action behind the abstract concept.`,
      "Cognitive Skills": `${atom.name} is one of the foundational reasoning behaviors within ${subSkill.name.toLowerCase()}. Developing this atomic skill strengthens the precision and rigor of your thinking in measurable ways.`,
      "Technical Skills": `${atom.name} is a specific, repeatable technique within ${subSkill.name.toLowerCase()}. Once internalized, it becomes a reliable tool you can deploy across diverse technical challenges.`,
      "Strategic Skills": `${atom.name} is a specific analytical behavior within ${subSkill.name.toLowerCase()} that sharpens your ability to see patterns, anticipate consequences, and make better strategic choices.`,
      "Leadership Skills": `${atom.name} is a concrete leadership behavior within ${subSkill.name.toLowerCase()}. Leaders who practice it deliberately create better team outcomes and build stronger trust.`,
      "Business Skills": `${atom.name} is a specific tactical skill within ${subSkill.name.toLowerCase()} that directly impacts your ability to drive revenue, build relationships, and close deals.`,
    };

    const goodExamples: Record<string, string> = {
      conversational: `Applying ${atom.name.toLowerCase()} thoughtfully in dialogue:\n"If I understand correctly, your primary worry is that the new timeline doesn't leave enough buffer for testing. Is that right?"`,
      reflective: `A deep, high-receptivity journal entry on ${atom.name.toLowerCase()}:\n"Today, instead of speaking immediately, I paused to let them finish. I noticed they shared two more critical constraints that I would have completely missed."`,
      analytical: `A rigorous, logically structured application of ${atom.name.toLowerCase()}:\n"Applying this, we must first isolate the variable X. Let's outline the direct dependencies, test each assumption, and identify the root cause."`,
    };

    const badExamples: Record<string, string> = {
      conversational: `Reacting without employing ${atom.name.toLowerCase()} in dialogue:\n"Yeah, I get it. But here is why we still need to proceed with my plan anyway..."`,
      reflective: `A shallow, low-awareness reflection on ${atom.name.toLowerCase()}:\n"I listened to them, but their points weren't very relevant to what I was trying to build."`,
      analytical: `A superficial or biased application of ${atom.name.toLowerCase()}:\n"We should jump straight to the conclusion because it fits our initial hypothesis perfectly."`,
    };

    const custom = CUSTOM_EXAMPLES[atom.name];

    return {
      id: String(i + 1),
      name: atom.name,
      whatItIs: atom.description,
      whyItMatters: whyContexts[category] || whyContexts["Human Skills"],
      goodExample: custom ? custom.good : (goodExamples[archetype] || goodExamples["conversational"]),
      badExample: custom ? custom.bad : (badExamples[archetype] || badExamples["conversational"]),
    };
  });
}

export default function MicroSkillsPage() {
  const router = useRouter();
  const { sprintId, skill, subSkill, skillName, displayName, isSubSkillSprint, skillSlug, subSkillSlug } = useSprintContext();
  const { updateStage } = useSprintStore();
  const { setStage } = useProgressStore();
  const [skills, setSkills] = useState<MicroSkill[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skill) {
      if (sprintId) setLoading(false);
      return;
    }
    if (isSubSkillSprint) setStage(skillSlug, subSkillSlug, "micro-skill");
 
    // Build the right fallback based on sprint type
    const fallbackSkills = isSubSkillSprint && subSkill
      ? buildAtomicMicroSkills(skill, subSkill)
      : buildMicroSkills(skill);
 
    const focusQuery = isSubSkillSprint && subSkill ? `&focus_sub_skill=${encodeURIComponent(subSkill.name)}` : '';
    const atomicQuery = isSubSkillSprint && subSkill?.atomic_skills ? `&atomic_skills=${encodeURIComponent(subSkill.atomic_skills.map(a => a.name).join(','))}` : '';
 
    api
      .get<{ microSkills: any[] }>(`/api/v1/sprint/content/micro-skills?skill_id=${sprintId}${focusQuery}${atomicQuery}`)
      .then((data) => {
        const mappedSkills = (data.microSkills || []).map((ms: any) => ({
          id: ms.id || "",
          name: ms.name || "",
          whatItIs: ms.whatItIs || ms.description || "",
          whyItMatters: ms.whyItMatters || ms.tip || "",
          goodExample: ms.goodExample || "",
          badExample: ms.badExample || "",
        }));
        setSkills(mappedSkills.length ? mappedSkills : fallbackSkills);
        setLoading(false);
      })
      .catch(() => {
        setSkills(fallbackSkills);
        setLoading(false);
      });
  }, [sprintId, skill, isSubSkillSprint, subSkill]);

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
          {isSubSkillSprint && subSkill ? subSkill.name : skillName} — Core Building Blocks
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

                  {/* 3. Good Example */}
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "14px 18px",
                      backgroundColor: "var(--surface-container-low)",
                      borderLeft: "3px solid var(--success)",
                    }}
                  >
                    <div className="label-mono" style={{ marginBottom: 8, color: "var(--success)" }}>
                      Good Example
                    </div>
                    <p className="body-ui" style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>{ms.goodExample}</p>
                  </div>

                  {/* 4. Bad Example */}
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "14px 18px",
                      backgroundColor: "var(--error-container)",
                      borderLeft: "3px solid var(--error)",
                    }}
                  >
                    <div className="label-mono" style={{ marginBottom: 8, color: "var(--error)" }}>
                      Bad Example
                    </div>
                    <p className="body-ui" style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>{ms.badExample}</p>
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
