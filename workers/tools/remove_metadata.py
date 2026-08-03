# workers/tools/remove_metadata.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput


class RemoveMetadataInput(ToolInput):
    input_path: str
    output_path: str


class RemoveMetadataOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: RemoveMetadataInput) -> RemoveMetadataOutput:
    with pikepdf.open(params.input_path) as pdf:
        with pdf.open_metadata() as meta:
            meta.clear()

        # docinfo (the older-style /Info dictionary) is separate from
        # XMP metadata and needs clearing independently, or author/
        # creator/producer strings can survive even after meta.clear()
        with pdf.open_metadata() as meta:
            pass
        if "/Info" in pdf.trailer:
            del pdf.trailer["/Info"]

        page_count = len(pdf.pages)
        pdf.save(params.output_path)

    return RemoveMetadataOutput(
        output_path=params.output_path,
        diff_summary="Removed all document metadata (author, title, creation software, etc).",
        page_count=page_count,
    )