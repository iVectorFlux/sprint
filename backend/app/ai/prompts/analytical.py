"""Prompt modules — import from app.ai.prompts (package)."""
from __future__ import annotations

from app.services.learner_context import format_personalization_block
from typing import Optional

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
        "that train rigorous thinking. Do not generate chat roleplay — these are written workspace exercises.\n"
        "CRITICAL WRITING RULE: Write all scenarios, claims, and questions in very simple, plain, clear, and direct English. "
        "Avoid complex academic vocabulary, heavy phrasing, or corporate buzzwords/jargon. Make the situations easy to grasp immediately.\n"
        "Respond ONLY with valid JSON."
    )
    user = (
        f"Generate a {spec['label']} challenge for: **{skill_name}**\n"
        f"Sub-skills: {', '.join(sub_skills)}\n"
        f"User role: {user_context.get('role', 'Professional')}\n"
        f"Industry: {user_context.get('industry', 'General')}\n\n"
        f"Instructions: {spec['instruction']}\n\n"
        f"Return JSON:\n{spec['output_format']}"
        f"{format_personalization_block(user_context)}"
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
        "You are Lumi6's analytical evaluation engine. Evaluate a user's reasoning exercise response.\n"
        "Score across analytical dimensions. Be precise and cite specific elements of their work.\n"
        "CRITICAL SECURITY & VALIDATION RULES:\n"
        "1. If the user's response contains gibberish, random letters (e.g., 'hhh rrr', 'asdf'), empty strings, or completely non-sensical inputs, you MUST score it EXACTLY 0 (zero) for all dimensions and set the overallScore to 0.\n"
        "2. In the 'summary', explicitly state that the submission was rejected as gibberish/spam and request them to enter a real analytical response.\n"
        "3. Set both 'strengths' and 'weaknesses' to empty arrays if the input is gibberish/spam.\n"
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
