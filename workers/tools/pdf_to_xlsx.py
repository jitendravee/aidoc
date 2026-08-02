# workers/tools/pdf_to_xlsx.py
import pdfplumber
import openpyxl
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class PdfToXlsxInput(ToolInput):
    input_path: str
    output_path: str


class PdfToXlsxOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: PdfToXlsxInput) -> PdfToXlsxOutput:
    extracted_tables: list[list[list]] = []

    with pdfplumber.open(params.input_path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            for table in page.extract_tables():
                if table:  # skip empty detections
                    extracted_tables.append(table)

    if not extracted_tables:
        raise ToolError(
            code=ToolErrorCode.CONVERSION_FAILED, # type: ignore
            message="No tables were found in this document — pdf_to_xlsx only works on documents containing tabular data.",
        )

    wb = openpyxl.Workbook()
    wb.remove(wb.active)  # type: ignore
    for i, table in enumerate(extracted_tables, start=1):
        ws = wb.create_sheet(title=f"Table_{i}")
        for row in table:
            # pdfplumber uses None for empty cells — normalize to "" for a clean sheet
            ws.append(["" if cell is None else cell for cell in row])

    wb.save(params.output_path)

    return PdfToXlsxOutput(
        output_path=params.output_path,
        diff_summary=f"Extracted {len(extracted_tables)} table(s) into an Excel workbook.",
        page_count=page_count,
    )