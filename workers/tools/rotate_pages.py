# workers/tools/rotate_pages.py
from typing import Literal
from .base import ToolInput, ToolOutput, open_pdf, validate_pages_in_range


class PageRotation(ToolInput):
    page: int
    rotation_degrees: Literal[90, 180, 270]


class RotatePagesInput(ToolInput):
    input_path: str
    output_path: str
    rotations: list[PageRotation]


class RotatePagesOutput(ToolOutput):
    output_path: str
    pages_remaining: int
    diff_summary: str


def run(input: RotatePagesInput) -> RotatePagesOutput:
    pdf = open_pdf(input.input_path)
    total_pages = len(pdf.pages)

    page_numbers = [r.page for r in input.rotations]
    validate_pages_in_range(page_numbers, total_pages)

    for r in input.rotations:
        pdf.pages[r.page - 1].rotate(r.rotation_degrees, relative=True)

    pdf.save(input.output_path)
    pdf.close()

    parts = [f"page {r.page} by {r.rotation_degrees}°" for r in input.rotations]
    diff_summary = "Rotated " + ", ".join(parts) + "."

    return RotatePagesOutput(
        output_path=input.output_path,
        pages_remaining=total_pages,
        diff_summary=diff_summary,
    )