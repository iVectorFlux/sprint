# Practice domain

Maps **stages** (today’s screens) to **practice block** groups (input / thinking / practice / output).

| File | Role |
|------|------|
| `practice-blocks.ts` | `StageType` → block group |
| `sprint-routes.ts` | Archetype → first stage URL |

Telemetry: `src/lib/telemetry.ts` → `POST /api/v1/telemetry/events`
