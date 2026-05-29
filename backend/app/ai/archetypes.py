"""
Archetype resolver for Lumi6 Skill Lab.

This is the core of the scalable architecture:
  100+ skills → 6 archetypes → 6 session engines

Instead of storing "engine = custom" per skill, every skill maps to an
archetype, and the archetype fully defines:
  - Which session engine runs the practice
  - What stage flow the sprint follows
  - What evaluation dimensions are scored
  - What prompt style is used to generate content

Adding a new skill = assign it an archetype. No new engine code needed.
"""

from __future__ import annotations

from typing import TypedDict


# ---------------------------------------------------------------------------
# Archetype configuration objects
# ---------------------------------------------------------------------------

class ArchetypeConfig(TypedDict):
    session_engine: str
    stage_flow: list[str]
    simulation_capabilities: list[str]
    evaluation_dimensions: list[str]
    drill_type: str          # what kind of drills this archetype uses
    content_style: str       # how primer/micro-skills should be written


ARCHETYPES: dict[str, ArchetypeConfig] = {
    # -------------------------------------------------------------------------
    # 1. CONVERSATIONAL — roleplay with AI character, pushback, escalation
    # -------------------------------------------------------------------------
    "conversational": {
        "session_engine": "roleplay_engine",
        "stage_flow": [
            "primer",
            "micro_skills",
            "micro_drills",
            "guided_simulation",
            "independent_simulation",
            "replay_analysis",
            "reflection",
            "escalated_retry",
            "report",
        ],
        "simulation_capabilities": [
            "roleplay",
            "pushback",
            "escalation",
            "conversation_replay",
        ],
        "evaluation_dimensions": [
            "empathy",
            "clarity",
            "composure",
            "listening",
            "assertiveness",
            "conflict_management",
            "escalation_control",
        ],
        "drill_type": "scenario",
        "content_style": "dialogue_focused",
    },

    # -------------------------------------------------------------------------
    # 2. ANALYTICAL — reasoning workspace, assumption mapping, counterfactuals
    # -------------------------------------------------------------------------
    "analytical": {
        "session_engine": "reasoning_engine",
        "stage_flow": [
            "primer",
            "micro_skills",
            "micro_drills",
            "reasoning_workspace",
            "evidence_analysis",
            "counterfactual_challenge",
            "reflection",
            "reasoning_assessment",
            "report",
        ],
        "simulation_capabilities": [
            "assumption_mapping",
            "evidence_analysis",
            "counterfactual_generation",
            "structured_argument",
        ],
        "evaluation_dimensions": [
            "logical_rigor",
            "assumption_awareness",
            "evidence_quality",
            "counterfactual_thinking",
            "synthesis",
            "depth_of_analysis",
        ],
        "drill_type": "analysis",
        "content_style": "framework_focused",
    },

    # -------------------------------------------------------------------------
    # 3. REFLECTIVE — journaling, pattern detection, behavior analysis
    # -------------------------------------------------------------------------
    "reflective": {
        "session_engine": "reflection_engine",
        "stage_flow": [
            "primer",
            "micro_skills",
            "guided_reflection",
            "pattern_detection",
            "behavior_analysis",
            "growth_plan",
            "report",
        ],
        "simulation_capabilities": [
            "guided_journaling",
            "pattern_detection",
            "behavior_analysis",
            "emotional_mapping",
        ],
        "evaluation_dimensions": [
            "self_awareness_depth",
            "pattern_recognition",
            "emotional_granularity",
            "growth_orientation",
            "behavioral_specificity",
            "insight_quality",
        ],
        "drill_type": "reflection",
        "content_style": "introspective",
    },

    # -------------------------------------------------------------------------
    # Phase 2 stubs — configs present so the resolver never fails
    # -------------------------------------------------------------------------
    "creation": {
        "session_engine": "creation_engine",
        "stage_flow": ["primer", "micro_skills", "report"],
        "simulation_capabilities": ["create", "review", "annotate", "revise"],
        "evaluation_dimensions": ["clarity", "structure", "originality", "impact"],
        "drill_type": "creation",
        "content_style": "writing_focused",
    },
    "performance": {
        "session_engine": "performance_engine",
        "stage_flow": ["primer", "micro_skills", "report"],
        "simulation_capabilities": ["record", "transcribe", "analyze", "re_record"],
        "evaluation_dimensions": ["delivery", "presence", "engagement", "structure"],
        "drill_type": "performance",
        "content_style": "delivery_focused",
    },
    "systems": {
        "session_engine": "systems_engine",
        "stage_flow": ["primer", "micro_skills", "report"],
        "simulation_capabilities": ["canvas", "dependency_mapping", "constraint_injection"],
        "evaluation_dimensions": ["systems_depth", "dependency_clarity", "leverage_identification"],
        "drill_type": "design",
        "content_style": "systems_focused",
    },
}


# ---------------------------------------------------------------------------
# Public resolver API
# ---------------------------------------------------------------------------

def resolve_archetype(archetype: str) -> ArchetypeConfig:
    """
    Return full engine config for a given archetype name.
    Falls back to 'conversational' if archetype is unknown.
    """
    return ARCHETYPES.get(archetype, ARCHETYPES["conversational"])


def get_stage_flow(archetype: str) -> list[str]:
    """Return the ordered stage list for a given archetype."""
    return resolve_archetype(archetype)["stage_flow"]


def get_evaluation_dimensions(archetype: str) -> list[str]:
    """Return the evaluation dimension keys for a given archetype."""
    return resolve_archetype(archetype)["evaluation_dimensions"]


def get_drill_type(archetype: str) -> str:
    """Return the drill type string for a given archetype."""
    return resolve_archetype(archetype)["drill_type"]


def get_session_engine(archetype: str) -> str:
    """Return the session engine identifier for a given archetype."""
    return resolve_archetype(archetype)["session_engine"]


def get_content_style(archetype: str) -> str:
    """Return the content generation style for primer/micro-skills."""
    return resolve_archetype(archetype)["content_style"]


def archetype_from_skill(skill_data: dict) -> str:
    """
    Extract archetype from a skill DB record.
    Falls back to 'conversational' if not set.
    """
    return skill_data.get("archetype") or "conversational"
