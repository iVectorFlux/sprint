"""
Prompt templates for every AI-powered feature in Lumi6 Skill Lab.
Each function returns (system_prompt, user_prompt) tuples.
"""

from __future__ import annotations


# ---------------------------------------------------------------------------
# Layer 4 — Sprint Content Generation
# ---------------------------------------------------------------------------

def primer_cards_prompt(skill_name: str, sub_skills: list[str], user_context: dict) -> tuple[str, str]:
    """Generate 5 primer cards for a skill sprint."""
    system = (
        "You are Lumi6, an AI-native learning platform. Generate exactly 5 primer cards "
        "that introduce a workplace skill. Each card should build understanding progressively. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"Generate 5 primer cards for the skill: **{skill_name}**\n"
        f"Sub-skills covered: {', '.join(sub_skills)}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n"
        f"Seniority: {user_context.get('seniority', 'Mid-level')}\n\n"
        "Return JSON with this exact structure:\n"
        '{\n'
        '  "cards": [\n'
        '    {\n'
        '      "title": "Card title",\n'
        '      "content": "2-3 sentence explanation tailored to the user\'s role and industry",\n'
        '      "icon": "one of: target, brain, alert-triangle, trending-up, check-circle"\n'
        '    }\n'
        '  ]\n'
        '}\n\n'
        "Card 1: Why this skill matters for their specific role\n"
        "Card 2: The science/research behind deliberate practice for this skill\n"
        "Card 3: Common pitfalls professionals at their level face\n"
        "Card 4: What they'll practice in this sprint\n"
        "Card 5: Their measurable goal for this sprint"
    )
    return system, user


def micro_skills_prompt(skill_name: str, sub_skills: list[str], user_context: dict) -> tuple[str, str]:
    """Generate micro-skills with good/bad examples."""
    system = (
        "You are Lumi6, an AI-native learning platform. Generate micro-skill breakdowns "
        "with concrete workplace examples. Respond ONLY with valid JSON."
    )
    user = (
        f"Generate micro-skill cards for: **{skill_name}**\n"
        f"Sub-skills: {', '.join(sub_skills)}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n\n"
        "For each sub-skill, create a micro-skill card. Return JSON:\n"
        '{\n'
        '  "microSkills": [\n'
        '    {\n'
        '      "id": "ms-1",\n'
        '      "name": "Sub-skill name",\n'
        '      "description": "What this micro-skill is and why it matters",\n'
        '      "goodExample": "A concrete workplace example of doing this WELL",\n'
        '      "badExample": "A concrete workplace example of doing this POORLY",\n'
        '      "tip": "One actionable tip to practice this immediately"\n'
        '    }\n'
        '  ]\n'
        '}'
    )
    return system, user


def scenarios_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    mode: str = "guided",
) -> tuple[str, str]:
    """Generate contextual simulation scenarios."""
    difficulty_map = {
        "guided": "easy to medium",
        "independent": "medium to hard",
        "escalated": "hard to extreme",
    }
    difficulty = difficulty_map.get(mode, "medium")

    system = (
        "You are Lumi6, an AI simulation scenario designer. Generate realistic workplace "
        "scenarios that test specific competencies. Each scenario must have a distinct AI character "
        "with a name, personality, and motivation. Respond ONLY with valid JSON."
    )
    user = (
        f"Generate 3 simulation scenarios for: **{skill_name}**\n"
        f"Difficulty range: {difficulty}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n"
        f"Seniority: {user_context.get('seniority', 'Mid-level')}\n\n"
        "Return JSON:\n"
        '{\n'
        '  "scenarios": [\n'
        '    {\n'
        '      "id": "s1",\n'
        '      "title": "Short scenario title",\n'
        '      "difficulty": "easy|medium|hard",\n'
        '      "context": "2-3 sentence scenario setup with specific workplace situation",\n'
        '      "aiCharacterName": "Full Name",\n'
        '      "aiCharacterRole": "Their role (e.g. VP of Operations)",\n'
        '      "aiCharacterPersonality": "Brief personality description and emotional state",\n'
        '      "objective": "What the user should try to achieve in this conversation"\n'
        '    }\n'
        '  ]\n'
        '}\n\n'
        f"Make scenarios relevant to a {user_context.get('role', 'Professional')} "
        f"in {user_context.get('industry', 'a corporate environment')}."
    )
    return system, user


