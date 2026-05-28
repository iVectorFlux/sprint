import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SubSkillProgress {
  status: "not_started" | "in_progress" | "completed";
  currentStage: string;
  drillScores: number[];
  simulationTurnCount: number;
  startedAt?: string;
  completedAt?: string;
  lastActiveAt?: string;
}

export interface SkillProgress {
  subSkills: Record<string, SubSkillProgress>;
}

interface ProgressState {
  skills: Record<string, SkillProgress>;

  /** Start or resume a sub-skill sprint */
  startSubSkill: (skillSlug: string, subSkillSlug: string) => void;

  /** Update which stage the learner is on */
  setStage: (skillSlug: string, subSkillSlug: string, stage: string) => void;

  /** Record a drill score */
  addDrillScore: (skillSlug: string, subSkillSlug: string, score: number) => void;

  /** Increment simulation turn count */
  addSimulationTurn: (skillSlug: string, subSkillSlug: string) => void;

  /** Mark a sub-skill as completed */
  completeSubSkill: (skillSlug: string, subSkillSlug: string) => void;

  /** Get progress for a specific sub-skill */
  getSubSkillProgress: (skillSlug: string, subSkillSlug: string) => SubSkillProgress | null;

  /** Get overall completion percentage for a skill (0-100) */
  getSkillCompletion: (skillSlug: string, totalSubSkills: number) => number;
}

const DEFAULT_PROGRESS: SubSkillProgress = {
  status: "not_started",
  currentStage: "primer",
  drillScores: [],
  simulationTurnCount: 0,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      skills: {},

      startSubSkill: (skillSlug, subSkillSlug) =>
        set((state) => {
          const skill = state.skills[skillSlug] || { subSkills: {} };
          const existing = skill.subSkills[subSkillSlug];
          if (existing && existing.status !== "not_started") {
            // Already started, just update lastActiveAt
            return {
              skills: {
                ...state.skills,
                [skillSlug]: {
                  subSkills: {
                    ...skill.subSkills,
                    [subSkillSlug]: { ...existing, lastActiveAt: new Date().toISOString() },
                  },
                },
              },
            };
          }
          return {
            skills: {
              ...state.skills,
              [skillSlug]: {
                subSkills: {
                  ...skill.subSkills,
                  [subSkillSlug]: {
                    ...DEFAULT_PROGRESS,
                    status: "in_progress",
                    startedAt: new Date().toISOString(),
                    lastActiveAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        }),

      setStage: (skillSlug, subSkillSlug, stage) =>
        set((state) => {
          const skill = state.skills[skillSlug];
          if (!skill) return state;
          const sub = skill.subSkills[subSkillSlug];
          if (!sub) return state;
          return {
            skills: {
              ...state.skills,
              [skillSlug]: {
                subSkills: {
                  ...skill.subSkills,
                  [subSkillSlug]: { ...sub, currentStage: stage, lastActiveAt: new Date().toISOString() },
                },
              },
            },
          };
        }),

      addDrillScore: (skillSlug, subSkillSlug, score) =>
        set((state) => {
          const skill = state.skills[skillSlug];
          if (!skill) return state;
          const sub = skill.subSkills[subSkillSlug];
          if (!sub) return state;
          return {
            skills: {
              ...state.skills,
              [skillSlug]: {
                subSkills: {
                  ...skill.subSkills,
                  [subSkillSlug]: {
                    ...sub,
                    drillScores: [...sub.drillScores, score],
                    lastActiveAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        }),

      addSimulationTurn: (skillSlug, subSkillSlug) =>
        set((state) => {
          const skill = state.skills[skillSlug];
          if (!skill) return state;
          const sub = skill.subSkills[subSkillSlug];
          if (!sub) return state;
          return {
            skills: {
              ...state.skills,
              [skillSlug]: {
                subSkills: {
                  ...skill.subSkills,
                  [subSkillSlug]: {
                    ...sub,
                    simulationTurnCount: sub.simulationTurnCount + 1,
                    lastActiveAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        }),

      completeSubSkill: (skillSlug, subSkillSlug) =>
        set((state) => {
          const skill = state.skills[skillSlug];
          if (!skill) return state;
          const sub = skill.subSkills[subSkillSlug];
          if (!sub) return state;
          return {
            skills: {
              ...state.skills,
              [skillSlug]: {
                subSkills: {
                  ...skill.subSkills,
                  [subSkillSlug]: {
                    ...sub,
                    status: "completed",
                    completedAt: new Date().toISOString(),
                    lastActiveAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        }),

      getSubSkillProgress: (skillSlug, subSkillSlug) => {
        const skill = get().skills[skillSlug];
        if (!skill) return null;
        return skill.subSkills[subSkillSlug] || null;
      },

      getSkillCompletion: (skillSlug, totalSubSkills) => {
        const skill = get().skills[skillSlug];
        if (!skill || totalSubSkills === 0) return 0;
        const completed = Object.values(skill.subSkills).filter(
          (s) => s.status === "completed"
        ).length;
        return Math.round((completed / totalSubSkills) * 100);
      },
    }),
    {
      name: "lumi6-progress",
    }
  )
);
