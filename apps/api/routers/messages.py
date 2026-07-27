# apps/api/routers/messages.py
from fastapi import APIRouter
from pydantic import BaseModel
import os, uuid, pikepdf

from apps.api.ai.planner import plan
from apps.api.services.executor import execute_plan
from apps.api.storage.b2_client import upload_file, download_file, get_presigned_download_url
from apps.api.db.repository import (
    get_head_version, create_document, create_version,
    save_message, get_recent_messages, get_document_filename,
)

router = APIRouter()
CACHE_DIR = "cache"


class SendMessageRequest(BaseModel):
    workspace_id: str
    message: str
    document_ids: list[str]


@router.post("/workspace/messages")
async def send_message(body: SendMessageRequest):
    os.makedirs(CACHE_DIR, exist_ok=True)

    primary_doc_id = body.document_ids[0]
    save_message(primary_doc_id, "user", body.message)
    history = get_recent_messages(primary_doc_id, limit=6)

    # page counts only — no downloads yet, planner doesn't need file bytes
    doc_meta = {}
    documents_for_planner = []
    label_to_doc_id = {}
    for i, doc_id in enumerate(body.document_ids, start=1):
        label = f"doc_{i}"
        label_to_doc_id[label] = doc_id
        head = get_head_version(doc_id)
        doc_meta[label] = head
        documents_for_planner.append({"label": label, "page_count": head["page_count"]})

    result_plan = plan(body.message, documents_for_planner, history=history)

    if result_plan["type"] in ("chat", "unsupported", "clarification"):
        reply_text = result_plan.get("message", "")
        save_message(primary_doc_id, "assistant", reply_text)
        return {
            "status": "clarification_needed" if result_plan["type"] == "clarification" else result_plan["type"],
            "question": reply_text if result_plan["type"] == "clarification" else None,
            "message": reply_text,
        }

    # only NOW download files, since we know an actual edit is happening
    doc_paths = {}
    for label, head in doc_meta.items():
        path = os.path.join(CACHE_DIR, f"{label}_{uuid.uuid4().hex}.pdf")
        download_file(head["storage_key"], path)
        doc_paths[label] = path

    result = execute_plan(result_plan, doc_paths, CACHE_DIR)

    if result["status"] != "success":
        for p in doc_paths.values():
            if os.path.exists(p):
                os.remove(p)
        reply_text = result.get("question") or result.get("message", "Something went wrong.")
        save_message(primary_doc_id, "assistant", reply_text)
        return result

    response_documents = []

    for entry in result["results"]:
        labels = entry["labels"]
        local_path = entry["path"]

        # untouched document — path never changed, so reuse its existing
        # head version instead of uploading a pointless duplicate version
        if len(labels) == 1 and local_path == doc_paths[labels[0]]:
            target_doc_id = label_to_doc_id[labels[0]]
            head = get_head_version(target_doc_id)
            response_documents.append({
                "document_id": target_doc_id,
                "filename": get_document_filename(target_doc_id),
                "download_url": get_presigned_download_url(head["storage_key"],inline=True),
                "page_count": head["page_count"],        
                "can_undo": head["parent_version_id"] is not None,

            })
            continue

        with pikepdf.open(local_path) as pdf:
            page_count = len(pdf.pages)

        if len(labels) == 1:
            target_doc_id = label_to_doc_id[labels[0]]
            head = get_head_version(target_doc_id)
            new_storage_key = f"{target_doc_id}/v_{uuid.uuid4().hex[:8]}.pdf"
            upload_file(local_path, new_storage_key)
            create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"], parent_version_id=head["version_id"])
            filename = get_document_filename(target_doc_id)
            response_documents.append({
                        "document_id": target_doc_id,
                        "filename": filename,
                        "download_url": get_presigned_download_url(new_storage_key,inline=True),
                        "page_count": page_count,
                        "can_undo": True,
            
            })

        else:
            # merge result — this is a genuinely NEW document in the
            # workspace; the labels it consumed are no longer standalone
            target_doc_id = create_document("merged_result.pdf")
            new_storage_key = f"{target_doc_id}/v0.pdf"
            upload_file(local_path, new_storage_key)
            create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"])
            filename = "merged_result.pdf"
            response_documents.append({
                        "document_id": target_doc_id,
                        "filename": filename,
                        "download_url": get_presigned_download_url(new_storage_key,inline=True),
                        "page_count": page_count,
                        "can_undo": False,
            
            })

       
        os.remove(local_path)

    for p in doc_paths.values():
        if os.path.exists(p):
            os.remove(p)

    save_message(primary_doc_id, "assistant", result["diff_summary"])

    return {
        "status": "success",
        "documents": response_documents,   # <-- the fix: FE now knows the CURRENT workspace state
        "diff_summary": result["diff_summary"],
    }