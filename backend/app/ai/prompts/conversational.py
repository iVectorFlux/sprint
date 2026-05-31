"""Prompt modules — import from app.ai.prompts (package)."""
from __future__ import annotations
from typing import Optional

from app.services.learner_context import format_personalization_block

def simulation_character_prompt(
    scenario: dict,
    skill_name: str,
    mode: str,
    user_context: dict,
) -> str:
    """
    System prompt for the AI character in a conversational simulation.
    This stays in the conversation for all turns.
    """
    coaching_note = ""
    if mode == "guided":
        coaching_note = (
            "\n\nIMPORTANT: After each response, include a hidden coaching section "
            "in the following JSON format on a new line after your dialogue:\n"
            '<!--COACH:{"hint":"coaching tip for the user","turnScores":{'
            '"empathy":0-100,"clarity":0-100,"composure":0-100,"listening":0-100},'
            '"telemetry":{"trust_level":0-100,"stress_level":0-100,"escalation_risk":0-100}}-->'
        )

    stress_level = {
        "guided": "moderate — be challenging but not overwhelming",
        "independent": "elevated — push back firmly, test their resolve",
        "escalated": "high — be aggressive, interrupt, challenge credibility, show frustration",
        "final": "variable — start moderate, escalate based on their responses",
    }.get(mode, "moderate")

    return (
        f"You are {scenario.get('aiCharacterName', 'Alex')} — "
        f"{scenario.get('aiCharacterRole', 'a senior colleague')}.\n\n"
        f"PERSONALITY: {scenario.get('aiCharacterPersonality', 'Professional but firm')}\n\n"
        f"SCENARIO: {scenario.get('context', 'A workplace conversation')}\n\n"
        f"YOUR EMOTIONAL STATE: {stress_level}\n\n"
        f"SKILL BEING TESTED: {skill_name}\n\n"
        "RULES:\n"
        "1. Stay in character at all times. You are NOT an AI assistant — you are this person.\n"
        "2. React realistically to what the user says. If they show empathy, soften slightly. "
        "If they're dismissive, escalate.\n"
        "3. Keep responses to 2-4 sentences. This is a conversation, not a monologue.\n"
        "4. Include realistic emotional cues (sighing, pausing, raising voice, etc.)\n"
        "5. Have a hidden agenda or concern that the user needs to uncover through good listening.\n"
        f"6. The user is a {user_context.get('role', 'Professional')} "
        f"in {user_context.get('industry', 'a corporate setting')}.\n"
        "7. Reflect their goals, weaknesses, and past practice from learner context when reacting.\n"
        f"{format_personalization_block(user_context)}"
        f"{coaching_note}"
    )


def simulation_opening_prompt(scenario: dict) -> str:
    """User prompt to generate the AI character's opening line."""
    return (
        f"The scene: {scenario.get('context', 'A workplace meeting')}\n\n"
        "Begin the conversation. Open with a realistic statement that sets the emotional tone "
        "and immediately puts the user in a position where they need to respond skillfully. "
        "Be direct and in-character. 2-3 sentences max."
    )


# ---------------------------------------------------------------------------
# Conversational Archetype — Evaluation
# ---------------------------------------------------------------------------

def simulation_evaluation_prompt(
    transcript: list[dict],
    skill_name: str,
    scenario_context: str,
) -> tuple[str, str]:
    """Evaluate a completed conversational simulation across 7 dimensions."""
    formatted_transcript = "\n".join(
        f"{'USER' if m['role'] == 'user' else 'CHARACTER'}: {m['content']}"
        for m in transcript
        if m.get("role") in ("user", "assistant")
    )

    system = (
        "You are Lumi6's evaluation engine. Analyze a complete simulation transcript and "
        "provide a detailed multidimensional assessment. Be specific, citing exact quotes "
        "from the transcript. Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL: {skill_name}\n"
        f"SCENARIO: {scenario_context}\n\n"
        f"TRANSCRIPT:\n{formatted_transcript}\n\n"
        "Evaluate across 7 dimensions and return JSON:\n"
        '{\n'
        '  "overallScore": 0-100,\n'
        '  "summary": "3-4 sentence overall assessment",\n'
        '  "empathy": 0-100,\n'
        '  "clarity": 0-100,\n'
        '  "composure": 0-100,\n'
        '  "listening": 0-100,\n'
        '  "assertiveness": 0-100,\n'
        '  "conflictManagement": 0-100,\n'
        '  "escalationControl": 0-100,\n'
        '  "strengths": ["strength 1", "strength 2", "strength 3"],\n'
        '  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],\n'
        '  "retryRecommendations": ["suggestion 1", "suggestion 2", "suggestion 3"],\n'
        '  "timelineEvents": [\n'
        '    {\n'
        '      "timestamp": "Turn 1",\n'
        '      "event": "Brief description of what happened",\n'
        '      "type": "strength|weakness|neutral",\n'
        '      "quote": "Exact quote from transcript"\n'
        '    }\n'
        '  ]\n'
        '}'
    )
    return system, user
