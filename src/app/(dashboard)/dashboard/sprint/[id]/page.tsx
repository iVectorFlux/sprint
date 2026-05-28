import Link from "next/link";
import { SKILLS_TAXONOMY } from "@/data/skills-taxonomy";
import { STAGE_ORDER, STAGE_LABELS, ENGINE_TYPE_LABELS } from "@/types";
import BeginSprintButton from "@/components/sprint/BeginSprintButton";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
            <span style={{ color: "var(--text-heading)", fontSize: 13 }}>{subSkill.name}</span>
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
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              <span className="chip chip-primary">
                {ENGINE_TYPE_LABELS[skill.learning_engine_type]}
              </span>
              {subSkill && (
                <span className="chip">
                  Difficulty {"●".repeat(subSkill.difficulty_level)}{"○".repeat(5 - subSkill.difficulty_level)}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="body-reading" style={{ maxWidth: 640 }}>
          {subSkill
            ? subSkill.description
            : skill.description}
        </p>
      </section>

      {/* Sub-skill specific: what you'll practice */}
      {isSubSkillSprint && (
        <section style={{ marginBottom: "var(--stack-md)" }}>
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--text-heading)" }}>
              What you&apos;ll practice
            </h3>
            <p className="body-ui" style={{ lineHeight: 1.7, marginBottom: 16 }}>
              This sprint focuses specifically on <strong>{subSkill.name}</strong> as part of the broader {skill.name} competency.
              You&apos;ll go through an 11-stage flow designed to build this micro-skill from understanding to mastery.
            </p>
            <div className="body-sm">
              The AI will generate scenarios, drills, and simulations tailored to {subSkill.name.toLowerCase()}.
              Your performance is tracked and contributes to your overall {skill.name.toLowerCase()} progress.
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="grid-3" style={{ marginBottom: "var(--stack-md)" }}>
        <div className="card stat-card">
          <div className="stat-card-label">
            {isSubSkillSprint ? "Parent skill" : "Sub-skills"}
          </div>
          <div className="stat-card-value">
            {isSubSkillSprint ? skill.name : skill.sub_skills.length}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Difficulty</div>
          <div className="stat-card-value">
            {subSkill
              ? `${subSkill.difficulty_level}/5`
              : `${(skill.sub_skills.reduce((a, s) => a + s.difficulty_level, 0) / skill.sub_skills.length).toFixed(1)}/5`}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Est. time</div>
          <div className="stat-card-value">{isSubSkillSprint ? "~45 min" : "~20 hr"}</div>
        </div>
      </section>

      {/* Sprint Structure */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Sprint structure
        </h3>
        <div className="card" style={{ padding: 20 }}>
          <div className="sprint-timeline">
            {STAGE_ORDER.map((stage, i) => (
              <div key={stage} className="sprint-stage">
                <div className="sprint-stage-indicator">
                  <div className="sprint-stage-dot" />
                  {i < STAGE_ORDER.length - 1 && (
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
            Ready to begin?
          </div>
          <div className="body-sm">
            {isSubSkillSprint
              ? `Start your sprint for ${subSkill.name} (part of ${skill.name}).`
              : `Start your transformation sprint for ${skill.name}.`}
          </div>
        </div>
        <BeginSprintButton skillSlug={id} skillName={displayName} />
      </section>

      {/* Guidance */}
      <div className="guidance-box" style={{ marginTop: "var(--stack-sm)" }}>
        <div className="guidance-box-title">How sprints work</div>
        <div className="guidance-box-text">
          Each sprint follows an 11-stage adaptive learning flow: from foundational primers
          through guided simulations, independent practice, and final assessments. The AI
          adapts difficulty, scenarios, and feedback based on your performance. Your progress
          is saved and mapped to the parent skill.
        </div>
      </div>
    </div>
  );
}
