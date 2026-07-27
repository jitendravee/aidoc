import uuid
from apps.api.db.database import get_connection


def create_document(original_filename: str) -> str:
    document_id = str(uuid.uuid4())
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO documents (id, original_filename) VALUES (%s, %s)",
        (document_id, original_filename),
    )
    conn.commit()
    cur.close()
    conn.close()
    return document_id

def save_message(workspace_id: str, role: str, content: str) -> None:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO messages (id, workspace_id, role, content) VALUES (%s, %s, %s, %s)",
        (str(uuid.uuid4()), workspace_id, role, content),
    )
    conn.commit()
    cur.close()
    conn.close()

def get_recent_messages(workspace_id: str, limit: int = 6) -> list[dict]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT role, content FROM messages
           WHERE workspace_id = %s
           ORDER BY created_at DESC LIMIT %s""",
        (workspace_id, limit),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{"role": r, "content": c} for r, c in reversed(rows)]
# apps/api/db/repository.py — add this
def get_document_filename(document_id: str) -> str:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT original_filename FROM documents WHERE id = %s", (document_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row[0] if row else "document.pdf"


def create_version(document_id, storage_key, page_count, diff_summary, parent_version_id=None):
    version_id = str(uuid.uuid4())
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO versions (id, document_id, parent_version_id, storage_key, page_count, diff_summary)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (version_id, document_id, parent_version_id, storage_key, page_count, diff_summary),
    )
    cur.execute("UPDATE documents SET head_version_id = %s WHERE id = %s", (version_id, document_id))
    conn.commit()
    cur.close()
    conn.close()
    return version_id


# apps/api/db/repository.py
def get_head_version(document_id: str) -> dict:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT v.id, v.storage_key, v.page_count, v.parent_version_id
           FROM versions v
           JOIN documents d ON d.head_version_id = v.id
           WHERE d.id = %s""",
        (document_id,),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row is None:
        raise ValueError(f"No head version found for document {document_id}")
    return {"version_id": row[0], "storage_key": row[1], "page_count": row[2], "parent_version_id": row[3]}


def revert_to_previous_version(document_id: str) -> dict:
    head = get_head_version(document_id)
    if head["parent_version_id"] is None:
        raise ValueError("This document has no earlier version to revert to.")
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE documents SET head_version_id = %s WHERE id = %s", (head["parent_version_id"], document_id))
    conn.commit()
    cur.close()
    conn.close()
    return get_head_version(document_id)