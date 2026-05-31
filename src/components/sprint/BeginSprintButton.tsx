"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSprintStore } from "@/stores/useSprintStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { SKILLS_TAXONOMY } from "@/data/skills-taxonomy";
import { toSlug } from "@/hooks/useSprintContext";
import SprintGenerationLoader from "@/components/sprint/SprintGenerationLoader";
import { getFirstStageUrl } from "@/domain/practice";

interface BeginSprintButtonProps {
  skillSlug: string;
  skillName: string;
}

export default function BeginSprintButton({ skillSlug, skillName }: BeginSprintButtonProps) {
  const router = useRouter();
  const { startSprint } = useSprintStore();
  const { startSubSkill } = useProgressStore();
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse skill--sub-skill slug
  const parts = skillSlug.split("--");
  const parentSlug = parts[0];
  const subSlug = parts.length > 1 ? parts.slice(1).join("--") : "";

  // Find skill from taxonomy
  const skill = SKILLS_TAXONOMY.find(
    (s) => toSlug(s.name) === parentSlug
  );

  const handleBegin = () => {
    setLoading(true);
    setError(null);

    if (!skill) {
      setError("Skill not found");
      setLoading(false);
      return;
    }

    // Track progress
    if (subSlug) {
      startSubSkill(parentSlug, subSlug);
    }

    // Show the generation loader animation
    setShowLoader(true);

    // Try to create sprint via backend in parallel
    (async () => {
      try {
        const { api } = await import("@/lib/api");
        const skills = await api.get<Array<{ id: string; name: string }>>("/api/v1/skills");
        const dbSkill = skills.find(
          (s) => s.name.toLowerCase() === skill.name.toLowerCase()
        );
        if (dbSkill) {
          await startSprint(dbSkill.id);
        }
      } catch {
        // Backend not available — loader will still complete and navigate with slug
      }
    })();
  };

  const handleLoaderComplete = () => {
    const archetype = skill?.archetype ?? "conversational";
    router.push(getFirstStageUrl(skillSlug, archetype));
  };

  if (showLoader) {
    return (
      <SprintGenerationLoader
        skillName={skillName}
        skillIcon={skill?.icon}
        onComplete={handleLoaderComplete}
      />
    );
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-lg"
        id="sprint-begin"
        onClick={handleBegin}
        disabled={loading}
      >
        {loading ? "Starting..." : "Begin sprint →"}
      </button>
      {error && (
        <div style={{ color: "var(--error)", fontSize: 13, marginTop: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}
