"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role || "individual_contributor",
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">
        Begin your 20-hour skill transformation journey.
      </p>

      {error && (
        <div className="auth-error" role="alert" id="signup-error">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="auth-field">
          <label className="input-label" htmlFor="signup-name">
            Full Name
          </label>
          <input
            id="signup-name"
            className="input"
            type="text"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="auth-field">
          <label className="input-label" htmlFor="signup-email">
            Work Email
          </label>
          <input
            id="signup-email"
            className="input"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label className="input-label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            className="input"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </div>

        <div className="auth-field">
          <label className="input-label" htmlFor="signup-role">
            Your Role
          </label>
          <select
            id="signup-role"
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select your role (optional)</option>
            <option value="individual_contributor">Individual Contributor</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
            <option value="vp">VP / Senior Leader</option>
            <option value="c_suite">C-Suite</option>
            <option value="founder">Founder</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="signup-submit"
          style={{ width: "100%", marginTop: "8px" }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{" "}
        <Link href="/login">Sign in</Link>
      </div>
    </div>
  );
}
