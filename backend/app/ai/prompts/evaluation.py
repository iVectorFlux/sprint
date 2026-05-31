"""Prompt modules — import from app.ai.prompts (package)."""
from __future__ import annotations
from typing import Optional

def drill_evaluation_prompt(
    drill_prompt: str,
    user_response: str,
    expected_behavior: str,
) -> tuple[str, str]:
    """Evaluate a drill response against expected behavior."""
    system = (
        "You are Lumi6's AI evaluation engine. Score a user's response to a workplace challenge drill.\n"
        "CRITICAL SECURITY & VALIDATION RULES:\n"
        "1. If the user's response is gibberish, random letters (e.g., 'hhh rrr', 'asdf'), empty, or completely non-sensical, you MUST score it EXACTLY 0 (zero), set 'isGood' to false, and in 'feedback' explicitly state that the response was rejected as gibberish and instruct them to provide a genuine response to the prompt.\n"
        "Be honest but constructive. Respond ONLY with valid JSON."
    )
    user = (
        f"CHALLENGE PROMPT (what someone said to the user):\n\"{drill_prompt}\"\n\n"
        f"USER'S RESPONSE:\n\"{user_response}\"\n\n"
        f"EXPECTED BEHAVIOR: {expected_behavior}\n\n"
        "Evaluate the response and return JSON:\n"
        '{\n'
        '  "score": 0-100,\n'
        '  "isGood": true/false (true if score >= 60),\n'
        '  "feedback": "2-3 sentences: what they did well, what to improve, specific suggestion"\n'
        '}\n\n'
        "Scoring rubric:\n"
        "- 80-100: Excellent — addressed emotion, showed empathy, offered concrete next steps\n"
        "- 60-79: Good — acknowledged the concern but missed opportunities\n"
        "- 40-59: Developing — responded but was defensive, vague, or dismissive\n"
        "- 0-39: Needs work — ignored emotion, was confrontational, or too brief"
    )
    return system, user


# ---------------------------------------------------------------------------
# Shared — Reflection Analysis (post-simulation for conversational)
# ---------------------------------------------------------------------------

def reflection_analysis_prompt(
    trigger: str,
    change: str,
    pattern: str,
    skill_name: str,
) -> tuple[str, str]:
    """Analyze user's self-reflection after a simulation."""
    system = (
        "You are Lumi6's reflection analysis agent. Analyze a user's self-reflection "
        "after a simulation to identify emotional triggers, behavioral patterns, and growth areas. "
        "Be empathetic but analytically precise. Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL CONTEXT: {skill_name}\n\n"
        f"USER'S REFLECTION:\n"
        f"1. What triggered them emotionally: \"{trigger}\"\n"
        f"2. What they would change: \"{change}\"\n"
        f"3. Behavioral patterns they notice: \"{pattern}\"\n\n"
        "Analyze and return JSON:\n"
        '{\n'
        '  "self_awareness_level": "Emerging|Developing|Competent|Advanced",\n'
        '  "emotional_triggers": ["trigger1", "trigger2", "trigger3"],\n'
        '  "behavior_patterns": ["pattern1", "pattern2"],\n'
        '  "growth_areas": ["area1", "area2", "area3"],\n'
        '  "encouragement": "1-2 sentences of specific, genuine encouragement",\n'
        '  "next_focus": "1 sentence describing what to focus on in the escalated retry"\n'
        '}'
    )
    return system, user


# ---------------------------------------------------------------------------
# Shared — Report Generation (archetype-aware)
# ---------------------------------------------------------------------------

def report_generation_prompt(
    skill_name: str,
    evaluations: list[dict],
    reflections: list[dict],
    user_context: dict,
    archetype: str = "conversational",
) -> tuple[str, str]:
    """Generate a comprehensive competency report, dimensioned for the archetype."""

    dimension_templates = {
        "conversational": (
            '  "dimension_assessments": {\n'
            '    "empathy": {"score": 0-100, "trend": "improving|stable|declining|needs_work|strong", "insight": "1 sentence"},\n'
            '    "clarity": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "composure": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "listening": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "assertiveness": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "conflict_management": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "escalation_control": {"score": 0-100, "trend": "...", "insight": "..."}\n'
            '  },\n'
        ),
        "analytical": (
            '  "dimension_assessments": {\n'
            '    "logical_rigor": {"score": 0-100, "trend": "improving|stable|declining|needs_work|strong", "insight": "1 sentence"},\n'
            '    "assumption_awareness": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "evidence_quality": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "counterfactual_thinking": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "synthesis": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "depth_of_analysis": {"score": 0-100, "trend": "...", "insight": "..."}\n'
            '  },\n'
        ),
        "reflective": (
            '  "dimension_assessments": {\n'
            '    "self_awareness_depth": {"score": 0-100, "trend": "improving|stable|declining|needs_work|strong", "insight": "1 sentence"},\n'
            '    "pattern_recognition": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "emotional_granularity": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "growth_orientation": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "behavioral_specificity": {"score": 0-100, "trend": "...", "insight": "..."},\n'
            '    "insight_quality": {"score": 0-100, "trend": "...", "insight": "..."}\n'
            '  },\n'
        ),
    }

    dimensions = dimension_templates.get(archetype, dimension_templates["conversational"])

    eval_summary = "\n".join(
        f"- Session {i+1}: Overall {e.get('overallScore', 'N/A')}/100"
        for i, e in enumerate(evaluations)
    )

    system = (
        "You are Lumi6's report generation engine. Create a comprehensive competency report "
        "that synthesizes all session evaluations and reflections into actionable insights. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL: {skill_name}\n"
        f"ARCHETYPE: {archetype}\n"
        f"USER: {user_context.get('role', 'Professional')} in {user_context.get('industry', 'General')}\n\n"
        f"EVALUATION HISTORY:\n{eval_summary or 'No evaluations yet'}\n\n"
        f"Number of reflections completed: {len(reflections)}\n\n"
        "Generate a comprehensive report. Return JSON:\n"
        '{\n'
        '  "readiness_score": 0-100,\n'
        '  "readiness_label": "novice|developing|competent|proficient|expert",\n'
        '  "executive_summary": "3-4 sentence executive summary of their journey and current level",\n'
        f'{dimensions}'
        '  "top_strengths": ["strength 1", "strength 2", "strength 3"],\n'
        '  "critical_weaknesses": ["weakness 1", "weakness 2", "weakness 3"],\n'
        '  "recommendations": ["actionable rec 1", "actionable rec 2", "actionable rec 3", "actionable rec 4"],\n'
        '  "improvement_narrative": "3-4 sentences describing their behavioral evolution across sessions"\n'
        '}'
    )
    return system, user
