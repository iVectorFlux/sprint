import Link from "next/link";
import { getCurrentUser, getActiveSprint, getUserSprints, getUserSkillMastery } from "@/lib/data/user";
import { SKILLS_TAXONOMY } from "@/data/skills-taxonomy";
import { STAGE_LABELS } from "@/types";
import type { StageType } from "@/types";
import LearningComposer from "@/components/dashboard/LearningComposer";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const activeSprint = user ? await getActiveSprint(user.id) : null;
  const sprints = user ? await getUserSprints(user.id) : [];
  const mastery = user ? await getUserSkillMastery(user.id) : [];

  // Compute real stats
  const totalPracticeHours = sprints.reduce((sum, s) => sum + (s.completed_hours || 0), 0);
  const completedSprints = sprints.filter((s) => s.status === "completed").length;
  const activeSkills = mastery.length;
  const masteryAvg = mastery.length
    ? Math.round(mastery.reduce((sum, m) => sum + (m.mastery_score || 0), 0) / mastery.length)
    : 0;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const progressPercent = activeSprint
    ? Math.round(((activeSprint.completed_hours || 0) / (activeSprint.target_hours || 20)) * 100)
    : 0;

  return (
    <div className="stack-lg" style={{ maxWidth: 960 }}>
      {/* Welcome Section */}
      <section>
        <h2 className="headline-md" style={{ marginBottom: 4 }}>
          {greeting}, {user?.full_name?.split(" ")[0] || "there"}
        </h2>
        <p className="body-sm">
          {activeSprint
            ? "Continue your learning journey. You have an active sprint in progress."
            : sprints.length > 0
              ? "Welcome back. Browse the catalog to start a new sprint."
              : "Welcome to Lumi6. Start by exploring the Skills Catalog."}
        </p>
      </section>

      {/* Learning goal composer — primary entry point */}
      <section>
        <LearningComposer />
      </section>

      {/* Stats Grid */}
      <section className="grid-4">
        <div className="card stat-card">
          <div className="stat-card-label">Practice Hours</div>
          <div className="stat-card-value">{totalPracticeHours.toFixed(1)}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Sprints Done</div>
          <div className="stat-card-value">{completedSprints}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Active Skills</div>
          <div className="stat-card-value">{activeSkills}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-label">Avg Mastery</div>
          <div className="stat-card-value">{masteryAvg}%</div>
        </div>
      </section>

      {/* Active Sprint (if any) */}
      {activeSprint ? (
        <section>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3 className="headline-sm">Active Sprint</h3>
            <Link
              href={`/dashboard/sprint/${activeSprint.id}`}
              className="btn btn-ghost btn-sm"
              id="dashboard-view-sprint"
            >
              View Sprint →
            </Link>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <div className="flex-row">
                <span style={{ fontSize: 28 }}>
                  {activeSprint.skill?.icon || "🎯"}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--text-heading)",
                    }}
                  >
                    {activeSprint.title || activeSprint.skill?.name || "Sprint"}
                  </div>
                  <div className="body-sm" style={{ marginTop: 2 }}>
                    Stage:{" "}
                    {activeSprint.current_stage
                      ? STAGE_LABELS[activeSprint.current_stage as StageType]
                      : "Not started"}
                  </div>
                </div>
              </div>
              <div className="chip chip-primary">{progressPercent}% Complete</div>
            </div>

            <div className="progress-track progress-track-lg">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex-between" style={{ marginTop: 12 }}>
              <span className="body-sm">
                {activeSprint.completed_hours || 0}h / {activeSprint.target_hours || 20}h
              </span>
              <span className="body-sm">
                Confidence: {activeSprint.confidence_score || 0}%
              </span>
            </div>
          </div>
        </section>
      ) : (
        /* No active sprint — CTA */
        <section>
          <div
            className="card"
            style={{
              padding: 32,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>🚀</div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-heading)",
              }}
            >
              Start Your First Sprint
            </div>
            <div className="body-sm" style={{ maxWidth: 400 }}>
              Browse our catalog of 14 core skills and 88+ sub-skills.
              Pick a skill to begin your 20-hour transformation journey.
            </div>
            <Link
              href="/dashboard/catalog"
              className="btn btn-primary"
              id="dashboard-start-sprint"
            >
              Browse Skills Catalog →
            </Link>
          </div>
        </section>
      )}

      {/* Recommended Skills */}
      <section>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Recommended Skills
        </h3>
        <div className="grid-3">
          {SKILLS_TAXONOMY.slice(0, 3).map((skill) => (
            <Link
              key={skill.name}
              href={`/dashboard/sprint/${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              className="card card-interactive"
              style={{ display: "block", textDecoration: "none", padding: 20 }}
            >
              <div className="flex-row" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{skill.icon}</span>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 15,
                    color: "var(--text-heading)",
                  }}
                >
                  {skill.name}
                </span>
              </div>
              <div className="body-sm" style={{ lineHeight: 1.5 }}>
                {skill.sub_skills.length} sub-skills · {skill.category}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Overview */}
      <section className="guidance-box" style={{ marginTop: 8 }}>
        <div className="guidance-box-title">Platform Overview</div>
        <div className="guidance-box-text">
          Lumi6 Skill Lab covers{" "}
          <strong>{SKILLS_TAXONOMY.length} core skills</strong> with{" "}
          <strong>88+ sub-skills</strong> across Human Skills, Cognitive Skills,
          Leadership Skills, and Technical Skills. Each skill is taught through a
          unique AI learning engine optimized for that capability type.
        </div>
      </section>
    </div>
  );
}
