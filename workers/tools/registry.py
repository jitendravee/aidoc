from workers.tools import delete_pages, merge_pdfs, rotate_pages, split_pdf

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