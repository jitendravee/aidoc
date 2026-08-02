from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os, uuid, pikepdf

from apps.api.ai.planner import plan
from apps.api.services.executor import execute_plan
from apps.api.services.kinds import format_extension, format_from_filename, format_kind, format_mime_type, kind_extension, kind_is_inline, kind_mime_type
from apps.api.services.pending_secure_actions import (
    create_pending_secure_action, pop_pending_secure_action,
)
from apps.api.storage.b2_client import upload_file, download_file, get_presigned_download_url
from apps.api.db.repository import (
    get_head_version, create_document, create_version,
    save_message, get_recent_messages, get_document_filename,
)

router = APIRouter()
CACHE_DIR = "cache"

# messages that cancel an in-progress password prompt instead of being
# treated as a password attempt
_CANCEL_WORDS = {"cancel", "stop", "nevermind", "never mind", "never  mind", "no"}


def _open_maybe_encrypted(path: str, password: str | None = None):
    try:
        return pikepdf.open(path)
    except pikepdf.PasswordError:
        if password is None:
            raise
        return pikepdf.open(path, password=password)


def _get_page_count(path: str, kind: str, password: str | None = None) -> int | None:
    if kind != "pdf":
        return None
    with _open_maybe_encrypted(path, password) as pdf:
        return len(pdf.pages)

def _build_response_documents(
    result: dict,
    doc_paths: dict[str, str],
    label_to_doc_id: dict[str, str],
    password: str | None = None,
) -> list[dict]:
    response_documents = []

    for entry in result["results"]:
        labels = entry["labels"]
        paths = entry["paths"]
        kind = entry["kind"]
        fmt = entry["format"]
        group_id = str(uuid.uuid4()) if len(paths) > 1 else None
        group_total = len(paths) if len(paths) > 1 else None

        # unchanged original: same file, no new version was written
        if len(paths) == 1 and len(labels) == 1 and paths[0] == doc_paths[labels[0]]:
            target_doc_id = label_to_doc_id[labels[0]]
            head = get_head_version(target_doc_id)
            resp_fmt = format_from_filename(head["storage_key"]) or "pdf"
            response_documents.append({
                "document_id": target_doc_id,
                "filename": get_document_filename(target_doc_id),
                "download_url": get_presigned_download_url(
                    head["storage_key"],
                    mime_type=format_mime_type(resp_fmt),
                    inline=kind_is_inline(format_kind(resp_fmt)),
                ),
                "kind": format_kind(resp_fmt),
                "page_count": head["page_count"],
                "can_undo": head["parent_version_id"] is not None,
                "group_id": None, "group_index": None, "group_total": None,
            })
            continue
        for i, local_path in enumerate(paths, start=1):
            page_count = _get_page_count(local_path, kind, password)
            ext = format_extension(fmt)

            if kind == "pdf" and len(paths) == 1 and len(labels) == 1:
                target_doc_id = label_to_doc_id[labels[0]]
                head = get_head_version(target_doc_id)
                new_storage_key = f"{target_doc_id}/v_{uuid.uuid4().hex[:8]}.pdf"
                upload_file(local_path, new_storage_key)
                create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"], parent_version_id=head["version_id"])
                filename = get_document_filename(target_doc_id)
                can_undo = True
            else:
                source_name = get_document_filename(label_to_doc_id[labels[0]]) if len(labels) == 1 else "document"
                base_name = os.path.splitext(source_name)[0]
                suffix = f"_part{i}" if len(paths) > 1 else ""
                filename = f"{base_name}{suffix}{ext}"

                target_doc_id = create_document(filename)
                new_storage_key = f"{target_doc_id}/v0{ext}"
                upload_file(local_path, new_storage_key)
                create_version(target_doc_id, new_storage_key, page_count, result["diff_summary"])
                can_undo = False

            response_documents.append({
                "document_id": target_doc_id,
                "filename": filename,
                "download_url": get_presigned_download_url(
                    new_storage_key,
                    mime_type=format_mime_type(fmt),
                    inline=kind_is_inline(kind),
                ),
                "kind": kind,
                "page_count": page_count,
                "can_undo": can_undo,
                "group_id": group_id,
                "group_index": i if group_total else None,
                "group_total": group_total,
            })
            os.remove(local_path)

    return response_documents


class SendMessageRequest(BaseModel):
    workspace_id: str
    message: str
    document_ids: list[str]


