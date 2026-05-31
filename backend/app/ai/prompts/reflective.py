"""Prompt modules — import from app.ai.prompts (package)."""
from __future__ import annotations
from typing import Optional

def guided_reflection_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    session_number: int = 1,
    previous_patterns: list[str] | None = None,
) -> tuple[str, str]:
    """
    Generate a guided journaling prompt for a reflective skill session.
    Adapts based on session number and any patterns previously detected.
    """
    depth_guidance = {
        1: "This is the first reflection session. Focus on surface-level awareness — "
           "ask the user to recall a recent relevant situation.",
        2: "This is a follow-up session. Go deeper — ask them to identify patterns "
           "across multiple situations, not just one.",
        3: "This is an advanced session. Challenge the user to connect their patterns "
           "to their core beliefs and default behavioral modes.",
    }.get(min(session_number, 3), "")

    pattern_context = ""
    if previous_patterns:
        pattern_context = (
            f"\nPreviously detected patterns for this user: {', '.join(previous_patterns)}. "
            "Reference these patterns in the prompts to build continuity."
        )

    system = (
        "You are Lumi6's reflection guide. Generate thoughtful, psychologically-grounded "
        "journaling prompts that help professionals develop genuine self-awareness. "
        "Prompts should be specific, not generic. Avoid platitudes. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"Generate a guided reflection session for: **{skill_name}**\n"
        f"Sub-skills: {', '.join(sub_skills)}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Session number: {session_number}\n"
        f"Guidance: {depth_guidance}{pattern_context}\n\n"
        "Return JSON:\n"
        '{\n'
        '  "session_title": "Session theme title",\n'
        '  "opening_frame": "1-2 sentences to orient the user to this reflection session",\n'
        '  "reflection_prompts": [\n'
        '    {\n'
        '      "id": "p1",\n'
        '      "question": "The reflection question",\n'
        '      "follow_up": "A follow-up probe if they go surface-level",\n'
        '      "focus_area": "Which sub-skill or dimension this targets"\n'
        '    }\n'
        '  ],\n'
        '  "closing_challenge": "One concrete behavioral experiment to try this week"\n'
        '}'
    )
    return system, user


def pattern_detection_prompt(
    skill_name: str,
    reflection_entries: list[str],
) -> tuple[str, str]:
    """
    Analyze multiple reflection entries to detect behavioral and emotional patterns.
    """
    formatted_entries = "\n\n---\n\n".join(
        f"Entry {i+1}:\n{entry}" for i, entry in enumerate(reflection_entries)
    )

    system = (
        "You are Lumi6's pattern detection engine. Analyze reflection journal entries "
        "to identify recurring behavioral and emotional patterns. Be specific and cite "
        "evidence from the entries. Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL CONTEXT: {skill_name}\n\n"
        f"REFLECTION ENTRIES:\n{formatted_entries}\n\n"
        "Detect patterns and return JSON:\n"
        '{\n'
        '  "primary_patterns": [\n'
        '    {\n'
        '      "pattern_name": "Short descriptive name",\n'
        '      "description": "2-3 sentence description of the pattern",\n'
        '      "evidence": "Specific evidence from entries",\n'
        '      "category": "emotional|behavioral|cognitive|relational"\n'
        '    }\n'
        '  ],\n'
        '  "triggers": ["trigger 1", "trigger 2", "trigger 3"],\n'
        '  "default_responses": ["response 1", "response 2"],\n'
        '  "growth_edges": ["area 1", "area 2", "area 3"],\n'
        '  "self_awareness_level": "Emerging|Developing|Competent|Advanced",\n'
        '  "insight": "1-2 sentences: the single most important thing this person should understand about themselves"\n'
        '}'
    )
    return system, user


def growth_plan_prompt(
    skill_name: str,
    detected_patterns: dict,
    user_context: dict,
) -> tuple[str, str]:
    """Generate a personalized growth plan based on detected patterns."""
    system = (
        "You are Lumi6's growth planning engine. Create a specific, actionable 30-day "
        "behavioral growth plan based on a professional's self-reflection patterns. "
        "Avoid generic advice. Make every recommendation concrete. Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL: {skill_name}\n"
        f"USER: {user_context.get('role', 'Professional')} in {user_context.get('industry', 'General')}\n\n"
        f"DETECTED PATTERNS:\n{detected_patterns}\n\n"
        "Create a 30-day growth plan. Return JSON:\n"
        '{\n'
        '  "growth_theme": "The overarching growth focus",\n'
        '  "week_1": {\n'
        '    "focus": "Week 1 focus area",\n'
        '    "daily_practice": "Specific 5-minute daily practice",\n'
        '    "weekly_experiment": "One behavioral experiment to run",\n'
        '    "reflection_question": "End-of-week reflection question"\n'
        '  },\n'
        '  "week_2": { "focus": "...", "daily_practice": "...", "weekly_experiment": "...", "reflection_question": "..." },\n'
        '  "week_3": { "focus": "...", "daily_practice": "...", "weekly_experiment": "...", "reflection_question": "..." },\n'
        '  "week_4": { "focus": "...", "daily_practice": "...", "weekly_experiment": "...", "reflection_question": "..." },\n'
        '  "success_indicators": ["indicator 1", "indicator 2", "indicator 3"],\n'
        '  "accountability_prompt": "How the user should hold themselves accountable"\n'
        '}'
    )
    return system, user


def reflection_entry_analysis_prompt(
    skill_name: str,
    prompt_question: str,
    user_entry: str,
) -> tuple[str, str]:
    """
    Analyze a single reflection journal entry against the prompt question.
    Returns depth score + follow-up if shallow.
    """
    system = (
        "You are Lumi6's reflection analysis engine. Evaluate the depth and quality of a "
        "professional's journal entry. Encourage genuine introspection. Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL CONTEXT: {skill_name}\n"
        f"REFLECTION PROMPT: {prompt_question}\n"
        f"USER'S ENTRY: {user_entry}\n\n"
        "Analyze and return JSON:\n"
        '{\n'
        '  "depth_score": 0-100,\n'
        '  "depth_label": "Surface|Developing|Deep|Profound",\n'
        '  "feedback": "2-3 sentences of warm, honest feedback",\n'
        '  "follow_up_question": "A probe to go deeper if depth_score < 70",\n'
        '  "detected_emotions": ["emotion 1", "emotion 2"],\n'
        '  "detected_patterns": ["pattern 1"]\n'
        '}'
    )
    return system, user
