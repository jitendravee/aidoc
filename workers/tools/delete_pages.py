from __future__ import annotations
import pikepdf
from .base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class DeletePagesInput(ToolInput):
    input_path: str        # path to source PDF on disk
    output_path: str       # where to write the result
    pages: list[int]       # 1-indexed page numbers to delete


class DeletePagesOutput(ToolOutput):
    output_path: str
    pages_remaining: int
    diff_summary: str


def run(input: DeletePagesInput) -> DeletePagesOutput:
    try:
        pdf = pikepdf.open(input.input_path)
    except pikepdf.PasswordError:
        raise ToolError(ToolErrorCode.ENCRYPTED_PDF, "PDF is password-protected.")
    except pikepdf.PdfError:
        raise ToolError(ToolErrorCode.CORRUPTED_FILE, "Could not open PDF — file may be corrupted.")

    total_pages = len(pdf.pages)

    for page_num in input.pages:
        if page_num < 1 or page_num > total_pages:
            raise ToolError(
                ToolErrorCode.PAGE_OUT_OF_RANGE,
                f"Page {page_num} does not exist — document has {total_pages} pages.",
            )

    # delete highest page numbers first so earlier indices don't shift
    for page_num in sorted(input.pages, reverse=True):
        del pdf.pages[page_num - 1]   # pikepdf is 0-indexed internally

    pdf.save(input.output_path)
    remaining = len(pdf.pages)
    pdf.close()

    deleted_str = ", ".join(str(p) for p in sorted(input.pages))
    return DeletePagesOutput(
        output_path=input.output_path,
        pages_remaining=remaining,
        diff_summary=f"Removed page(s) {deleted_str}. Document now has {remaining} pages.",
    )