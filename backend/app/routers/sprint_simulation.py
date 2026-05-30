"""
Simulation engine API — start, message, end simulations with AI characters.
This is the core AI-native interaction layer of Lumi6.
"""

from __future__ import annotations

import json
import os
import re
import uuid
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional

from app.db import get_supabase
from app.ai.llm import multi_turn_completion, chat_completion_json
from app.ai.prompts import (
    simulation_character_prompt,
    simulation_opening_prompt,
    simulation_evaluation_prompt,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class StartSimulationRequest(BaseModel):
    scenario_id: str
    mode: str = "guided"  # guided | independent | escalated | final
    # Optional inline scenario data (for escalated/final where we generate on the fly)
    scenario_title: Optional[str] = None
    scenario_context: Optional[str] = None
    ai_character_name: Optional[str] = None
    ai_character_role: Optional[str] = None
    ai_character_personality: Optional[str] = None


class SendMessageRequest(BaseModel):
    simulation_id: str
    content: str


class EndSimulationRequest(BaseModel):
    simulation_id: str


# ---------------------------------------------------------------------------
# In-memory simulation sessions (production would use Redis)
# ---------------------------------------------------------------------------

_sessions: dict[str, dict] = {}


def _get_session(sim_id: str) -> dict:
    if sim_id not in _sessions:
        raise HTTPException(status_code=404, detail="Simulation session not found. It may have expired.")
    return _sessions[sim_id]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _get_user_and_sprint(sprint_id: str, authorization: Optional[str] = None) -> tuple[str, dict]:
    """Verify auth, return (user_id, sprint_data)."""
    supabase = get_supabase()
    if not supabase or not authorization:
        actual_sprint_id = sprint_id.split("--")[0] if "--" in sprint_id else sprint_id
        skill_name = actual_sprint_id.replace("-", " ").title()
        sprint_data = {
            "id": sprint_id,
            "user_id": "mock-user-id",
            "primary_skill_id": actual_sprint_id,
            "status": "active",
            "current_stage": "primer",
            "completed_hours": 0.0,
            "skills": {
                "name": skill_name
            }
        }
        return "mock-user-id", sprint_data

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    actual_sprint_id = sprint_id.split("--")[0] if "--" in sprint_id else sprint_id

    # Try finding by full sprint_id first
    try:
        sprint = (
            supabase.table("sprints")
            .select("*, skills!primary_skill_id(name)")
            .eq("id", sprint_id)
            .eq("user_id", user.user.id)
            .single()
            .execute()
        )
        if sprint.data:
            return user.user.id, sprint.data
    except Exception:
        pass

    # Try finding by actual_sprint_id (UUID or parent skill ID)
    try:
        sprint = (
            supabase.table("sprints")
            .select("*, skills!primary_skill_id(name)")
            .eq("id", actual_sprint_id)
            .eq("user_id", user.user.id)
            .single()
            .execute()
        )
        if sprint.data:
            return user.user.id, sprint.data
    except Exception:
        pass

    # Try finding the latest active sprint for the parent skill
    try:
        result = (
            supabase.table("sprints")
            .select("*, skills!primary_skill_id(name)")
            .eq("primary_skill_id", actual_sprint_id)
            .eq("user_id", user.user.id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if result.data and len(result.data) > 0:
            return user.user.id, result.data[0]
    except Exception:
        pass

    # Safe mock fallback so the API doesn't crash if the database is unseeded or offline
    skill_name = actual_sprint_id.replace("-", " ").title()
    sprint_data = {
        "id": sprint_id,
        "user_id": user.user.id,
        "primary_skill_id": actual_sprint_id,
        "status": "active",
        "current_stage": "primer",
        "completed_hours": 0.0,
        "skills": {
            "name": skill_name
        }
    }
    return user.user.id, sprint_data


def _extract_coach_data(text: str) -> tuple[str, dict | None]:
    """
    Extract coaching JSON from AI character response.
    The character embeds it as <!--COACH:{...}-->
    Returns (clean_dialogue, coach_data_or_none).
    """
    match = re.search(r"<!--COACH:(.*?)-->", text, re.DOTALL)
    if match:
        clean_text = text[: match.start()].strip()
        try:
            coach_data = json.loads(match.group(1))
            return clean_text, coach_data
        except json.JSONDecodeError:
            return clean_text, None
    return text.strip(), None


async def _get_user_context(user_id: str) -> dict:
    """Fetch user context for prompt personalization."""
    supabase = get_supabase()
    if not supabase:
        return {
            "role": "Professional",
            "department": "General",
            "seniority": "Mid-level",
            "industry": "Corporate",
        }
    profile = (
        supabase.table("users")
        .select("role, department, seniority, country")
        .eq("id", user_id)
        .single()
        .execute()
    )
    data = profile.data or {}
    return {
        "role": data.get("role") or "Professional",
        "department": data.get("department") or "General",
        "seniority": data.get("seniority") or "Mid-level",
        "industry": "Corporate",
    }


# ---------------------------------------------------------------------------
# POST /start — Start a simulation
# ---------------------------------------------------------------------------

@router.post("/{sprint_id}/simulation/start")
async def start_simulation(
    sprint_id: str,
    body: StartSimulationRequest,
    authorization: Optional[str] = Header(None),
):
    user_id, sprint_data = await _get_user_and_sprint(sprint_id, authorization)
    user_ctx = await _get_user_context(user_id)

    # Resolve skill name
    skill_name = "Communication"  # default
    if sprint_data.get("skills"):
        skill_name = sprint_data["skills"].get("name", skill_name)

    # Build scenario dict
    scenario = {
        "id": body.scenario_id,
        "title": body.scenario_title or f"Scenario {body.scenario_id}",
        "context": body.scenario_context or "A challenging workplace conversation.",
        "aiCharacterName": body.ai_character_name or "Alex Chen",
        "aiCharacterRole": body.ai_character_role or "Senior colleague",
        "aiCharacterPersonality": body.ai_character_personality or "Professional but firm, with underlying concerns",
    }

    # Generate system prompt for the character
    system_prompt = simulation_character_prompt(scenario, skill_name, body.mode, user_ctx)

    # Generate opening message
    opening_user_prompt = simulation_opening_prompt(scenario)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": opening_user_prompt},
    ]
    raw_opening = await multi_turn_completion(messages, temperature=0.8)
    opening_text, coach_data = _extract_coach_data(raw_opening)

    # Create simulation record in DB
    supabase = get_supabase()
    if not supabase:
        sim_id = str(uuid.uuid4())
    else:
        sim_record = {
            "sprint_id": sprint_id,
            "simulation_type": body.mode,
            "scenario": scenario.get("title"),
            "difficulty_level": {"guided": 1, "independent": 2, "escalated": 3, "final": 2}.get(body.mode, 2),
            "context": scenario,
            "ai_configuration": {"system_prompt": system_prompt, "model": os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")},
            "generated_by": "ai",
        }
        result = supabase.table("simulations").insert(sim_record).execute()
        sim_id = result.data[0]["id"]

    # Store session in memory
    opening_msg = {
        "id": f"ai-{uuid.uuid4().hex[:8]}",
        "role": "assistant",
        "content": opening_text,
    }

    _sessions[sim_id] = {
        "simulation_id": sim_id,
        "sprint_id": sprint_id,
        "user_id": user_id,
        "mode": body.mode,
        "skill_name": skill_name,
        "scenario": scenario,
        "system_prompt": system_prompt,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "assistant", "content": opening_text},
        ],
        "ui_messages": [opening_msg],
        "state": {
            "trust_level": 40,
            "stress_level": 50,
            "escalation_risk": 30,
            "turn_count": 0,
        },
        "coach_hints": [],
        "started_at": datetime.now(timezone.utc).isoformat(),
    }

    return {
        "simulationId": sim_id,
        "messages": [opening_msg],
        "state": _sessions[sim_id]["state"],
    }


# ---------------------------------------------------------------------------
# POST /message — Send a message in a simulation
# ---------------------------------------------------------------------------

@router.post("/{sprint_id}/simulation/message")
async def send_message(
    sprint_id: str,
    body: SendMessageRequest,
    authorization: Optional[str] = Header(None),
):
    # Verify auth
    supabase = get_supabase()
    if supabase:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Unauthorized")

    session = _get_session(body.simulation_id)

    # Add user message to conversation
    session["messages"].append({"role": "user", "content": body.content})
    session["state"]["turn_count"] += 1

    # Call LLM for character response
    raw_response = await multi_turn_completion(
        session["messages"],
        temperature=0.8,
        max_tokens=512,
    )

    # Extract coaching data if in guided mode
    dialogue_text, coach_data = _extract_coach_data(raw_response)

    # Add assistant response to conversation history
    session["messages"].append({"role": "assistant", "content": dialogue_text})

    # Build response
    ai_msg = {
        "id": f"ai-{uuid.uuid4().hex[:8]}",
        "role": "assistant",
        "content": dialogue_text,
    }
    session["ui_messages"].append(
        {"id": f"user-{uuid.uuid4().hex[:8]}", "role": "user", "content": body.content}
    )
    session["ui_messages"].append(ai_msg)

    # Update telemetry from coaching data
    response_data: dict = {"message": ai_msg, "state": session["state"]}

    if coach_data:
        if "telemetry" in coach_data:
            session["state"].update(coach_data["telemetry"])
            session["state"]["turn_count"] = session["state"].get("turn_count", 0)
        if "hint" in coach_data:
            session["coach_hints"].append(coach_data["hint"])
            response_data["coachHint"] = coach_data["hint"]
        if "turnScores" in coach_data:
            response_data["turnScores"] = coach_data["turnScores"]

    response_data["state"] = session["state"]
    return response_data


# ---------------------------------------------------------------------------
# POST /end — End simulation and get full evaluation
# ---------------------------------------------------------------------------

@router.post("/{sprint_id}/simulation/end")
async def end_simulation(
    sprint_id: str,
    body: EndSimulationRequest,
    authorization: Optional[str] = Header(None),
):
    supabase = get_supabase()
    user_id = "mock-user-id"
    if supabase:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Unauthorized")
        user_id = user.user.id

    session = _get_session(body.simulation_id)

    # Build transcript for evaluation
    transcript = [
        {"role": m["role"], "content": m["content"]}
        for m in session["messages"]
        if m["role"] in ("user", "assistant")
    ]

    # AI evaluation across 7 dimensions
    system_prompt, user_prompt = simulation_evaluation_prompt(
        transcript,
        session["skill_name"],
        session["scenario"].get("context", ""),
    )
    evaluation = await chat_completion_json(
        system_prompt,
        user_prompt,
        temperature=0.5,
        max_tokens=3000,
    )

    # Save simulation attempt to DB
    full_transcript = "\n".join(
        f"{'USER' if m['role'] == 'user' else 'AI'}: {m['content']}"
        for m in transcript
    )

    if supabase:
        attempt_data = {
            "simulation_id": body.simulation_id,
            "user_id": user_id,
            "transcript": full_transcript,
            "evaluation": evaluation,
            "telemetry": session["state"],
            "score": evaluation.get("overallScore", 0),
            "emotional_score": evaluation.get("empathy", 0),
            "clarity_score": evaluation.get("clarity", 0),
        }
        supabase.table("simulation_attempts").insert(attempt_data).execute()

    # Clean up session
    del _sessions[body.simulation_id]

    return {"evaluation": evaluation}
