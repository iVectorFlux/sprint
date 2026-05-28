"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 3;

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Operations",
  "Finance",
  "HR / People",
  "Legal",
  "Executive",
  "Other",
];

const SENIORITY_LEVELS = [
  { value: "intern", label: "Intern / Trainee" },
  { value: "junior", label: "Junior (0–2 years)" },
  { value: "mid", label: "Mid-Level (2–5 years)" },
  { value: "senior", label: "Senior (5–10 years)" },
  { value: "lead", label: "Lead / Staff" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "vp", label: "VP / Senior Leader" },
  { value: "c_suite", label: "C-Suite" },
  { value: "founder", label: "Founder" },
];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "UAE",
  "Japan",
  "France",
  "Netherlands",
  "Other",
];

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "India (IST, UTC+5:30)" },
  { value: "America/New_York", label: "US Eastern (EST, UTC-5)" },
  { value: "America/Chicago", label: "US Central (CST, UTC-6)" },
  { value: "America/Denver", label: "US Mountain (MST, UTC-7)" },
  { value: "America/Los_Angeles", label: "US Pacific (PST, UTC-8)" },
  { value: "Europe/London", label: "UK (GMT, UTC+0)" },
  { value: "Europe/Berlin", label: "Central Europe (CET, UTC+1)" },
  { value: "Asia/Dubai", label: "UAE (GST, UTC+4)" },
  { value: "Asia/Singapore", label: "Singapore (SGT, UTC+8)" },
  { value: "Asia/Tokyo", label: "Japan (JST, UTC+9)" },
  { value: "Australia/Sydney", label: "Australia (AEST, UTC+10)" },
  { value: "Pacific/Auckland", label: "New Zealand (NZST, UTC+12)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [seniority, setSeniority] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");

  const canProceed = () => {
    switch (step) {
      case 1:
        return fullName.trim().length >= 2;
      case 2:
        return department && seniority;
      case 3:
        return country && timezone;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Session expired. Please log in again.");
        return;
      }

      // Update user record
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: fullName.trim(),
          department,
          seniority,
          country,
          timezone,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Also update auth metadata so the name shows everywhere
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      // Create initial user profile (Learning Genome)
      await supabase.from("user_profiles").upsert({
        user_id: user.id,
        personality_model: {},
        communication_style: {},
        behavioral_patterns: {},
        emotional_patterns: {},
        strengths: [],
        weaknesses: [],
        motivations: [],
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-card">
      {/* Step Indicator */}
      <div className="onboarding-step-indicator">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`onboarding-step-dot ${
              i + 1 === step
                ? "onboarding-step-dot-active"
                : i + 1 < step
                  ? "onboarding-step-dot-completed"
                  : ""
            }`}
          />
        ))}
      </div>

      {/* Step 1: Name & Title */}
      {step === 1 && (
        <>
          <h1 className="onboarding-title">Welcome to Lumi6</h1>
          <p className="onboarding-subtitle">
            Let&apos;s set up your profile. This helps us personalize your
            learning experience and calibrate AI simulations to your context.
          </p>

          <div className="onboarding-form">
            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-name">
                Full Name *
              </label>
              <input
                id="onboard-name"
                className="input"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
                autoComplete="name"
              />
            </div>

            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-title">
                Job Title (optional)
              </label>
              <input
                id="onboard-title"
                className="input"
                type="text"
                placeholder="e.g. Senior Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                autoComplete="organization-title"
              />
              <div className="input-helper">
                This helps us tailor scenarios to your professional context.
              </div>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Professional Context */}
      {step === 2 && (
        <>
          <h1 className="onboarding-title">Professional Context</h1>
          <p className="onboarding-subtitle">
            Tell us about your role. The AI will use this to generate realistic
            scenarios and calibrate difficulty for your experience level.
          </p>

          <div className="onboarding-form">
            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-department">
                Department *
              </label>
              <select
                id="onboard-department"
                className="input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-seniority">
                Seniority Level *
              </label>
              <select
                id="onboard-seniority"
                className="input"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
              >
                <option value="">Select seniority</option>
                {SENIORITY_LEVELS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-experience">
                Years of Experience (optional)
              </label>
              <input
                id="onboard-experience"
                className="input"
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 5"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <>
          <h1 className="onboarding-title">Location & Timezone</h1>
          <p className="onboarding-subtitle">
            This helps us schedule reinforcement nudges at optimal times and
            contextualize cultural scenarios in simulations.
          </p>

          <div className="onboarding-form">
            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-country">
                Country *
              </label>
              <select
                id="onboard-country"
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="onboarding-field">
              <label className="input-label" htmlFor="onboard-timezone">
                Timezone *
              </label>
              <select
                id="onboard-timezone"
                className="input"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="">Select timezone</option>
                {TIMEZONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Completion guidance */}
          <div
            className="guidance-box"
            style={{ marginTop: "var(--stack-sm)" }}
          >
            <div className="guidance-box-title">What happens next?</div>
            <div className="guidance-box-text">
              After setup, you&apos;ll land on your dashboard. Browse the Skills
              Catalog to pick your first skill and start your 20-hour
              transformation sprint.
            </div>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div
          className="auth-error"
          role="alert"
          style={{ marginTop: 16 }}
          id="onboarding-error"
        >
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="onboarding-actions" style={{ marginTop: 24 }}>
        {step > 1 && (
          <button
            className="btn btn-ghost"
            onClick={handleBack}
            id="onboard-back"
          >
            ← Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
            id="onboard-next"
          >
            Continue →
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleComplete}
            disabled={!canProceed() || loading}
            id="onboard-complete"
          >
            {loading ? "Setting up..." : "Complete Setup →"}
          </button>
        )}
      </div>
    </div>
  );
}
