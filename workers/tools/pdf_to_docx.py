# workers/tools/pdf_to_docx.py
from pdf2docx import Converter
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode
import pikepdf


class PdfToDocxInput(ToolInput):
    input_path: str
    output_path: str


class PdfToDocxOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: PdfToDocxInput) -> PdfToDocxOutput:
    with pikepdf.open(params.input_path) as pdf:
        if pdf.is_encrypted:
            raise ToolError(
                code=ToolErrorCode.ENCRYPTED_PDF,
                message="This PDF is password-protected. Use 'unlock_pdf' first before converting to Word."
            )
        page_count = len(pdf.pages)

    cv = Converter(params.input_path)
    try:
        cv.convert(params.output_path)
    finally:
        cv.close()

    return PdfToDocxOutput(
        output_path=params.output_path,
        diff_summary=f"Converted {page_count} page(s) to an editable Word document.",
        page_count=page_count,
    )