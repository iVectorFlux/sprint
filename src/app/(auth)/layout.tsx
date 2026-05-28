import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--surface);
          padding: var(--gutter-page);
        }
        .auth-container {
          width: 100%;
          max-width: 420px;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: var(--stack-md);
        }
        .auth-brand-logo {
          width: 40px;
          height: 40px;
          background-color: var(--primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--on-primary);
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
        }
        .auth-brand-text {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .auth-card {
          background-color: var(--surface-bright);
          border: 1px solid var(--border-subtle);
          padding: 32px;
        }
        .auth-title {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 8px;
        }
        .auth-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: var(--stack-sm);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: var(--stack-xs) 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-top: 1px solid var(--border-subtle);
        }
        .auth-divider-text {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .auth-footer {
          text-align: center;
          margin-top: var(--stack-sm);
          font-size: 14px;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--primary-container);
          font-weight: 500;
        }
        .auth-footer a:hover {
          color: var(--brand-hover);
        }
        .auth-error {
          padding: 12px 16px;
          background-color: var(--error-container);
          border-left: 3px solid var(--error);
          font-size: 13px;
          color: var(--on-error-container);
        }
      `}</style>
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-logo">L6</div>
          <div className="auth-brand-text">Lumi6 Skill Lab</div>
        </div>
        {children}
      </div>
    </div>
  );
}
