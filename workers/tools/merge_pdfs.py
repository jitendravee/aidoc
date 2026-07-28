from __future__ import annotations
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolErrorCode, ToolError, open_pdf


class MergePdfsInput(ToolInput):
    input_paths: list[str]
    output_path: str


class MergePdfsOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: MergePdfsInput) -> MergePdfsOutput:
    if len(params.input_paths) < 2:
        raise ToolError(ToolErrorCode.UNSUPPORTED_FEATURE, "Merge needs at least two documents.")

    merged = pikepdf.new()
    for path in params.input_paths:
        with open_pdf(path) as src:
            merged.pages.extend(src.pages)

    merged.save(params.output_path)
    page_count = len(merged.pages)

    return MergePdfsOutput(
        output_path=params.output_path,
        diff_summary=f"Merged {len(params.input_paths)} documents into one, {page_count} pages total.",
        page_count=page_count,
    )