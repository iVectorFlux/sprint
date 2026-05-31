# Lumi6 — Agent guide (read this first)

**Goal:** Minimize exploration tokens. Open only the files listed for your task.

**Vocabulary:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — what *skill*, *sprint*, *archetype*, *stage* mean (ignore overloaded terms like “primitive” unless `futureplan.md`).

## Next.js note

This repo may use a non-standard Next.js version. Before changing routing or server APIs, check `node_modules/next/dist/docs/` for current conventions.

## Stack

| Layer | Path |
|-------|------|
| Frontend UI | `src/app/`, `src/components/` |
| Business logic | `src/domain/` |
| Skill catalog | `src/data/skills-taxonomy.ts` |
| Types + stage flows | `src/types/index.ts` |
| Hooks (sprint context, nav) | `src/hooks/` |
| API client | `src/lib/api.ts` |
| Backend | `backend/app/` |
| DB migrations | `supabase/migrations/` |
| Product roadmap | `@futureplan.md` (not indexed — mention explicitly) |

## Architecture in 30 seconds

```text
Goal text → domain/goal-matching → Skill from catalog
Skill → Archetype (6 types) → ordered Stages (screens)
Sprint URL: /dashboard/sprint/[slug or uuid]
```

- **Stage nav:** `useArchetypeFlow` + `ARCHETYPE_STAGE_NAV` in `src/types/index.ts`
- **AI content:** `backend/app/routers/sprint_content.py`
- **AI simulation:** `backend/app/routers/sprint_simulation.py`
- **AI evaluation:** `backend/app/routers/sprint_evaluation.py`
- **Archetype config:** `backend/app/ai/archetypes.py`
- **Prompts:** `backend/app/ai/prompts/` — **one module only** (see `prompts/README.md`)

## Task → files (open these only)

| Task | Files |
|------|--------|
| Fix sprint stage UI / navigation | `src/hooks/useArchetypeFlow.ts`, `src/hooks/useSprintContext.ts`, `src/components/sprint/SprintFlowLayout.tsx`, relevant `src/app/.../(stages)/*/page.tsx` |
| Primer / micro-skills content | `(stages)/primer/page.tsx`, `(stages)/micro-skills/page.tsx`, `sprint_content.py`, `prompts/shared.py` |
| Drills | `(stages)/drills/page.tsx`, `src/lib/drills/fallback-drills.ts`, `sprint_content.py`, `prompts/shared.py`, `prompts/evaluation.py` |
| Simulation / roleplay | `(stages)/simulation/**`, `sprint_simulation.py`, `prompts/conversational.py` |
| Reasoning workspace | `(stages)/reasoning/page.tsx`, `useReasoningStore.ts`, `sprint_content.py`, `prompts/analytical.py` |
| Guided reflection | `(stages)/guided-reflection/page.tsx`, `prompts/reflective.py` |
| Reports / assessment | `(stages)/report/page.tsx`, `(stages)/assessment/page.tsx`, `sprint_evaluation.py`, `prompts/evaluation.py` |
| Add / change skill catalog | `src/data/skills-taxonomy.ts` |
| Goal matching (text → skills) | `src/domain/goal-matching/` |
| Dashboard composer | `src/components/dashboard/LearningComposer.tsx` |
| URL slugs (server-safe) | `src/lib/slug.ts` |
| DB schema | `supabase/migrations/00*.sql` (pick one file) |
| LLM client | `backend/app/ai/llm.py` |
| Telemetry events | `backend/app/routers/telemetry.py`, `src/lib/telemetry.ts` |
| User challenges | `backend/app/routers/challenges.py`, `src/types/challenge.ts` |
| Practice blocks / stage URLs | `src/domain/practice/` |
| Sprint create (archetype stages) | `backend/app/routers/sprints.py` |
| Personalized drills/scenarios context | `backend/app/services/learner_context.py` |

## Do NOT read by default

| Path | Why |
|------|-----|
| `backend/app/ai/prompts/*.py` (all modules) | Open **one** module per task |
| `src/lib/drills/fallback-drills.ts` | Static copy only; skip unless changing fallbacks |
| `futureplan.md` | Strategy only when asked |
| `package-lock.json` | Huge |
| All migration files at once | Open the one you need |

## Stage routes (under `sprint/[id]/(stages)/`)

| Segment | Purpose |
|---------|---------|
| `primer` | Intro cards |
| `micro-skills` | Sub-skill teaching |
| `drills` | Written exercises |
| `simulation/guided` \| `independent` \| `escalated` | Roleplay |
| `reasoning` | Analytical workspace |
| `guided-reflection` | Reflective flow |
| `reflection` | Post-sim reflection |
| `replay` | Transcript review |
| `report` | Competency report |

## Backend routers (`backend/app/main.py` mounts)

- `sprint_content` — `/api/v1/sprint/content/*`
- `sprint_simulation` — `/api/v1/sprint/{id}/simulation/*`
- `sprint_evaluation` — eval + reports
- `sprints`, `skills`, `users`

## Conventions

- Prefer **small diffs**; match existing patterns in the file you edit.
- Frontend sprint pages are `"use client"`; they call `api` from `@/lib/api`.
- Taxonomy is source of truth for **slug** sprints; DB sprints API exists but UI often uses slugs.
- Simulation sessions: **Upstash Redis** via `backend/app/services/simulation_session_store.py` (in-memory fallback if env unset).
- Put new **business logic** in `src/domain/`, not in components.

## Token tips for agents

1. Grep for a symbol before opening large files.
2. Edit `prompts/shared.py` (or one archetype module), not the whole prompts tree.
3. Use `@AGENTS.md` + `@docs/ARCHITECTURE.md` for vocabulary.
4. For product direction, `@futureplan.md` — not for routine bugfixes.
