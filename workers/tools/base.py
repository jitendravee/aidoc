# workers/tools/base.py
from __future__ import annotations
from enum import Enum
import pikepdf
from pydantic import BaseModel


class ToolErrorCode(str, Enum):
    PAGE_OUT_OF_RANGE = "PAGE_OUT_OF_RANGE"
    DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND"
    ENCRYPTED_PDF = "ENCRYPTED_PDF"
    CORRUPTED_FILE = "CORRUPTED_FILE"
    UNSUPPORTED_FEATURE = "UNSUPPORTED_FEATURE"
    INTERNAL_ERROR = "INTERNAL_ERROR"



class ToolError(Exception):
    def __init__(self, code: ToolErrorCode, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


class ToolInput(BaseModel):
    pass


class ToolOutput(BaseModel):
    pass


def open_pdf(path: str) -> pikepdf.Pdf:
    """Shared open logic — every tool that reads a PDF calls this
    instead of hand-rolling the same try/except."""
    try:
        return pikepdf.open(path)
    except pikepdf.PasswordError:
        raise ToolError(ToolErrorCode.ENCRYPTED_PDF, "PDF is password-protected.")
    except pikepdf.PdfError:
        raise ToolError(ToolErrorCode.CORRUPTED_FILE, "Could not open PDF — file may be corrupted.")


def validate_pages_in_range(pages: list[int], total_pages: int) -> None:
    """Shared 1-indexed page-range validation."""
    for page_num in pages:
        if page_num < 1 or page_num > total_pages:
            raise ToolError(
                ToolErrorCode.PAGE_OUT_OF_RANGE,
                f"Page {page_num} does not exist — document has {total_pages} pages.",
            )