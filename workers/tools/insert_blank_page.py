# workers/tools/insert_blank_page.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class InsertBlankPageInput(ToolInput):
    input_path: str
    output_path: str
    after_page: int  # 0 = insert as the new first page


class InsertBlankPageOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: InsertBlankPageInput) -> InsertBlankPageOutput:
    with pikepdf.open(params.input_path) as pdf:
        if params.after_page < 0 or params.after_page > len(pdf.pages):
            raise ToolError(code=ToolErrorCode.INVALID_INPUT, message=f"Document has {len(pdf.pages)} pages — can't insert after page {params.after_page}.") # type: ignore

        ref_page = pdf.pages[0] if len(pdf.pages) else None
        width = float(ref_page.mediabox[2]) if ref_page else 612
        height = float(ref_page.mediabox[3]) if ref_page else 792

        blank = pikepdf.Page(pdf.make_indirect(pikepdf.Dictionary(
            Type=pikepdf.Name.Page,
            MediaBox=[0, 0, width, height],
            Resources=pikepdf.Dictionary(),
        )))
        pdf.pages.insert(params.after_page, blank)
        pdf.save(params.output_path)
        page_count = len(pdf.pages)

    return InsertBlankPageOutput(
        output_path=params.output_path,
        diff_summary=f"Inserted a blank page after page {params.after_page}." if params.after_page else "Inserted a blank page at the start.",
        page_count=page_count,
    )