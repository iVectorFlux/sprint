import AppShell from "@/components/layout/AppShell";
import { getCurrentUser } from "@/lib/data/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AppShell
      userName={user?.full_name}
      userRole={user?.seniority || user?.role || "Learner"}
    >
      {children}
    </AppShell>
  );
}
