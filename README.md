# Lumi6 Skill Lab

An AI-native platform for **building human competencies through deliberate practice**—not passive courses. Learners work through skill sprints with realistic scenarios, structured reasoning, and reflection, with AI coaching where the skill demands live interaction.

## Product direction

**Vocabulary (read first):** [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — skill, sprint, archetype, stage, goal matching.

Lumi6 is evolving along two tracks (see **[futureplan.md](./futureplan.md)** for the full roadmap):

### 1. Practice engine (what ships today)

**Today:** Pick a **skill** from the catalog → run a **sprint** → follow **stages** (primer, drills, simulation, report, …) chosen by the skill’s **archetype** (6 practice formats).

**Dashboard:** Describe a goal → **goal matching** suggests catalog skills (no random filler).

**Later:** Custom **practice plans** (ordered practice blocks) built by a Copilot—not a second “lab” app.

### 2. Human Development Graph (longitudinal moat)

**Vision:** Every lab, drill, and simulation feeds a structured **learner model** (traits, patterns, skill history, confidence—with evidence). An **event-driven growth layer** recommends the next practice, pathway, and light-touch nudges (email, push, Slack).

- Value is **remembering who this person is over months**, not generating more generic content.
- Cost stays manageable when the system **wakes on events** (sim completed, report ready, inactivity)—not always-on chat.

**Positioning:** Lumi6 is a **practice platform** with agents in the pockets where dialogue or discovery *is* the skill, plus a longitudinal layer that gets smarter about *you*—not an LMS with a bot that writes lessons.

---

## What it does today

### How a sprint works

Each **skill** uses one **archetype** (practice format):

### Archetype-based sprints

Skills are grouped into practice formats:

| Archetype | Practice focus | Example skills |
|-----------|----------------|----------------|
| **Conversational** | AI roleplay, pushback, escalation | Communication, influence, leadership, sales |
| **Analytical** | Reasoning workspace (assumptions, evidence, counterfactuals) | Critical thinking, problem solving, judgment |
| **Reflective** | Guided journaling, patterns, growth plan | Emotional intelligence, metacognition, adaptability |
| **Creation / Performance / Systems** | Stubs (primer → concepts → report) | AI literacy, system design, systems thinking |

### Conversational flow (reference)

1. **Primer** — context and sub-skills  
2. **Micro-skills** — building blocks  
3. **Drills** — scenario, analysis, reflection, or decision exercises  
4. **Guided simulation** — roleplay with coaching hints  
5. **Independent simulation** — same interaction, no hints  
6. **Replay** — transcript review  
7. **Reflection** — self-analysis  
8. **Escalated simulation** — harder scenario  
9. **Report** — AI competency summary  

Analytical and reflective archetypes use different stage sets (e.g. reasoning workspace or guided reflection instead of full simulation chain).

### Skills taxonomy

~15 skills across human, cognitive, strategic, leadership, business, and technical categories, each with 6–8 sub-skills. Source: `src/data/skills-taxonomy.ts`.

---

## Tech stack

- **Frontend:** Next.js, TypeScript, Zustand, CSS design system  
- **Backend:** FastAPI (Python), async endpoints  
- **AI:** Groq (Llama 3.3 70B) via OpenAI-compatible API, structured JSON where possible  
- **Database:** Supabase (PostgreSQL + Auth, pgvector for memory)  
- **Design:** DM Sans + Inter, academic professional theme  

---

## Getting started

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
pip install openai
uvicorn app.main:app --reload --port 8000
```

### Environment

Copy `backend/.env.example` to `backend/.env` and add:

```
GROQ_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

Simulation roleplay sessions are stored in **Upstash Redis** (see `backend/.env.example`). Without Redis, the API falls back to in-memory sessions (lost on restart).

---

## Architecture (current)

| Router | Responsibility |
|--------|----------------|
| `sprint_content.py` | Primer, micro-skills, drills, scenarios, reasoning challenges, reflection prompts |
| `sprint_simulation.py` | Multi-turn simulations (session state, coaching telemetry) |
| `sprint_evaluation.py` | Drill scoring, reflection analysis, competency reports |

Supporting pieces:

- `backend/app/ai/archetypes.py` — stage flows and evaluation dimensions per archetype  
- `src/hooks/useArchetypeFlow.ts` — frontend stage navigation  
- `user_profiles` + `memory_nodes` (SQL) — planned home for the Human Development Graph  

All AI calls go through `backend/app/ai/llm.py` (OpenAI-compatible APIs).

---

## Documentation

- **[AGENTS.md](./AGENTS.md)** — **Start here for AI coding agents** (task → files map, token-saving rules)
- **[futureplan.md](./futureplan.md)** — Product roadmap (`@futureplan.md` in Cursor; excluded from default index via `.cursorignore`)

---

## License

See repository license file if present.
