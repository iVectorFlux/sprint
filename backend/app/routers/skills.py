"""Skills API router."""

from fastapi import APIRouter, HTTPException
from app.db import get_supabase
from app.schemas import SkillResponse, SkillWithSubSkillsResponse, SubSkillResponse

router = APIRouter()


@router.get("", response_model=list[SkillResponse])
async def list_skills():
    """List all skills."""
    supabase = get_supabase()
    if not supabase:
        # Mock default skills so catalog/dashboard works cleanly in offline mode
        return [
            {"id": "communication", "name": "Communication", "archetype": "conversational", "description": "Articulate ideas clearly, listen actively, and facilitate productive dialogues."},
            {"id": "influence-negotiation", "name": "Influence & Negotiation", "archetype": "conversational", "description": "Persuade others, manage conflicts, and reach mutually beneficial agreements."},
            {"id": "strategic-sales", "name": "Strategic Sales", "archetype": "conversational", "description": "Identify client needs, navigate complex accounts, and build long-term value partnerships."},
            {"id": "leadership-essentials", "name": "Leadership Essentials", "archetype": "conversational", "description": "Inspire trust, align teams, and delegate effectively to drive organizational goals."}
        ]
    result = supabase.table("skills").select("*").order("name").execute()
    return result.data


@router.get("/{skill_id}", response_model=SkillWithSubSkillsResponse)
async def get_skill(skill_id: str):
    """Get a skill with its sub-skills."""
    supabase = get_supabase()
    if not supabase:
        skill_name = skill_id.replace("-", " ").title()
        return {
            "id": skill_id,
            "name": skill_name,
            "archetype": "conversational",
            "description": f"Master the core elements of {skill_name}.",
            "sub_skills": [
                {"id": "s1", "name": "Active Listening", "description": "Listen attentively and validate others.", "difficulty_level": 2},
                {"id": "s2", "name": "Storytelling", "description": "Construct high-impact narratives.", "difficulty_level": 3}
            ]
        }

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
