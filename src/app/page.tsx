import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-page">
      <style>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--gutter-page);
          text-align: center;
          background-color: var(--surface);
        }
        .landing-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .landing-logo {
          width: 48px;
          height: 48px;
          background-color: var(--primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--on-primary);
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
        }
        .landing-title {
          font-family: var(--font-heading);
          font-size: 42px;
          font-weight: 700;
          color: var(--text-heading);
          letter-spacing: -0.02em;
        }
        .landing-subtitle {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 400;
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto var(--stack-md);
          line-height: 1.7;
        }
        .landing-tagline {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-blue);
          margin-bottom: var(--stack-sm);
        }
        .landing-actions {
          display: flex;
          gap: 16px;
          margin-top: var(--stack-sm);
        }
        .landing-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
        }
        .landing-stats {
          display: flex;
          gap: var(--stack-md);
          margin-top: var(--stack-lg);
          padding-top: var(--stack-md);
          border-top: 1px solid var(--border-subtle);
        }
        .landing-stat-value {
          font-family: var(--font-heading);
          font-size: 28px;
          font-weight: 700;
          color: var(--primary-container);
        }
        .landing-stat-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .landing-title { font-size: 28px; }
          .landing-subtitle { font-size: 15px; }
          .landing-actions { flex-direction: column; width: 100%; }
          .landing-actions .btn { width: 100%; }
          .landing-stats { flex-direction: column; gap: var(--stack-sm); }
        }
      `}</style>

      <div className="landing-tagline">AI-Native Adaptive Learning</div>
      <div className="landing-brand">
        <div className="landing-logo">L6</div>
      </div>
      <h1 className="landing-title">Lumi6 Skill Lab</h1>
      <p className="landing-subtitle">
        Rapidly acquire, retain, and operationalize future-of-work capabilities
        through personalized deliberate practice and AI-driven simulations.
      </p>

      <div className="landing-actions">
        <Link href="/signup" className="btn btn-primary btn-lg" id="landing-signup">
          Get Started
        </Link>
        <Link href="/login" className="btn btn-ghost btn-lg" id="landing-login">
          Sign In
        </Link>
      </div>

      <div className="landing-stats">
        <div>
          <div className="landing-stat-value">14</div>
          <div className="landing-stat-label">Core Skills</div>
        </div>
        <div>
          <div className="landing-stat-value">88+</div>
          <div className="landing-stat-label">Sub-Skills</div>
        </div>
        <div>
          <div className="landing-stat-value">20h</div>
          <div className="landing-stat-label">To Competence</div>
        </div>
      </div>

      <div className="landing-footer">
        © 2026 Lumi6 Skill Lab — Capability Transformation Platform
      </div>
    </div>
  );
}
