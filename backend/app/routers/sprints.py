"""Sprints API router."""

from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from app.db import get_supabase
from app.schemas import SprintResponse, CreateSprintRequest, StageType
from app.ai.archetypes import get_stage_flow, archetype_from_skill

router = APIRouter()


def _stage_enum_values() -> set[str]:
    return {s.value for s in StageType}


def _stages_for_archetype(archetype: str) -> list[str]:
    """Ordered stage keys for this archetype, filtered to valid DB enum values."""
    allowed = _stage_enum_values()
    flow = get_stage_flow(archetype)
    return [s for s in flow if s in allowed]


@router.get("", response_model=list[SprintResponse])
async def list_sprints(authorization: Optional[str] = Header(None)):
    """List sprints for the authenticated user."""
    supabase = get_supabase()
    if not supabase or not authorization:
        return []

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = (
        supabase.table("sprints")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("", response_model=SprintResponse)
async def create_sprint(
    body: CreateSprintRequest,
    authorization: Optional[str] = Header(None),
):
    """Create a new sprint for a skill — stages follow the skill's archetype."""
    supabase = get_supabase()
    if not supabase or not authorization:
        skill_name = body.skill_id.replace("-", " ").title()
        return {
            "id": "mock-sprint-id",
            "user_id": "mock-user-id",
            "primary_skill_id": body.skill_id,
            "title": body.title or f"{skill_name} Sprint",
            "status": "not_started",
            "current_stage": "primer",
            "target_hours": 20,
        }

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    skill = (
        supabase.table("skills")
        .select("name, archetype, learning_engine_type")
        .eq("id", body.skill_id)
        .single()
        .execute()
    )
    if not skill.data:
        raise HTTPException(status_code=404, detail="Skill not found")

    archetype = archetype_from_skill(skill.data)
    stage_flow = _stages_for_archetype(archetype)
    if not stage_flow:
        stage_flow = ["primer", "report"]

    first_stage = stage_flow[0]

    sprint_data = {
        "user_id": user.user.id,
        "primary_skill_id": body.skill_id,
        "title": body.title or f"{skill.data['name']} Sprint",
        "status": "not_started",
        "current_stage": first_stage,
        "target_hours": 20,
    }
    sprint_result = supabase.table("sprints").insert(sprint_data).execute()
    sprint = sprint_result.data[0]

    stages = [
        {
            "sprint_id": sprint["id"],
            "stage_key": stage_key,
            "sequence_number": i + 1,
            "status": "active" if i == 0 else "locked",
        }
        for i, stage_key in enumerate(stage_flow)
    ]
    supabase.table("sprint_stages").insert(stages).execute()

    return sprint


@router.get("/{sprint_id}", response_model=SprintResponse)
async def get_sprint(sprint_id: str, authorization: Optional[str] = Header(None)):
    """Get a specific sprint."""
    supabase = get_supabase()
    if not supabase or not authorization:
        actual_skill_id = sprint_id.split("--")[0] if "--" in sprint_id else sprint_id
        skill_name = actual_skill_id.replace("-", " ").title()
        return {
            "id": sprint_id,
            "user_id": "mock-user-id",
            "primary_skill_id": actual_skill_id,
            "title": f"{skill_name} Sprint",
            "status": "active",
            "current_stage": "primer",
            "target_hours": 20,
        }

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = (
        supabase.table("sprints")
        .select("*")
        .eq("id", sprint_id)
        .eq("user_id", user.user.id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Sprint not found")

    return result.data
