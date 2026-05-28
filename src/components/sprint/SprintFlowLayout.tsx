"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STAGE_NAV = [
  { key: "primer", label: "Primer", icon: "📖" },
  { key: "micro-skills", label: "Micro-Skills", icon: "🧩" },
  { key: "drills", label: "Drills", icon: "⚡" },
  { key: "simulation", label: "Simulation", icon: "🎯" },
  { key: "replay", label: "Replay", icon: "🔄" },
  { key: "reflection", label: "Reflection", icon: "💭" },
  { key: "assessment", label: "Assessment", icon: "🏆" },
  { key: "report", label: "Report", icon: "📊" },
];

export default function SprintFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Extract sprint ID from path: /dashboard/sprint/[id]/...
  const parts = pathname.split("/");
  const sprintIdx = parts.indexOf("sprint");
  const sprintId = sprintIdx >= 0 ? parts[sprintIdx + 1] : "";
  const currentSegment = parts[sprintIdx + 2] || "";

  return (
    <div className="sprint-flow-shell">
      {/* Sprint Top Bar */}
      <header className="sprint-flow-header">
        <div className="sprint-flow-header-left">
          <Link
            href="/dashboard/sprints"
            className="sprint-flow-back"
            title="Back to Sprints"
          >
            ←
          </Link>
          <div className="sprint-flow-brand">
            <span className="sprint-flow-brand-icon">⚡</span>
            <span className="sprint-flow-brand-text">Competency Sprint</span>
          </div>
        </div>

        {/* Stage Pills */}
        <nav className="sprint-flow-stages">
          {STAGE_NAV.map((stage) => {
            const stageIdx = STAGE_NAV.findIndex(
              (s) => s.key === currentSegment
            );
            const thisIdx = STAGE_NAV.findIndex((s) => s.key === stage.key);
            const isActive =
              currentSegment === stage.key ||
              (stage.key === "simulation" &&
                currentSegment.startsWith("simulation"));
            const isCompleted = thisIdx < stageIdx;

            return (
              <Link
                key={stage.key}
                href={`/dashboard/sprint/${sprintId}/${stage.key}`}
                className={`sprint-flow-stage-pill ${isActive ? "sprint-flow-stage-pill-active" : ""} ${isCompleted ? "sprint-flow-stage-pill-completed" : ""}`}
              >
                <span className="sprint-flow-stage-icon">
                  {isCompleted ? "✅" : stage.icon}
                </span>
                <span className="sprint-flow-stage-label">{stage.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Stage Content */}
      <main className="sprint-flow-content">{children}</main>
    </div>
  );
}
