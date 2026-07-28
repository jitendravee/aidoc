# import json
# from google import genai
# from google.genai import types
# from workers.tools.registry import TOOLS_BY_CATEGORY, TOOLS_INFO

# client = genai.Client()

# CATEGORY_LABELS = {
#     "page": "Page operations",
#     "document": "Document operations",
# }


# def _build_tools_description() -> str:
#     sections = []
#     for category, tools in TOOLS_BY_CATEGORY.items():
#         label = CATEGORY_LABELS.get(category, category.title())
#         lines = [f"### {label}"]
#         for t in tools:
#             schema_str = (
#                 ", ".join(f"{k}: {v}" for k, v in t["params_schema"].items())
#                 if t["params_schema"] else "no params"
#             )
#             output_note = f" [produces {t['output_count']} documents]" if t["output_count"] > 1 else ""
#             lines.append(f"- {t['name']}: {t['description']} (params — {schema_str}){output_note}")
#         sections.append("\n".join(lines))
#     return "\n\n".join(sections)


# def _build_system_prompt() -> str:
#     tools_text = _build_tools_description()
#     tool_names = ", ".join(f'"{t["name"]}"' for t in TOOLS_INFO)

#     return f"""You are FlowPDF's assistant. Users chat with you to edit PDFs
# they've uploaded, each identified by a short label like "doc_1", "doc_2".

# You currently support ONLY these tools:
# {tools_text}

# Output ONLY a JSON object. Choose exactly one "type":

# 1. "workflow" — the request maps to one or more supported edits, expressed
#    as an ordered list of steps. Each step's "inputs" is a list of document
#    keys — either an original label ("doc_1") or a previous step's "output"
#    key, letting you chain edits before a merge/split/etc:

# {{"type": "workflow", "steps": [
#   {{"id": "rotate_doc1", "tool": "rotate_pages", "inputs": ["doc_1"], "output": "doc1_rotated",
#     "params": {{"rotations": [{{"page": 3, "rotation_degrees": 90}}]}}}},
#   {{"id": "delete_doc1_page5", "tool": "delete_pages", "inputs": ["doc1_rotated"], "output": "doc1_clean",
#     "params": {{"pages": [5]}}}},
#   {{"id": "merge_final", "tool": "merge_pdfs", "inputs": ["doc1_clean", "doc_2"], "output": "merged",
#     "params": {{}}}}
# ], "final_outputs": ["merged"]}}

# Rules for workflows:
# - Valid tool names are ONLY those listed above ({tool_names}). Never invent
#   a tool or use one not in that list, no matter how similar to a real one.
# - Give each step an "id" that describes what it does (e.g. "rotate_doc1",
#   "delete_doc1_pages", "merge_final") — never generic ids like "s1", "s2".
# - "final_outputs" lists the output keys that represent the actual result
#   documents to return to the user — usually just the last step's output,
#   but list more than one if independent chains exist.
# - Any edits to a document always run BEFORE that document is consumed by
#   a merge or similar multi-input tool.
# - All page numbers refer to each document's ORIGINAL page numbering,
#   before edits in this request are applied.
# - Rotation must be one of 90, 180, 270 degrees.
# - Tools marked "[produces N documents]" (currently split_pdf) use
#   "outputs": [list of N keys] instead of a single "output" string. List
#   ALL of those keys in "final_outputs" if the user wants every result
#   back — for split, that means both halves unless they only asked for
#   one specific part.

#   Example:
#   {{"id": "split_doc1", "tool": "split_pdf", "inputs": ["doc_1"],
#     "outputs": ["doc1_part1", "doc1_part2"],
#     "params": {{"split_after_page": 6}}}}
#   ...with "final_outputs": ["doc1_part1", "doc1_part2"]

# 2. "clarification" — the request IS a supported edit (matches one of the
#    tools listed above), but is missing details you need (which page, which
#    document, which angle, which split point):
# {{"type": "clarification", "message": "Which page would you like to rotate?"}}

