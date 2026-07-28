from __future__ import annotations

import pikepdf
from workers.tools.base import ToolInput, ToolOutput, open_pdf


class CompressPdfInput(ToolInput):
    input_path: str
    output_path: str


class CompressPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: CompressPdfInput) -> CompressPdfOutput:
    with open_pdf(params.input_path) as pdf:
        page_count = len(pdf.pages)
        # pikepdf's own compress_streams + object stream generation cuts
        # redundant PDF structure/metadata, but does NOT re-encode embedded
        # images at lower quality — that's what actually shrinks scanned
        # or image-heavy PDFs, and pikepdf alone can't do it. See note below.
        pdf.save(
            params.output_path,
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
        )

    return CompressPdfOutput(
        output_path=params.output_path,
        diff_summary="Compressed the document's internal structure.",
        page_count=page_count,
    )