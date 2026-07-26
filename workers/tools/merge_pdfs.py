# workers/tools/merge_pdfs.py
import pikepdf
from .base import ToolInput, ToolOutput, open_pdf


class MergePdfsInput(ToolInput):
    input_paths: list[str]   # ordered — output preserves this order
    output_path: str


class MergePdfsOutput(ToolOutput):
    output_path: str
    pages_remaining: int
    diff_summary: str


def run(input: MergePdfsInput) -> MergePdfsOutput:
    merged = pikepdf.new()
    for path in input.input_paths:
        src = open_pdf(path)
        merged.pages.extend(src.pages)
        src.close()

    merged.save(input.output_path)
    total_pages = len(merged.pages)
    merged.close()

    return MergePdfsOutput(
        output_path=input.output_path,
        pages_remaining=total_pages,
        diff_summary=f"Merged {len(input.input_paths)} documents into one, {total_pages} pages total.",
    )