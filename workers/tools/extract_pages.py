from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, open_pdf, validate_pages_in_range


class ExtractPagesInput(ToolInput):
    input_path: str
    output_path: str
    pages: list[int]  # 1-indexed pages to pull out into a new document


class ExtractPagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: ExtractPagesInput) -> ExtractPagesOutput:
    with open_pdf(params.input_path) as pdf:
        validate_pages_in_range(params.pages, len(pdf.pages))

        extracted = pikepdf.new()
        for page_num in params.pages:  # preserve requested order, not sorted
            extracted.pages.append(pdf.pages[page_num - 1])
        extracted.save(params.output_path)
        page_count = len(extracted.pages)

    pages_str = ", ".join(str(p) for p in params.pages)
    return ExtractPagesOutput(
        output_path=params.output_path,
        diff_summary=f"Extracted page(s) {pages_str} into a new document.",
        page_count=page_count,
    )