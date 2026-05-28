import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Lumi6",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="onboarding-layout">
      <style>{`
        .onboarding-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--surface);
          padding: var(--gutter-page);
        }
        .onboarding-container {
          width: 100%;
          max-width: 560px;
        }
        .onboarding-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: var(--stack-md);
        }
        .onboarding-brand-logo {
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
        .onboarding-brand-text {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-heading);
        }
        .onboarding-card {
          background-color: var(--surface-bright);
          border: 1px solid var(--border-subtle);
          padding: 36px;
        }
        .onboarding-step-indicator {
          display: flex;
          gap: 8px;
          margin-bottom: var(--stack-sm);
        }
        .onboarding-step-dot {
          flex: 1;
          height: 3px;
          background-color: var(--border-subtle);
          transition: background-color var(--transition-base);
        }
        .onboarding-step-dot-active {
          background-color: var(--primary-container);
        }
        .onboarding-step-dot-completed {
          background-color: var(--success);
        }
        .onboarding-title {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 8px;
        }
        .onboarding-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: var(--stack-sm);
          line-height: 1.6;
        }
        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .onboarding-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .onboarding-actions .btn {
          flex: 1;
        }
        .onboarding-field {
          display: flex;
          flex-direction: column;
        }
        .onboarding-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .onboarding-card { padding: 24px; }
          .onboarding-row { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="onboarding-container">
        <div className="onboarding-brand">
          <div className="onboarding-brand-logo">L6</div>
          <div className="onboarding-brand-text">Lumi6 Skill Lab</div>
        </div>
        {children}
      </div>
    </div>
  );
}
