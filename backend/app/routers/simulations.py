"""Simulations API router."""

from fastapi import APIRouter, HTTPException, Header
from app.db import get_supabase

router = APIRouter()


@router.get("/sprint/{sprint_id}")
async def list_simulations(sprint_id: str, authorization: str = Header(...)):
    """List simulations for a sprint."""
    supabase = get_supabase()

    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Verify sprint belongs to user
    sprint = (
        supabase.table("sprints")
        .select("id")
        .eq("id", sprint_id)
        .eq("user_id", user.user.id)
        .single()
        .execute()
    )
    if not sprint.data:
        raise HTTPException(status_code=404, detail="Sprint not found")

    result = (
        supabase.table("simulations")
        .select("*")
        .eq("sprint_id", sprint_id)
        .order("created_at")
        .execute()
    )
    return result.data


@router.get("/{simulation_id}/attempts")
async def list_attempts(simulation_id: str, authorization: str = Header(...)):
    """List attempts for a simulation."""
    supabase = get_supabase()

    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = (
        supabase.table("simulation_attempts")
        .select("*")
        .eq("simulation_id", simulation_id)
        .eq("user_id", user.user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data
