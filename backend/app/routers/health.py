"""Health check router."""

from fastapi import APIRouter
from app.services.simulation_session_store import get_simulation_session_store

router = APIRouter()


@router.get("/health")
async def health_check():
    """API health check endpoint."""
    store = get_simulation_session_store()
    return {
        "status": "healthy",
        "service": "lumi6-api",
        "version": "0.1.0",
        "simulation_sessions": "redis" if store.redis_enabled else "memory",
    }
