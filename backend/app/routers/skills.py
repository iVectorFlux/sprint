"""Skills API router."""

from fastapi import APIRouter, HTTPException
from app.db import get_supabase
from app.schemas import SkillResponse, SkillWithSubSkillsResponse, SubSkillResponse

router = APIRouter()


@router.get("/", response_model=list[SkillResponse])
async def list_skills():
    """List all skills."""
    supabase = get_supabase()
    result = supabase.table("skills").select("*").order("name").execute()
    return result.data


@router.get("/{skill_id}", response_model=SkillWithSubSkillsResponse)
async def get_skill(skill_id: str):
    """Get a skill with its sub-skills."""
    supabase = get_supabase()

    # Get skill
    skill_result = supabase.table("skills").select("*").eq("id", skill_id).single().execute()
    if not skill_result.data:
        raise HTTPException(status_code=404, detail="Skill not found")

    # Get sub-skills
    sub_skills_result = (
        supabase.table("sub_skills")
        .select("*")
        .eq("skill_id", skill_id)
        .order("difficulty_level")
        .execute()
    )

    return {
        **skill_result.data,
        "sub_skills": sub_skills_result.data or [],
    }
