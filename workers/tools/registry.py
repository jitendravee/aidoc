from workers.tools import delete_pages, merge_pdfs, protect_pdf, rotate_pages, split_pdf, unlock_pdf, watermark_pdf

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
    "merge_pdfs": {
        "input_model": merge_pdfs.MergePdfsInput,
        "run": merge_pdfs.run,
        "description": "Merge two or more documents into one, in the given order.",
        "arity": "multi",
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
    }
    for name, tool in TOOL_REGISTRY.items()
]