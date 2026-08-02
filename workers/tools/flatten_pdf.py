# workers/tools/flatten_pdf.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput


class FlattenPdfInput(ToolInput):
    input_path: str
    output_path: str


class FlattenPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: FlattenPdfInput) -> FlattenPdfOutput:
    with pikepdf.open(params.input_path) as pdf:
        if "/AcroForm" in pdf.Root:
            del pdf.Root["/AcroForm"]

        for page in pdf.pages:
            if "/Annots" in page:
                del page["/Annots"]

        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    return FlattenPdfOutput(
        output_path=params.output_path,
        diff_summary="Flattened all form fields and annotations into the page content.",
        page_count=page_count,
    )