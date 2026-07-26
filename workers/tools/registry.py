# workers/tools/registry.py
from workers.tools import delete_pages, merge_pdfs, rotate_pages

TOOL_REGISTRY = {
    "delete_pages": {
        "input_model": delete_pages.DeletePagesInput,
        "run": delete_pages.run,
    },
    "rotate_pages": {
        "input_model": rotate_pages.RotatePagesInput,
        "run": rotate_pages.run,
    },
        "merge_pdfs": {"input_model": merge_pdfs.MergePdfsInput, "run": merge_pdfs.run},

}