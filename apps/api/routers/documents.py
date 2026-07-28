from fastapi import APIRouter, HTTPException, UploadFile
from pydantic import BaseModel
import uuid, shutil, os, pikepdf

from apps.api.storage.b2_client import upload_file, get_presigned_download_url
from apps.api.db.repository import (
    create_document, create_version, get_document_filename,
    get_head_version, revert_to_previous_version,
)
from apps.api.services.pending_uploads import create_pending_upload, pop_pending_upload

router = APIRouter()
CACHE_DIR = "cache"


@router.post("/documents/{document_id}/undo")
async def undo_document(document_id: str):
    try:
        new_head = revert_to_previous_version(document_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "document_id": document_id,
        "filename": get_document_filename(document_id),
        "download_url": get_presigned_download_url(new_head["storage_key"], inline=True),
        "page_count": new_head["page_count"],
        "can_undo": new_head["parent_version_id"] is not None,
    }


@router.get("/documents/{document_id}")
async def get_document(document_id: str):
    try:
        head = get_head_version(document_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "document_id": document_id,
        "filename": get_document_filename(document_id),
        "download_url": get_presigned_download_url(head["storage_key"], inline=True),
        "page_count": head["page_count"],
        "can_undo": head["parent_version_id"] is not None,
    }


@router.post("/documents")
async def upload_document(file: UploadFile):
    os.makedirs(CACHE_DIR, exist_ok=True)
    temp_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}.pdf")
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        with pikepdf.open(temp_path) as pdf:
            page_count = len(pdf.pages)
    except pikepdf.PasswordError:
        # don't create a document yet — hold the raw bytes and make the
        # frontend collect a password before this becomes a real document
        token = create_pending_upload(temp_path, file.filename) # type: ignore
        return {"status": "password_required", "upload_token": token, "filename": file.filename}

    document_id = create_document(file.filename) # type: ignore
    storage_key = f"{document_id}/v0.pdf"
    upload_file(temp_path, storage_key)
    create_version(document_id, storage_key, page_count, "Initial upload.")
    os.remove(temp_path)

    download_url = get_presigned_download_url(storage_key, inline=True)
    return {
        "status": "success",
        "document_id": document_id,
        "filename": file.filename,
        "download_url": download_url,
        "page_count": page_count,
    }


class CompleteUploadRequest(BaseModel):
    upload_token: str
    password: str


@router.post("/documents/complete-upload")
async def complete_upload(body: CompleteUploadRequest):
    pending = pop_pending_upload(body.upload_token)
    if pending is None:
        raise HTTPException(status_code=404, detail="Upload session expired or not found — please re-upload the file.")

    temp_path = pending["temp_path"]
    filename = pending["filename"]

    try:
        with pikepdf.open(temp_path, password=body.password) as pdf:
            page_count = len(pdf.pages)
            unlocked_path = os.path.join(CACHE_DIR, f"unlocked_{uuid.uuid4().hex}.pdf")
            pdf.save(unlocked_path)  # saving with no `encryption=` strips the protection
    except pikepdf.PasswordError:
        # put it back so the user can retry without re-uploading the file
        new_token = create_pending_upload(temp_path, filename)
        return {"status": "error", "message": "Incorrect password.", "upload_token": new_token}

    document_id = create_document(filename)
    storage_key = f"{document_id}/v0.pdf"
    upload_file(unlocked_path, storage_key)
    create_version(document_id, storage_key, page_count, "Initial upload (password removed for editing).")

    os.remove(temp_path)
    os.remove(unlocked_path)

    return {
        "status": "success",
        "document_id": document_id,
        "filename": filename,
        "download_url": get_presigned_download_url(storage_key, inline=True),
        "page_count": page_count,
    }