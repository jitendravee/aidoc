# workers/tools/pdf_to_txt.py
import fitz
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class PdfToTxtInput(ToolInput):
    input_path: str
    output_path: str


class PdfToTxtOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: PdfToTxtInput) -> PdfToTxtOutput:
    doc = fitz.open(params.input_path)
    text_parts = [page.get_text() for page in doc]
    page_count = len(doc)
    doc.close()

    full_text = "\n\n".join(text_parts).strip() # type: ignore
    if not full_text:
        raise ToolError(
            code=ToolErrorCode.CONVERSION_FAILED, # type: ignore
            message="No extractable text was found — this document may be a scanned image with no real text layer.",
        )

    with open(params.output_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    return PdfToTxtOutput(
        output_path=params.output_path,
        diff_summary=f"Extracted plain text from {page_count} page(s).",
        page_count=page_count,
    )