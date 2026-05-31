# Lumi6 Skill Lab — Agent guide (read this first)

**Goal:** Minimize exploration tokens. Open only the files listed for your task.

## Next.js note

This repo may use a non-standard Next.js version. Before changing routing or server APIs, check `node_modules/next/dist/docs/` for current conventions.

## Stack

| Layer | Path |
|-------|------|
| Frontend | `src/app/`, `src/components/`, `src/hooks/`, `src/stores/` |
| API client | `src/lib/api.ts` |
| Taxonomy (skills) | `src/data/skills-taxonomy.ts` |
| Types + stage flows | `src/types/index.ts` |
| Backend | `backend/app/` |
| DB migrations | `supabase/migrations/` |
| Product roadmap | `@futureplan.md` (not indexed — mention explicitly) |

## Architecture in 30 seconds

- **Skill** → **archetype** (`conversational` \| `analytical` \| `reflective` \| …) → ordered **stages**.
- **Sprint URL:** `/dashboard/sprint/[id]` where `id` = skill slug or `skill--sub-skill` (see `useSprintContext`).
- **Stage nav:** `useArchetypeFlow` + `ARCHETYPE_STAGE_NAV` in `src/types/index.ts`.
- **AI content:** `backend/app/routers/sprint_content.py`
- **AI simulation (multi-turn agent):** `backend/app/routers/sprint_simulation.py`
- **AI evaluation / reports:** `backend/app/routers/sprint_evaluation.py`
- **Archetype config (backend):** `backend/app/ai/archetypes.py`
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
| DB schema | `supabase/migrations/00*.sql` (pick one file) |
| LLM client | `backend/app/ai/llm.py` |

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
- Simulation sessions are **in-memory** in `sprint_simulation.py` (`_sessions`) — Redis planned.

## Token tips for agents

1. Grep for a symbol before opening large files.
2. Edit `prompts/shared.py` (or one archetype module), not the whole prompts tree.
3. Use `@AGENTS.md` + one task row from the table above.
4. For product direction, `@futureplan.md` — not for routine bugfixes.