# ---------------------------------------------------------------------------
# Layer 5 — Simulation Engine
# ---------------------------------------------------------------------------

def simulation_character_prompt(
    scenario: dict,
    skill_name: str,
    mode: str,
    user_context: dict,
) -> str:
    """
    System prompt for the AI character in a simulation.
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
# Layer 6 — Evaluation Engine
# ---------------------------------------------------------------------------

def drill_evaluation_prompt(
    drill_prompt: str,
    user_response: str,
    expected_behavior: str,
) -> tuple[str, str]:
    """Evaluate a drill response against expected behavior."""
    system = (
        "You are Lumi6's AI evaluation engine. Score a user's response to a workplace "
        "challenge drill. Be honest but constructive. Respond ONLY with valid JSON."
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


def simulation_evaluation_prompt(
    transcript: list[dict],
    skill_name: str,
    scenario_context: str,
) -> tuple[str, str]:
    """Evaluate a completed simulation across 7 dimensions."""
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


# ---------------------------------------------------------------------------
# Layer 6 — Reflection Agent
# ---------------------------------------------------------------------------

def reflection_analysis_prompt(
    trigger: str,
    change: str,
    pattern: str,
    skill_name: str,
) -> tuple[str, str]:
    """Analyze user's self-reflection for emotional patterns."""
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
# Reporting Layer
# ---------------------------------------------------------------------------

def report_generation_prompt(
    skill_name: str,
    evaluations: list[dict],
    reflections: list[dict],
    user_context: dict,
) -> tuple[str, str]:
    """Generate a comprehensive competency report."""
    eval_summary = "\n".join(
        f"- Simulation {i+1}: Overall {e.get('overallScore', 'N/A')}/100, "
        f"Empathy {e.get('empathy', 'N/A')}, Clarity {e.get('clarity', 'N/A')}, "
        f"Composure {e.get('composure', 'N/A')}"
        for i, e in enumerate(evaluations)
    )

    system = (
        "You are Lumi6's report generation engine. Create a comprehensive competency report "
        "that synthesizes all simulation evaluations and reflections into actionable insights. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL: {skill_name}\n"
        f"USER: {user_context.get('role', 'Professional')} in {user_context.get('industry', 'General')}\n\n"
        f"EVALUATION HISTORY:\n{eval_summary}\n\n"
        f"Number of reflections completed: {len(reflections)}\n\n"
        "Generate a comprehensive report. Return JSON:\n"
        '{\n'
        '  "readiness_score": 0-100,\n'
        '  "readiness_label": "novice|developing|competent|proficient|expert",\n'
        '  "executive_summary": "3-4 sentence executive summary of their journey and current level",\n'
        '  "dimension_assessments": {\n'
        '    "empathy": {"score": 0-100, "trend": "improving|stable|declining|needs_work|strong", "insight": "1 sentence"},\n'
        '    "clarity": {"score": 0-100, "trend": "...", "insight": "..."},\n'
        '    "composure": {"score": 0-100, "trend": "...", "insight": "..."},\n'
        '    "listening": {"score": 0-100, "trend": "...", "insight": "..."},\n'
        '    "assertiveness": {"score": 0-100, "trend": "...", "insight": "..."},\n'
        '    "conflict_management": {"score": 0-100, "trend": "...", "insight": "..."},\n'
        '    "escalation_control": {"score": 0-100, "trend": "...", "insight": "..."}\n'
        '  },\n'
        '  "top_strengths": ["strength 1", "strength 2", "strength 3"],\n'
        '  "critical_weaknesses": ["weakness 1", "weakness 2", "weakness 3"],\n'
        '  "recommendations": ["actionable rec 1", "actionable rec 2", "actionable rec 3", "actionable rec 4"],\n'
        '  "improvement_narrative": "3-4 sentences describing their behavioral evolution across simulations"\n'
        '}'
    )
    return system, user
