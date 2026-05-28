"""
Sprint evaluation, reflection, report, replay, and stage management endpoints.
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional

from app.db import get_supabase
from app.ai.llm import chat_completion_json
from app.ai.prompts import (
    drill_evaluation_prompt,
    reflection_analysis_prompt,
    report_generation_prompt,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _auth_user(authorization: str) -> str:
    """Verify auth and return user_id."""
    supabase = get_supabase()
    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user.user.id


async def _get_user_context(user_id: str) -> dict:
    supabase = get_supabase()
    profile = (
        supabase.table("users")
        .select("role, department, seniority")
        .eq("id", user_id)
        .single()
        .execute()
    )
    data = profile.data or {}
    return {
        "role": data.get("role") or "Professional",
        "industry": "Corporate",
        "seniority": data.get("seniority") or "Mid-level",
    }


async def _verify_sprint(sprint_id: str, user_id: str) -> dict:
    supabase = get_supabase()
    result = (
        supabase.table("sprints")
        .select("*, skills!primary_skill_id(name)")
        .eq("id", sprint_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Sprint not found")
    return result.data


# ---------------------------------------------------------------------------
# POST /{sprint_id}/drill/evaluate — AI-scored drill response
# ---------------------------------------------------------------------------

class DrillEvaluateRequest(BaseModel):
    userResponse: str
    drillPrompt: str
    expectedBehavior: str


@router.post("/{sprint_id}/drill/evaluate")
async def evaluate_drill(
    sprint_id: str,
    body: DrillEvaluateRequest,
    authorization: str = Header(...),
):
    user_id = await _auth_user(authorization)
    await _verify_sprint(sprint_id, user_id)

    system, user = drill_evaluation_prompt(
        body.drillPrompt,
        body.userResponse,
        body.expectedBehavior,
    )
    result = await chat_completion_json(system, user, temperature=0.5, max_tokens=512)

    # Ensure required fields
    if "score" not in result:
        result = {"score": 50, "isGood": False, "feedback": "Unable to evaluate. Please try again."}
    result.setdefault("isGood", result.get("score", 0) >= 60)

    return result


# ---------------------------------------------------------------------------
# POST /{sprint_id}/reflection — AI reflection analysis
# ---------------------------------------------------------------------------

class ReflectionRequest(BaseModel):
    simulation_id: Optional[str] = None
    trigger: str
    change: str
    pattern: str


@router.post("/{sprint_id}/reflection")
async def analyze_reflection(
    sprint_id: str,
    body: ReflectionRequest,
    authorization: str = Header(...),
):
    user_id = await _auth_user(authorization)
    sprint = await _verify_sprint(sprint_id, user_id)

    skill_name = "Communication"
    if sprint.get("skills"):
        skill_name = sprint["skills"].get("name", skill_name)

    system, user = reflection_analysis_prompt(
        body.trigger,
        body.change,
        body.pattern,
        skill_name,
    )
    result = await chat_completion_json(system, user, temperature=0.6, max_tokens=1024)

    if not result.get("self_awareness_level"):
        result = {
            "self_awareness_level": "Developing",
            "emotional_triggers": ["authority challenge", "credibility questioning"],
            "behavior_patterns": ["defensive response", "over-explanation"],
            "growth_areas": ["Active listening under pressure", "Pausing before responding"],
            "encouragement": "Your willingness to reflect is itself a sign of growth.",
            "next_focus": "Focus on staying composed when your credibility is challenged.",
        }

    return {"analysis": result}


# ---------------------------------------------------------------------------
# GET /{sprint_id}/report — AI competency report
# ---------------------------------------------------------------------------

@router.get("/{sprint_id}/report")
async def get_report(
    sprint_id: str,
    authorization: str = Header(...),
):
    user_id = await _auth_user(authorization)
    sprint = await _verify_sprint(sprint_id, user_id)
    user_ctx = await _get_user_context(user_id)

    skill_name = "Communication"
    if sprint.get("skills"):
        skill_name = sprint["skills"].get("name", skill_name)

    supabase = get_supabase()

    # Fetch all simulation attempts for this sprint
    sims = (
        supabase.table("simulations")
        .select("id")
        .eq("sprint_id", sprint_id)
        .execute()
    )
    sim_ids = [s["id"] for s in (sims.data or [])]

    evaluations = []
    if sim_ids:
        attempts = (
            supabase.table("simulation_attempts")
            .select("evaluation, score")
            .in_("simulation_id", sim_ids)
            .eq("user_id", user_id)
            .order("created_at")
            .execute()
        )
        evaluations = [a.get("evaluation", {}) for a in (attempts.data or []) if a.get("evaluation")]

    # Generate AI report
    system, user = report_generation_prompt(skill_name, evaluations, [], user_ctx)
    report = await chat_completion_json(system, user, temperature=0.6, max_tokens=3000)

    if not report.get("readiness_score"):
        report["readiness_score"] = 65
        report["readiness_label"] = "developing"

    # Save report to DB
    try:
        supabase.table("reports").insert({
            "user_id": user_id,
            "sprint_id": sprint_id,
            "report_type": "sprint_completion",
            "summary": report,
            "strengths": report.get("top_strengths"),
            "weaknesses": report.get("critical_weaknesses"),
            "recommendations": report.get("recommendations"),
        }).execute()
    except Exception:
        pass  # Non-critical

    return {
        "report": report,
        "sprint": {
            "id": sprint_id,
            "hoursCompleted": sprint.get("completed_hours", 0) or 0,
            "progress": 100,
            "simulationsCompleted": len(evaluations),
            "evaluationsCount": len(evaluations),
            "reflectionsCount": 1,
        },
    }


# ---------------------------------------------------------------------------
# GET /{sprint_id}/replay/{sim_id} — Replay data for a simulation
# ---------------------------------------------------------------------------

@router.get("/{sprint_id}/replay/{sim_id}")
async def get_replay(
    sprint_id: str,
    sim_id: str,
    authorization: str = Header(...),
):
    user_id = await _auth_user(authorization)
    await _verify_sprint(sprint_id, user_id)

    supabase = get_supabase()

    # Fetch simulation record
    sim = (
        supabase.table("simulations")
        .select("*")
        .eq("id", sim_id)
        .eq("sprint_id", sprint_id)
        .single()
        .execute()
    )
    if not sim.data:
        raise HTTPException(status_code=404, detail="Simulation not found")

    # Fetch latest attempt with evaluation
    attempt = (
        supabase.table("simulation_attempts")
        .select("*")
        .eq("simulation_id", sim_id)
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    attempt_data = (attempt.data or [None])[0]

    # Parse transcript into messages
    messages = []
    if attempt_data and attempt_data.get("transcript"):
        for line in attempt_data["transcript"].split("\n"):
            if line.startswith("USER: "):
                messages.append({"id": f"msg-{len(messages)}", "role": "user", "content": line[6:]})
            elif line.startswith("AI: "):
                messages.append({"id": f"msg-{len(messages)}", "role": "assistant", "content": line[4:]})

    context = sim.data.get("context") or {}

    return {
        "simulation": {
            "id": sim_id,
            "scenarioTitle": sim.data.get("scenario") or context.get("title", "Simulation"),
            "aiCharacterName": context.get("aiCharacterName", "AI Character"),
            "mode": sim.data.get("simulation_type", "guided"),
            "difficulty": sim.data.get("difficulty_level", 2),
        },
        "messages": messages,
        "evaluation": attempt_data.get("evaluation") if attempt_data else None,
    }


# ---------------------------------------------------------------------------
# PUT /{sprint_id}/stage — Update sprint stage progress
# ---------------------------------------------------------------------------

class UpdateStageRequest(BaseModel):
    stage_key: str
    progress: int = 0


@router.put("/{sprint_id}/stage")
async def update_stage(
    sprint_id: str,
    body: UpdateStageRequest,
    authorization: str = Header(...),
):
    user_id = await _auth_user(authorization)
    await _verify_sprint(sprint_id, user_id)

    supabase = get_supabase()

    # Update sprint current stage
    supabase.table("sprints").update({
        "current_stage": body.stage_key,
        "status": "active",
    }).eq("id", sprint_id).execute()

    # Mark current stage as active, previous as completed
    # Get all stages
    stages = (
        supabase.table("sprint_stages")
        .select("id, stage_key, status")
        .eq("sprint_id", sprint_id)
        .order("sequence_number" if "sequence_number" in "" else "created_at")
        .execute()
    )

    if stages.data:
        found = False
        for stage in stages.data:
            if stage["stage_key"] == body.stage_key:
                found = True
                supabase.table("sprint_stages").update({
                    "status": "active",
                }).eq("id", stage["id"]).execute()
            elif not found:
                supabase.table("sprint_stages").update({
                    "status": "completed",
                }).eq("id", stage["id"]).execute()

    return {"stage": body.stage_key, "progress": body.progress}
