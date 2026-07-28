# workers/tools/crop_pdf.py
from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, open_pdf, validate_pages_in_range


class CropPdfInput(ToolInput):
    input_path: str
    output_path: str
    margin_points: float = 36  # ~0.5 inch
    pages: list[int] | None = None  # 1-indexed; None means every page


class CropPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: CropPdfInput) -> CropPdfOutput:
    with open_pdf(params.input_path) as pdf:
        total = len(pdf.pages)
        target_pages = params.pages if params.pages is not None else list(range(1, total + 1))
        validate_pages_in_range(target_pages, total)

        m = params.margin_points
        for page_num in target_pages:
            page = pdf.pages[page_num - 1]
            box = page.mediabox
            x0, y0, x1, y1 = float(box[0]), float(box[1]), float(box[2]), float(box[3])
            page.mediabox = [x0 + m, y0 + m, x1 - m, y1 - m]  # type: ignore

        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    if params.pages is None:
        summary = f"Cropped {m}pt margin from every page."
    else:
        pages_str = ", ".join(str(p) for p in target_pages)
        summary = f"Cropped {m}pt margin from page(s) {pages_str}."

    return CropPdfOutput(output_path=params.output_path, diff_summary=summary, page_count=page_count)