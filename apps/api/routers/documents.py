from fastapi import APIRouter, UploadFile
import uuid, shutil, os, pikepdf

from apps.api.storage.b2_client import upload_file, get_presigned_download_url
from apps.api.db.repository import create_document, create_version

router = APIRouter()
CACHE_DIR = "cache"  # scratch space only — not the source of truth anymore


@router.post("/documents")
async def upload_document(file: UploadFile):
    os.makedirs(CACHE_DIR, exist_ok=True)
    temp_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}.pdf")
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    with pikepdf.open(temp_path) as pdf:
        page_count = len(pdf.pages)

    document_id = create_document(file.filename) # type: ignore
    storage_key = f"{document_id}/v0.pdf"
    upload_file(temp_path, storage_key)
    create_version(document_id, storage_key, page_count, "Initial upload.")

    os.remove(temp_path)  # bytes now live only in B2 + are tracked in Neon

    download_url = get_presigned_download_url(storage_key)
    return {"document_id": document_id, "download_url": download_url, "page_count": page_count}