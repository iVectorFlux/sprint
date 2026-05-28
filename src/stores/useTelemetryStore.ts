import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TelemetryEvent {
  timestamp: string;
  type: "drill_submit" | "sim_turn" | "stage_enter" | "stage_exit" | "reflection";
  skillSlug: string;
  subSkillSlug: string;
  data: Record<string, unknown>;
}

interface TelemetryState {
  events: TelemetryEvent[];

  /** Record a telemetry event */
  track: (event: Omit<TelemetryEvent, "timestamp">) => void;

  /** Get events for a specific sub-skill */
  getEvents: (skillSlug: string, subSkillSlug: string) => TelemetryEvent[];

  /** Get response time stats for drills */
  getDrillStats: (skillSlug: string, subSkillSlug: string) => {
    avgResponseTime: number;
    avgWordCount: number;
    totalDrills: number;
  };

  /** Clear all telemetry */
  clear: () => void;
}

export const useTelemetryStore = create<TelemetryState>()(
  persist(
    (set, get) => ({
      events: [],

      track: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            { ...event, timestamp: new Date().toISOString() },
          ],
        })),

      getEvents: (skillSlug, subSkillSlug) =>
        get().events.filter(
          (e) => e.skillSlug === skillSlug && e.subSkillSlug === subSkillSlug
        ),

      getDrillStats: (skillSlug, subSkillSlug) => {
        const drills = get().events.filter(
          (e) =>
            e.skillSlug === skillSlug &&
            e.subSkillSlug === subSkillSlug &&
            e.type === "drill_submit"
        );
        if (drills.length === 0) {
          return { avgResponseTime: 0, avgWordCount: 0, totalDrills: 0 };
        }
        const totalTime = drills.reduce(
          (sum, e) => sum + ((e.data.responseTimeMs as number) || 0),
          0
        );
        const totalWords = drills.reduce(
          (sum, e) => sum + ((e.data.wordCount as number) || 0),
          0
        );
        return {
          avgResponseTime: Math.round(totalTime / drills.length),
          avgWordCount: Math.round(totalWords / drills.length),
          totalDrills: drills.length,
        };
      },

      clear: () => set({ events: [] }),
    }),
    {
      name: "lumi6-telemetry",
    }
  )
);
