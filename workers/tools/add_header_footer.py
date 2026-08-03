# workers/tools/add_header_footer.py
import fitz
from workers.tools.base import ToolInput, ToolOutput

_POSITIONS = {
    "header-left": lambda w, h: (36, 24),
    "header-center": lambda w, h: (w / 2, 24),
    "header-right": lambda w, h: (w - 36, 24),
    "footer-left": lambda w, h: (36, h - 24),
    "footer-center": lambda w, h: (w / 2, h - 24),
    "footer-right": lambda w, h: (w - 36, h - 24),
}


class AddHeaderFooterInput(ToolInput):
    input_path: str
    output_path: str
    text: str
    position: str = "footer-center"  # one of _POSITIONS keys
    font_size: int = 9


class AddHeaderFooterOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: AddHeaderFooterInput) -> AddHeaderFooterOutput:
    placer = _POSITIONS.get(params.position, _POSITIONS["footer-center"])
    doc = fitz.open(params.input_path)

    for page in doc:
        x, y = placer(page.rect.width, page.rect.height)
        align = 1 if "center" in params.position else (2 if "right" in params.position else 0)
        page.insert_text(
            (x, y), params.text, fontsize=params.font_size,
            color=(0.3, 0.3, 0.3),
        ) if align == 0 else page.insert_textbox(
            fitz.Rect(0, y - 10, page.rect.width, y + 10), params.text,
            fontsize=params.font_size, color=(0.3, 0.3, 0.3), align=align,
        )

    page_count = len(doc)
    doc.save(params.output_path)
    doc.close()

    return AddHeaderFooterOutput(
        output_path=params.output_path,
        diff_summary=f"Added header/footer text to {page_count} page(s).",
        page_count=page_count,
    )