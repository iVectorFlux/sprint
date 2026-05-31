# Lumi6 — Architecture & vocabulary

**Read this first** if terms like *sprint*, *archetype*, *primitive*, or *capability* feel overlapping. This doc is the single glossary for product and code.

---

## One sentence

**Lumi6 helps you practice real skills through guided sprints; we match what you want to learn to the right skill in the catalog, then run the practice flow that fits that skill’s type.**

---

## Simple mental model (5 terms)

```text
You describe a goal
       ↓
Goal matching  →  picks Skills from the catalog (+ practice patterns)
       ↓
Sprint  →  one practice journey for a skill
       ↓
Archetype  →  which *kind* of practice (conversation vs analysis vs reflection…)
       ↓
Stages  →  the actual screens you step through (primer, drills, simulation, report…)
```

| Term | Plain English | In the app today |
|------|----------------|------------------|
| **Skill** | A capability in the catalog (e.g. Communication, Critical Thinking) | Skills Catalog, taxonomy |
| **Sprint** | One run of practice for a skill (or sub-skill) | `/dashboard/sprint/[id]` |
| **Archetype** | The *format* of practice—6 types, shared by many skills | Drives which stages appear |
| **Stage** | One step in a sprint (a screen) | `primer`, `drills`, `simulation`, `report`, … |
| **Practice pattern** | A small cognitive ability (e.g. “evidence evaluation”) shared across skills | Shown when you search; used for matching |

**Product name:** “Lumi6” or “Lumi6 Skill Lab” is branding only—not a separate code module.

---

## What we removed from day-to-day language

| Old / confusing term | What it actually was | Use instead |
|----------------------|----------------------|-------------|
| **Skill Lab** (feature) | Experimental “lab” UI with composable plans | **Sprint** (today’s product) |
| **Capability graph** | Catalog + practice patterns | **Skill catalog** + **goal matching** |
| **Capability resolver** | Code that maps your text → skills | **Goal matching** (`src/domain/goal-matching/`) |
| **Skill DNA** | Metadata: which practice patterns each skill trains | **Practice patterns** (code: `skill-dna.ts`) |
| **Primitive** | Future Lego block for custom plans (not shipped) | **Stage** (today) or **practice block** (future) |
| **Learning Plan** | Future ordered list of practice blocks | **Sprint flow** (today) or **custom plan** (future) |

---

## Archetype (the 6 practice formats)

An **archetype** is not a skill—it is the **engine** that decides which stages you get.

| Archetype | You mostly… | Example skills |
|-----------|-------------|----------------|
| `conversational` | Roleplay, dialogue, pushback | Communication, Negotiation |
| `analytical` | Reasoning, evidence, assumptions | Critical Thinking, Problem Solving |
| `reflective` | Guided reflection, patterns | Emotional Intelligence, Metacognition |
| `systems` | Maps, loops, dependencies | Systems Thinking, System Design |
| `creation` / `performance` | Stubs today | AI Literacy, etc. |

**Rule:** ~100 skills → **6 archetypes** → same stage *families*, different AI content.

---

## Sprint vs “My Sprints”

| | Sprint (route) | My Sprints (page) |
|--|----------------|-------------------|
| **What** | The practice experience | Your list of saved runs |
| **URL** | `/dashboard/sprint/communication` or `/dashboard/sprint/uuid` | `/dashboard/sprints` |
| **ID** | Skill slug (`communication`) or DB id | Row in `sprints` table |

---

## Goal matching (dashboard composer)

When you type *“GEO vs SEO budget meeting”*:

1. **Practice patterns** inferred (e.g. trade-off analysis, judgment, strategic thinking).
2. **Skills** ranked (e.g. Judgment, Communication).
3. You start a **sprint** for that skill.

If nothing matches → we say so (no random catalog filler). Custom topics are a **future** phase (~10% “novel goals” in `futureplan.md`).

---

## Future (not in the main app yet)

| Future term | Meaning |
|-------------|---------|
| **Practice block** | Reusable step type (read, drill, sim)—replaces overloaded “primitive” |
| **Custom plan** | Agent-built sequence of blocks for a specific goal |
| **Lumi6 practice planner** | Future in-product planner for custom plans — **not Microsoft Copilot** |
| **Challenge** | A workplace situation tracked over time (Challenge Graph) |
| **Growth graph** | Long-term learner model (events, recommendations) |

### Personalization (drills & scenarios)

AI-generated **drills** and **simulation scenarios** use `backend/app/services/learner_context.py`:

- Profile (`users` + `user_profiles`)
- Active goals (`user_challenges` from dashboard composer)
- Recent insights (`memory_nodes`)
- Recent practice (`telemetry_events`)

Restart the API after deploy; cache is **per user** so content is not shared between learners.

### Simulation sessions (Upstash Redis)

Live roleplay state (messages, trust/stress telemetry) is stored in **Upstash Redis** via REST (`UPSTASH_REDIS_REST_*` in `backend/.env`). TTL default 4 hours. Without Redis, the API uses in-memory fallback (dev only).

Details: `futureplan.md`.

---

## Codebase map (where things live)

```text
src/
  app/(dashboard)/dashboard/
    sprint/[id]/          ← Sprint UI (stages under (stages)/)
    catalog/              ← Browse skills
    sprints/              ← List saved sprints
    page.tsx              ← Dashboard + LearningComposer
  domain/                 ← Business logic (no React)
    goal-matching/        ← Match text → skills + patterns
    README.md
  data/
    skills-taxonomy.ts    ← Skill catalog (source of truth)
  types/
    index.ts              ← Archetypes, stage types, flows
  hooks/
    useSprintContext.ts   ← Parse sprint URL → skill
    useArchetypeFlow.ts   ← Stage navigation
  components/sprint/      ← Sprint shell, buttons
  lib/
    slug.ts               ← URL slugs (server + client safe)
    api.ts                ← Backend client

backend/app/
  ai/archetypes.py        ← Archetype → prompts, eval dimensions
  routers/
    sprint_content.py     ← Generate primer, drills, etc.
    sprint_simulation.py  ← Multi-turn roleplay agent
    sprint_evaluation.py  ← Reports

supabase/migrations/      ← DB schema
docs/ARCHITECTURE.md      ← This file
AGENTS.md                 ← AI agent task → file map
futureplan.md             ← Roadmap (strategy)
```

---

## Rules for new code

1. **UI** → `src/app/` or `src/components/`
2. **Business rules** (matching, scoring, DNA) → `src/domain/`
3. **Catalog data** → `src/data/`
4. **Shared types** → `src/types/`
5. **Do not** add a second parallel “lab” route without updating this doc.
6. Prefer **stage** in UI copy; **practice block** only for future composable engine.

---

*Last updated: May 2026*
