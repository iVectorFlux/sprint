"""
Unified LLM client for Lumi6 Skill Lab.
Supports any OpenAI-compatible API (Groq, OpenAI, Together, etc).
"""

from __future__ import annotations

import os
import json
import logging
from typing import Any, Dict, List, Optional

from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# Lazy singleton
_client: Optional[AsyncOpenAI] = None


def _get_client() -> AsyncOpenAI:
    """Get or create the LLM client. Supports Groq, OpenAI, or any compatible API."""
    global _client
    if _client is None:
        # Check for API key: GROQ_API_KEY > OPENAI_API_KEY
        api_key = os.environ.get("GROQ_API_KEY") or os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "No LLM API key found. Set GROQ_API_KEY or OPENAI_API_KEY in backend/.env"
            )

        # Base URL: defaults to Groq if GROQ_API_KEY is set
        base_url = os.environ.get("LLM_BASE_URL")
        if not base_url:
            if os.environ.get("GROQ_API_KEY"):
                base_url = "https://api.groq.com/openai/v1"
            # If only OPENAI_API_KEY, leave base_url as None (uses OpenAI default)

        _client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        provider = "Groq" if "groq" in (base_url or "") else "OpenAI"
        model = os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")
        logger.info("LLM client initialized: %s (%s)", provider, model)

    return _client


async def chat_completion(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 2048,
    json_mode: bool = False,
) -> str:
    """
    Send a single-turn chat completion.
    Returns the assistant's response text.
    """
    model = model or os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")
    client = _get_client()

    kwargs: Dict[str, Any] = {
        "model": model,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }

    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    response = await client.chat.completions.create(**kwargs)
    return response.choices[0].message.content or ""


async def chat_completion_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> Dict[str, Any]:
    """
    Chat completion that returns parsed JSON.
    Falls back to empty dict on parse failure.
    """
    raw = await chat_completion(
        system_prompt,
        user_prompt,
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        json_mode=True,
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        logger.error("Failed to parse LLM JSON response: %s", raw[:500])
        return {}


async def multi_turn_completion(
    messages: List[Dict[str, str]],
    *,
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    json_mode: bool = False,
) -> str:
    """
    Multi-turn chat completion for simulations.
    `messages` should be a list of {"role": ..., "content": ...} dicts.
    """
    model = model or os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")
    client = _get_client()

    kwargs: Dict[str, Any] = {
        "model": model,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "messages": messages,
    }

    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    response = await client.chat.completions.create(**kwargs)
    return response.choices[0].message.content or ""
