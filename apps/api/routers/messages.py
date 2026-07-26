# apps/api/routers/messages.py
from fastapi import APIRouter
from pydantic import BaseModel
import os, uuid, pikepdf

from apps.api.ai.planner import plan
from apps.api.services.executor import execute_plan
from apps.api.storage.b2_client import upload_file, download_file, get_presigned_download_url
from apps.api.db.repository import create_document, get_head_version, create_version, save_message, get_recent_messages

router = APIRouter()
CACHE_DIR = "cache"


class SendMessageRequest(BaseModel):
    message: str
    document_ids: list[str]  # all documents currently in the workspace


@router.post("/documents/{document_id}/messages")
async def send_message(document_id: str, body: SendMessageRequest):
    message = body.message
    save_message(document_id, "user", message)

    history = get_recent_messages(document_id, limit=6)
    head = get_head_version(document_id)

    os.makedirs(CACHE_DIR, exist_ok=True)
    input_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}.pdf")
    download_file(head["storage_key"], input_path)

    # single document, expressed as a one-entry workspace —
    # same shape the multi-document planner/executor expect
    doc_paths = {"doc_1": input_path}
    documents = [{"label": "doc_1", "page_count": head["page_count"]}]

    result_plan = plan(message, documents, history=history)
    result = execute_plan(result_plan, doc_paths, CACHE_DIR)

    if result["status"] != "success":
        if os.path.exists(input_path):
            os.remove(input_path)
        reply_text = result.get("question") or result.get("message", "Something went wrong.")
        save_message(document_id, "assistant", reply_text)
        return result

    final_local_path = result["final_output_path"]
    new_storage_key = f"{document_id}/v_{uuid.uuid4().hex[:8]}.pdf"
    upload_file(final_local_path, new_storage_key)

    with pikepdf.open(final_local_path) as pdf:
        new_page_count = len(pdf.pages)

    create_version(
        document_id, new_storage_key, new_page_count,
        result["diff_summary"], parent_version_id=head["version_id"],
    )

    download_url = get_presigned_download_url(new_storage_key)
    save_message(document_id, "assistant", result["diff_summary"])

    if os.path.exists(input_path):
        os.remove(input_path)
    if os.path.exists(final_local_path) and final_local_path != input_path:
        os.remove(final_local_path)

    return {"status": "success", "download_url": download_url, "diff_summary": result["diff_summary"]}





@router.post("/workspace/messages")
async def send_workspace_message(body: SendMessageRequest):
    documents = []
    doc_paths = {}
    label_to_id = {}

    for i, doc_id in enumerate(body.document_ids, start=1):
        label = f"doc_{i}"
        label_to_id[label] = doc_id
        head = get_head_version(doc_id)
        path = os.path.join(CACHE_DIR, f"{label}_{uuid.uuid4().hex}.pdf")
        download_file(head["storage_key"], path)
        with pikepdf.open(path) as pdf:
            page_count = len(pdf.pages)
        documents.append({"label": label, "page_count": page_count})
        doc_paths[label] = path

    result_plan = plan(body.message, documents)
    result = execute_plan(result_plan, doc_paths, CACHE_DIR)

    if result["status"] != "success":
        for p in doc_paths.values():
            if os.path.exists(p):
                os.remove(p)
        return result

    final_local_path = result["final_output_path"]
    # decide which document(s) this result becomes the new head for —
    # if merged, this creates a NEW document entity, not a version of an existing one
    new_document_id = create_document("merged_result.pdf")
    new_storage_key = f"{new_document_id}/v0.pdf"
    upload_file(final_local_path, new_storage_key)
    with pikepdf.open(final_local_path) as pdf:
        new_page_count = len(pdf.pages)
    create_version(new_document_id, new_storage_key, new_page_count, result["diff_summary"])

    download_url = get_presigned_download_url(new_storage_key)

    for p in doc_paths.values():
        if os.path.exists(p):
            os.remove(p)
    if os.path.exists(final_local_path):
        os.remove(final_local_path)

    return {
        "status": "success",
        "document_id": new_document_id,
        "download_url": download_url,
        "diff_summary": result["diff_summary"],
    }