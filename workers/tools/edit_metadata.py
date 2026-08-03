# workers/tools/edit_metadata.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput


class EditMetadataInput(ToolInput):
    input_path: str
    output_path: str
    title: str | None = None
    author: str | None = None
    subject: str | None = None


class EditMetadataOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: EditMetadataInput) -> EditMetadataOutput:
    with pikepdf.open(params.input_path) as pdf:
        with pdf.open_metadata() as meta:
            if params.title is not None:
                meta["dc:title"] = params.title
            if params.author is not None:
                meta["dc:creator"] = [params.author]
            if params.subject is not None:
                meta["dc:description"] = params.subject

        page_count = len(pdf.pages)
        pdf.save(params.output_path)

    changed = [f for f, v in [("title", params.title), ("author", params.author), ("subject", params.subject)] if v is not None]
    return EditMetadataOutput(
        output_path=params.output_path,
        diff_summary=f"Updated document {', '.join(changed)}." if changed else "No metadata changes made.",
        page_count=page_count,
    )