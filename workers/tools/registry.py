import pikepdf
from workers.tools import (
    delete_pages, docx_to_pdf, flatten_pdf, images_to_pdf, merge_pdfs, pdf_to_docx, pdf_to_jpg, pdf_to_png, pdf_to_pptx, pdf_to_xlsx, protect_pdf, rotate_pages, split_pdf,
    unlock_pdf, watermark_pdf, extract_pages, organize_pdf, crop_pdf,
    add_page_numbers, compress_pdf,insert_blank_page,redact_pages
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
    },"redact_pages": {
    "input_model": redact_pages.RedactPagesInput,
    "run": redact_pages.run,
    "description": "Permanently black out and remove specific rectangular areas of a document (e.g. sensitive text, SSNs, signatures) — not just a visual cover, the underlying content is deleted.",
    "arity": "single",
    "category": "page",
    "output_count": 1,
    "params_schema": {"boxes": "list of {page: int, x: float, y: float, width: float, height: float} — coordinates in points from the top-left of each page"},
    "usage_notes": [
        "If the user names what to redact (e.g. 'redact the SSN on page "
        "2') but gives no coordinates, ask a clarifying question — you "
        "cannot infer exact pixel/point coordinates from a text "
        "description alone.",
        "This is a PERMANENT, irreversible content removal, not a cosmetic "
        "black box — mention this if the user seems to expect it to be undoable via undo_document beyond one step back.",
    ],
},
    "extract_pages": {
        "input_model": extract_pages.ExtractPagesInput,
        "run": extract_pages.run,
        "description": "Pull specific pages out into a brand new document, preserving the order given.",
        "arity": "single",
        "category": "page",
        "output_count": 1,
        "params_schema": {"pages": "list[int] — 1-indexed pages to extract, in the order to keep them"},
    },"flatten_pdf": {
    "input_model": flatten_pdf.FlattenPdfInput,
    "run": flatten_pdf.run,
    "description": "Flatten fillable form fields and annotations so the document can no longer be edited or filled in.",
    "arity": "single",
    "category": "document",
    "output_count": 1,
    "params_schema": {},
    "usage_notes": [
        "Different from protect_pdf — this removes editability of form "
        "fields/annotations permanently and doesn't require a password; "
        "protect_pdf adds a password lock instead. If the user says "
        "'make this form uneditable' or 'flatten this', use this tool; "
        "if they say 'password protect' or 'lock with a password', use protect_pdf.",
    ],
},
    "pdf_to_xlsx": {
    "input_model": pdf_to_xlsx.PdfToXlsxInput,
    "run": pdf_to_xlsx.run,
    "description": "Extract tables from a PDF into an Excel spreadsheet, one sheet per table found.",
    "arity": "single",
    "category": "conversion",
    "output_count": 1,
    "output_kind": "xlsx",
    "output_format": "xlsx",
    "params_schema": {},
    "usage_notes": [
        "Only works well on documents with clear tabular structure (bordered "
        "or clearly-aligned tables) — for a PDF that's mostly prose text, "
        "warn the user this may not extract anything useful before running it.",
    ],
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
"pdf_to_png": {
    "input_model": pdf_to_png.PdfToPngInput,
    "run": pdf_to_png.run,
    "description": "Convert every page of a PDF into a separate PNG image.",
    "arity": "single",
    "category": "conversion",
    "output_count": "dynamic",
    "output_kind": "image",
    "output_format": "png",
    "zip_outputs": True,   # ADD THIS — same storage control as pdf_to_jpg
    "params_schema": {"dpi": "int, default 150 — image resolution"},
    "usage_notes": [
        "Prefer this over pdf_to_jpg when the user mentions PNG, "
        "transparency, or lossless/crisp output; otherwise pdf_to_jpg "
        "is the default for a generic 'convert to image' request.",
    ],
},"insert_blank_page": {
    "input_model": insert_blank_page.InsertBlankPageInput,
    "run": insert_blank_page.run,
    "description": "Insert a blank page into a document at a specific position.",
    "arity": "single",
    "category": "page",
    "output_count": 1,
    "params_schema": {"after_page": "int — 1-indexed page to insert after; use 0 to insert at the very start"},
    "usage_notes": [
        "The new blank page matches the size of the document's existing pages.",
    ],
},
"docx_to_pdf": {
    "input_model": docx_to_pdf.DocxToPdfInput,
    "run": docx_to_pdf.run,
    "description": "Convert a Word document (.docx) into a PDF.",
    "arity": "single",
    "category": "conversion",
    "output_count": 1,
    "params_schema": {},
    "usage_notes": [
        "Formatting (fonts, images, layout) is preserved as closely as "
        "the source document supports — complex embedded objects may "
        "render slightly differently than in Word itself.",
    ],
},
"images_to_pdf": {
    "input_model": images_to_pdf.ImagesToPdfInput,
    "run": images_to_pdf.run,
    "description": "Combine one or more images — or a zip bundle of many images — into a single PDF, one image per page.",
    "arity": "multi",
    "min_inputs": 1,   # NEW — a single image is a valid request too, not just batches
    "category": "conversion",
    "output_count": 1,
    "params_schema": {},
"usage_notes": [
    "A single image is a completely valid, complete request — convert "
    "it to a one-page PDF immediately, do NOT ask for confirmation or "
    "for more images first.",
    "Inputs may be individual image documents OR a single zip-bundle "
    "document containing many images (created when a user uploads a "
    "large batch of photos at once) — treat a zip document the same "
    "as any other input label; the tool handles unzipping itself.",
    "Page order follows the order of the input labels given (and, "
    "within a zip bundle, the upload order) — don't reorder unless "
    "the user explicitly asks for a specific sequence.",
],
},
# registry.py entry
"pdf_to_docx": {
    "input_model": pdf_to_docx.PdfToDocxInput,
    "run": pdf_to_docx.run,
    "description": "Convert a PDF into an editable Word document, preserving text, layout, and basic formatting.",
    "arity": "single",
    "category": "conversion",
    "output_count": 1,
    "output_kind": "docx",
    "output_format": "docx",
    "params_schema": {},
    "usage_notes": [
        "Unlike pdf_to_pptx, this attempts to extract REAL editable text and "
        "layout, not just images — mention this as an advantage if the user "
        "is comparing the two.",
        "Complex layouts (heavy tables, multi-column, scanned/image-only "
        "pages) may not convert perfectly — say so if the source looks "
        "image-heavy rather than promising a flawless result.",
    ],
},
    "pdf_to_jpg": {
        "input_model": pdf_to_jpg.PdfToJpgInput,
        "run": pdf_to_jpg.run,
        "description": "Convert every page of a PDF into a separate JPG image.",
        "arity": "single",
        "category": "conversion",
        "output_count": "dynamic",
        "output_kind": "image",
        "output_format": "jpg",       # NEW
        "zip_outputs": True,
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
        "output_format": "pptx",      # NEW
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