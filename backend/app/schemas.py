"""Pydantic schemas for API request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


# --- Enums ---

class UserRole(str, Enum):
    learner = "learner"
    manager = "manager"
    admin = "admin"
    super_admin = "super_admin"


class SprintStatus(str, Enum):
    not_started = "not_started"
    active = "active"
    paused = "paused"
    completed = "completed"
    abandoned = "abandoned"


class StageType(str, Enum):
    primer = "primer"
    micro_skills = "micro_skills"
    micro_drills = "micro_drills"
    guided_simulation = "guided_simulation"
    independent_simulation = "independent_simulation"
    replay_analysis = "replay_analysis"
    reflection = "reflection"
    escalated_retry = "escalated_retry"
    final_assessment = "final_assessment"
    report = "report"
    reinforcement = "reinforcement"


class LearningEngineType(str, Enum):
    simulation_based = "simulation_based"
    structured_reasoning = "structured_reasoning"
    consequence_simulation = "consequence_simulation"
    stress_simulation = "stress_simulation"
    reflective_ai_mirror = "reflective_ai_mirror"
    recovery_conditioning = "recovery_conditioning"
    cognitive_conflict = "cognitive_conflict"
    constraint_architecture = "constraint_architecture"


# --- Response Schemas ---

class SkillResponse(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    learning_engine_type: LearningEngineType
    icon: Optional[str] = None

    class Config:
        from_attributes = True


class SubSkillResponse(BaseModel):
    id: str
    skill_id: str
    name: str
    description: Optional[str] = None
    difficulty_level: int

    class Config:
        from_attributes = True


class SkillWithSubSkillsResponse(SkillResponse):
    sub_skills: list[SubSkillResponse] = []


class SprintResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str] = None
    primary_skill_id: str
    status: SprintStatus
    current_stage: Optional[StageType] = None
    target_hours: int = 20
    completed_hours: float = 0
    readiness_score: Optional[float] = None
    confidence_score: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.learner
    department: Optional[str] = None
    seniority: Optional[str] = None
    onboarding_completed: bool = False

    class Config:
        from_attributes = True


# --- Request Schemas ---

class CreateSprintRequest(BaseModel):
    skill_id: str
    title: Optional[str] = None


class UpdateUserRequest(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    seniority: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    years_experience: Optional[int] = None


class TelemetryEventRequest(BaseModel):
    sprint_id: Optional[str] = None
    event_type: str
    payload: dict = Field(default_factory=dict)
