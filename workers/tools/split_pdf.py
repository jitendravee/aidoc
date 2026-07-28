from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, open_pdf, validate_pages_in_range


class SplitPdfInput(ToolInput):
    input_path: str
    output_paths: list[str]  # exactly two: [first_half_path, second_half_path]
    split_after_page: int


class SplitPdfOutput(ToolOutput):
    output_paths: list[str]
    diff_summary: str
    page_counts: list[int]


def run(params: SplitPdfInput) -> SplitPdfOutput:
    if len(params.output_paths) != 2:
        raise ToolError(ToolErrorCode.INTERNAL_ERROR, "split_pdf requires exactly two output paths.")

    with open_pdf(params.input_path) as pdf:
        total = len(pdf.pages)
        validate_pages_in_range([params.split_after_page], total)

        first = pikepdf.new()
        first.pages.extend(pdf.pages[: params.split_after_page])
        first.save(params.output_paths[0])
        first_count = len(first.pages)

        second = pikepdf.new()
        second.pages.extend(pdf.pages[params.split_after_page :])
        second.save(params.output_paths[1])
        second_count = len(second.pages)

    return SplitPdfOutput(
        output_paths=list(params.output_paths),
        diff_summary=f"Split into two documents after page {params.split_after_page}: {first_count} and {second_count} pages.",
        page_counts=[first_count, second_count],
    )