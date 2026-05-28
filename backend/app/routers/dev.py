"""
Dev-mode evaluation endpoint.
No auth or database required — calls Groq directly.
Only loaded in development.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.llm import chat_completion_json
from app.ai.prompts import drill_evaluation_prompt

router = APIRouter()


class DrillEvaluateRequest(BaseModel):
    userResponse: str
    drillPrompt: str
    expectedBehavior: str


@router.post("/dev/evaluate-drill")
async def dev_evaluate_drill(body: DrillEvaluateRequest):
    """AI-scored drill evaluation — no auth required (dev only)."""
    system, user = drill_evaluation_prompt(
        body.drillPrompt,
        body.userResponse,
        body.expectedBehavior,
    )
    result = await chat_completion_json(system, user, temperature=0.5, max_tokens=512)

    # Ensure required fields
    if "score" not in result:
        result = {
            "score": 50,
            "isGood": False,
            "feedback": "Unable to evaluate. Please try again.",
        }
    result.setdefault("isGood", result.get("score", 0) >= 60)

    return result
