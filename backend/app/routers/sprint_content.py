"""Sprint content generation API — AI-powered primer, micro-skills, scenarios."""

from fastapi import APIRouter, HTTPException, Header, Query
from app.db import get_supabase
from app.ai.llm import chat_completion_json
from app.ai.prompts import primer_cards_prompt, micro_skills_prompt, scenarios_prompt

router = APIRouter()


async def _get_user_context(authorization: str) -> dict:
    """Extract user context (role, industry, seniority) from auth token."""
    supabase = get_supabase()
    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Fetch user profile for context
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
        "industry": "Corporate",  # Could be enriched from organization table
    }


async def _get_skill_info(skill_id: str) -> tuple[str, list[str]]:
    """Get skill name and sub-skill names."""
    supabase = get_supabase()
    skill = supabase.table("skills").select("name").eq("id", skill_id).single().execute()
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
    return skill.data["name"], sub_skill_names


@router.get("/primer")
async def generate_primer(
    skill_id: str = Query(...),
    authorization: str = Header(...),
):
    """AI-generate primer cards for a skill."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills = await _get_skill_info(skill_id)

    system, user = primer_cards_prompt(skill_name, sub_skills, ctx)
    result = await chat_completion_json(system, user, temperature=0.8)

    if not result.get("cards"):
        raise HTTPException(status_code=502, detail="AI failed to generate primer cards")

    return result


@router.get("/micro-skills")
async def generate_micro_skills(
    skill_id: str = Query(...),
    authorization: str = Header(...),
):
    """AI-generate micro-skill breakdowns."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills = await _get_skill_info(skill_id)

    system, user = micro_skills_prompt(skill_name, sub_skills, ctx)
    result = await chat_completion_json(system, user, temperature=0.7)

    if not result.get("microSkills"):
        raise HTTPException(status_code=502, detail="AI failed to generate micro-skills")

    return result


@router.get("/scenarios")
async def generate_scenarios(
    skill_id: str = Query(...),
    mode: str = Query("guided"),
    authorization: str = Header(...),
):
    """AI-generate contextual simulation scenarios."""
    ctx = await _get_user_context(authorization)
    skill_name, sub_skills = await _get_skill_info(skill_id)

    system, user = scenarios_prompt(skill_name, sub_skills, ctx, mode)
    result = await chat_completion_json(system, user, temperature=0.9)

    if not result.get("scenarios"):
        raise HTTPException(status_code=502, detail="AI failed to generate scenarios")

    return result
