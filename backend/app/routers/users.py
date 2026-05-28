"""Users API router."""

from fastapi import APIRouter, HTTPException, Header
from app.db import get_supabase
from app.schemas import UserResponse, UpdateUserRequest

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: str = Header(...)):
    """Get the current authenticated user's profile."""
    supabase = get_supabase()

    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = (
        supabase.table("users")
        .select("*")
        .eq("id", user.user.id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    return result.data


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    body: UpdateUserRequest,
    authorization: str = Header(...),
):
    """Update the current user's profile."""
    supabase = get_supabase()

    user = supabase.auth.get_user(authorization.replace("Bearer ", ""))
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("users")
        .update(update_data)
        .eq("id", user.user.id)
        .execute()
    )

    return result.data[0]
