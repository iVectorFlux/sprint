"""
Build a unified learner context for AI content (drills, scenarios, primer, simulation).

Sources: users, user_profiles (learning genome), active challenges, memory_nodes, recent practice.
"""

from __future__ import annotations

from typing import Any, Optional

from app.db import get_supabase


def _json_summary(value: Any, max_items: int = 5) -> str:
    """Turn JSONB lists/objects into a short string for prompts."""
    if value is None:
        return ""
    if isinstance(value, str):
        return value[:500]
    if isinstance(value, list):
        parts = [str(x) for x in value[:max_items]]
        return "; ".join(parts)
    if isinstance(value, dict):
        parts = [f"{k}: {v}" for k, v in list(value.items())[:max_items]]
        return "; ".join(parts)
    return str(value)[:500]


def format_personalization_block(ctx: dict) -> str:
    """Prompt section injected into drills/scenarios generation."""
    block = ctx.get("personalization_block", "").strip()
    if not block:
        return ""
    return (
        "\n\n--- LEARNER CONTEXT (required: personalize every drill/scenario to this person) ---\n"
        f"{block}\n"
        "--- End learner context ---\n"
    )


async def build_learner_context(user_id: Optional[str] = None) -> dict:
    """
    Rich context for content generation. Always includes role/seniority;
    adds profile, goals, and history when available in DB.
    """
    base = {
        "user_id": user_id or "mock-user-id",
        "role": "Professional",
        "department": "General",
        "seniority": "Mid-level",
        "industry": "Corporate",
        "country": None,
        "strengths": "",
        "weaknesses": "",
        "motivations": "",
        "behavioral_patterns": "",
        "active_challenges": [],
        "recent_insights": [],
        "recent_practice": [],
        "personalization_block": "",
    }

    supabase = get_supabase()
    if not supabase or not user_id or user_id == "mock-user-id":
        base["personalization_block"] = (
            f"Role: {base['role']}. Department: {base['department']}. "
            f"Seniority: {base['seniority']}."
        )
        return base

    user_row = (
        supabase.table("users")
        .select("role, department, seniority, country, full_name")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )
    u = (user_row.data or [{}])[0] if user_row.data else {}
    base.update({
        "role": u.get("role") or base["role"],
        "department": u.get("department") or base["department"],
        "seniority": u.get("seniority") or base["seniority"],
        "country": u.get("country"),
        "full_name": u.get("full_name"),
    })

    genome = (
        supabase.table("user_profiles")
        .select(
            "strengths, weaknesses, motivations, behavioral_patterns, "
            "communication_style, confidence_score, learning_velocity_score"
        )
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if genome.data:
        g = genome.data[0]
        base["strengths"] = _json_summary(g.get("strengths"))
        base["weaknesses"] = _json_summary(g.get("weaknesses"))
        base["motivations"] = _json_summary(g.get("motivations"))
        base["behavioral_patterns"] = _json_summary(g.get("behavioral_patterns"))
        if g.get("confidence_score") is not None:
            base["confidence_score"] = g["confidence_score"]

    challenges = (
        supabase.table("user_challenges")
        .select("title, raw_context, inferred_patterns, created_at")
        .eq("user_id", user_id)
        .eq("status", "active")
        .order("updated_at", desc=True)
        .limit(3)
        .execute()
    )
    base["active_challenges"] = challenges.data or []

    memories = (
        supabase.table("memory_nodes")
        .select("title, content, memory_type, source_type")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(5)
        .execute()
    )
    base["recent_insights"] = [
        {
            "type": m.get("memory_type"),
            "title": m.get("title"),
            "content": (m.get("content") or "")[:300],
        }
        for m in (memories.data or [])
    ]

    telemetry = (
        supabase.table("telemetry_events")
        .select("event_type, payload, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(8)
        .execute()
    )
    base["recent_practice"] = [
        {
            "event": t.get("event_type"),
            "summary": _json_summary(t.get("payload"), max_items=3),
        }
        for t in (telemetry.data or [])
    ]

    lines = [
        f"Role: {base['role']}",
        f"Department: {base['department']}",
        f"Seniority: {base['seniority']}",
        f"Industry: {base['industry']}",
    ]
    if base.get("country"):
        lines.append(f"Country/region: {base['country']}")
    if base["strengths"]:
        lines.append(f"Known strengths: {base['strengths']}")
    if base["weaknesses"]:
        lines.append(f"Development areas: {base['weaknesses']}")
    if base["motivations"]:
        lines.append(f"Motivations: {base['motivations']}")
    if base["behavioral_patterns"]:
        lines.append(f"Behavioral patterns: {base['behavioral_patterns']}")

    for i, ch in enumerate(base["active_challenges"], 1):
        title = ch.get("title", "Goal")
        raw = (ch.get("raw_context") or "")[:400]
        patterns = ch.get("inferred_patterns") or []
        pat = f" (focus: {', '.join(patterns[:5])})" if patterns else ""
        lines.append(f"Active learning goal {i}: {title}{pat}")
        if raw and raw != title:
            lines.append(f"  Context they provided: {raw}")

    for ins in base["recent_insights"][:3]:
        if ins.get("content"):
            lines.append(f"Past insight ({ins.get('type', 'note')}): {ins['content']}")

    for pr in base["recent_practice"][:3]:
        if pr.get("summary"):
            lines.append(f"Recent practice ({pr['event']}): {pr['summary']}")

    base["personalization_block"] = "\n".join(lines)
    return base


async def learner_context_from_auth(authorization: Optional[str]) -> dict:
    """Resolve user from JWT and build learner context."""
    supabase = get_supabase()
    if not supabase or not authorization:
        return await build_learner_context(None)

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        return await build_learner_context(None)

    return await build_learner_context(user.user.id)
