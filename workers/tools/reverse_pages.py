# workers/tools/reverse_pages.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput


class ReversePagesInput(ToolInput):
    input_path: str
    output_path: str


class ReversePagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: ReversePagesInput) -> ReversePagesOutput:
    with pikepdf.open(params.input_path) as pdf:
        page_count = len(pdf.pages)
        pdf.pages.reverse()
        pdf.save(params.output_path)

    return ReversePagesOutput(
        output_path=params.output_path,
        diff_summary=f"Reversed the order of all {page_count} page(s).",
        page_count=page_count,
    )