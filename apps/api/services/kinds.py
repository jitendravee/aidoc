# apps/api/services/kinds.py
"""kind = broad category the FRONTEND uses to pick a preview component
   (pdf / image / pptx / docx / xlsx / zip) — stays coarse on purpose,
   one Preview component per kind.
format = the SPECIFIC file type a tool actually writes to disk (jpg,
   png, pdf, pptx, zip...) — this is where extension/mime live, since
   two formats (jpg, png) can share one kind (image) but need
   different extensions and different Content-Type headers."""

from typing import TypedDict


class KindInfo(TypedDict):
    inline: bool  # can a browser render this directly (iframe/img)?


KIND_REGISTRY: dict[str, KindInfo] = {
    "pdf": {"inline": True},
    "image": {"inline": True},
    "pptx": {"inline": False},
    "docx": {"inline": False},
    "xlsx": {"inline": False},
    "zip": {"inline": False},
}


class FormatInfo(TypedDict):
    kind: str
    extension: str
    mime_type: str


# Add a new tool output format here — nothing else needs to change.
FORMAT_REGISTRY: dict[str, FormatInfo] = {
    "pdf":  {"kind": "pdf",   "extension": ".pdf",  "mime_type": "application/pdf"},
    "jpg":  {"kind": "image", "extension": ".jpg",  "mime_type": "image/jpeg"},
    "png":  {"kind": "image", "extension": ".png",  "mime_type": "image/png"},
    "pptx": {"kind": "pptx",  "extension": ".pptx", "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"},
    "docx": {"kind": "docx",  "extension": ".docx", "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
    "xlsx": {"kind": "xlsx",  "extension": ".xlsx", "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
    "zip":  {"kind": "zip",   "extension": ".zip",  "mime_type": "application/zip"},
}


def format_extension(fmt: str) -> str:
    return FORMAT_REGISTRY.get(fmt, {}).get("extension", "")


def format_mime_type(fmt: str) -> str:
    return FORMAT_REGISTRY.get(fmt, {}).get("mime_type", "application/octet-stream")


def format_kind(fmt: str) -> str:
    return FORMAT_REGISTRY.get(fmt, {}).get("kind", "pdf")


def kind_is_inline(kind: str) -> bool:
    return KIND_REGISTRY.get(kind, {}).get("inline", False)


# --- kept for the original-PDF-only call sites in documents.py (upload,
# undo, get_document) where there's no "tool output" involved, just the
# fixed original-PDF format — "pdf" is a valid key in both registries
# so these are safe aliases, not a second source of truth.
def kind_mime_type(kind: str) -> str:
    return format_mime_type(kind)


def kind_extension(kind: str) -> str:
    return format_extension(kind)