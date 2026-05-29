"""
Prompt templates for every AI-powered feature in Lumi6 Skill Lab.
Each function returns (system_prompt, user_prompt) tuples.

Prompts are organized by archetype:
  - Shared (primer, micro-skills, drills)
  - Conversational archetype (simulation character, evaluation)
  - Analytical archetype (reasoning workspace, evidence, counterfactuals)
  - Reflective archetype (guided journaling, pattern detection, growth plan)
"""

from __future__ import annotations


# ---------------------------------------------------------------------------
# Shared — Primer Cards (archetype-aware)
# ---------------------------------------------------------------------------

def primer_cards_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    archetype: str = "conversational",
) -> tuple[str, str]:
    """Generate 5 primer cards for a skill sprint, styled for the archetype."""

    archetype_context = {
        "conversational": (
            "This skill is practiced through live AI dialogue roleplay. "
            "Your primer should emphasize real-world conversation scenarios, "
            "what people actually say wrong, and what effective dialogue looks like."
        ),
        "analytical": (
            "This skill is practiced through structured reasoning workspaces. "
            "Your primer should emphasize frameworks, cognitive pitfalls, "
            "and how to build rigorous arguments from evidence."
        ),
        "reflective": (
            "This skill is practiced through guided journaling and self-reflection. "
            "Your primer should emphasize personal awareness, pattern recognition, "
            "and the importance of examining one's own behavioral defaults."
        ),
    }.get(archetype, "")

    system = (
        "You are Lumi6, an AI-native learning platform. Generate exactly 5 primer cards "
        "that introduce a workplace skill. Each card should build understanding progressively. "
        f"{archetype_context} "
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


def micro_skills_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    archetype: str = "conversational",
) -> tuple[str, str]:
    """Generate micro-skills with good/bad examples, styled for the archetype."""

    example_guidance = {
        "conversational": "good/bad examples should be dialogue exchanges or responses people actually say.",
        "analytical": "good/bad examples should be reasoning samples — show sound vs flawed logic.",
        "reflective": "good/bad examples should be self-reflection entries — show deep vs shallow introspection.",
    }.get(archetype, "good/bad examples should be concrete workplace situations.")

    system = (
        "You are Lumi6, an AI-native learning platform. Generate micro-skill breakdowns "
        "with concrete workplace examples. Respond ONLY with valid JSON."
    )
    user = (
        f"Generate micro-skill cards for: **{skill_name}**\n"
        f"Sub-skills: {', '.join(sub_skills)}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n"
        f"Note: {example_guidance}\n\n"
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


# ---------------------------------------------------------------------------
# Shared — Drills (archetype-aware)
# ---------------------------------------------------------------------------

def drills_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    archetype: str = "conversational",
) -> tuple[str, str]:
    """Generate drills appropriate for the archetype's practice mode."""

    drill_specs = {
        "conversational": {
            "type": "scenario",
            "type_label": "Scenario Response",
            "instruction": (
                "Each drill presents a workplace dialogue situation. "
                "The prompt asks the user to respond as they would in real life."
            ),
        },
        "analytical": {
            "type": "analysis",
            "type_label": "Analysis Exercise",
            "instruction": (
                "Each drill presents a problem or argument. "
                "The prompt asks the user to identify assumptions, evaluate evidence, "
                "or apply a specific reasoning framework."
            ),
        },
        "reflective": {
            "type": "reflection",
            "type_label": "Reflection Prompt",
            "instruction": (
                "Each drill asks the user to recall a real past experience and reflect on it. "
                "The prompt should guide them to examine their own reactions, patterns, and defaults."
            ),
        },
    }.get(archetype, {"type": "scenario", "type_label": "Challenge", "instruction": ""})

    system = (
        "You are Lumi6, an AI-native learning platform. Generate focused practice drills "
        "for workplace skills. Each drill should challenge a specific micro-skill. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"Generate 6 practice drills for: **{skill_name}**\n"
        f"Sub-skills: {', '.join(sub_skills[:6])}\n"
        f"Drill type: {drill_specs['type_label']}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n"
        f"Instructions: {drill_specs['instruction']}\n\n"
        "Return JSON:\n"
        '{\n'
        '  "drills": [\n'
        '    {\n'
        f'      "id": "d1",\n'
        f'      "microSkill": "Name of the sub-skill being tested",\n'
        f'      "type": "{drill_specs["type"]}",\n'
        '      "context": "2-3 sentence situation setup",\n'
        '      "prompt": "The specific challenge or question for the user",\n'
        '      "expectedBehavior": "What a strong response demonstrates"\n'
        '    }\n'
        '  ]\n'
        '}'
    )
    return system, user


# ---------------------------------------------------------------------------
# Conversational Archetype — Scenario Generation
# ---------------------------------------------------------------------------

def scenarios_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    mode: str = "guided",
) -> tuple[str, str]:
    """Generate contextual simulation scenarios for conversational skills."""
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
# Conversational Archetype — Simulation Engine
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Analytical Archetype — Reasoning Workspace
# ---------------------------------------------------------------------------