# 3. "unsupported" — about PDF editing, but does NOT match any tool listed
#    above (e.g. converting file formats, compressing, watermarking, OCR,
#    redacting, protecting/unlocking with a password — check the tool list
#    above, not this example, to decide). Say plainly it's not supported yet,
#    and mention what IS available BY NAME from the tool list above:
# {{"type": "unsupported", "message": "I can't do that yet — right now I can help with: <list the actual supported tools from above>. Want to try one of those?"}}

# 4. "chat" — greeting, thanks, small talk, or anything unrelated to editing
#    a PDF. Respond briefly and warmly; if it's a greeting, invite them to
#    describe what they'd like done, and mention what's supported BY NAME
#    from the tool list above (not a fixed list — always reflect the tools
#    shown to you in this prompt):
# {{"type": "chat", "message": "Hey! I'm FlowPDF's assistant — I can help with <the actual supported tools from above>. What would you like to do?"}}

# Always pick the type that matches what the user actually asked, checking
# against the CURRENT tool list above — never against tool names mentioned
# only as examples in these instructions. Never invent a tool that isn't in
# the supported list."""


# def plan(user_message: str, documents: list[dict], history: list[dict] | None = None) -> dict:
#     history = history or []
#     history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
#     docs_text = "\n".join(f"{d['label']}: {d['page_count']} pages" for d in documents) or "(none uploaded yet)"
#     contents = (
#         f"Documents in this conversation:\n{docs_text}\n\n"
#         f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
#         f"Latest request: {user_message}"
#     )
#     response = client.models.generate_content(
#         model="gemini-2.5-flash",
#         contents=contents,
#         config=types.GenerateContentConfig(
#             system_instruction=_build_system_prompt(),
#             response_mime_type="application/json",
#             temperature=0,
#         ),
#     )
#     result = json.loads(response.text)  # type: ignore
#     result.setdefault("type", "workflow" if result.get("steps") else "chat")
#     return result
import json
import os
from openai import OpenAI, APIError, RateLimitError
from workers.tools.registry import TOOLS_BY_CATEGORY, TOOLS_INFO

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
    default_headers={
        "HTTP-Referer": "https://flowpdf.online",
        "X-Title": "FlowPDF",
    },
)

# Free-tier model on OpenRouter. Check https://openrouter.ai/models?max_price=0
# periodically — free model availability/names change as providers rotate
# what they offer for free. Swap this string if this one gets deprecated.
MODEL = "openrouter/free"

CATEGORY_LABELS = {
    "page": "Page operations",
    "document": "Document operations",
}


def _build_tools_description() -> str:
    sections = []
    for category, tools in TOOLS_BY_CATEGORY.items():
        label = CATEGORY_LABELS.get(category, category.title())
        lines = [f"### {label}"]
        for t in tools:
            schema_str = (
                ", ".join(f"{k}: {v}" for k, v in t["params_schema"].items())
                if t["params_schema"] else "no params"
            )
            output_note = f" [produces {t['output_count']} documents]" if t.get("output_count", 1) > 1 else ""
            lines.append(f"- {t['name']}: {t['description']} (params — {schema_str}){output_note}")
        sections.append("\n".join(lines))
    return "\n\n".join(sections)


