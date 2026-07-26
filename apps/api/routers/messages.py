# apps/api/routers/messages.py
from fastapi import APIRouter
from pydantic import BaseModel
import os, uuid, pikepdf

from apps.api.ai.planner import plan
from apps.api.services.executor import execute_plan
from apps.api.storage.b2_client import upload_file, download_file, get_presigned_download_url
from apps.api.db.repository import get_head_version, create_document, create_version, save_message, get_recent_messages

router = APIRouter()
CACHE_DIR = "cache"


class SendMessageRequest(BaseModel):
    message: str
    document_ids: list[str]


@router.post("/workspace/messages")
async def send_message(body: SendMessageRequest):
    os.makedirs(CACHE_DIR, exist_ok=True)

    # only log/read history against the FIRST document for now —
    # good enough while merge conversations are rare; revisit if
    # multi-document conversations get long and need shared memory
    primary_doc_id = body.document_ids[0]
    save_message(primary_doc_id, "user", body.message)
    history = get_recent_messages(primary_doc_id, limit=6)

    doc_paths = {}
    documents = []
    for i, doc_id in enumerate(body.document_ids, start=1):
        label = f"doc_{i}"
        head = get_head_version(doc_id)
        path = os.path.join(CACHE_DIR, f"{label}_{uuid.uuid4().hex}.pdf")
        download_file(head["storage_key"], path)
        doc_paths[label] = path
        documents.append({"label": label, "page_count": head["page_count"]})

    result_plan = plan(body.message, documents, history=history)
    result = execute_plan(result_plan, doc_paths, CACHE_DIR)

    if result["status"] != "success":
        for p in doc_paths.values():
            if os.path.exists(p):
                os.remove(p)
        reply_text = result.get("question") or result.get("message", "Something went wrong.")
        save_message(primary_doc_id, "assistant", reply_text)
        return result

    final_local_path = result["final_output_path"]
    was_merge = len(body.document_ids) > 1

    if was_merge:
        new_document_id = create_document("merged_result.pdf")
        target_doc_id = new_document_id
        parent_version_id = None
    else:
        target_doc_id = primary_doc_id
        head = get_head_version(primary_doc_id)
        parent_version_id = head["version_id"]

    new_storage_key = f"{target_doc_id}/v_{uuid.uuid4().hex[:8]}.pdf"
    upload_file(final_local_path, new_storage_key)

    with pikepdf.open(final_local_path) as pdf:
        new_page_count = len(pdf.pages)

    create_version(target_doc_id, new_storage_key, new_page_count, result["diff_summary"], parent_version_id=parent_version_id)
    download_url = get_presigned_download_url(new_storage_key)
    save_message(primary_doc_id, "assistant", result["diff_summary"])

    for p in doc_paths.values():
        if os.path.exists(p):
            os.remove(p)
    if os.path.exists(final_local_path) and final_local_path not in doc_paths.values():
        os.remove(final_local_path)

    return {
        "status": "success",
        "document_id": target_doc_id,
        "download_url": download_url,
        "diff_summary": result["diff_summary"],
    }