@router.post("/workspace/messages")
async def send_message(body: SendMessageRequest):
    os.makedirs(CACHE_DIR, exist_ok=True)
    primary_doc_id = body.document_ids[0]

    # If the last assistant turn asked this conversation for a password,
    # this message IS the password (or a cancel) — never route it through
    # the planner, and never persist the raw password text to history.
    pending_secure = pop_pending_secure_action(primary_doc_id)
    if pending_secure is not None:
        if body.message.strip().lower() in _CANCEL_WORDS:
            save_message(primary_doc_id, "user", "[cancelled]")
            reply_text = "No problem — cancelled. Let me know if you'd like to try again."
            save_message(primary_doc_id, "assistant", reply_text)
            return {"status": "chat", "message": reply_text, "error_code": None, "awaiting_password": False}
        return await _handle_secure_password(body, primary_doc_id, pending_secure)

    save_message(primary_doc_id, "user", body.message)
    history = get_recent_messages(primary_doc_id, limit=6)

    doc_meta, label_to_doc_id, documents_for_planner = {}, {}, []
    for i, doc_id in enumerate(body.document_ids, start=1):
        label = f"doc_{i}"
        label_to_doc_id[label] = doc_id
        head = get_head_version(doc_id)
        doc_meta[label] = head
        documents_for_planner.append({
            "label": label,
            "page_count": head["page_count"],
            "kind": format_kind(format_from_filename(head["storage_key"]) or "pdf"),
        })

    result_plan = plan(body.message, documents_for_planner, history=history)

    if result_plan["type"] == "password_required":
        target_label = result_plan["target"]
        action = "set" if result_plan["tool"] == "protect_pdf" else "use to unlock it"
        create_pending_secure_action(
            document_id=primary_doc_id,
            tool=result_plan["tool"],
            target_label=target_label,
            pending_steps=result_plan.get("pending_steps", []),
            label_to_doc_id=label_to_doc_id,
        )
        reply_text = f"Sure — what password would you like to {action}?"
        save_message(primary_doc_id, "assistant", reply_text)
        return {
            "status": "clarification_needed",
            "message": reply_text,
            "error_code": None,
            "awaiting_password": True,
        }

    if result_plan["type"] in ("chat", "unsupported", "clarification"):
        reply_text = result_plan.get("message", "")
        save_message(primary_doc_id, "assistant", reply_text)
        return {
            "status": "clarification_needed" if result_plan["type"] == "clarification" else result_plan["type"],
            "message": reply_text,
            "error_code": None,
            "awaiting_password": False,
        }

    doc_paths = {}
    doc_formats = {}
    for label, head in doc_meta.items():
        fmt = format_from_filename(head["storage_key"]) or "pdf"
        ext = format_extension(fmt)
        path = os.path.join(CACHE_DIR, f"{label}_{uuid.uuid4().hex}{ext}")
        download_file(head["storage_key"], path)
        doc_paths[label] = path
        doc_formats[label] = fmt

    result = execute_plan(result_plan, doc_paths, CACHE_DIR, doc_formats)

    if result["status"] != "success":
        for p in doc_paths.values():
            if os.path.exists(p):
                os.remove(p)
        error_obj = result.get("error") or {}
        reply_text = result.get("question") or error_obj.get("message", "Something went wrong — please try again.")
        save_message(primary_doc_id, "assistant", reply_text)
        return {"status": "error", "message": reply_text, "error_code": error_obj.get("code"), "awaiting_password": False}

    response_documents = _build_response_documents(result, doc_paths, label_to_doc_id)
    for p in doc_paths.values():
        if os.path.exists(p):
            os.remove(p)

    save_message(primary_doc_id, "assistant", result["diff_summary"])
    return {
        "status": "success",
        "documents": response_documents,
        "diff_summary": result["diff_summary"],
        "awaiting_password": False,
    }


async def _handle_secure_password(body: SendMessageRequest, primary_doc_id: str, pending_secure: dict) -> dict:
    password = body.message.strip()
    tool = pending_secure["tool"]
    target_label = pending_secure["target_label"]
    pending_steps = pending_secure["pending_steps"]
    label_to_doc_id = pending_secure["label_to_doc_id"]

    # never write the raw password into chat history
    save_message(primary_doc_id, "user", "[password provided]")

    needed_labels = {target_label} | {key for step in pending_steps for key in step["inputs"]}
    doc_paths = {}
    for label in needed_labels:
        doc_id = label_to_doc_id[label]
        head = get_head_version(doc_id)
        path = os.path.join(CACHE_DIR, f"{label}_{uuid.uuid4().hex}.pdf")
        download_file(head["storage_key"], path)
        doc_paths[label] = path

    steps = pending_steps + [{
        "id": f"{tool}_final",
        "tool": tool,
        "inputs": [target_label],
        "output": "result",
        "params": {"password": password},
    }]
    manual_plan = {"type": "workflow", "steps": steps, "final_outputs": ["result"]}

    result = execute_plan(manual_plan, doc_paths, CACHE_DIR)

    if result["status"] != "success":
        for p in doc_paths.values():
            if os.path.exists(p):
                os.remove(p)
        error_obj = result.get("error") or {}
        reply_text = error_obj.get("message") or "That didn't work — check the password and try again, or say 'cancel'."
        # re-arm: the *next* message is still treated as a password attempt
        create_pending_secure_action(primary_doc_id, tool, target_label, pending_steps, label_to_doc_id)
        save_message(primary_doc_id, "assistant", reply_text)
        return {
            "status": "clarification_needed",
            "message": reply_text,
            "error_code": error_obj.get("code"),
            "awaiting_password": True,
        }

    response_documents = _build_response_documents(result, doc_paths, label_to_doc_id, password=password)
    for p in doc_paths.values():
        if os.path.exists(p):
            os.remove(p)

    action_label = "Protected" if tool == "protect_pdf" else "Unlocked"
    summary = f"{result['diff_summary']}".strip() or f"{action_label} the document."
    save_message(primary_doc_id, "assistant", summary)
    return {
        "status": "success",
        "documents": response_documents,
        "diff_summary": summary,
        "awaiting_password": False,
    }