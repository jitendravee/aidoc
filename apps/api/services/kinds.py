# apps/api/services/kinds.py
"""kind = broad category the FRONTEND uses to pick a preview component
   (pdf / image / pptx / docx / xlsx / zip / txt) — stays coarse on
   purpose, one Preview component per kind.
format = the SPECIFIC file type a tool actually writes to disk (jpg,
   png, pdf, pptx, zip, txt...) — this is where extension/mime live,
   since two formats (jpg, png) can share one kind (image) but need
   different extensions and different Content-Type headers."""

import os
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
    "txt": {"inline": True},  # browsers render plain text fine inline
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
    "txt":  {"kind": "txt",   "extension": ".txt",  "mime_type": "text/plain"},
}


def format_extension(fmt: str) -> str:
    return FORMAT_REGISTRY.get(fmt, {}).get("extension", "")


def format_mime_type(fmt: str) -> str:
    return FORMAT_REGISTRY.get(fmt, {}).get("mime_type", "application/octet-stream")


def format_kind(fmt: str) -> str:
    return FORMAT_REGISTRY.get(fmt, {}).get("kind", "pdf")


def format_from_filename(filename: str) -> str | None:
    """Reverse-lookup: file extension -> format key in FORMAT_REGISTRY.
    Used at upload time (don't know the format yet) and when re-deriving
    a document's format from its storage_key (which always carries the
    real extension, e.g. '<id>/v0.zip')."""
    ext = os.path.splitext(filename)[1].lower()
    for fmt, info in FORMAT_REGISTRY.items():
        if info["extension"] == ext:
            return fmt
    return None


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