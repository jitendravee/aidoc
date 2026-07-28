from fastapi import APIRouter
from workers.tools.registry import TOOLS_INFO

router = APIRouter()

# Tools shown on the landing page for context/roadmap purposes, even
# before they're implemented — keeps the marketing page honest about
# what's coming without needing a second hardcoded list on the frontend.
# Remove an entry from here the same day you add it to TOOL_REGISTRY.
COMING_SOON = [
    {"name": "pdf_to_word", "label": "PDF to Word", "description": "Convert your PDF files into easy to edit DOC and DOCX documents.", "category": "convert"},
    {"name": "pdf_to_powerpoint", "label": "PDF to PowerPoint", "description": "Turn your PDF files into easy to edit PPT and PPTX slideshows.", "category": "convert"},
    {"name": "pdf_to_excel", "label": "PDF to Excel", "description": "Pull data straight from PDFs into Excel spreadsheets.", "category": "convert"},
    {"name": "word_to_pdf", "label": "Word to PDF", "description": "Make DOC and DOCX files easy to read by converting them to PDF.", "category": "convert"},
    {"name": "ocr_pdf", "label": "OCR PDF", "description": "Easily convert scanned PDFs into searchable and selectable documents.", "category": "extract"},
    {"name": "translate_pdf", "label": "Translate PDF", "description": "Easily translate PDF files powered by AI, keeping layout intact.", "category": "ai"},
    {"name": "summarize_pdf", "label": "AI Summarizer", "description": "Quickly generate concise summaries of PDF documents.", "category": "ai"},
    {"name": "redact_pdf", "label": "Redact PDF", "description": "Permanently remove sensitive information from a PDF.", "category": "security"},
    {"name": "sign_pdf", "label": "Sign PDF", "description": "Sign yourself or request electronic signatures from others.", "category": "security"},
]


@router.get("/tools")
async def list_tools():
    available = [
        {
            "name": t["name"],
            "label": t["name"].replace("_", " ").title(),
            "description": t["description"],
            "category": t["category"],
            "available": True,
        }
        for t in TOOLS_INFO
    ]

    coming_soon = [
        {**t, "label": t.get("label") or t["name"].replace("_", " ").title(), "available": False}
        for t in COMING_SOON
    ]

    return {"tools": available + coming_soon}