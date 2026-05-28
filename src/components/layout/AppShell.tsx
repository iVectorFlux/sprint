"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import LearningChatFAB from "@/components/dashboard/LearningChatFAB";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/catalog": "Skills Catalog",
  "/dashboard/sprints": "My Sprints",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

interface AppShellProps {
  children: React.ReactNode;
  userName?: string | null;
  userRole?: string | null;
}

export default function AppShell({ children, userName, userRole }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Get page title from route
  const title =
    PAGE_TITLES[pathname] ||
    (pathname.startsWith("/dashboard/sprint/")
      ? "Sprint"
      : "Lumi6 Skill Lab");

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userRole={userRole}
      />
      <div className="main-area">
        <TopBar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content">
          {children}
        </main>
      </div>
      <LearningChatFAB />
    </div>
  );
}
