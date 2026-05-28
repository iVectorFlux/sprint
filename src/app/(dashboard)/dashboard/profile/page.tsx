import { getCurrentUser, getUserProfile, getUserSkillMastery } from "@/lib/data/user";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  const mastery = await getUserSkillMastery(user.id);

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const strengths = (profile?.strengths as string[] | null) || [];
  const weaknesses = (profile?.weaknesses as string[] | null) || [];

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <div className="flex-row" style={{ gap: 20, marginBottom: 16 }}>
          <div className="avatar avatar-lg">{initials}</div>
          <div>
            <h2 className="headline-md" style={{ marginBottom: 2 }}>
              {user.full_name || "User"}
            </h2>
            <p className="body-sm">
              {[user.seniority, user.department].filter(Boolean).join(" · ") || "No details yet"}
            </p>
            <p className="label-micro" style={{ marginTop: 4 }}>
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Professional Context */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Professional Context
        </h3>
        <div className="card">
          <div className="grid-3" style={{ gap: 20 }}>
            <div>
              <div className="label-mono" style={{ marginBottom: 6 }}>Department</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user.department || "—"}</div>
            </div>
            <div>
              <div className="label-mono" style={{ marginBottom: 6 }}>Experience</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {user.years_experience ? `${user.years_experience} years` : "—"}
              </div>
            </div>
            <div>
              <div className="label-mono" style={{ marginBottom: 6 }}>Seniority</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user.seniority || "—"}</div>
            </div>
            <div>
              <div className="label-mono" style={{ marginBottom: 6 }}>Country</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user.country || "—"}</div>
            </div>
            <div>
              <div className="label-mono" style={{ marginBottom: 6 }}>Timezone</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user.timezone || "—"}</div>
            </div>
            <div>
              <div className="label-mono" style={{ marginBottom: 6 }}>Role</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user.role || "learner"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Mastery */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Skill Mastery
        </h3>
        {mastery.length > 0 ? (
          <div className="card" style={{ padding: 0 }}>
            {mastery.map((m, i) => (
              <div
                key={m.id}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    i < mastery.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                }}
              >
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-heading)" }}>
                    {(m.skill as { name?: string })?.name || "Skill"}
                  </div>
                  <div className="flex-row" style={{ gap: 12 }}>
                    <span className="label-micro">{m.practice_hours?.toFixed(1) || 0}h practiced</span>
                    <span className="chip chip-primary" style={{ fontSize: 10 }}>
                      {Math.round(m.mastery_score || 0)}%
                    </span>
                  </div>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${(m.mastery_score || 0) >= 70 ? "progress-fill-success" : ""}`}
                    style={{ width: `${m.mastery_score || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-heading)", marginBottom: 4 }}>
              No skill mastery data yet
            </div>
            <div className="body-sm">
              Complete sprints to build your mastery profile.
            </div>
          </div>
        )}
      </section>

      {/* Strengths & Weaknesses */}
      <div className="grid-2" style={{ gap: 24 }}>
        <section>
          <h3 className="headline-sm" style={{ marginBottom: 16 }}>
            Identified Strengths
          </h3>
          {strengths.length > 0 ? (
            <div className="card stack-xs">
              {strengths.map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "var(--success)", fontSize: 16 }}>✓</span>
                  {s}
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div className="body-sm">
                Strengths will appear after completing sprints and simulations.
              </div>
            </div>
          )}
        </section>

        <section>
          <h3 className="headline-sm" style={{ marginBottom: 16 }}>
            Growth Areas
          </h3>
          {weaknesses.length > 0 ? (
            <div className="card stack-xs">
              {weaknesses.map((w) => (
                <div
                  key={w}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "var(--warning)", fontSize: 16 }}>△</span>
                  {w}
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div className="body-sm">
                Growth areas will be identified as the AI analyzes your patterns.
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Learning Genome Note */}
      <div className="guidance-box guidance-box-accent" style={{ marginTop: "var(--stack-md)" }}>
        <div className="guidance-box-title">Learning Genome</div>
        <div className="guidance-box-text">
          Your Learning Genome is a persistent evolving profile that tracks behavioral patterns,
          communication style, confidence, emotional regulation, learning velocity, and more.
          It becomes more accurate as you complete more sprints and simulations.
        </div>
      </div>
    </div>
  );
}
