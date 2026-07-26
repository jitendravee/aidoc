# apps/api/ai/planner.py
import json
from google import genai
from google.genai import types

client = genai.Client()

SYSTEM_PROMPT = """You are a PDF editing planner. Given a user's request and the
document's page count, output ONLY a JSON object with this shape:

{"operations": [
  {"tool": "delete_pages", "params": {"pages": [1,2]}},
  {"tool": "rotate_pages", "params": {"rotations": [{"page": 3, "rotation_degrees": 90}]}}
]}

Include one entry per distinct action the user asked for, in any order — the
backend will sequence them correctly. All page numbers refer to the ORIGINAL
document, before any edits in this request are applied.

Only use these two tools: delete_pages, rotate_pages.
If the request is ambiguous or doesn't match either tool, respond:
{"operations": [], "clarification": "your question here"}
"""

def plan(user_message: str, page_count: int) -> dict:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Document has {page_count} pages.\nRequest: {user_message}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0,
        ),
    )
    return json.loads(response.text) # type: ignore