from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode, open_pdf


class ProtectPdfInput(ToolInput):
    input_path: str
    output_path: str
    password: str


class ProtectPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: ProtectPdfInput) -> ProtectPdfOutput:
    if not params.password or len(params.password) < 4:
        raise ToolError(ToolErrorCode.UNSUPPORTED_FEATURE, "Password must be at least 4 characters.")

    with open_pdf(params.input_path) as pdf:
        page_count = len(pdf.pages)
        pdf.save(
            params.output_path,
            encryption=pikepdf.Encryption(owner=params.password, user=params.password, R=4),
        )

    return ProtectPdfOutput(
        output_path=params.output_path,
        diff_summary="Added password protection to the document.",
        page_count=page_count,
    )