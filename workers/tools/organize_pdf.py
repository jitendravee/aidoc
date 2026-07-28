from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode, open_pdf, validate_pages_in_range


class OrganizePdfInput(ToolInput):
    input_path: str
    output_path: str
    new_order: list[int]  # 1-indexed pages in their new order — must include every page exactly once


class OrganizePdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: OrganizePdfInput) -> OrganizePdfOutput:
    with open_pdf(params.input_path) as pdf:
        total = len(pdf.pages)
        validate_pages_in_range(params.new_order, total)

        if sorted(params.new_order) != list(range(1, total + 1)):
            raise ToolError(
                ToolErrorCode.UNSUPPORTED_FEATURE,
                f"new_order must include all {total} pages exactly once.",
            )

        reordered = pikepdf.new()
        for page_num in params.new_order:
            reordered.pages.append(pdf.pages[page_num - 1])
        reordered.save(params.output_path)
        page_count = len(reordered.pages)

    return OrganizePdfOutput(
        output_path=params.output_path,
        diff_summary="Reordered the document's pages.",
        page_count=page_count,
    )