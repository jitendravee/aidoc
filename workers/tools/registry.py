import pikepdf
from workers.tools import (
    delete_pages, merge_pdfs, pdf_to_jpg, pdf_to_pptx, protect_pdf, rotate_pages, split_pdf,
    unlock_pdf, watermark_pdf, extract_pages, organize_pdf, crop_pdf,
    add_page_numbers, compress_pdf,
)

TOOL_REGISTRY = {
    "delete_pages": {
        "input_model": delete_pages.DeletePagesInput,
        "run": delete_pages.run,
        "description": "Delete one or more pages from a document.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
        "params_schema": {"pages": "list[int] — 1-indexed page numbers to remove"},
    },
    "rotate_pages": {
        "input_model": rotate_pages.RotatePagesInput,
        "run": rotate_pages.run,
        "description": "Rotate one or more pages.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
        "params_schema": {"rotations": "list of {page: int, rotation_degrees: 90|180|270}"},
    },
    "split_pdf": {
        "input_model": split_pdf.SplitPdfInput,
        "run": split_pdf.run,
        "description": "Split a document into two parts after a given page number.",
        "arity": "single",
        "category": "page",
        "output_count": 2,
        "params_schema": {"split_after_page": "int — page number to split after"},
    },
    "extract_pages": {
        "input_model": extract_pages.ExtractPagesInput,
        "run": extract_pages.run,
        "description": "Pull specific pages out into a brand new document, preserving the order given.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
        "params_schema": {"pages": "list[int] — 1-indexed pages to extract, in the order to keep them"},
    },
    "organize_pdf": {
        "input_model": organize_pdf.OrganizePdfInput,
        "run": organize_pdf.run,
        "description": "Reorder all pages in a document into a new sequence.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
        "params_schema": {"new_order": "list[int] — every original page number exactly once, in the new order"},
    },
"pdf_to_jpg": {
    "input_model": pdf_to_jpg.PdfToJpgInput,
    "run": pdf_to_jpg.run,
    "description": "Convert every page of a PDF into a separate JPG image.",
    "arity": "single",
    "category": "conversion",
    "output_count": "dynamic",
    "output_kind": "image",
    "zip_outputs": True,   # NEW — bundle N images into one .zip instead of N documents
    "params_schema": {"dpi": "int, default 150 — image resolution"},
},
"pdf_to_pptx": {
    "input_model": pdf_to_pptx.PdfToPptxInput,
    "run": pdf_to_pptx.run,
    "description": "Convert a PDF into a PowerPoint presentation, one slide per page.",
    "arity": "single",
    "category": "conversion",
    "output_count": 1,
    "output_kind": "pptx",
    "params_schema": {"dpi": "int, default 150 — image resolution per slide"},
    "usage_notes": ["Slides are image-based, not editable text — mention this if the user expects editable content."],
},
# workers/tools/registry.py — just the crop_pdf entry shown, add usage_notes similarly to any tool that needs it
    "crop_pdf": {
        "input_model": crop_pdf.CropPdfInput,
        "run": crop_pdf.run,
        "description": "Crop a uniform margin off every page.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
     "params_schema": {
        "margin_points": "float, default 36 (~0.5in) — margin to remove from each edge",
        "pages": "list[int], optional — 1-indexed pages to crop; omit to crop every page",
    },
    "usage_notes": [
        "If the user gives a measurement in inches or centimeters, convert "
        "it yourself: 1 inch = 72 points, 1 cm = 28.35 points. Only ask a "
        "clarifying question if no measurement was given at all.",
        "If the user names specific pages (e.g. 'crop page 4'), set "
        "'pages' to just those. If they don't mention specific pages "
        "(e.g. 'crop this pdf'), omit 'pages' entirely so it applies to "
        "the whole document — don't ask which pages unless they've "
        "already implied a subset.",
    ],
    },
    "add_page_numbers": {
        "input_model": add_page_numbers.AddPageNumbersInput,
        "run": add_page_numbers.run,
        "description": "Stamp page numbers onto every page.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
        "params_schema": {"position": '"bottom-center" or "bottom-right", default "bottom-center"'},
    },
    "merge_pdfs": {
        "input_model": merge_pdfs.MergePdfsInput,
        "run": merge_pdfs.run,
        "description": "Merge two or more documents into one, in the given order.",
        "arity": "multi",
        "category": "document",
        "output_count": 1,
        "params_schema": {},
    },
    "compress_pdf": {
        "input_model": compress_pdf.CompressPdfInput,
        "run": compress_pdf.run,
        "description": "Reduce the document's internal file size by removing redundant structure.",
        "arity": "single",
        "category": "document",
        "output_count": 1,
        "params_schema": {},
    },
    "watermark_pdf": {
        "input_model": watermark_pdf.WatermarkPdfInput,
        "run": watermark_pdf.run,
        "description": "Stamp a text watermark diagonally across every page.",
        "arity": "single",
        "category": "security",
        "output_count": 1,
        "params_schema": {
            "text": "string — the watermark text",
            "opacity": "float 0.0-1.0, default 0.3 — how faint the watermark is",
        },
    },
    "protect_pdf": {
        "input_model": protect_pdf.ProtectPdfInput,
        "run": protect_pdf.run,
        "description": "Add password protection to a document.",
        "arity": "single",
        "category": "security",
        "output_count": 1,
        "params_schema": {"password": "string — at least 4 characters"},
    },
    "unlock_pdf": {
        "input_model": unlock_pdf.UnlockPdfInput,
        "run": unlock_pdf.run,
        "description": "Remove password protection from a document, given the current password.",
        "arity": "single",
        "category": "security",
        "output_count": 1,
        "params_schema": {"password": "string — the document's current password"},
    },
}

TOOLS_BY_CATEGORY: dict[str, list[dict]] = {}
for name, tool in TOOL_REGISTRY.items():
    TOOLS_BY_CATEGORY.setdefault(tool["category"], []).append({"name": name, **tool})

TOOLS_INFO = [
    {
        "name": name,
        "description": tool["description"],
        "arity": tool["arity"],
        "category": tool["category"],
        "output_count": tool["output_count"],
        "params_schema": tool["params_schema"],
        "usage_notes": tool.get("usage_notes", []),
    }
    for name, tool in TOOL_REGISTRY.items()
]