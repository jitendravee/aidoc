# workers/tools/images_to_pdf.py
import os
import shutil
import tempfile
import zipfile
import fitz  # PyMuPDF
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode

_IMAGE_EXTS = (".jpg", ".jpeg", ".png")


class ImagesToPdfInput(ToolInput):
    input_paths: list[str]   # each entry is either a single image file OR a .zip bundle of images
    output_path: str


class ImagesToPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def _collect_image_paths(input_paths: list[str]) -> tuple[list[str], list[str]]:
    """Expands any .zip entries into their contained images, sorted by
    filename (the batch-upload endpoint zero-pads names so this sort
    reproduces the original selection order). Returns (image_paths,
    temp_dirs_to_clean_up)."""
    image_paths: list[str] = []
    temp_dirs: list[str] = []

    for p in input_paths:
        if p.lower().endswith(".zip"):
            extract_dir = tempfile.mkdtemp(prefix="imgzip_")
            temp_dirs.append(extract_dir)
            with zipfile.ZipFile(p) as zf:
                zf.extractall(extract_dir)
            for name in sorted(os.listdir(extract_dir)):
                if name.lower().endswith(_IMAGE_EXTS):
                    image_paths.append(os.path.join(extract_dir, name))
        elif p.lower().endswith(_IMAGE_EXTS):
            image_paths.append(p)

    return image_paths, temp_dirs


def run(params: ImagesToPdfInput) -> ImagesToPdfOutput:
    image_paths, temp_dirs = _collect_image_paths(params.input_paths)

    if not image_paths:
        for d in temp_dirs:
            shutil.rmtree(d, ignore_errors=True)
        raise ToolError(code=ToolErrorCode.INVALID_INPUT, message="No images found to combine.") # type: ignore

    doc = fitz.open()
    try:
        for img_path in image_paths:
            img_doc = fitz.open(img_path)
            rect = img_doc[0].rect
            page = doc.new_page(width=rect.width, height=rect.height)
            page.insert_image(rect, filename=img_path)
            img_doc.close()

        doc.save(params.output_path)
        page_count = len(doc)
    finally:
        doc.close()
        for d in temp_dirs:
            shutil.rmtree(d, ignore_errors=True)

    return ImagesToPdfOutput(
        output_path=params.output_path,
        diff_summary=f"Combined {page_count} image(s) into a single PDF.",
        page_count=page_count,
    )