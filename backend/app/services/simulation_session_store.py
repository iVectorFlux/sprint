"""
Simulation session store — Upstash Redis REST with in-memory fallback.

Env:
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  SIMULATION_SESSION_TTL_SECONDS (default 14400 = 4h)
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any, Optional

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

SESSION_KEY_PREFIX = "sim:session:"
DEFAULT_TTL_SECONDS = int(os.environ.get("SIMULATION_SESSION_TTL_SECONDS", "14400"))


class SimulationSessionStore:
    def __init__(self) -> None:
        self._url = (os.environ.get("UPSTASH_REDIS_REST_URL") or "").rstrip("/")
        self._token = os.environ.get("UPSTASH_REDIS_REST_TOKEN") or ""
        self._ttl = DEFAULT_TTL_SECONDS
        self._memory: dict[str, dict[str, Any]] = {}
        self.redis_enabled = bool(self._url and self._token)
        if self.redis_enabled:
            logger.info("Simulation sessions: Upstash Redis enabled")
        else:
            logger.warning(
                "Simulation sessions: Upstash not configured — using in-memory store "
                "(sessions lost on restart)"
            )

    def _redis_key(self, simulation_id: str) -> str:
        return f"{SESSION_KEY_PREFIX}{simulation_id}"

    async def _redis_command(self, *args: str) -> Any:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                self._url,
                headers={"Authorization": f"Bearer {self._token}"},
                json=list(args),
            )
            response.raise_for_status()
            data = response.json()
            if data.get("error"):
                raise RuntimeError(data["error"])
            return data.get("result")

    async def get(self, simulation_id: str) -> Optional[dict[str, Any]]:
        if not self.redis_enabled:
            return self._memory.get(simulation_id)

        raw = await self._redis_command("GET", self._redis_key(simulation_id))
        if raw is None:
            return None
        if isinstance(raw, str):
            return json.loads(raw)
        return raw

    async def set(self, simulation_id: str, session: dict[str, Any]) -> None:
        if not self.redis_enabled:
            self._memory[simulation_id] = session
            return

        payload = json.dumps(session, default=str)
        await self._redis_command(
            "SET",
            self._redis_key(simulation_id),
            payload,
            "EX",
            str(self._ttl),
        )

    async def delete(self, simulation_id: str) -> None:
        if not self.redis_enabled:
            self._memory.pop(simulation_id, None)
            return
        await self._redis_command("DEL", self._redis_key(simulation_id))


_store: Optional[SimulationSessionStore] = None


def get_simulation_session_store() -> SimulationSessionStore:
    global _store
    if _store is None:
        _store = SimulationSessionStore()
    return _store


async def load_simulation_session(simulation_id: str) -> dict[str, Any]:
    session = await get_simulation_session_store().get(simulation_id)
    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Simulation session not found. It may have expired.",
        )
    return session


async def save_simulation_session(simulation_id: str, session: dict[str, Any]) -> None:
    await get_simulation_session_store().set(simulation_id, session)


async def delete_simulation_session(simulation_id: str) -> None:
    await get_simulation_session_store().delete(simulation_id)
