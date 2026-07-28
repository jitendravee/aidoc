from __future__ import annotations
import io
import pikepdf
from reportlab.pdfgen import canvas
from workers.tools.base import ToolInput, ToolOutput, open_pdf


class AddPageNumbersInput(ToolInput):
    input_path: str
    output_path: str
    position: str = "bottom-center"  # "bottom-center" | "bottom-right"


class AddPageNumbersOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def _number_overlay(page_num: int, total: int, position: str, width: float, height: float) -> pikepdf.Pdf:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(width, height))
    c.setFont("Helvetica", 10)
    text = f"{page_num} / {total}"
    if position == "bottom-right":
        c.drawRightString(width - 36, 24, text)
    else:
        c.drawCentredString(width / 2, 24, text)
    c.save()
    buffer.seek(0)
    return pikepdf.open(buffer)


def run(params: AddPageNumbersInput) -> AddPageNumbersOutput:
    with open_pdf(params.input_path) as pdf:
        total = len(pdf.pages)
        for i, page in enumerate(pdf.pages, start=1):
            box = page.mediabox
            width = float(box[2]) - float(box[0])
            height = float(box[3]) - float(box[1])
            with _number_overlay(i, total, params.position, width, height) as overlay:
                page.add_overlay(overlay.pages[0]) # type: ignore

        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    return AddPageNumbersOutput(
        output_path=params.output_path,
        diff_summary=f"Added page numbers to all {page_count} pages.",
        page_count=page_count,
    )