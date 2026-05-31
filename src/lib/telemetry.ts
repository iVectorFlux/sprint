import { api } from '@/lib/api'
import type { PracticeTelemetryPayload } from '@/types/telemetry'

/**
 * Record a practice telemetry event (Phase 2 — Challenge Graph + HDG input).
 */
export async function emitPracticeEvent(
  payload: PracticeTelemetryPayload & { event_type: PracticeTelemetryPayload['event_type'] }
): Promise<void> {
  try {
    await api.post('/api/v1/telemetry/events', payload)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[telemetry]', payload.event_type, err)
    }
  }
}
