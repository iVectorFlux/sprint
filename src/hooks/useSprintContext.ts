"use client";

/**
 * useSprintContext — resolves skill + sub-skill info from the sprint URL.
 *
 * URL format: `/dashboard/sprint/[id]`
 * where `id` can be:
 *   - `emotional-intelligence--self-awareness` (skill--sub-skill slug)
 *   - `emotional-intelligence` (full-skill slug, legacy)
 *   - A UUID from the database
 *
 * This hook resolves both skill and sub-skill context for all sprint stage pages.
 */

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { SKILLS_TAXONOMY, type SkillTaxonomyEntry } from "@/data/skills-taxonomy";

/** Slugify a name for URL matching */
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export interface SubSkillEntry {
  name: string;
  description: string;
  difficulty_level: number;
}

export interface SprintContext {
  /** Raw URL parameter */
  sprintId: string;
  /** The parent skill slug */
  skillSlug: string;
  /** The sub-skill slug (empty if full-skill sprint) */
  subSkillSlug: string;
  /** The parent skill from taxonomy */
  skill: SkillTaxonomyEntry | null;
  /** The specific sub-skill being trained (null if full-skill sprint) */
  subSkill: SubSkillEntry | null;
  /** Display name: sub-skill name if available, else skill name */
  displayName: string;
  /** Parent skill name */
  skillName: string;
  /** All sub-skill names for the parent skill */
  subSkillNames: string[];
  /** Whether this is a sub-skill level sprint */
  isSubSkillSprint: boolean;
}

export function useSprintContext(): SprintContext {
  const { id } = useParams<{ id: string }>();

  return useMemo(() => {
    if (!id) {
      return {
        sprintId: "",
        skillSlug: "",
        subSkillSlug: "",
        skill: null,
        subSkill: null,
        displayName: "This skill",
        skillName: "This skill",
        subSkillNames: [],
        isSubSkillSprint: false,
      };
    }

    // Parse skill--sub-skill format
    const parts = id.split("--");
    const skillSlug = parts[0];
    const subSkillSlug = parts.length > 1 ? parts.slice(1).join("--") : "";

    // Find the parent skill
    const skill = SKILLS_TAXONOMY.find(
      (s) => toSlug(s.name) === skillSlug
    ) || null;

    // Find the sub-skill if specified
    let subSkill: SubSkillEntry | null = null;
    if (skill && subSkillSlug) {
      subSkill = skill.sub_skills.find(
        (s) => toSlug(s.name) === subSkillSlug
      ) || null;
    }

    const isSubSkillSprint = !!subSkill;
    const displayName = subSkill?.name || skill?.name || "This skill";
    const skillName = skill?.name || "This skill";
    const subSkillNames = skill?.sub_skills.map((s) => s.name) || [];

    return {
      sprintId: id,
      skillSlug,
      subSkillSlug,
      skill,
      subSkill,
      displayName,
      skillName,
      subSkillNames,
      isSubSkillSprint,
    };
  }, [id]);
}
