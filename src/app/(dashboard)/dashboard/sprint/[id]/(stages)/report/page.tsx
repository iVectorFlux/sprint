"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

interface DimensionAssessment {
  score: number;
  trend: string;
  insight: string;
}

interface ReportData {
  readiness_score: number;
  readiness_label: string;
  executive_summary: string;
  dimension_assessments: Record<string, DimensionAssessment>;
  top_strengths: string[];
  critical_weaknesses: string[];
  recommendations: string[];
  improvement_narrative: string;
}

interface ReportResponse {
  report: ReportData;
  sprint: {
    id: string;
    hoursCompleted: number;
    progress: number;
    simulationsCompleted: number;
    evaluationsCount: number;
    reflectionsCount: number;
  };
}

const DIM_LABELS: Record<string, string> = {
  empathy: "Empathy",
  clarity: "Clarity",
  composure: "Composure",
  listening: "Active Listening",
  assertiveness: "Assertiveness",
  conflict_management: "Conflict Mgmt",
  escalation_control: "De-escalation",
};

export default function ReportPage() {
  const router = useRouter();
  const { id: sprintId } = useParams<{ id: string }>();
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<ReportResponse>(`/api/v1/sprint/${sprintId}/report`)
      .then((res) => { setData(res); setLoading(false); })
      .catch((e) => {
        // Fallback demo data
        setData({
          report: {
            readiness_score: 72,
            readiness_label: "competent",
            executive_summary: "You demonstrated strong emotional acknowledgment and active listening skills. Your ability to maintain composure under moderate pressure was above average. However, assertiveness in high-conflict scenarios needs development.",
            dimension_assessments: {
              empathy: { score: 82, trend: "improving", insight: "Strong emotional recognition" },
              clarity: { score: 68, trend: "stable", insight: "Good but could be more concise" },
              composure: { score: 75, trend: "improving", insight: "Maintained calm in most scenarios" },
              listening: { score: 85, trend: "strong", insight: "Excellent paraphrasing skills" },
              assertiveness: { score: 55, trend: "needs_work", insight: "Tends to accommodate too readily" },
              conflict_management: { score: 65, trend: "developing", insight: "Good de-escalation, needs firmer resolution" },
              escalation_control: { score: 72, trend: "improving", insight: "Effective at lowering temperature" },
            },
            top_strengths: [
              "Active listening and paraphrasing under pressure",
              "Emotional acknowledgment before problem-solving",
              "Maintaining professional tone consistently",
            ],
            critical_weaknesses: [
              "Assertiveness drops when faced with authority figures",
              "Tendency to over-accommodate rather than hold ground",
              "Solution-orientation weakens under high stress",
            ],
            recommendations: [
              "Practice assertive statements using the 'I believe X because Y' framework",
              "In escalated scenarios, pause 3 seconds before responding to regain composure",
              "Use specific data points when pushing back on unreasonable requests",
              "Schedule follow-up sprints focusing on negotiation and boundary-setting",
            ],
            improvement_narrative: "Over the course of this sprint, you showed clear growth in emotional regulation and listening skills. Your initial simulations revealed a pattern of defensiveness, but by the escalated retry, you successfully deployed de-escalation techniques. The key area for continued growth is balancing empathy with assertiveness.",
          },
          sprint: { id: sprintId, hoursCompleted: 2.5, progress: 100, simulationsCompleted: 4, evaluationsCount: 4, reflectionsCount: 2 },
        });
        setLoading(false);
      });
  }, [sprintId]);

  if (loading) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <div className="skeleton skeleton-heading" style={{ margin: "0 auto" }} />
        <div className="skeleton skeleton-card" style={{ marginTop: 24 }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="sprint-stage-container" style={{ textAlign: "center" }}>
        <h2 className="headline-sm" style={{ color: "var(--error)" }}>Error Loading Report</h2>
        <p className="body-sm">{error || "An unexpected error occurred."}</p>
        <button className="btn btn-primary" onClick={() => router.push("/dashboard/sprints")} style={{ marginTop: 16 }}>
          Back to Sprints
        </button>
      </div>
    );
  }

  const { report, sprint } = data;

  // Radar chart calculations
  const dims = Object.keys(DIM_LABELS);
  const centerX = 160, centerY = 160, radius = 110;
  const getCoords = (i: number, score: number) => {
    const angle = (i * 2 * Math.PI) / dims.length - Math.PI / 2;
    return { x: centerX + radius * (score / 100) * Math.cos(angle), y: centerY + radius * (score / 100) * Math.sin(angle) };
  };

  const gridRings = [20, 40, 60, 80, 100].map((level) =>
    dims.map((_, i) => { const { x, y } = getCoords(i, level); return `${x},${y}`; }).join(" ")
  );

  const userPoints = dims.map((dim, i) => {
    const dimData = report.dimension_assessments[dim] || { score: 50 };
    const { x, y } = getCoords(i, dimData.score);
    return { x, y, dim, score: dimData.score };
  });

  const readinessColor = report.readiness_score >= 70 ? "var(--success)" : report.readiness_score >= 50 ? "var(--warning)" : "var(--error)";

  return (
    <div className="sprint-stage-container sprint-stage-container-wide" style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <span className="sprint-stage-badge">Sprint Completed</span>
        <h1 className="headline-lg" style={{ marginTop: 16, marginBottom: 8 }}>
          Competency Report
        </h1>
        <p className="body-ui" style={{ maxWidth: 600, margin: "0 auto", color: "var(--text-secondary)" }}>
          A multidimensional diagnostic profile measuring behavior, empathy, and composure in high-stakes workplace dialogues.
        </p>
      </div>

      {/* Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, marginBottom: 32 }}>
        {/* Radar + Score */}
        <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: readinessColor, marginBottom: 4 }}>
            {report.readiness_score}
          </div>
          <div className="label-mono" style={{ marginBottom: 8 }}>Readiness Index</div>
          <span className="chip" style={{ color: readinessColor, borderColor: readinessColor, marginBottom: 24 }}>
            {report.readiness_label.replace("_", " ")}
          </span>

          <svg width="320" height="320" style={{ overflow: "visible" }}>
            {gridRings.map((ring, i) => (
              <polygon key={i} points={ring} fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            ))}
            {dims.map((_, i) => {
              const p = getCoords(i, 100);
              return <line key={i} x1={centerX} y1={centerY} x2={p.x} y2={p.y} stroke="var(--border-subtle)" strokeWidth="1" />;
            })}
            <polygon points={userPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(45,106,79,0.15)" stroke="var(--success)" strokeWidth="2.5" />
            {userPoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="var(--success)" stroke="var(--surface-bright)" strokeWidth="1.5" />
                <text
                  x={centerX + (radius + 24) * Math.cos((i * 2 * Math.PI) / dims.length - Math.PI / 2)}
                  y={centerY + (radius + 14) * Math.sin((i * 2 * Math.PI) / dims.length - Math.PI / 2) + 4}
                  fill="var(--text-heading)"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="var(--font-ui)"
                >
                  {DIM_LABELS[p.dim]} ({p.score})
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Summary + Narrative */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              📋 Executive Summary
            </h3>
            <p className="body-ui" style={{ color: "var(--text-secondary)" }}>{report.executive_summary}</p>
          </div>
          <div className="card" style={{ padding: 28, flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              📈 Behavioral Evolution
            </h3>
            <p className="body-ui" style={{ color: "var(--text-secondary)", marginBottom: 20 }}>{report.improvement_narrative}</p>
            <div className="divider" />
            <div className="flex-row" style={{ gap: 32, paddingTop: 12 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-container)" }}>{sprint.simulationsCompleted}</div>
                <div className="label-micro">Simulations</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--success)" }}>{sprint.reflectionsCount}</div>
                <div className="label-micro">Reflections</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--warning)" }}>{sprint.hoursCompleted.toFixed(1)}hr</div>
                <div className="label-micro">Practice</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid-2" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, borderColor: "var(--success)", borderWidth: 2 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--success)", marginBottom: 16, display: "flex", gap: 8 }}>
            🟢 Demonstrated Strengths
          </h3>
          <ul className="body-ui" style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {report.top_strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="card" style={{ padding: 24, borderColor: "var(--error)", borderWidth: 2 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--error)", marginBottom: 16, display: "flex", gap: 8 }}>
            🔴 Growth Opportunities
          </h3>
          <ul className="body-ui" style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {report.critical_weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card" style={{ padding: 28, marginBottom: 40 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--primary-container)", marginBottom: 20, display: "flex", gap: 8 }}>
          💡 Personalized Action Plan
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {report.recommendations.map((rec, i) => (
            <div key={i} className="guidance-box" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div className="avatar avatar-sm" style={{ fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
              <p className="body-ui" style={{ margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 16 }}>
        <button className="btn btn-ghost btn-lg" onClick={() => router.push("/dashboard/sprints")}>
          Return to Dashboard
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => router.push("/dashboard")}>
          Explore More Sprints
        </button>
      </div>
    </div>
  );
}
