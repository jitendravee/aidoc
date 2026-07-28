from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class UnlockPdfInput(ToolInput):
    input_path: str
    output_path: str
    password: str


class UnlockPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: UnlockPdfInput) -> UnlockPdfOutput:
    try:
        with pikepdf.open(params.input_path, password=params.password) as pdf:
            page_count = len(pdf.pages)
            pdf.save(params.output_path)  # saving without `encryption=` strips it
    except pikepdf.PasswordError:
        raise ToolError(ToolErrorCode.ENCRYPTED_PDF, "Incorrect password — could not unlock this PDF.")

    return UnlockPdfOutput(
        output_path=params.output_path,
        diff_summary="Removed password protection from the document.",
        page_count=page_count,
    )