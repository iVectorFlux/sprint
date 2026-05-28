import { create } from 'zustand';
import { api } from '@/lib/api';

export interface SprintDashboard {
  hasStarted: boolean;
  sprint: {
    id: string;
    currentStage: string;
    progress: number;
    readinessScore: number;
    hoursCompleted: number;
    status: string;
    title?: string;
    skillName?: string;
    skillIcon?: string;
  } | null;
  heatmap: Record<string, number> | null;
  weaknesses: { dimension: string; score: number }[];
  simulationsCompleted: number;
}

interface SprintStoreState {
  dashboard: SprintDashboard | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: (sprintId: string) => Promise<void>;
  startSprint: (skillId: string) => Promise<{ id: string } | null>;
  updateStage: (sprintId: string, stage: string, progress: number) => Promise<void>;
}

export const useSprintStore = create<SprintStoreState>((set) => ({
  dashboard: null,
  loading: false,
  error: null,

  fetchDashboard: async (sprintId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<SprintDashboard>(`/api/v1/sprint/${sprintId}/dashboard`);
      set({ dashboard: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  startSprint: async (skillId: string) => {
    set({ loading: true, error: null });
    try {
      const sprint = await api.post<{ id: string }>('/api/v1/sprints', {
        skill_id: skillId,
      });
      set({ loading: false });
      return sprint;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return null;
    }
  },

  updateStage: async (sprintId: string, stage: string, progress: number) => {
    try {
      await api.put(`/api/v1/sprint/${sprintId}/stage`, { stage_key: stage, progress });
      // Update local state
      set((state) => ({
        dashboard: state.dashboard
          ? {
              ...state.dashboard,
              sprint: state.dashboard.sprint
                ? { ...state.dashboard.sprint, currentStage: stage, progress }
                : null,
            }
          : null,
      }));
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  },
}));
