"""Sprint content generation API — archetype-aware primer, micro-skills, scenarios, reasoning challenges, reflection prompts."""

from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
from typing import Optional

from app.db import get_supabase
from app.ai.llm import chat_completion_json
from app.ai.archetypes import resolve_archetype, archetype_from_skill
from app.ai.prompts import (
    primer_cards_prompt,
    micro_skills_prompt,
    drills_prompt,
    scenarios_prompt,
    reasoning_challenge_prompt,
    guided_reflection_prompt,
    pattern_detection_prompt,
    growth_plan_prompt,
    reflection_entry_analysis_prompt,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

async def _get_user_context(authorization: str) -> dict:
    """Extract user context (role, industry, seniority) from auth token."""
    supabase = get_supabase()
    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    profile = (
        supabase.table("users")
        .select("role, department, seniority, country")
        .eq("id", user.user.id)
        .single()
        .execute()
    )
    data = profile.data or {}
    return {
        "user_id": user.user.id,
        "role": data.get("role") or "Professional",
        "department": data.get("department") or "General",
        "seniority": data.get("seniority") or "Mid-level",
        "industry": "Corporate",
    }


async def _get_skill_info(skill_id: str) -> tuple[str, list[str], str]:
    """Get skill name, sub-skill names, and archetype."""
    supabase = get_supabase()
    skill = supabase.table("skills").select("name, archetype").eq("id", skill_id).single().execute()
    if not skill.data:
        raise HTTPException(status_code=404, detail="Skill not found")

    sub_skills = (
        supabase.table("sub_skills")
        .select("name")
        .eq("skill_id", skill_id)
        .order("difficulty_level")
        .execute()
    )
    sub_skill_names = [s["name"] for s in (sub_skills.data or [])]
    archetype = archetype_from_skill(skill.data)
    return skill.data["name"], sub_skill_names, archetype


# ---------------------------------------------------------------------------
# GET /primer — Archetype-aware primer cards
# ---------------------------------------------------------------------------

@router.get("/primer")
async def generate_primer(
    skill_id: str = Query(...),
    authorization: str = Header(...),
):
    """AI-generate primer cards styled for the skill's archetype."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills, archetype = await _get_skill_info(skill_id)

    system, user = primer_cards_prompt(skill_name, sub_skills, ctx, archetype)
    result = await chat_completion_json(system, user, temperature=0.8)

    if not result.get("cards"):
        raise HTTPException(status_code=502, detail="AI failed to generate primer cards")

    return result


# ---------------------------------------------------------------------------
# GET /micro-skills — Archetype-aware micro-skill breakdowns
# ---------------------------------------------------------------------------

@router.get("/micro-skills")
async def generate_micro_skills(
    skill_id: str = Query(...),
    authorization: str = Header(...),
):
    """AI-generate micro-skill breakdowns styled for the skill's archetype."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills, archetype = await _get_skill_info(skill_id)

    system, user = micro_skills_prompt(skill_name, sub_skills, ctx, archetype)
    result = await chat_completion_json(system, user, temperature=0.7)

    if not result.get("microSkills"):
        raise HTTPException(status_code=502, detail="AI failed to generate micro-skills")

    return result


# ---------------------------------------------------------------------------
# GET /drills — Archetype-aware drills
# ---------------------------------------------------------------------------

@router.get("/drills")
async def generate_drills(
    skill_id: str = Query(...),
    authorization: str = Header(...),
):
    """AI-generate practice drills appropriate for the skill's archetype."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills, archetype = await _get_skill_info(skill_id)

    system, user = drills_prompt(skill_name, sub_skills, ctx, archetype)
    result = await chat_completion_json(system, user, temperature=0.8)

    if not result.get("drills"):
        raise HTTPException(status_code=502, detail="AI failed to generate drills")

    return result


# ---------------------------------------------------------------------------
# GET /scenarios — Conversational archetype: scenario generation
# ---------------------------------------------------------------------------

@router.get("/scenarios")
async def generate_scenarios(
    skill_id: str = Query(...),
    mode: str = Query("guided"),
    authorization: str = Header(...),
):
    """AI-generate contextual simulation scenarios (conversational archetype only)."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills, archetype = await _get_skill_info(skill_id)

    if archetype != "conversational":
        raise HTTPException(
            status_code=400,
            detail=f"Scenarios are only available for conversational skills. This skill uses the '{archetype}' archetype."
        )

    system, user = scenarios_prompt(skill_name, sub_skills, ctx, mode)
    result = await chat_completion_json(system, user, temperature=0.9)

    if not result.get("scenarios"):
        raise HTTPException(status_code=502, detail="AI failed to generate scenarios")

    return result


# ---------------------------------------------------------------------------
# GET /reasoning-challenge — Analytical archetype: reasoning workspace challenge
# ---------------------------------------------------------------------------

@router.get("/reasoning-challenge")
async def generate_reasoning_challenge(
    skill_id: str = Query(...),
    mode: str = Query("assumptions"),  # assumptions | evidence | counterfactual
    authorization: str = Header(...),
):
    """AI-generate a reasoning workspace challenge (analytical archetype only)."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills, archetype = await _get_skill_info(skill_id)

    if archetype != "analytical":
        raise HTTPException(
            status_code=400,
            detail=f"Reasoning challenges are only available for analytical skills. This skill uses the '{archetype}' archetype."
        )

    system, user = reasoning_challenge_prompt(skill_name, sub_skills, ctx, mode)
    result = await chat_completion_json(system, user, temperature=0.8)

    if not result.get("challenge_type"):
        raise HTTPException(status_code=502, detail="AI failed to generate reasoning challenge")

    return result


# ---------------------------------------------------------------------------
# POST /reasoning-challenge/evaluate — Analytical archetype: evaluate submission
# ---------------------------------------------------------------------------

class ReasoningSubmission(BaseModel):
    skill_id: str
    challenge_type: str
    challenge: dict
    user_response: dict


@router.post("/reasoning-challenge/evaluate")
async def evaluate_reasoning(
    body: ReasoningSubmission,
    authorization: str = Header(...),
):
    """Evaluate a user's analytical reasoning workspace submission."""
    from app.ai.prompts import reasoning_evaluation_prompt

    ctx = await _get_user_context(authorization)
    skill_name, _, _ = await _get_skill_info(body.skill_id)

    system, user = reasoning_evaluation_prompt(
        skill_name,
        body.challenge_type,
        body.challenge,
        body.user_response,
    )
    result = await chat_completion_json(system, user, temperature=0.5, max_tokens=1500)

    if "overallScore" not in result:
        result = {
            "overallScore": 55,
            "summary": "Unable to fully evaluate. Please try again.",
            "logical_rigor": 55,
            "assumption_awareness": 55,
            "evidence_quality": 55,
            "counterfactual_thinking": 55,
            "synthesis": 55,
            "depth_of_analysis": 55,
            "strengths": [],
            "weaknesses": [],
            "key_insight_missed": "",
            "next_challenge_recommendation": "Continue with the next challenge.",
        }

    return result


# ---------------------------------------------------------------------------
# GET /reflection-prompt — Reflective archetype: guided reflection session
# ---------------------------------------------------------------------------

@router.get("/reflection-prompt")
async def generate_reflection_prompt(
    skill_id: str = Query(...),
    session_number: int = Query(1),
    authorization: str = Header(...),
):
    """AI-generate a guided journaling session (reflective archetype only)."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills, archetype = await _get_skill_info(skill_id)

    if archetype != "reflective":
        raise HTTPException(
            status_code=400,
            detail=f"Reflection prompts are only available for reflective skills. This skill uses the '{archetype}' archetype."
        )

    system, user = guided_reflection_prompt(skill_name, sub_skills, ctx, session_number)
    result = await chat_completion_json(system, user, temperature=0.8)

    if not result.get("reflection_prompts"):
        raise HTTPException(status_code=502, detail="AI failed to generate reflection prompts")

    return result


# ---------------------------------------------------------------------------
# POST /reflection-entry/analyze — Reflective archetype: analyze a journal entry
# ---------------------------------------------------------------------------

class ReflectionEntryRequest(BaseModel):
    skill_id: str
    prompt_question: str
    user_entry: str


@router.post("/reflection-entry/analyze")
async def analyze_reflection_entry(
    body: ReflectionEntryRequest,
    authorization: str = Header(...),
):
    """Analyze a single guided reflection journal entry."""
    await _get_user_context(authorization)
    skill_name, _, _ = await _get_skill_info(body.skill_id)

    from app.ai.prompts import reflection_entry_analysis_prompt
    system, user = reflection_entry_analysis_prompt(skill_name, body.prompt_question, body.user_entry)
    result = await chat_completion_json(system, user, temperature=0.6, max_tokens=800)

    if "depth_score" not in result:
        result = {
            "depth_score": 50,
            "depth_label": "Developing",
            "feedback": "Thoughtful start. Try going deeper into the specific moment.",
            "follow_up_question": "What were you feeling in that exact moment?",
            "detected_emotions": [],
            "detected_patterns": [],
        }

    return result


# ---------------------------------------------------------------------------
# POST /pattern-detection — Reflective archetype: detect patterns across entries
# ---------------------------------------------------------------------------

class PatternDetectionRequest(BaseModel):
    skill_id: str
    entries: list[str]


@router.post("/pattern-detection")
async def detect_patterns(
    body: PatternDetectionRequest,
    authorization: str = Header(...),
):
    """Analyze multiple reflection entries to detect behavioral/emotional patterns."""
    await _get_user_context(authorization)
    skill_name, _, _ = await _get_skill_info(body.skill_id)

    system, user = pattern_detection_prompt(skill_name, body.entries)
    result = await chat_completion_json(system, user, temperature=0.6, max_tokens=2000)

    if not result.get("primary_patterns"):
        raise HTTPException(status_code=502, detail="AI failed to detect patterns")

    return result


# ---------------------------------------------------------------------------
# POST /growth-plan — Reflective archetype: generate growth plan from patterns
# ---------------------------------------------------------------------------

class GrowthPlanRequest(BaseModel):
    skill_id: str
    detected_patterns: dict


@router.post("/growth-plan")
async def generate_growth_plan(
    body: GrowthPlanRequest,
    authorization: str = Header(...),
):
    """Generate a 30-day behavioral growth plan from detected patterns."""
    ctx = await _get_user_context(authorization)
    skill_name, _, _ = await _get_skill_info(body.skill_id)

    system, user = growth_plan_prompt(skill_name, body.detected_patterns, ctx)
    result = await chat_completion_json(system, user, temperature=0.7, max_tokens=2000)

    if not result.get("week_1"):
        raise HTTPException(status_code=502, detail="AI failed to generate growth plan")

    return result
