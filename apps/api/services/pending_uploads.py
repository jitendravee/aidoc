# apps/api/services/pending_uploads.py
import uuid

# in-memory only — fine for a single dev process; a restart loses any
# pending (unfinished) password-protected uploads, which is an acceptable
# gap for now (same category as the cache/ cleanup gap flagged earlier)
_PENDING: dict[str, dict] = {}

def create_pending_upload(temp_path: str, filename: str) -> str:
    token = uuid.uuid4().hex
    _PENDING[token] = {"temp_path": temp_path, "filename": filename}
    return token

def get_pending_upload(token: str) -> dict | None:
    return _PENDING.get(token)

def pop_pending_upload(token: str) -> dict | None:
    return _PENDING.pop(token, None)