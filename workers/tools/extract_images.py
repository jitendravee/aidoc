# workers/tools/extract_images.py
import os
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class ExtractImagesInput(ToolInput):
    input_path: str
    output_dir: str


class ExtractImagesOutput(ToolOutput):
    output_paths: list[str]
    diff_summary: str
    page_count: int


def run(params: ExtractImagesInput) -> ExtractImagesOutput:
    output_paths = []

    with pikepdf.open(params.input_path) as pdf:
        page_count = len(pdf.pages)

        for page_num, page in enumerate(pdf.pages, start=1):
            for image_key in list(page.images.keys()):
                try:
                    raw_image = page.images[image_key]
                    pdf_image = pikepdf.PdfImage(raw_image) # type: ignore
                    ext = pdf_image.extension or ".png" # type: ignore
                    out_path = os.path.join(
                        params.output_dir, f"page_{page_num}_{len(output_paths) + 1}{ext}"
                    )
                    pdf_image.extract_to(fileprefix=out_path.removesuffix(ext))
                    output_paths.append(out_path)
                except Exception:
                    continue  # skip images pikepdf can't decode rather than failing the whole run

    if not output_paths:
        raise ToolError(
            code=ToolErrorCode.CONVERSION_FAILED, # type: ignore
            message="No embedded images were found in this document.",
        )

    return ExtractImagesOutput(
        output_paths=output_paths,
        diff_summary=f"Extracted {len(output_paths)} embedded image(s) from the document.",
        page_count=page_count,
    )