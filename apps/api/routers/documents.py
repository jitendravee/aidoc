from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import uuid, shutil, os, zipfile, pikepdf

from apps.api.services.kinds import (
    format_from_filename, format_extension, format_kind, format_mime_type, kind_is_inline,
)
from apps.api.storage.b2_client import upload_file, get_presigned_download_url
from apps.api.db.repository import (
    create_document, create_version, get_document_filename,
    get_head_version, revert_to_previous_version,
)
from apps.api.services.pending_uploads import create_pending_upload, pop_pending_upload

router = APIRouter()
CACHE_DIR = "cache"

# What a plain file-picker upload will accept today. docx/pptx/xlsx stay
# out of this set for now since there's no "upload one directly" flow yet
# — add them here the day you add a tool that consumes them as a source.
ACCEPTED_UPLOAD_FORMATS = {"pdf", "jpg", "png", "docx"}

def _download_url_for(storage_key: str, fmt: str) -> str:
    return get_presigned_download_url(
        storage_key,
        mime_type=format_mime_type(fmt),
        inline=kind_is_inline(format_kind(fmt)),
    )


def _response_for(document_id: str, head: dict) -> dict:
    """Single place that turns a DB version row into the API response
    shape — derives format from the storage_key's own extension, so it
    works for pdf, image, or zip documents without extra DB columns."""
    fmt = format_from_filename(head["storage_key"]) or "pdf"
    return {
        "document_id": document_id,
        "filename": get_document_filename(document_id),
        "download_url": _download_url_for(head["storage_key"], fmt),
        "kind": format_kind(fmt),
        "page_count": head["page_count"],
        "can_undo": head["parent_version_id"] is not None,
        "group_id": None,
        "group_index": None,
        "group_total": None,
    }


@router.post("/documents/{document_id}/undo")
async def undo_document(document_id: str):
    try:
        new_head = revert_to_previous_version(document_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return _response_for(document_id, new_head)


@router.get("/documents/{document_id}")
async def get_document(document_id: str):
    try:
        head = get_head_version(document_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Document not found")
    return _response_for(document_id, head)


@router.post("/documents")
async def upload_document(file: UploadFile):
    fmt = format_from_filename(file.filename or "")
    if fmt is None or fmt not in ACCEPTED_UPLOAD_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Accepted: {', '.join(sorted(ACCEPTED_UPLOAD_FORMATS))}.",
        )

    os.makedirs(CACHE_DIR, exist_ok=True)
    ext = format_extension(fmt)
    temp_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}{ext}")
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    if fmt == "pdf":
        try:
            with pikepdf.open(temp_path) as pdf:
                page_count = len(pdf.pages)
        except pikepdf.PasswordError:
            token = create_pending_upload(temp_path, file.filename)  # type: ignore
            return {"status": "password_required", "upload_token": token, "filename": file.filename}
    else:
        page_count = None  # images have no page concept

    document_id = create_document(file.filename)  # type: ignore
    storage_key = f"{document_id}/v0{ext}"
    upload_file(temp_path, storage_key)
    create_version(document_id, storage_key, page_count, "Initial upload.")
    os.remove(temp_path)

    return {"status": "success", **_response_for(document_id, {
        "storage_key": storage_key, "page_count": page_count, "parent_version_id": None,
    })}


@router.post("/documents/batch-images")
async def upload_images_batch(files: list[UploadFile] = File(...)):
    """Bundles N image uploads into ONE zip document instead of N
    separate documents/storage objects — avoids N presigned-upload round
    trips and N DB rows when someone drops in e.g. 100 photos meant to
    become a single PDF via images_to_pdf."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")

    os.makedirs(CACHE_DIR, exist_ok=True)
    zip_temp_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}.zip")
    temp_image_paths: list[str] = []

    try:
        entries = []
        for i, file in enumerate(files, start=1):
            fmt = format_from_filename(file.filename or "")
            if fmt not in ("jpg", "png"):
                raise HTTPException(
                    status_code=400,
                    detail=f"'{file.filename}' isn't a supported image type (jpg/png only).",
                )
            ext = format_extension(fmt)
            temp_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}_{i:04d}{ext}")
            with open(temp_path, "wb") as f:
                shutil.copyfileobj(file.file, f)  # streamed to disk, never fully in memory
            temp_image_paths.append(temp_path)
            entries.append((temp_path, f"{i:04d}{ext}"))  # zero-padded name preserves order

        with zipfile.ZipFile(zip_temp_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for temp_path, arcname in entries:
                zf.write(temp_path, arcname=arcname)
    finally:
        for p in temp_image_paths:
            if os.path.exists(p):
                os.remove(p)

    document_id = create_document(f"images_{uuid.uuid4().hex[:8]}.zip")
    storage_key = f"{document_id}/v0.zip"
    upload_file(zip_temp_path, storage_key)
    create_version(document_id, storage_key, None, f"Uploaded {len(files)} image(s) as a bundle.")
    os.remove(zip_temp_path)

    return {
        "status": "success",
        **_response_for(document_id, {"storage_key": storage_key, "page_count": None, "parent_version_id": None}),
        "image_count": len(files),
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
            pdf.save(unlocked_path)
    except pikepdf.PasswordError:
        new_token = create_pending_upload(temp_path, filename)
        return {"status": "error", "message": "Incorrect password.", "upload_token": new_token}

    document_id = create_document(filename)
    storage_key = f"{document_id}/v0.pdf"
    upload_file(unlocked_path, storage_key)
    create_version(document_id, storage_key, page_count, "Initial upload (password removed for editing).")

    os.remove(temp_path)
    os.remove(unlocked_path)

    return {"status": "success", **_response_for(document_id, {
        "storage_key": storage_key, "page_count": page_count, "parent_version_id": None,
    })}