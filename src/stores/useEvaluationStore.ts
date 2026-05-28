import { create } from 'zustand';
import { api } from '@/lib/api';
import type { SimMessage } from './useSimulationStore';

export interface EvaluationData {
  overallScore: number;
  summary: string;
  empathy: number;
  clarity: number;
  composure: number;
  listening: number;
  assertiveness: number;
  conflictManagement: number;
  escalationControl: number;
  strengths: string[];
  weaknesses: string[];
  retryRecommendations: string[];
  timelineEvents: {
    timestamp: string;
    event: string;
    type: 'strength' | 'weakness' | 'neutral';
    quote?: string;
  }[];
}

export interface ReplayData {
  simulation: {
    scenarioTitle: string;
    aiCharacterName: string;
    mode: string;
  };
  messages: SimMessage[];
  evaluation: EvaluationData;
}

interface EvaluationStoreState {
  replay: ReplayData | null;
  loading: boolean;
  error: string | null;
  fetchReplay: (sprintId: string, simId: string) => Promise<void>;
}

export const useEvaluationStore = create<EvaluationStoreState>((set) => ({
  replay: null,
  loading: false,
  error: null,

  fetchReplay: async (sprintId, simId) => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<ReplayData>(
        `/api/v1/sprint/${sprintId}/replay/${simId}`
      );
      set({ replay: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
