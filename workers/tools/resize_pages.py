# workers/tools/resize_pages.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode

PAGE_SIZES = {
    "a4": (595.28, 841.89),
    "letter": (612, 792),
    "legal": (612, 1008),
}


class ResizePagesInput(ToolInput):
    input_path: str
    output_path: str
    size: str  # "a4" | "letter" | "legal"


class ResizePagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: ResizePagesInput) -> ResizePagesOutput:
    target = PAGE_SIZES.get(params.size.lower())
    if target is None:
        raise ToolError(
            code=ToolErrorCode.INVALID_INPUT, # type: ignore
            message=f"Unsupported page size '{params.size}'. Choose from: {', '.join(PAGE_SIZES)}.",
        )
    width, height = target

    with pikepdf.open(params.input_path) as pdf:
        for page in pdf.pages:
            page.MediaBox = [0, 0, width, height]

        page_count = len(pdf.pages)
        pdf.save(params.output_path)

    return ResizePagesOutput(
        output_path=params.output_path,
        diff_summary=f"Resized {page_count} page(s) to {params.size.upper()}.",
        page_count=page_count,
    )