def reasoning_challenge_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    mode: str = "assumptions",
) -> tuple[str, str]:
    """
    Generate a reasoning workspace challenge.
    mode: 'assumptions' | 'evidence' | 'counterfactual'
    """
    mode_specs = {
        "assumptions": {
            "label": "Assumption Mapping",
            "instruction": (
                "Present a realistic workplace scenario or claim. "
                "Ask the user to identify 3-5 hidden assumptions behind it, "
                "then rate each assumption's validity and explain what would change if it were false."
            ),
            "output_format": (
                '{\n'
                '  "challenge_type": "assumptions",\n'
                '  "title": "Short descriptive title",\n'
                '  "scenario": "2-3 sentence workplace scenario or claim to analyze",\n'
                '  "central_claim": "The main claim or decision being analyzed",\n'
                '  "starter_assumptions": ["example assumption 1", "example assumption 2"],\n'
                '  "guiding_questions": ["question 1", "question 2", "question 3"],\n'
                '  "strong_response_criteria": ["criterion 1", "criterion 2", "criterion 3"]\n'
                '}'
            ),
        },
        "evidence": {
            "label": "Evidence Analysis",
            "instruction": (
                "Present a decision scenario with 4-6 pieces of mixed evidence "
                "(some strong, some weak, some misleading). "
                "Ask the user to evaluate each piece of evidence and explain how it should "
                "or should not influence the decision."
            ),
            "output_format": (
                '{\n'
                '  "challenge_type": "evidence",\n'
                '  "title": "Short descriptive title",\n'
                '  "decision_context": "2-3 sentence description of the decision at stake",\n'
                '  "evidence_items": [\n'
                '    {"id": "e1", "label": "Evidence label", "content": "Evidence description", '
                '"actual_quality": "strong|weak|misleading"}\n'
                '  ],\n'
                '  "guiding_questions": ["question 1", "question 2"],\n'
                '  "strong_response_criteria": ["criterion 1", "criterion 2"]\n'
                '}'
            ),
        },
        "counterfactual": {
            "label": "Counterfactual Challenge",
            "instruction": (
                "Present a past decision or outcome. Generate 3 counterfactual challenges: "
                "what if a key assumption were false? What if the context changed? "
                "What is the strongest argument against the conclusion?"
            ),
            "output_format": (
                '{\n'
                '  "challenge_type": "counterfactual",\n'
                '  "title": "Short descriptive title",\n'
                '  "original_scenario": "2-3 sentence description of the situation/decision",\n'
                '  "original_conclusion": "The conclusion reached or action taken",\n'
                '  "counterfactuals": [\n'
                '    {"id": "c1", "prompt": "What if X were false?", "challenge_type": "assumption_flip|context_change|steelman"}\n'
                '  ],\n'
                '  "strong_response_criteria": ["criterion 1", "criterion 2"]\n'
                '}'
            ),
        },
    }

    spec = mode_specs.get(mode, mode_specs["assumptions"])

    system = (
        "You are Lumi6's analytical engine. Generate structured reasoning workspace challenges "
        "that train rigorous thinking. Do not generate chat roleplay — these are written workspace exercises. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"Generate a {spec['label']} challenge for: **{skill_name}**\n"
        f"Sub-skills: {', '.join(sub_skills)}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n\n"
        f"Instructions: {spec['instruction']}\n\n"
        f"Return JSON:\n{spec['output_format']}"
    )
    return system, user


def reasoning_evaluation_prompt(
    skill_name: str,
    challenge_type: str,
    challenge: dict,
    user_response: dict,
) -> tuple[str, str]:
    """
    Evaluate a user's reasoning workspace submission.
    user_response: dict with the user's answers for the challenge type.
    """
    system = (
        "You are Lumi6's analytical evaluation engine. Evaluate a user's reasoning exercise response. "
        "Score across analytical dimensions. Be precise and cite specific elements of their work. "
        "Respond ONLY with valid JSON."
    )
    user = (
        f"SKILL: {skill_name}\n"
        f"CHALLENGE TYPE: {challenge_type}\n"
        f"CHALLENGE: {challenge}\n\n"
        f"USER RESPONSE: {user_response}\n\n"
        "Evaluate and return JSON:\n"
        '{\n'
        '  "overallScore": 0-100,\n'
        '  "summary": "2-3 sentence overall assessment",\n'
        '  "logical_rigor": 0-100,\n'
        '  "assumption_awareness": 0-100,\n'
        '  "evidence_quality": 0-100,\n'
        '  "counterfactual_thinking": 0-100,\n'
        '  "synthesis": 0-100,\n'
        '  "depth_of_analysis": 0-100,\n'
        '  "strengths": ["strength 1", "strength 2"],\n'
        '  "weaknesses": ["weakness 1", "weakness 2"],\n'
        '  "key_insight_missed": "The most important thing they failed to identify",\n'
        '  "next_challenge_recommendation": "What to focus on in the next workspace challenge"\n'
        '}'
    )
    return system, user


# ---------------------------------------------------------------------------
# Reflective Archetype — Guided Journaling
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Shared — Drill Evaluation
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
