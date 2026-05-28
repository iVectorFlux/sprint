"""
Lumi6 Skill Lab — FastAPI Backend
AI-native adaptive skill learning platform API
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routers import skills, sprints, users, simulations, health
from app.routers import sprint_content, sprint_simulation, sprint_evaluation
from app.routers import dev as dev_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup/shutdown."""
    # Startup
    print("🚀 Lumi6 API starting...")
    print("📡 AI-native endpoints: content, simulation, evaluation")
    yield
    # Shutdown
    print("🛑 Lumi6 API shutting down...")


app = FastAPI(
    title="Lumi6 Skill Lab API",
    description="AI-native adaptive skill learning and simulation platform API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, tags=["Health"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(skills.router, prefix="/api/v1/skills", tags=["Skills"])
app.include_router(sprints.router, prefix="/api/v1/sprints", tags=["Sprints"])
app.include_router(simulations.router, prefix="/api/v1/simulations", tags=["Simulations"])

# AI-native sprint endpoints
app.include_router(sprint_content.router, prefix="/api/v1/sprint/content", tags=["Sprint Content (AI)"])
app.include_router(sprint_simulation.router, prefix="/api/v1/sprint", tags=["Simulation Engine (AI)"])
app.include_router(sprint_evaluation.router, prefix="/api/v1/sprint", tags=["Sprint Evaluation (AI)"])

# Dev-mode endpoints (no auth required)
app.include_router(dev_router.router, prefix="/api/v1", tags=["Dev"])
