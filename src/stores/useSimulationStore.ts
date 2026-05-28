import { create } from 'zustand';
import { api } from '@/lib/api';

export interface SimMessage {
  id: string;
  role: 'user' | 'assistant' | 'coach_hint' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SimState {
  trust_level: number;
  stress_level: number;
  escalation_risk: number;
  turn_count: number;
}

export interface TurnScores {
  empathy: number;
  clarity: number;
  composure: number;
  listening: number;
}

interface SimulationStoreState {
  messages: SimMessage[];
  state: SimState | null;
  coachHints: string[];
  lastTurnScores: TurnScores | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  simulationId: string | null;

  startSimulation: (
    sprintId: string,
    scenarioId: string,
    mode: 'guided' | 'independent' | 'escalated' | 'final'
  ) => Promise<void>;
  sendMessage: (sprintId: string, content: string) => Promise<void>;
  endSimulation: (sprintId: string) => Promise<unknown>;
  reset: () => void;
}

export const useSimulationStore = create<SimulationStoreState>((set, get) => ({
  messages: [],
  state: null,
  coachHints: [],
  lastTurnScores: null,
  loading: false,
  sending: false,
  error: null,
  simulationId: null,

  startSimulation: async (sprintId, scenarioId, mode) => {
    set({ loading: true, error: null, messages: [], state: null, coachHints: [], lastTurnScores: null });
    try {
      const data = await api.post<{
        simulationId: string;
        messages: SimMessage[];
        state: SimState;
      }>(`/api/v1/sprint/${sprintId}/simulation/start`, {
        scenario_id: scenarioId,
        mode,
      });
      set({
        simulationId: data.simulationId,
        messages: data.messages || [],
        state: data.state || null,
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  sendMessage: async (sprintId, content) => {
    const { simulationId, messages } = get();
    if (!simulationId) return;

    // Optimistically add user message
    const userMsg: SimMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };
    set({ sending: true, messages: [...messages, userMsg] });

    try {
      const data = await api.post<{
        message: SimMessage;
        state: SimState;
        coachHint?: string;
        turnScores?: TurnScores;
      }>(`/api/v1/sprint/${sprintId}/simulation/message`, {
        simulation_id: simulationId,
        content,
      });

      set((s) => ({
        messages: [...s.messages, data.message],
        state: data.state || s.state,
        coachHints: data.coachHint
          ? [...s.coachHints, data.coachHint]
          : s.coachHints,
        lastTurnScores: data.turnScores || s.lastTurnScores,
        sending: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, sending: false });
    }
  },

  endSimulation: async (sprintId) => {
    const { simulationId } = get();
    if (!simulationId) return null;
    try {
      const data = await api.post(`/api/v1/sprint/${sprintId}/simulation/end`, {
        simulation_id: simulationId,
      });
      return data;
    } catch (err) {
      set({ error: (err as Error).message });
      return null;
    }
  },

  reset: () => {
    set({
      messages: [],
      state: null,
      coachHints: [],
      lastTurnScores: null,
      loading: false,
      sending: false,
      error: null,
      simulationId: null,
    });
  },
}));
