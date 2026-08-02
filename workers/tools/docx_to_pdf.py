# workers/tools/docx_to_pdf.py
import os
import subprocess
import tempfile
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class DocxToPdfInput(ToolInput):
    input_path: str
    output_path: str


class DocxToPdfOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: DocxToPdfInput) -> DocxToPdfOutput:
    with tempfile.TemporaryDirectory() as tmp_dir:
        try:
            subprocess.run(
                ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", tmp_dir, params.input_path],
                check=True, capture_output=True, timeout=60,
            )
        except subprocess.CalledProcessError as e:
            raise ToolError(code=ToolErrorCode.CONVERSION_FAILED, message="Couldn't convert this Word document — it may be corrupted or use unsupported formatting.") # type: ignore
        except subprocess.TimeoutExpired:
            raise ToolError(code=ToolErrorCode.CONVERSION_FAILED, message="Conversion took too long — the document may be too large or complex.") # type: ignore

        base_name = os.path.splitext(os.path.basename(params.input_path))[0]
        converted_path = os.path.join(tmp_dir, f"{base_name}.pdf")
        if not os.path.exists(converted_path):
            raise ToolError(code=ToolErrorCode.CONVERSION_FAILED, message="Conversion didn't produce an output file.") # type: ignore

        import shutil
        shutil.move(converted_path, params.output_path)

    import fitz
    doc = fitz.open(params.output_path)
    page_count = len(doc)
    doc.close()

    return DocxToPdfOutput(
        output_path=params.output_path,
        diff_summary=f"Converted Word document to a {page_count}-page PDF.",
        page_count=page_count,
    )