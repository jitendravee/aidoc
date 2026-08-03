# workers/tools/duplicate_pages.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class DuplicatePagesInput(ToolInput):
    input_path: str
    output_path: str
    page: int       # 1-indexed page to duplicate
    count: int = 1  # how many extra copies to insert


class DuplicatePagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: DuplicatePagesInput) -> DuplicatePagesOutput:
    with pikepdf.open(params.input_path) as pdf:
        if params.page < 1 or params.page > len(pdf.pages):
            raise ToolError(
                code=ToolErrorCode.INVALID_INPUT, # type: ignore
                message=f"Document has {len(pdf.pages)} pages — page {params.page} doesn't exist.",
            )
        if params.count < 1:
            raise ToolError(code=ToolErrorCode.INVALID_INPUT, message="Count must be at least 1.") # type: ignore

        source = pdf.pages[params.page - 1]
        for i in range(params.count):
            pdf.pages.insert(params.page + i, source)

        page_count = len(pdf.pages)
        pdf.save(params.output_path)

    return DuplicatePagesOutput(
        output_path=params.output_path,
        diff_summary=f"Duplicated page {params.page} ({params.count} extra copy/copies added).",
        page_count=page_count,
    )