import pikepdf
from workers.tools import (
    add_header_footer, delete_pages, docx_to_pdf, duplicate_pages, edit_metadata, extract_images, fill_form, flatten_pdf, grayscale_pdf, images_to_pdf, merge_pdfs, pdf_to_docx, pdf_to_jpg, pdf_to_png, pdf_to_pptx, pdf_to_txt, pdf_to_xlsx, protect_pdf, resize_pages, reverse_pages, rotate_pages, split_pdf,
    unlock_pdf, watermark_pdf, extract_pages, organize_pdf, crop_pdf,
    add_page_numbers, compress_pdf,insert_blank_page,redact_pages,remove_metadata
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
    "add_header_footer": {
    "input_model": add_header_footer.AddHeaderFooterInput,
    "run": add_header_footer.run,
    "description": "Stamp custom text (e.g. a company name, date, or file reference) into the header or footer of every page.",
    "arity": "single",
    "category": "page",
    "output_count": 1,
    "params_schema": {
        "text": "string — the text to stamp",
        "position": '"header-left" | "header-center" | "header-right" | "footer-left" | "footer-center" | "footer-right", default "footer-center"',
        "font_size": "int, default 9",
    },
    "usage_notes": [
        "Different from add_page_numbers (which specifically numbers "
        "pages) and watermark_pdf (which stamps large diagonal text "
        "across the whole page) — this is for small, permanent text in "
        "the header/footer margin, like a filename, date, or company name.",
        "If the user wants page numbers specifically, use add_page_numbers "
        "instead, even if they describe it as 'add text to the footer'.",
    ],
},
    "pdf_to_txt": {
    "input_model": pdf_to_txt.PdfToTxtInput,
    "run": pdf_to_txt.run,
    "description": "Extract all readable text from a PDF into a plain .txt file, with no formatting or layout.",
    "arity": "single",
    "category": "conversion",
    "output_count": 1,
    "output_kind": "txt",
    "output_format": "txt",
    "params_schema": {},
    "usage_notes": [
        "This is RAW TEXT ONLY — no layout, no tables, no formatting "
        "survives. If the user needs editable formatting preserved, use "
        "pdf_to_docx instead; this is for quick copy-paste/search use cases.",
        "If the document is a scanned/image-only PDF, this will find no "
        "text — warn the user rather than producing an empty file.",
    ],
},
    "duplicate_pages": {
    "input_model": duplicate_pages.DuplicatePagesInput,
    "run": duplicate_pages.run,
    "description": "Duplicate a specific page, inserting one or more extra copies right after it.",
    "arity": "single",
    "category": "page",
    "output_count": 1,
    "params_schema": {
        "page": "int — 1-indexed page to duplicate",
        "count": "int, default 1 — how many extra copies to insert",
    },
    "usage_notes": [
        "If the user doesn't say how many copies, default count to 1 "
        "(one extra copy) rather than asking, unless the request is "
        "ambiguous about which page.",
    ],
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
},"reverse_pages": {
    "input_model": reverse_pages.ReversePagesInput,
    "run": reverse_pages.run,
    "description": "Reverse the order of every page in a document, last page first.",
    "arity": "single",
    "category": "page",
    "output_count": 1,
    "params_schema": {},
    "usage_notes": [
        "This reverses the ENTIRE document — if the user wants a custom "
        "specific order rather than a straight reversal, use organize_pdf instead.",
    ],
},
"fill_form": {
    "input_model": fill_form.FillFormInput,
    "run": fill_form.run,
    "description": "Fill in values for an existing fillable PDF form's fields.",
    "arity": "single",
    "category": "document",
    "output_count": 1,
    "params_schema": {"fields": "object — map of form field name to the value to fill in"},
    "usage_notes": [
        "You need the EXACT field names as they exist in the PDF, which "
        "you generally won't know from the conversation alone — if the "
        "user just says 'fill in my name as John', ask them to confirm "
        "which field(s) that corresponds to, unless the field names are "
        "obvious/already stated.",
        "After filling, the user may also want flatten_pdf to lock the "
        "filled values in place so the form can't be edited further — "
        "mention this as a natural next step, don't do it automatically.",
    ],
},
"remove_metadata": {
    "input_model": remove_metadata.RemoveMetadataInput,
    "run": remove_metadata.run,
    "description": "Strip all metadata from a document — author, title, creation date, software used to create it, and anything else in the document properties.",
    "arity": "single",
    "category": "security",
    "output_count": 1,
    "params_schema": {},
    "usage_notes": [
        "Different from edit_metadata — this REMOVES all metadata "
        "entirely rather than setting specific fields. Use this when the "
        "user wants privacy/anonymity ('strip the metadata', 'remove my "
        "name from this file's properties') rather than editing to a "
        "specific value.",
    ],
},
"resize_pages": {
    "input_model": resize_pages.ResizePagesInput,
    "run": resize_pages.run,
    "description": "Resize every page of a document to a standard paper size (A4, Letter, or Legal).",
    "arity": "single",
    "category": "page",
    "output_count": 1,
    "params_schema": {"size": '"a4" | "letter" | "legal"'},
    "usage_notes": [
        "This changes the page BOX dimensions only — content is not "
        "rescaled/repositioned to fit, so a page much larger or smaller "
        "than the target size may end up cropped or with extra blank "
        "margin. Mention this if the user's pages vary a lot in original size.",
        "If the user just says 'make this standard size' with no specific "
        "size named, default to 'a4' unless their document/context "
        "suggests otherwise (e.g. US-based content implies letter).",
    ],
},
"extract_images": {
    "input_model": extract_images.ExtractImagesInput,
    "run": extract_images.run,
    "description": "Pull the actual embedded photos/images out of a PDF at their original quality — different from pdf_to_jpg, which renders whole pages as images.",
    "arity": "single",
    "category": "conversion",
    "output_count": "dynamic",
    "output_kind": "image",
    "zip_outputs": True,
    "params_schema": {},
    "usage_notes": [
        "Use this when the user wants the PHOTOS inside a PDF (e.g. "
        "'pull the images out of this report'), not the pages themselves "
        "rendered as pictures — for that, use pdf_to_jpg or pdf_to_png instead.",
        "If the document has no embedded images (e.g. it's all text or "
        "the 'images' are actually rendered text), this will find nothing "
        "— warn the user rather than promising results on a text-only PDF.",
    ],
},
"edit_metadata": {
    "input_model": edit_metadata.EditMetadataInput,
    "run": edit_metadata.run,
    "description": "Edit a document's title, author, or subject metadata — the info shown in a PDF viewer's document properties panel, not visible content on the pages themselves.",
    "arity": "single",
    "category": "document",
    "output_count": 1,
    "params_schema": {
        "title": "string, optional — document title",
        "author": "string, optional — document author",
        "subject": "string, optional — document subject/description",
    },
    "usage_notes": [
        "At least one of title/author/subject must be given — if the "
        "user hasn't said what to set any of these to, ask which field(s) "
        "and what value.",
        "This changes invisible document PROPERTIES, not anything printed "
        "on the pages — don't confuse this with watermark_pdf or adding "
        "visible text to a page.",
    ],
},
    "grayscale_pdf": {
    "input_model": grayscale_pdf.GrayscalePdfInput,
    "run": grayscale_pdf.run,
    "description": "Convert every page of a document to black and white (grayscale) — for printing or reducing color-related file size.",
    "arity": "single",
    "category": "document",
    "output_count": 1,
    "params_schema": {},
    "usage_notes": [
        "This flattens each page to a rendered grayscale image internally, "
        "so the resulting PDF is no longer text-searchable/selectable — "
        "mention this tradeoff if the user needs to keep the text editable "
        "or copyable afterward.",
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