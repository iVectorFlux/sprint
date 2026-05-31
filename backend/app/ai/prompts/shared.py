"""Prompt modules — import from app.ai.prompts (package)."""
from __future__ import annotations
from typing import Optional

def primer_cards_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    archetype: str = "conversational",
    focus_sub_skill: Optional[str] = None,
    atomic_skills: Optional[list[str]] = None,
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
        f"{archetype_context}\n"
        "CRITICAL WRITING RULE:\n"
        "Do NOT write seniority fluff or intro sentences like 'As a mid-level professional in the corporate industry...' or mention titles/seniority. "
        "Explain concepts and details objectively and directly.\n"
        "Respond ONLY with valid JSON."
    )
    
    if focus_sub_skill:
        sub_skills_str = f"Focus sub-skill: **{focus_sub_skill}**"
        if atomic_skills:
            sub_skills_str += f"\nAtomic building blocks: {', '.join(atomic_skills)}"
        
        user = (
            f"Generate 5 primer cards specifically focusing on the sub-skill: **{focus_sub_skill}** (parent skill: **{skill_name}**)\n"
            f"{sub_skills_str}\n"
            f"User role: {user_context.get('role', 'Professional')}\n"
            f"Industry: {user_context.get('industry', 'General')}\n"
            f"Seniority: {user_context.get('seniority', 'Mid-level')}\n\n"
            "Return JSON with this exact structure:\n"
            '{\n'
            '  "cards": [\n'
            '    {\n'
            '      "title": "Card title",\n'
            '      "body": "2-3 sentence explanation tailored to the user\'s role and industry",\n'
            '      "detail": "Extended detail/concrete application box content (2-3 sentences of deep context or actionable advice)"\n'
            '    }\n'
            '  ]\n'
            '}\n\n'
            "Card 1: What is this sub-skill (a clear, direct, quick brief on what it is and what it comprises)\n"
            "Card 2: Why this matters now for modern workplace collaboration and effectiveness\n"
            "Card 3: Common pitfalls professionals face regarding this sub-skill\n"
            "Card 4: What they'll practice in this sprint (focusing on its atomic building blocks)\n"
            "Card 5: Their measurable goal for this sub-skill sprint"
        )
    else:
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
            '      "body": "2-3 sentence explanation tailored to the user\'s role and industry",\n'
            '      "detail": "Extended detail/concrete application box content (2-3 sentences of deep context or actionable advice)"\n'
            '    }\n'
            '  ]\n'
            '}\n\n'
            "Card 1: What is this skill (a clear, direct, quick brief on what it is and what it comprises)\n"
            "Card 2: Why this matters now for modern workplace collaboration and effectiveness\n"
            "Card 3: Common pitfalls professionals face\n"
            "Card 4: What they'll practice in this sprint\n"
            "Card 5: Their measurable goal for this sprint"
        )
    return system, user


def micro_skills_prompt(
    skill_name: str,
    sub_skills: list[str],
    user_context: dict,
    archetype: str = "conversational",
    focus_sub_skill: Optional[str] = None,
    atomic_skills: Optional[list[str]] = None,
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
    
    if focus_sub_skill and atomic_skills:
        user = (
            f"Generate micro-skill cards for the sub-skill: **{focus_sub_skill}** (parent skill: **{skill_name}**)\n"
            f"Atomic building blocks to break down: {', '.join(atomic_skills)}\n"
            f"User role: {user_context.get('role', 'Professional')}\n"
            f"Industry: {user_context.get('industry', 'General')}\n"
            f"Note: {example_guidance}\n\n"
            "For each atomic building block, create a micro-skill card. Return JSON:\n"
            '{\n'
            '  "microSkills": [\n'
            '    {\n'
            '      "id": "ms-1",\n'
            '      "name": "Atomic skill name",\n'
            '      "whatItIs": "1-2 sentence definition explaining what this atomic skill is",\n'
            '      "whyItMatters": "1-2 sentence explanation of why this atomic skill is crucial for their role and industry",\n'
            '      "goodExample": "A concrete workplace example of doing this WELL",\n'
            '      "badExample": "A concrete workplace example of doing this POORLY"\n'
            '    }\n'
            '  ]\n'
            '}'
        )
    else:
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
            '      "whatItIs": "1-2 sentence definition explaining what this micro-skill is",\n'
            '      "whyItMatters": "1-2 sentence explanation of why this micro-skill is crucial for their role and industry",\n'
            '      "goodExample": "A concrete workplace example of doing this WELL",\n'
            '      "badExample": "A concrete workplace example of doing this POORLY"\n'
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
    focus_sub_skill: Optional[str] = None,
    atomic_skills: Optional[list[str]] = None,
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
        "You are Lumi6, an AI-native learning platform. Generate focused, highly concrete practice drills "
        "for workplace skills. Each drill should challenge a specific micro-skill.\n"
        "CRITICAL RULES:\n"
        "1. Every drill's 'context' MUST be a highly specific, concrete, realistic workplace scenario or situation (e.g., specific conversations, product metrics, launch details, team disagreements). NEVER use generic or abstract templates like 'You are analyzing a complex problem that requires X.'\n"
        "2. Every drill's 'prompt' MUST end with a practical, helpful hint or tip formatted exactly as: '\\n\\n💡 Hint: [actionable guidance on how to think about or solve this challenge].'\n"
        "Respond ONLY with valid JSON."
    )
    
    if focus_sub_skill and atomic_skills:
        num_drills = len(atomic_skills)
        user = (
            f"Generate exactly {num_drills} practice drills for the sub-skill: **{focus_sub_skill}** (parent skill: **{skill_name}**)\n"
            f"Generate exactly ONE drill for each of the following atomic building blocks: {', '.join(atomic_skills)}\n"
            f"Make sure you map each drill to a unique atomic building block from the list, with NO duplicates.\n"
            f"Drill type: {drill_specs['type_label']}\n"
            f"User role: {user_context.get('role', 'Professional')}\n"
            f"Industry: {user_context.get('industry', 'General')}\n"
            f"Instructions: {drill_specs['instruction']}\n\n"
            "Return JSON:\n"
            '{\n'
            '  "drills": [\n'
            '    {\n'
            '      "id": "d1",\n'
            '      "microSkill": "Name of the atomic skill being tested (must match one of the atomic building blocks exactly)",\n'
            '      "type": "{drill_specs["type"]}",\n'
            '      "context": "2-3 sentence situation setup",\n'
            '      "prompt": "The specific challenge or question for the user",\n'
            '      "expectedBehavior": "What a strong response demonstrates"\n'
            '    }\n'
            '  ]\n'
            '}'
        )
    else:
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
            '      "id": "d1",\n'
            '      "microSkill": "Name of the sub-skill being tested",\n'
            '      "type": "{drill_specs["type"]}",\n'
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

