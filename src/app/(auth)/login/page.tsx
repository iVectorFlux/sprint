"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">
        Sign in to continue your learning journey.
      </p>

      {error && (
        <div className="auth-error" role="alert" id="login-error">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <label className="input-label" htmlFor="login-email">
            Email Address
          </label>
          <input
            id="login-email"
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
          <label className="input-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="login-submit"
          style={{ width: "100%", marginTop: "8px" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="auth-divider">
        <span className="auth-divider-text">or</span>
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        id="login-magic-link"
        style={{ width: "100%" }}
        onClick={async () => {
          if (!email) {
            setError("Please enter your email for magic link.");
            return;
          }
          setLoading(true);
          setError(null);
          const supabase = createClient();
          const { error } = await supabase.auth.signInWithOtp({ email });
          setLoading(false);
          if (error) {
            setError(error.message);
          } else {
            setError(null);
            alert("Check your email for the login link!");
          }
        }}
      >
        Send Magic Link
      </button>

      <div className="auth-footer">
        Don&apos;t have an account?{" "}
        <Link href="/signup">Create one</Link>
      </div>
    </div>
  );
}
