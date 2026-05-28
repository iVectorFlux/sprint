"""Sprints API router."""

from fastapi import APIRouter, HTTPException, Header
from app.db import get_supabase
from app.schemas import SprintResponse, CreateSprintRequest, StageType

router = APIRouter()

# Stage order for initializing sprint stages
STAGE_ORDER = [
    StageType.primer,
    StageType.micro_skills,
    StageType.micro_drills,
    StageType.guided_simulation,
    StageType.independent_simulation,
    StageType.replay_analysis,
    StageType.reflection,
    StageType.escalated_retry,
    StageType.final_assessment,
    StageType.report,
    StageType.reinforcement,
]


@router.get("/", response_model=list[SprintResponse])
async def list_sprints(authorization: str = Header(...)):
    """List sprints for the authenticated user."""
    supabase = get_supabase()

    # Verify user from JWT
    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
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


@router.post("/", response_model=SprintResponse)
async def create_sprint(
    body: CreateSprintRequest,
    authorization: str = Header(...),
):
    """Create a new sprint for a skill."""
    supabase = get_supabase()

    # Verify user
    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Verify skill exists
    skill = supabase.table("skills").select("name").eq("id", body.skill_id).single().execute()
    if not skill.data:
        raise HTTPException(status_code=404, detail="Skill not found")

    # Create sprint
    sprint_data = {
        "user_id": user.user.id,
        "primary_skill_id": body.skill_id,
        "title": body.title or f"{skill.data['name']} Sprint",
        "status": "not_started",
        "current_stage": "primer",
        "target_hours": 20,
    }
    sprint_result = supabase.table("sprints").insert(sprint_data).execute()
    sprint = sprint_result.data[0]

    # Create all 11 stages
    stages = [
        {
            "sprint_id": sprint["id"],
            "stage_key": stage.value,
            "sequence_number": i + 1,
            "status": "active" if i == 0 else "locked",
        }
        for i, stage in enumerate(STAGE_ORDER)
    ]
    supabase.table("sprint_stages").insert(stages).execute()

    return sprint


@router.get("/{sprint_id}", response_model=SprintResponse)
async def get_sprint(sprint_id: str, authorization: str = Header(...)):
    """Get a specific sprint."""
    supabase = get_supabase()

    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
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
