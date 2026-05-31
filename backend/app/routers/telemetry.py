"""Practice telemetry events — feeds Challenge Graph + Human Development Graph."""

from typing import Any, Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from app.db import get_supabase

router = APIRouter()


class TelemetryEventIn(BaseModel):
    event_type: str
    sprint_id: Optional[str] = None
    skill_slug: Optional[str] = None
    sub_skill_slug: Optional[str] = None
    stage: Optional[str] = None
    cognitive_patterns: Optional[list[str]] = None
    duration_ms: Optional[int] = None
    score: Optional[float] = None
    passed: Optional[bool] = None
    extra: dict[str, Any] = Field(default_factory=dict)


@router.post("/events")
async def create_telemetry_event(
    body: TelemetryEventIn,
    authorization: Optional[str] = Header(None),
):
    supabase = get_supabase()
    if not supabase or not authorization:
        return {"ok": True, "mock": True}

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    payload = body.model_dump(exclude_none=True)
    event_type = payload.pop("event_type")
    sprint_id = payload.pop("sprint_id", None)

    row = {
        "user_id": user.user.id,
        "sprint_id": sprint_id,
        "event_type": event_type,
        "payload": payload,
    }
    supabase.table("telemetry_events").insert(row).execute()
    return {"ok": True}
