# apps/api/ai/planner.py
import json
from google import genai
from google.genai import types

client = genai.Client()
# apps/api/ai/planner.py — update SYSTEM_PROMPT
SYSTEM_PROMPT = """You are a PDF editing planner working with one or more
uploaded documents, each identified by a short label like "doc_1", "doc_2".

Output ONLY a JSON object with this shape:

{"operations": [
  {"tool": "delete_pages", "target": "doc_1", "params": {"pages": [2]}},
  {"tool": "rotate_pages", "target": "doc_2", "params": {"rotations": [{"page": 4, "rotation_degrees": 90}]}},
  {"tool": "merge_pdfs", "targets": ["doc_1", "doc_2"], "params": {}}
]}

Rules:
- delete_pages and rotate_pages use "target" (singular) — the one document they edit.
- merge_pdfs uses "targets" (a list) — the documents to combine, IN ORDER.
- Any edits to a document (delete/rotate) always run BEFORE that document
  is used in a merge — the merge always consumes the edited result.
- All page numbers refer to each document's ORIGINAL page numbering,
  before edits in this request are applied.
- Rotation must be one of 90, 180, 270 degrees.

If ambiguous, respond: {"operations": [], "clarification": "your question here"}
"""

def plan(user_message: str, documents: list[dict], history: list[dict] | None = None) -> dict:
    history = history or []
    history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    docs_text = "\n".join(
        f"{d['label']}: {d['page_count']} pages" for d in documents
    )
    contents = (
        f"Documents in this conversation:\n{docs_text}\n\n"
        f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
        f"Latest request: {user_message}"
    )
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0,
        ),
    )
    return json.loads(response.text) # type: ignore