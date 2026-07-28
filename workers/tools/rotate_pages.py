from __future__ import annotations
from pydantic import BaseModel
from workers.tools.base import ToolInput, ToolOutput, open_pdf, validate_pages_in_range


class PageRotation(BaseModel):
    page: int
    rotation_degrees: int


class RotatePagesInput(ToolInput):
    input_path: str
    output_path: str
    rotations: list[PageRotation]


class RotatePagesOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: RotatePagesInput) -> RotatePagesOutput:
    with open_pdf(params.input_path) as pdf:
        validate_pages_in_range([r.page for r in params.rotations], len(pdf.pages))

        for r in params.rotations:
            pdf.pages[r.page - 1].rotate(r.rotation_degrees, relative=True)

        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    pages_str = ", ".join(str(r.page) for r in params.rotations)
    return RotatePagesOutput(
        output_path=params.output_path,
        diff_summary=f"Rotated page(s) {pages_str}.",
        page_count=page_count,
    )