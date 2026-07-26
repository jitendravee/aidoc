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


def get_head_version(document_id: str) -> dict:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT v.id, v.storage_key, v.page_count
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
    return {"version_id": row[0], "storage_key": row[1], "page_count": row[2]}