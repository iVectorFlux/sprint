"""Supabase client initialization for the backend."""

from __future__ import annotations

import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

_client = None


def get_supabase():
    """Get or create Supabase client (uses service role key for full access)."""
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL", "")
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        if not url or not key:
            logger.warning("Supabase not configured — database features disabled")
            return None
        try:
            from supabase import create_client
            _client = create_client(url, key)
        except ImportError:
            logger.warning("supabase package not installed — database features disabled")
            return None
    return _client
