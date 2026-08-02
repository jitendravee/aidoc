# workers/tools/redact_pages.py
import fitz
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode
from pydantic import BaseModel


class RedactionBox(BaseModel):
    page: int          # 1-indexed
    x: float            # points, from left
    y: float             # points, from top
    width: float
    height: float


class RedactPagesInput(ToolInput):
    input_path: str
    output_path: str
    boxes: list[RedactionBox]


class RedactPagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: RedactPagesInput) -> RedactPagesOutput:
    if not params.boxes:
        raise ToolError(code=ToolErrorCode.INVALID_INPUT, message="No redaction areas specified.") # type: ignore

    doc = fitz.open(params.input_path)

    for box in params.boxes:
        if box.page < 1 or box.page > len(doc):
            raise ToolError(code=ToolErrorCode.INVALID_INPUT, message=f"Document has {len(doc)} pages — page {box.page} doesn't exist.") # type: ignore
        page = doc[box.page - 1]
        rect = fitz.Rect(box.x, box.y, box.x + box.width, box.y + box.height)
        page.add_redact_annot(rect, fill=(0, 0, 0))
        page.apply_redactions()  # permanently removes underlying text/images, not just a visual overlay

    page_count = len(doc)
    doc.save(params.output_path)
    doc.close()

    return RedactPagesOutput(
        output_path=params.output_path,
        diff_summary=f"Redacted {len(params.boxes)} area(s) across the document.",
        page_count=page_count,
    )