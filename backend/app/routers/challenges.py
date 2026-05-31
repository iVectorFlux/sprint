"""User challenges — Challenge Graph foundation."""

from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.db import get_supabase

router = APIRouter()


class CreateChallengeRequest(BaseModel):
    title: str
    raw_context: Optional[str] = None
    inferred_skill_slugs: list[str] = []
    inferred_patterns: list[str] = []


@router.get("")
async def list_challenges(authorization: Optional[str] = Header(None)):
    supabase = get_supabase()
    if not supabase or not authorization:
        return []

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = (
        supabase.table("user_challenges")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("status", "active")
        .order("updated_at", desc=True)
        .execute()
    )
    return result.data or []


@router.post("")
async def create_challenge(
    body: CreateChallengeRequest,
    authorization: Optional[str] = Header(None),
):
    supabase = get_supabase()
    if not supabase or not authorization:
        return {"id": "mock-challenge", **body.model_dump()}

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    row = {
        "user_id": user.user.id,
        "title": body.title[:200],
        "raw_context": body.raw_context,
        "inferred_skill_slugs": body.inferred_skill_slugs,
        "inferred_patterns": body.inferred_patterns,
        "status": "active",
    }
    result = supabase.table("user_challenges").insert(row).execute()
    return result.data[0] if result.data else row
