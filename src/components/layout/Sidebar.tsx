"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "◻" },
  { label: "Skills Catalog", href: "/dashboard/catalog", icon: "◈" },
  { label: "My Sprints", href: "/dashboard/sprints", icon: "▶" },
  { label: "Profile", href: "/dashboard/profile", icon: "◯" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string | null;
  userRole?: string | null;
}

export default function Sidebar({
  isOpen,
  onClose,
  userName,
  userRole,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "sidebar-overlay-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: "var(--primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--on-primary)",
              fontFamily: "var(--font-heading)",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            L6
          </div>
          <div>
            <div className="sidebar-brand-name">Lumi6</div>
            <span className="sidebar-brand-badge">Skill Lab</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Platform</div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                onClick={onClose}
                id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <span className="sidebar-link-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer with user info */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar avatar-sm">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName || "User"}</div>
              <div className="sidebar-user-role">{userRole || "Learner"}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleSignOut}
            id="sidebar-signout"
            style={{ width: "100%", marginTop: 8 }}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
