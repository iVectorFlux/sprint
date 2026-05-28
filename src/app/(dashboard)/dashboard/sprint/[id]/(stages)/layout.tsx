import SprintFlowLayout from "@/components/sprint/SprintFlowLayout";

export default function SprintStageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SprintFlowLayout>{children}</SprintFlowLayout>;
}
