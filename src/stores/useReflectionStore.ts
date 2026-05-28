import { create } from 'zustand';
import { api } from '@/lib/api';

export interface ReflectionAnalysis {
  self_awareness_level: string;
  encouragement: string;
  emotional_triggers: string[];
  behavior_patterns: string[];
  growth_areas: string[];
  next_focus: string;
}

interface ReflectionStoreState {
  analysis: ReflectionAnalysis | null;
  loading: boolean;
  error: string | null;
  submitReflection: (
    sprintId: string,
    simId: string | null,
    data: { trigger: string; change: string; pattern: string }
  ) => Promise<void>;
  reset: () => void;
}

export const useReflectionStore = create<ReflectionStoreState>((set) => ({
  analysis: null,
  loading: false,
  error: null,

  submitReflection: async (sprintId, simId, data) => {
    set({ loading: true, error: null });
    try {
      const result = await api.post<{ analysis: ReflectionAnalysis }>(
        `/api/v1/sprint/${sprintId}/reflection`,
        { simulation_id: simId, ...data }
      );
      set({ analysis: result.analysis, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  reset: () => {
    set({ analysis: null, loading: false, error: null });
  },
}));
