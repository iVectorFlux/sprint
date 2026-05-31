import Link from "next/link";
import { SKILLS_TAXONOMY } from "@/data/skills-taxonomy";
import {
  STAGE_LABELS,
  ARCHETYPE_ICONS,
  ARCHETYPE_LABELS,
  ARCHETYPE_DESCRIPTIONS,
  ARCHETYPE_STAGE_FLOWS,
} from "@/types";
import BeginSprintButton from "@/components/sprint/BeginSprintButton";
import { toSlug } from "@/hooks/useSprintContext";

export default async function SprintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Parse skill--sub-skill format
  const parts = id.split("--");
  const skillSlug = parts[0];
  const subSkillSlug = parts.length > 1 ? parts.slice(1).join("--") : "";

  // Find skill by slug
  const skill = SKILLS_TAXONOMY.find(
    (s) => toSlug(s.name) === skillSlug
  );

  if (!skill) {
    return (
      <div className="empty-state" style={{ minHeight: 400 }}>
        <div className="empty-state-icon" style={{ fontSize: 40 }}>📭</div>
        <div className="empty-state-title">Sprint not found</div>
        <div className="empty-state-text">
          The skill sprint you&apos;re looking for doesn&apos;t exist.
        </div>
        <Link href="/dashboard/catalog" className="btn btn-primary btn-sm">
          Browse catalog
        </Link>
      </div>
    );
  }

  // Find sub-skill if specified
  const subSkill = subSkillSlug
    ? skill.sub_skills.find((s) => toSlug(s.name) === subSkillSlug)
    : null;

  const isSubSkillSprint = !!subSkill;
  const displayName = subSkill?.name || skill.name;

  // Archetype-specific stage flow
  const stageFlow = ARCHETYPE_STAGE_FLOWS[skill.archetype];
  const archetypeIcon = ARCHETYPE_ICONS[skill.archetype];
  const archetypeLabel = ARCHETYPE_LABELS[skill.archetype];

  // Phase 2 check
  const isPhase2 = ["creation", "performance", "systems"].includes(skill.archetype);

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Breadcrumb */}
      <nav className="topbar-breadcrumb" style={{ marginBottom: "var(--stack-sm)" }}>
        <Link href="/dashboard/catalog" style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Catalog
        </Link>
        <span className="topbar-breadcrumb-separator">/</span>
        {isSubSkillSprint ? (
          <>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{skill.name}</span>
            <span className="topbar-breadcrumb-separator">/</span>
            <span style={{ color: "var(--text-heading)", fontSize: 13 }}>{subSkill!.name}</span>
          </>
        ) : (
          <span style={{ color: "var(--text-heading)", fontSize: 13 }}>{skill.name}</span>
        )}
      </nav>

      {/* Header */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <div className="flex-row" style={{ marginBottom: 12, gap: 16 }}>
          <div
            style={{
              width: 56, height: 56,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--primary-fixed)",
              fontSize: 30,
            }}
          >
            {skill.icon}
          </div>
          <div>
            <h2 className="headline-md" style={{ marginBottom: 4 }}>
              {displayName}
            </h2>
            <div className="flex-row" style={{ gap: 8 }}>
              {isSubSkillSprint && (
                <span className="chip">{skill.name}</span>
              )}
              <span className="chip">{skill.category}</span>
              {/* Archetype badge */}
              <span className="archetype-badge" title={ARCHETYPE_DESCRIPTIONS[skill.archetype]}>
                {archetypeIcon} {archetypeLabel}
              </span>

              {isPhase2 && (
                <span className="chip" style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="body-reading" style={{ maxWidth: 640 }}>
          {subSkill ? subSkill.description : skill.description}
        </p>

        {/* Archetype description */}
        <div className="guidance-box guidance-box-accent" style={{ marginTop: 16 }}>
          <div className="guidance-box-title">{archetypeIcon} {archetypeLabel} practice format</div>
          <div className="guidance-box-text">{ARCHETYPE_DESCRIPTIONS[skill.archetype]}</div>
        </div>
      </section>

      {/* What you'll practice (sub-skill sprint) */}
      {isSubSkillSprint && (
        <section style={{ marginBottom: "var(--stack-md)" }}>
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--text-heading)" }}>
              What you&apos;ll practice
            </h3>
            <p className="body-ui" style={{ lineHeight: 1.7, marginBottom: 16 }}>
              This sprint focuses specifically on <strong>{subSkill!.name}</strong> as part of the broader {skill.name} competency.
              You&apos;ll go through a {stageFlow.length}-stage flow tailored to the {archetypeLabel.toLowerCase()} practice format.
            </p>
            <div className="body-sm">
              The AI will generate {archetypeLabel.toLowerCase() === 'conversational' ? 'roleplay scenarios, drills, and simulations' : archetypeLabel.toLowerCase() === 'analytical' ? 'reasoning challenges, structured exercises, and analysis tasks' : 'reflection prompts, pattern detection, and a growth plan'} tailored to {subSkill!.name.toLowerCase()}.
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="grid-2" style={{ marginBottom: "var(--stack-md)" }}>
        <div className="card stat-card">
          <div className="stat-card-label">
            {isSubSkillSprint ? "Parent skill" : "Sub-skills"}
          </div>
          <div className="stat-card-value">
            {isSubSkillSprint ? skill.name : skill.sub_skills.length}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Est. time</div>
          <div className="stat-card-value">{isSubSkillSprint ? "~45 min" : "~20 hr"}</div>
        </div>
      </section>

      {/* Sprint Structure — Archetype-specific stages */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Sprint structure <span style={{ fontWeight: 400, fontSize: 15, color: "var(--text-muted)" }}>({archetypeLabel})</span>
        </h3>
        <div className="card" style={{ padding: 20 }}>
          <div className="sprint-timeline">
            {stageFlow.map((stage, i) => (
              <div key={stage} className="sprint-stage">
                <div className="sprint-stage-indicator">
                  <div className="sprint-stage-dot" />
                  {i < stageFlow.length - 1 && (
                    <div className="sprint-stage-line" />
                  )}
                </div>
                <div className="sprint-stage-content">
                  <div className="sprint-stage-title">
                    <span className="label-mono" style={{ marginRight: 8 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {STAGE_LABELS[stage]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Begin Sprint CTA */}
      <section
        style={{
          padding: 28,
          backgroundColor: "var(--surface-container)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-heading)",
              marginBottom: 4,
            }}
          >
            {isPhase2 ? "Coming in Phase 2" : "Ready to begin?"}
          </div>
          <div className="body-sm">
            {isPhase2
              ? `The ${archetypeLabel} engine is being built. Choose a Conversational, Analytical, or Reflective skill for now.`
              : isSubSkillSprint
                ? `Start your ${archetypeLabel.toLowerCase()} sprint for ${subSkill!.name} (part of ${skill.name}).`
                : `Start your ${archetypeLabel.toLowerCase()} transformation sprint for ${skill.name}.`}
          </div>
        </div>
        {!isPhase2 && <BeginSprintButton skillSlug={id} skillName={displayName} />}
        {isPhase2 && (
          <Link href="/dashboard/catalog" className="btn btn-ghost btn-sm">
            Browse other skills
          </Link>
        )}
      </section>

      {/* How it works */}
      <div className="guidance-box" style={{ marginTop: "var(--stack-sm)" }}>
        <div className="guidance-box-title">How {archetypeLabel.toLowerCase()} sprints work</div>
        <div className="guidance-box-text">
          {skill.archetype === "conversational" && "You'll practice through live AI roleplay — the AI plays a realistic character who pushes back, escalates, and reacts to your responses. Each simulation is scored across 7 dimensions."}
          {skill.archetype === "analytical" && "You'll work through structured reasoning challenges: mapping assumptions, evaluating evidence, and tackling counterfactuals. This is a written workspace, not a chat — depth of analysis is what's scored."}
          {skill.archetype === "reflective" && "You'll reflect on real past situations through guided journal prompts. The AI detects your behavioral and emotional patterns across entries, then generates a personalized 30-day growth plan."}
          {["creation", "performance", "systems"].includes(skill.archetype) && "This archetype's session engine is being built. It will be available in Phase 2."}
        </div>
      </div>
    </div>
  );
}
