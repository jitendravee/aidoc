from __future__ import annotations
from workers.tools.base import ToolInput, ToolOutput, ToolErrorCode, ToolError, open_pdf, validate_pages_in_range


class DeletePagesInput(ToolInput):
    input_path: str
    output_path: str
    pages: list[int]


class DeletePagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: DeletePagesInput) -> DeletePagesOutput:
    with open_pdf(params.input_path) as pdf:
        validate_pages_in_range(params.pages, len(pdf.pages))

        for page_num in sorted(set(params.pages), reverse=True):
            del pdf.pages[page_num - 1]

        if len(pdf.pages) == 0:
            raise ToolError(
                ToolErrorCode.UNSUPPORTED_FEATURE,
                "Deleting these pages would leave an empty document.",
            )

        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    pages_str = ", ".join(str(p) for p in sorted(set(params.pages)))
    return DeletePagesOutput(
        output_path=params.output_path,
        diff_summary=f"Removed page(s) {pages_str}. Document now has {page_count} pages.",
        page_count=page_count,
    )