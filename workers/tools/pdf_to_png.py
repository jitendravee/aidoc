# workers/tools/pdf_to_png.py
import os
import fitz  # PyMuPDF
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class PdfToPngInput(ToolInput):
    input_path: str
    output_dir: str
    dpi: int = 150


class PdfToPngOutput(ToolOutput):
    output_paths: list[str]
    diff_summary: str
    page_count: int


def run(params: PdfToPngInput) -> PdfToPngOutput:
    doc = fitz.open(params.input_path)

    if doc.is_encrypted:
        raise ToolError(
            code=ToolErrorCode.ENCRYPTED_PDF,
            message="This PDF is password-protected. Please use the 'unlock_pdf' tool to remove the password before converting."
        )

    zoom = params.dpi / 72
    output_paths = []

    for i, page in enumerate(doc, start=1):  # type: ignore
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        out_path = os.path.join(params.output_dir, f"page_{i}.png")
        pix.save(out_path)  # PyMuPDF infers format from extension
        output_paths.append(out_path)

    page_count = len(doc)
    doc.close()

    return PdfToPngOutput(
        output_paths=output_paths,
        diff_summary=f"Converted {page_count} page(s) to PNG images.",
        page_count=page_count,
    )