def _build_system_prompt() -> str:
    tools_text = _build_tools_description()
    tool_names = ", ".join(f'"{t["name"]}"' for t in TOOLS_INFO)

    return f"""You are FlowPDF's assistant. Users chat with you to edit PDFs
they've uploaded, each identified by a short label like "doc_1", "doc_2".

You currently support ONLY these tools:
{tools_text}

Output ONLY a JSON object, nothing else — no markdown fences, no preamble,
no explanation before or after. Choose exactly one "type":

1. "workflow" — the request maps to one or more supported edits, expressed
   as an ordered list of steps. Each step's "inputs" is a list of document
   keys — either an original label ("doc_1") or a previous step's "output"
   key, letting you chain edits before a merge/split/etc:

{{"type": "workflow", "steps": [
  {{"id": "rotate_doc1", "tool": "rotate_pages", "inputs": ["doc_1"], "output": "doc1_rotated",
    "params": {{"rotations": [{{"page": 3, "rotation_degrees": 90}}]}}}},
  {{"id": "delete_doc1_page5", "tool": "delete_pages", "inputs": ["doc1_rotated"], "output": "doc1_clean",
    "params": {{"pages": [5]}}}},
  {{"id": "merge_final", "tool": "merge_pdfs", "inputs": ["doc1_clean", "doc_2"], "output": "merged",
    "params": {{}}}}
], "final_outputs": ["merged"]}}

Rules for workflows:
- Valid tool names are ONLY those listed above ({tool_names}). Never invent
  a tool or use one not in that list, no matter how similar to a real one.
- Give each step an "id" that describes what it does (e.g. "rotate_doc1",
  "delete_doc1_pages", "merge_final") — never generic ids like "s1", "s2".
- "final_outputs" lists the output keys that represent the actual result
  documents to return to the user.
- Any edits to a document always run BEFORE that document is consumed by
  a merge or similar multi-input tool.
- All page numbers refer to each document's ORIGINAL page numbering,
  before edits in this request are applied.
- Rotation must be one of 90, 180, 270 degrees.
- Tools marked "[produces N documents]" (currently split_pdf) use
  "outputs": [list of N keys] instead of a single "output" string. List
  ALL of those keys in "final_outputs" unless the user only asked for
  one specific part.

  Example:
  {{"id": "split_doc1", "tool": "split_pdf", "inputs": ["doc_1"],
    "outputs": ["doc1_part1", "doc1_part2"],
    "params": {{"split_after_page": 6}}}}
  ...with "final_outputs": ["doc1_part1", "doc1_part2"]

2. "clarification" — the request IS a supported edit, but is missing
   details you need (which page, which document, which angle, which
   split point):
{{"type": "clarification", "message": "Which page would you like to rotate?"}}

3. "unsupported" — about PDF editing, but does NOT match any tool listed
   above. Say plainly it's not supported yet, and mention what IS
   available BY NAME from the tool list above:
{{"type": "unsupported", "message": "I can't do that yet — right now I can help with: <list the actual supported tools from above>. Want to try one of those?"}}

4. "chat" — greeting, thanks, small talk, or anything unrelated to editing
   a PDF. Respond briefly and warmly; mention what's supported BY NAME
   from the tool list above:
{{"type": "chat", "message": "Hey! I'm FlowPDF's assistant — I can help with <the actual supported tools from above>. What would you like to do?"}}

Always pick the type that matches what the user actually asked, checking
against the CURRENT tool list above — never against tool names mentioned
only as examples in these instructions. Never invent a tool that isn't in
the supported list. Output ONLY the JSON object — no other text."""


def plan(user_message: str, documents: list[dict], history: list[dict] | None = None) -> dict:
    history = history or []
    history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    docs_text = "\n".join(f"{d['label']}: {d['page_count']} pages" for d in documents) or "(none uploaded yet)"
    user_content = (
        f"Documents in this conversation:\n{docs_text}\n\n"
        f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
        f"Latest request: {user_message}"
    )

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": _build_system_prompt()},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
    except RateLimitError:
        return {
            "type": "chat",
            "message": "I'm getting a lot of requests right now — give me a moment and try again in a bit.",
        }
    except APIError as e:
        print(f"OpenRouter API error: {e}")  # TEMPORARY — check your server logs
        return {
            "type": "chat",
            "message": "Something went wrong on my end processing that. Mind trying again?",
        }
    raw_text = response.choices[0].message.content or ""

    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError:
        # free models occasionally wrap JSON in ```json fences or add
        # stray text despite instructions — try stripping fences once
        # before giving up, rather than crashing the request
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            cleaned = cleaned.removeprefix("json").strip()
        try:
            result = json.loads(cleaned)
        except json.JSONDecodeError:
            return {
                "type": "chat",
                "message": "I had trouble understanding that — could you rephrase what you'd like done?",
            }

    result.setdefault("type", "workflow" if result.get("steps") else "chat")
    return result