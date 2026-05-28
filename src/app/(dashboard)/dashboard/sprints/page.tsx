import Link from "next/link";
import { getCurrentUser, getUserSprints } from "@/lib/data/user";
import { redirect } from "next/navigation";
import { STAGE_LABELS } from "@/types";
import type { StageType, SprintStatus } from "@/types";

const STATUS_CHIP: Record<SprintStatus, { className: string; label: string }> = {
  not_started: { className: "chip", label: "Not Started" },
  active: { className: "chip chip-primary", label: "Active" },
  paused: { className: "chip chip-warning", label: "Paused" },
  completed: { className: "chip chip-success", label: "Completed" },
  abandoned: { className: "chip chip-error", label: "Abandoned" },
};

export default async function SprintsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sprints = await getUserSprints(user.id);

  return (
    <div style={{ maxWidth: 800 }}>
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <div className="flex-between">
          <div>
            <h2 className="headline-md" style={{ marginBottom: 4 }}>
              My Sprints
            </h2>
            <p className="body-sm">
              {sprints.length > 0
                ? `You have ${sprints.length} sprint${sprints.length !== 1 ? "s" : ""}.`
                : "You haven't started any sprints yet."}
            </p>
          </div>
          <Link href="/dashboard/catalog" className="btn btn-primary btn-sm" id="sprints-new">
            + New Sprint
          </Link>
        </div>
      </section>

      {sprints.length > 0 ? (
        <div className="stack-sm">
          {sprints.map((sprint) => {
            const progress = Math.round(
              ((sprint.completed_hours || 0) / (sprint.target_hours || 20)) * 100
            );
            const statusInfo = STATUS_CHIP[sprint.status] || STATUS_CHIP.not_started;

            return (
              <Link
                key={sprint.id}
                href={`/dashboard/sprint/${sprint.id}`}
                className="card card-interactive"
                style={{ display: "block", textDecoration: "none", padding: 24 }}
                id={`sprint-card-${sprint.id}`}
              >
                <div className="flex-between" style={{ marginBottom: 12 }}>
                  <div className="flex-row" style={{ gap: 14 }}>
                    <span style={{ fontSize: 28 }}>
                      {sprint.skill?.icon || "🎯"}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: 17,
                          fontWeight: 700,
                          color: "var(--text-heading)",
                        }}
                      >
                        {sprint.title || sprint.skill?.name || "Sprint"}
                      </div>
                      <div className="body-sm" style={{ marginTop: 2 }}>
                        {sprint.current_stage
                          ? `Stage: ${STAGE_LABELS[sprint.current_stage as StageType]}`
                          : "Not started"}{" "}
                        {sprint.started_at
                          ? `· Started ${new Date(sprint.started_at).toLocaleDateString()}`
                          : ""}
                      </div>
                    </div>
                  </div>
                  <span className={statusInfo.className}>{statusInfo.label}</span>
                </div>

                <div className="progress-track" style={{ marginBottom: 8 }}>
                  <div
                    className={`progress-fill ${sprint.status === "completed" ? "progress-fill-success" : ""}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex-between">
                  <span className="label-micro">
                    {sprint.completed_hours || 0}h / {sprint.target_hours || 20}h ({progress}%)
                  </span>
                  <span className="label-micro">
                    Confidence: {sprint.confidence_score || 0}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: 40 }}>🚀</div>
          <div className="empty-state-title">No sprints yet</div>
          <div className="empty-state-text">
            Browse the skills catalog and start your first 20-hour transformation sprint.
          </div>
          <Link href="/dashboard/catalog" className="btn btn-primary btn-sm">
            Browse Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
