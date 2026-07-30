KIND_EXTENSIONS = {
    "pdf": ".pdf",
    "image": ".jpg",
    "pptx": ".pptx",
    "docx": ".docx",
    "xlsx": ".xlsx",
    "zip": ".zip",
}

KIND_MIME_TYPES = {
    "pdf": "application/pdf",
    "image": "image/jpeg",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "zip": "application/zip",
}

# Only formats a browser can render inline (iframe/img) — everything else,
# including zip, is download-only.
INLINE_KINDS = {"pdf", "image"}


def kind_extension(kind: str) -> str:
    return KIND_EXTENSIONS.get(kind, "")


def kind_mime_type(kind: str) -> str:
    return KIND_MIME_TYPES.get(kind, "application/octet-stream")


def kind_is_inline(kind: str) -> bool:
    return kind in INLINE_KINDS