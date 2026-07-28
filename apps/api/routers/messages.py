from fastapi import APIRouter
from pydantic import BaseModel
from collections import Counter
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

    doc_meta = {}
    label_to_doc_id = {}
    documents_for_planner = []
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

    # A labels tuple appearing MORE THAN ONCE across results means one
    # original document fanned out into multiple divergent outputs (a
    # split) — none of those can be "the next version" of the original,
    # since there's more than one of them. Only a labels tuple that
    # appears exactly once is a normal 1:1 edit eligible for a version update.
    label_counts = Counter(tuple(entry["labels"]) for entry in result["results"])
    split_part_counter: dict[tuple, int] = {}

    for entry in result["results"]:
        labels = entry["labels"]
        local_path = entry["path"]
        labels_key = tuple(labels)
        is_fanout = label_counts[labels_key] > 1

        if not is_fanout and len(labels) == 1 and local_path == doc_paths[labels[0]]:
            target_doc_id = label_to_doc_id[labels[0]]
            head = get_head_version(target_doc_id)
            response_documents.append({
                "document_id": target_doc_id,
                "filename": get_document_filename(target_doc_id),
                "download_url": get_presigned_download_url(head["storage_key"], inline=True),
                "page_count": head["page_count"],
                "can_undo": head["parent_version_id"] is not None,
            })
            continue

        with pikepdf.open(local_path) as pdf:
            page_count = len(pdf.pages)

        if not is_fanout and len(labels) == 1:
            target_doc_id = label_to_doc_id[labels[0]]
            head = get_head_version(target_doc_id)
            new_storage_key = f"{target_doc_id}/v_{uuid.uuid4().hex[:8]}.pdf"
            upload_file(local_path, new_storage_key)
            create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"], parent_version_id=head["version_id"])
            response_documents.append({
                "document_id": target_doc_id,
                "filename": get_document_filename(target_doc_id),
                "download_url": get_presigned_download_url(new_storage_key, inline=True),
                "page_count": page_count,
                "can_undo": True,
            })

        elif is_fanout:
            split_part_counter[labels_key] = split_part_counter.get(labels_key, 0) + 1
            part_number = split_part_counter[labels_key]
            source_name = get_document_filename(label_to_doc_id[labels[0]]) if len(labels) == 1 else "document"
            base_name = os.path.splitext(source_name)[0]
            filename = f"{base_name}_part{part_number}.pdf"

            target_doc_id = create_document(filename)
            new_storage_key = f"{target_doc_id}/v0.pdf"
            upload_file(local_path, new_storage_key)
            create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"])
            response_documents.append({
                "document_id": target_doc_id,
                "filename": filename,
                "download_url": get_presigned_download_url(new_storage_key, inline=True),
                "page_count": page_count,
                "can_undo": False,
            })

        else:
            target_doc_id = create_document("merged_result.pdf")
            new_storage_key = f"{target_doc_id}/v0.pdf"
            upload_file(local_path, new_storage_key)
            create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"])
            response_documents.append({
                "document_id": target_doc_id,
                "filename": "merged_result.pdf",
                "download_url": get_presigned_download_url(new_storage_key, inline=True),
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
        "documents": response_documents,
        "diff_summary": result["diff_summary"],
    }