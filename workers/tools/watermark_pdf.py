from __future__ import annotations
import io
import pikepdf
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from workers.tools.base import ToolInput, ToolOutput, open_pdf


class WatermarkPdfInput(ToolInput):
    input_path: str
    output_path: str
    text: str
    opacity: float = 0.3  # 0.0-1.0


class WatermarkPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def _make_watermark_overlay(text: str, opacity: float, page_width: float, page_height: float) -> pikepdf.Pdf:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(page_width, page_height))
    c.saveState()
    c.setFillColor(Color(0.5, 0.5, 0.5, alpha=opacity))
    c.setFont("Helvetica-Bold", 40)
    c.translate(page_width / 2, page_height / 2)
    c.rotate(45)
    c.drawCentredString(0, 0, text)
    c.restoreState()
    c.save()
    buffer.seek(0)
    return pikepdf.open(buffer)


def run(params: WatermarkPdfInput) -> WatermarkPdfOutput:
    with open_pdf(params.input_path) as pdf:
        for page in pdf.pages:
            box = page.mediabox
            width = float(box[2]) - float(box[0])
            height = float(box[3]) - float(box[1])

            with _make_watermark_overlay(params.text, params.opacity, width, height) as overlay:
                page.add_overlay(overlay.pages[0]) # type: ignore

        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    return WatermarkPdfOutput(
        output_path=params.output_path,
        diff_summary=f'Added watermark "{params.text}" to all {page_count} pages.',
        page_count=page_count,
    )