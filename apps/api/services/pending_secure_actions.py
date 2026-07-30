# apps/api/services/pending_secure_actions.py
"""Remembers an in-progress protect/unlock flow between chat turns.

The chat now asks for the password as a normal message instead of
opening a separate modal + endpoint. Between "assistant asks for the
password" and "user replies with it" there's no other state carrying
that intent forward — this is that state, keyed by the conversation's
primary document_id.

NOTE: in-memory, same tradeoff as pending_uploads — fine for a single
process, move to Redis/DB if you ever run more than one worker.
"""

import time

_TTL_SECONDS = 600
_pending: dict[str, dict] = {}


def create_pending_secure_action(
    document_id: str,
    tool: str,
    target_label: str,
    pending_steps: list[dict],
    label_to_doc_id: dict[str, str],
) -> None:
    _pending[document_id] = {
        "tool": tool,
        "target_label": target_label,
        "pending_steps": pending_steps,
        "label_to_doc_id": label_to_doc_id,
        "created_at": time.time(),
    }


def peek_pending_secure_action(document_id: str) -> dict | None:
    entry = _pending.get(document_id)
    if entry is None:
        return None
    if time.time() - entry["created_at"] > _TTL_SECONDS:
        _pending.pop(document_id, None)
        return None
    return entry


def pop_pending_secure_action(document_id: str) -> dict | None:
    entry = peek_pending_secure_action(document_id)
    if entry is not None:
        _pending.pop(document_id, None)
    return entry


def clear_pending_secure_action(document_id: str) -> None:
    _pending.pop(document_id, None)