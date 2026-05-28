"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [department, setDepartment] = useState("");
  const [seniority, setSeniority] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setTimezone(data.timezone || "");
        setDepartment(data.department || "");
        setSeniority(data.seniority || "");
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return;

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        timezone,
        department,
        seniority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authUser.id);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      // Also update auth metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      setMessage("Settings saved successfully.");
      router.refresh();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div className="skeleton skeleton-heading" />
        <div className="skeleton skeleton-card" style={{ marginTop: 16 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h2 className="headline-md" style={{ marginBottom: 4 }}>
          Settings
        </h2>
        <p className="body-sm">Manage your account and preferences.</p>
      </section>

      {message && (
        <div
          className={`guidance-box ${message.startsWith("Error") ? "guidance-box-error" : "guidance-box-success"}`}
          style={{ marginBottom: "var(--stack-sm)" }}
        >
          <div className="guidance-box-text">{message}</div>
        </div>
      )}

      {/* Account */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Account
        </h3>
        <div className="card stack-sm">
          <div>
            <label className="input-label" htmlFor="settings-name">
              Full Name
            </label>
            <input
              id="settings-name"
              className="input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="input-label" htmlFor="settings-email">
              Email
            </label>
            <input
              id="settings-email"
              className="input"
              type="email"
              value={email}
              disabled
            />
            <div className="input-helper">
              Email cannot be changed. Contact support if needed.
            </div>
          </div>
          <div>
            <label className="input-label" htmlFor="settings-department">
              Department
            </label>
            <input
              id="settings-department"
              className="input"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Product"
            />
          </div>
          <div>
            <label className="input-label" htmlFor="settings-seniority">
              Seniority
            </label>
            <input
              id="settings-seniority"
              className="input"
              type="text"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              placeholder="e.g. Senior"
            />
          </div>
          <div>
            <label className="input-label" htmlFor="settings-timezone">
              Timezone
            </label>
            <select
              id="settings-timezone"
              className="input"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="">Select timezone</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="America/New_York">US Eastern (EST)</option>
              <option value="America/Chicago">US Central (CST)</option>
              <option value="America/Los_Angeles">US Pacific (PST)</option>
              <option value="Europe/London">UK (GMT)</option>
              <option value="Europe/Berlin">Central Europe (CET)</option>
              <option value="Asia/Dubai">UAE (GST)</option>
              <option value="Asia/Singapore">Singapore (SGT)</option>
              <option value="Asia/Tokyo">Japan (JST)</option>
              <option value="Australia/Sydney">Australia (AEST)</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            id="settings-save-account"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section style={{ marginBottom: "var(--stack-md)" }}>
        <h3 className="headline-sm" style={{ marginBottom: 16 }}>
          Notifications
        </h3>
        <div className="card stack-sm">
          <div className="flex-between">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-heading)" }}>
                Sprint Reminders
              </div>
              <div className="body-sm">Get reminded to practice</div>
            </div>
            <input type="checkbox" defaultChecked id="settings-sprint-reminders" />
          </div>
          <hr className="card-divider" />
          <div className="flex-between">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-heading)" }}>
                Reinforcement Alerts
              </div>
              <div className="body-sm">Memory decay reinforcement triggers</div>
            </div>
            <input type="checkbox" defaultChecked id="settings-reinforcement-alerts" />
          </div>
          <hr className="card-divider" />
          <div className="flex-between">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-heading)" }}>
                Weekly Progress Report
              </div>
              <div className="body-sm">Email summary of your progress</div>
            </div>
            <input type="checkbox" id="settings-weekly-report" />
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h3 className="headline-sm" style={{ marginBottom: 16, color: "var(--error)" }}>
          Danger Zone
        </h3>
        <div className="card" style={{ borderColor: "var(--error)" }}>
          <div className="flex-between">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-heading)" }}>
                Delete Account
              </div>
              <div className="body-sm">
                Permanently delete your account and all data
              </div>
            </div>
            <button className="btn btn-danger btn-sm" id="settings-delete-account">
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
