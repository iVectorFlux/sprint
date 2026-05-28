"use client";

import { useState, useEffect, useCallback } from "react";

interface GenerationStep {
  label: string;
  duration: number; // ms to simulate this step
}

const GENERATION_STEPS: GenerationStep[] = [
  { label: "Analyzing your capability profile...", duration: 1800 },
  { label: "Mapping skill ontology & sub-skills...", duration: 2200 },
  { label: "Identifying optimal learning pathways...", duration: 2000 },
  { label: "Generating personalized simulations...", duration: 2600 },
  { label: "Calibrating difficulty progression...", duration: 1500 },
  { label: "Building AI coaching prompts...", duration: 1200 },
  { label: "Finalizing your unique sprint...", duration: 1000 },
];

interface SprintGenerationLoaderProps {
  skillName: string;
  skillIcon?: string;
  onComplete: () => void;
}

export default function SprintGenerationLoader({
  skillName,
  skillIcon = "⚡",
  onComplete,
}: SprintGenerationLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const advanceStep = useCallback(() => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });

    if (currentStep < GENERATION_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setDone(true);
      setTimeout(onComplete, 800);
    }
  }, [currentStep, onComplete]);

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(advanceStep, GENERATION_STEPS[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep, done, advanceStep]);

  const progress = ((completedSteps.size) / GENERATION_STEPS.length) * 100;

  return (
    <div className="gen-loader-overlay">
      <div className="gen-loader-card">
        {/* Spinner */}
        <div className="gen-loader-spinner-container">
          {!done ? (
            <div className="gen-loader-spinner" />
          ) : (
            <div className="gen-loader-done-icon">✓</div>
          )}
        </div>

        {/* Title */}
        <h1 className="gen-loader-title">
          {done ? "Your Sprint is Ready!" : "Generating Your Unique Sprint"}
        </h1>
        <p className="gen-loader-subtitle">
          {done
            ? `${skillIcon} ${skillName} — personalized just for you`
            : `${skillIcon} ${skillName}`}
        </p>

        {/* Progress bar */}
        <div className="gen-loader-progress-track">
          <div
            className="gen-loader-progress-fill"
            style={{ width: `${done ? 100 : progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="gen-loader-steps">
          {GENERATION_STEPS.map((step, i) => {
            const isCompleted = completedSteps.has(i);
            const isCurrent = i === currentStep && !done;
            const isPending = i > currentStep && !done;

            return (
              <div
                key={i}
                className={`gen-loader-step ${
                  isCurrent ? "gen-loader-step-active" : ""
                } ${isCompleted ? "gen-loader-step-done" : ""} ${
                  isPending ? "gen-loader-step-pending" : ""
                }`}
              >
                <div className="gen-loader-step-icon">
                  {isCompleted || done ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="9" fill="var(--success)" />
                      <path d="M5 9.5L7.5 12L13 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isCurrent ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="9" fill="var(--primary-container)" />
                      <path d="M9 5L10.5 8.5H14L11 10.5L12 14L9 12L6 14L7 10.5L4 8.5H7.5L9 5Z" fill="white" />
                    </svg>
                  ) : (
                    <div className="gen-loader-step-dot" />
                  )}
                </div>
                <span className="gen-loader-step-label">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
