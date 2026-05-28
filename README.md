# Lumi6 Skill Lab

An AI-native learning platform that builds human competencies through simulation-based practice. Unlike traditional courses, Lumi6 doesn't teach through videos or readings — it creates personalized, adaptive scenarios where learners practice real skills in realistic contexts, with AI coaching them in real time.

## What it does

Lumi6 takes a learner through an 11-stage sprint for each skill they want to develop:

1. **Primer** — foundational context about the skill and its sub-skills
2. **Micro-skills** — the building blocks broken down with clear what/why/how/pitfall structure
3. **Practice drills** — short, focused exercises matched to the skill type (reflection, analysis, scenario, decision)
4. **Guided simulation** — AI-powered roleplay with real-time coaching hints
5. **Independent simulation** — the same quality of interaction, but without coaching
6. **Replay** — review the full simulation transcript with AI annotations
7. **Reflection** — structured self-analysis of patterns and triggers
8. **Escalated simulation** — a harder version based on identified weaknesses
9. **Assessment** — final competency evaluation
10. **Report** — comprehensive AI-generated competency report with radar charts

## Skills taxonomy

The platform covers 14 core skills across 6 categories, each with 6-8 learnable sub-skills:

- **Human skills** — emotional intelligence, adaptability, communication
- **Cognitive skills** — critical thinking, problem solving, creative thinking, metacognition
- **Technical skills** — AI literacy, system design
- **Strategic skills** — systems thinking, judgment
- **Leadership skills** — influence and negotiation, leadership essentials
- **Business skills** — strategic sales

Each skill uses a specific learning engine type (simulation-based, reflective AI mirror, structured reasoning, consequence simulation, etc.) that determines how drills, simulations, and evaluations are structured.

## Tech stack

- **Frontend**: Next.js, TypeScript, Zustand stores, vanilla CSS design system
- **Backend**: FastAPI (Python), async endpoints
- **AI**: Groq (Llama 3.3 70B) via OpenAI-compatible API, with structured JSON output
- **Database**: Supabase (PostgreSQL + Auth)
- **Design**: DM Sans + Inter typography, academic professional theme

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
```

## Architecture

The AI layer consists of 3 routers:

- `sprint_content.py` — generates primers, micro-skills, scenarios (content generation)
- `sprint_simulation.py` — manages multi-turn AI simulations with embedded coaching
- `sprint_evaluation.py` — drill scoring, reflection analysis, competency reports

All AI calls go through a unified client (`ai/llm.py`) that supports any OpenAI-compatible API (Groq, OpenAI, Together, etc.) with automatic JSON mode.
