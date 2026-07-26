from fastapi import APIRouter
import os, uuid, pikepdf

from apps.api.ai.planner import plan
from apps.api.services.executor import execute_plan
from apps.api.storage.b2_client import upload_file, download_file, get_presigned_download_url
from apps.api.db.repository import get_head_version, create_version

router = APIRouter()
CACHE_DIR = "cache"


@router.post("/documents/{document_id}/messages")
async def send_message(document_id: str, message: str):
    head = get_head_version(document_id)

    os.makedirs(CACHE_DIR, exist_ok=True)
    input_path = os.path.join(CACHE_DIR, f"{uuid.uuid4().hex}.pdf")
    download_file(head["storage_key"], input_path)  # pull current head down from B2

    result_plan = plan(message, head["page_count"])
    output_path = os.path.join(CACHE_DIR, f"v_{uuid.uuid4().hex[:8]}.pdf")
    result = execute_plan(result_plan, input_path, output_path)

    if result["status"] != "success":
        os.remove(input_path)
        return result

    final_local_path = result["final_output_path"]
    new_storage_key = f"{document_id}/v_{uuid.uuid4().hex[:8]}.pdf"
    upload_file(final_local_path, new_storage_key)

    with pikepdf.open(final_local_path) as pdf:
        new_page_count = len(pdf.pages)

    create_version(
        document_id,
        new_storage_key,
        new_page_count,
        result["diff_summary"],
        parent_version_id=head["version_id"],
    )

    download_url = get_presigned_download_url(new_storage_key)

    os.remove(input_path)
    os.remove(final_local_path)

    return {"status": "success", "download_url": download_url, "diff_summary": result["diff_summary"]}