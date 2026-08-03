# workers/tools/grayscale_pdf.py
import fitz
from workers.tools.base import ToolInput, ToolOutput


class GrayscalePdfInput(ToolInput):
    input_path: str
    output_path: str


class GrayscalePdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: GrayscalePdfInput) -> GrayscalePdfOutput:
    doc = fitz.open(params.input_path)

    for page in doc:
        page.set_mediabox(page.rect)
        # re-render each page as a grayscale image, then replace the
        # page content — the simplest reliable way to strip color from
        # mixed text+vector+image content without per-object color math
        pix = page.get_pixmap(colorspace=fitz.csGRAY, dpi=200)
        page.clean_contents()
        page.insert_image(page.rect, pixmap=pix)

    page_count = len(doc)
    doc.save(params.output_path)
    doc.close()

    return GrayscalePdfOutput(
        output_path=params.output_path,
        diff_summary=f"Converted {page_count} page(s) to grayscale.",
        page_count=page_count,
    )