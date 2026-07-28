# # import json
# # from google import genai
# # from google.genai import types
# # from workers.tools.registry import TOOLS_BY_CATEGORY, TOOLS_INFO

# # client = genai.Client()

# # CATEGORY_LABELS = {
# #     "page": "Page operations",
# #     "document": "Document operations",
# # }


# # def _build_tools_description() -> str:
# #     sections = []
# #     for category, tools in TOOLS_BY_CATEGORY.items():
# #         label = CATEGORY_LABELS.get(category, category.title())
# #         lines = [f"### {label}"]
# #         for t in tools:
# #             schema_str = (
# #                 ", ".join(f"{k}: {v}" for k, v in t["params_schema"].items())
# #                 if t["params_schema"] else "no params"
# #             )
# #             output_note = f" [produces {t['output_count']} documents]" if t["output_count"] > 1 else ""
# #             lines.append(f"- {t['name']}: {t['description']} (params — {schema_str}){output_note}")
# #         sections.append("\n".join(lines))
# #     return "\n\n".join(sections)


# # def _build_system_prompt() -> str:
# #     tools_text = _build_tools_description()
# #     tool_names = ", ".join(f'"{t["name"]}"' for t in TOOLS_INFO)

# #     return f"""You are FlowPDF's assistant. Users chat with you to edit PDFs
# # they've uploaded, each identified by a short label like "doc_1", "doc_2".

# # You currently support ONLY these tools:
# # {tools_text}

# # Output ONLY a JSON object. Choose exactly one "type":

# # 1. "workflow" — the request maps to one or more supported edits, expressed
# #    as an ordered list of steps. Each step's "inputs" is a list of document
# #    keys — either an original label ("doc_1") or a previous step's "output"
# #    key, letting you chain edits before a merge/split/etc:

# # {{"type": "workflow", "steps": [
# #   {{"id": "rotate_doc1", "tool": "rotate_pages", "inputs": ["doc_1"], "output": "doc1_rotated",
# #     "params": {{"rotations": [{{"page": 3, "rotation_degrees": 90}}]}}}},
# #   {{"id": "delete_doc1_page5", "tool": "delete_pages", "inputs": ["doc1_rotated"], "output": "doc1_clean",
# #     "params": {{"pages": [5]}}}},
# #   {{"id": "merge_final", "tool": "merge_pdfs", "inputs": ["doc1_clean", "doc_2"], "output": "merged",
# #     "params": {{}}}}
# # ], "final_outputs": ["merged"]}}

# # Rules for workflows:
# # - Valid tool names are ONLY those listed above ({tool_names}). Never invent
# #   a tool or use one not in that list, no matter how similar to a real one.
# # - Give each step an "id" that describes what it does (e.g. "rotate_doc1",
# #   "delete_doc1_pages", "merge_final") — never generic ids like "s1", "s2".
# # - "final_outputs" lists the output keys that represent the actual result
# #   documents to return to the user — usually just the last step's output,
# #   but list more than one if independent chains exist.
# # - Any edits to a document always run BEFORE that document is consumed by
# #   a merge or similar multi-input tool.
# # - All page numbers refer to each document's ORIGINAL page numbering,
# #   before edits in this request are applied.
# # - Rotation must be one of 90, 180, 270 degrees.
# # - Tools marked "[produces N documents]" (currently split_pdf) use
# #   "outputs": [list of N keys] instead of a single "output" string. List
# #   ALL of those keys in "final_outputs" if the user wants every result
# #   back — for split, that means both halves unless they only asked for
# #   one specific part.

# #   Example:
# #   {{"id": "split_doc1", "tool": "split_pdf", "inputs": ["doc_1"],
# #     "outputs": ["doc1_part1", "doc1_part2"],
# #     "params": {{"split_after_page": 6}}}}
# #   ...with "final_outputs": ["doc1_part1", "doc1_part2"]

# # 2. "clarification" — the request IS a supported edit (matches one of the
# #    tools listed above), but is missing details you need (which page, which
# #    document, which angle, which split point):
# # {{"type": "clarification", "message": "Which page would you like to rotate?"}}

# # 3. "unsupported" — about PDF editing, but does NOT match any tool listed
# #    above (e.g. converting file formats, compressing, watermarking, OCR,
# #    redacting, protecting/unlocking with a password — check the tool list
# #    above, not this example, to decide). Say plainly it's not supported yet,
# #    and mention what IS available BY NAME from the tool list above:
# # {{"type": "unsupported", "message": "I can't do that yet — right now I can help with: <list the actual supported tools from above>. Want to try one of those?"}}

# # 4. "chat" — greeting, thanks, small talk, or anything unrelated to editing
# #    a PDF. Respond briefly and warmly; if it's a greeting, invite them to
# #    describe what they'd like done, and mention what's supported BY NAME
# #    from the tool list above (not a fixed list — always reflect the tools
# #    shown to you in this prompt):
# # {{"type": "chat", "message": "Hey! I'm FlowPDF's assistant — I can help with <the actual supported tools from above>. What would you like to do?"}}

# # Always pick the type that matches what the user actually asked, checking
# # against the CURRENT tool list above — never against tool names mentioned
# # only as examples in these instructions. Never invent a tool that isn't in
# # the supported list."""


# # def plan(user_message: str, documents: list[dict], history: list[dict] | None = None) -> dict:
# #     history = history or []
# #     history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
# #     docs_text = "\n".join(f"{d['label']}: {d['page_count']} pages" for d in documents) or "(none uploaded yet)"
# #     contents = (
# #         f"Documents in this conversation:\n{docs_text}\n\n"
# #         f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
# #         f"Latest request: {user_message}"
# #     )
# #     response = client.models.generate_content(
# #         model="gemini-2.5-flash",
# #         contents=contents,
# #         config=types.GenerateContentConfig(
# #             system_instruction=_build_system_prompt(),
# #             response_mime_type="application/json",
# #             temperature=0,
# #         ),
# #     )
# #     result = json.loads(response.text)  # type: ignore
# #     result.setdefault("type", "workflow" if result.get("steps") else "chat")
# #     return result
# import json
# import os
# from openai import OpenAI, APIError, RateLimitError
# from workers.tools.registry import TOOLS_BY_CATEGORY, TOOLS_INFO

# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key=os.environ["OPENROUTER_API_KEY"],
#     default_headers={
#         "HTTP-Referer": "https://flowpdf.online",
#         "X-Title": "FlowPDF",
#     },
# )

# # Free-tier model on OpenRouter. Check https://openrouter.ai/models?max_price=0
# # periodically — free model availability/names change as providers rotate
# # what they offer for free. Swap this string if this one gets deprecated.
# MODEL = "openrouter/free"

# CATEGORY_LABELS = {
#     "page": "Page operations",
#     "document": "Document operations",
#     "security": "Security operations",
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
#             output_note = f" [produces {t['output_count']} documents]" if t.get("output_count", 1) > 1 else ""
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

# Output ONLY a JSON object, nothing else — no markdown fences, no preamble,
# no explanation before or after. Choose exactly one "type":

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
#   documents to return to the user.
# - Any edits to a document always run BEFORE that document is consumed by
#   a merge or similar multi-input tool.
# - All page numbers refer to each document's ORIGINAL page numbering,
#   before edits in this request are applied.
# - Rotation must be one of 90, 180, 270 degrees.
# - Tools marked "[produces N documents]" (currently split_pdf) use
#   "outputs": [list of N keys] instead of a single "output" string. List
#   ALL of those keys in "final_outputs" unless the user only asked for
#   one specific part.

#   Example:
#   {{"id": "split_doc1", "tool": "split_pdf", "inputs": ["doc_1"],
#     "outputs": ["doc1_part1", "doc1_part2"],
#     "params": {{"split_after_page": 6}}}}
#   ...with "final_outputs": ["doc1_part1", "doc1_part2"]

# 2. "clarification" — the request IS a supported edit, but is missing
#    details you need (which page, which document, which angle, which
#    split point):
# {{"type": "clarification", "message": "Which page would you like to rotate?"}}

# 2b. "password_required" — the request is to protect or unlock a PDF, and
#     the tool needed is "protect_pdf" or "unlock_pdf", but no password was
#     given in the message. NEVER ask for a password in chat text — that
#     field is handled by a secure UI, not conversation. Identify the tool,
#     the target document, and — if the user ALSO asked for other edits in
#     the same message (e.g. "delete page 4 and protect it") — include those
#     as "pending_steps", using the exact same step shape as a workflow step,
#     so nothing the user asked for gets silently dropped:
# {{"type": "password_required", "tool": "protect_pdf", "target": "doc_1", "pending_steps": []}}
# Example with a combined request ("delete page 4 then password protect doc_1"):
# {{"type": "password_required", "tool": "protect_pdf", "target": "doc_1", "pending_steps": [
#   {{"id": "delete_doc1_page4", "tool": "delete_pages", "inputs": ["doc_1"], "output": "doc1_clean", "params": {{"pages": [4]}}}}
# ]}}

# 3. "unsupported" — about PDF editing, but does NOT match any tool listed
#    above. Say plainly it's not supported yet, and mention what IS
#    available BY NAME from the tool list above:
# {{"type": "unsupported", "message": "I can't do that yet — right now I can help with: <list the actual supported tools from above>. Want to try one of those?"}}

# 4. "chat" — greeting, thanks, small talk, or anything unrelated to editing
#    a PDF. Respond briefly and warmly; mention what's supported BY NAME
#    from the tool list above:
# {{"type": "chat", "message": "Hey! I'm FlowPDF's assistant — I can help with <the actual supported tools from above>. What would you like to do?"}}

# Always pick the type that matches what the user actually asked... For
# protect/unlock requests specifically, if a password wasn't given, use
# "password_required" — never "clarification" — since passwords must never
# be typed into chat.
# Always pick the type that matches what the user actually asked, checking
# against the CURRENT tool list above — never against tool names mentioned
# only as examples in these instructions. Never invent a tool that isn't in
# the supported list. Output ONLY the JSON object — no other text."""


# def plan(user_message: str, documents: list[dict], history: list[dict] | None = None) -> dict:
#     history = history or []
#     history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
#     docs_text = "\n".join(f"{d['label']}: {d['page_count']} pages" for d in documents) or "(none uploaded yet)"
#     user_content = (
#         f"Documents in this conversation:\n{docs_text}\n\n"
#         f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
#         f"Latest request: {user_message}"
#     )

#     try:
#         response = client.chat.completions.create(
#             model=MODEL,
#             messages=[
#                 {"role": "system", "content": _build_system_prompt()},
#                 {"role": "user", "content": user_content},
#             ],
#             response_format={"type": "json_object"},
#             temperature=0,
#         )
#     except RateLimitError:
#         return {
#             "type": "chat",
#             "message": "I'm getting a lot of requests right now — give me a moment and try again in a bit.",
#         }
#     except APIError as e:
#         print(f"OpenRouter API error: {e}")  # TEMPORARY — check your server logs
#         return {
#             "type": "chat",
#             "message": "Something went wrong on my end processing that. Mind trying again?",
#         }
#     raw_text = response.choices[0].message.content or ""

#     try:
#         result = json.loads(raw_text)
#     except json.JSONDecodeError:
#         # free models occasionally wrap JSON in ```json fences or add
#         # stray text despite instructions — try stripping fences once
#         # before giving up, rather than crashing the request
#         cleaned = raw_text.strip()
#         if cleaned.startswith("```"):
#             cleaned = cleaned.strip("`")
#             cleaned = cleaned.removeprefix("json").strip()
#         try:
#             result = json.loads(cleaned)
#         except json.JSONDecodeError:
#             return {
#                 "type": "chat",
#                 "message": "I had trouble understanding that — could you rephrase what you'd like done?",
#             }

#     result.setdefault("type", "workflow" if result.get("steps") else "chat")
#     return result



import json
import os
from openai import OpenAI, APIError, RateLimitError
from workers.tools.registry import TOOLS_INFO

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
    default_headers={"HTTP-Referer": "https://flowpdf.online", "X-Title": "FlowPDF"},
)

MODEL = "openrouter/free"


def _call_llm(system_prompt: str, user_content: str) -> dict:
    """Shared LLM call + JSON parsing, used by both the router and the
    detailed planner — one place to handle rate limits, API errors, and
    the occasional free-model markdown-fence wrapping."""
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
    except RateLimitError:
        return {"type": "chat", "message": "I'm getting a lot of requests right now — try again in a bit."}
    except APIError as e:
        print(f"OpenRouter API error: {e}")
        return {"type": "chat", "message": "Something went wrong on my end. Mind trying again?"}

    raw_text = response.choices[0].message.content or ""
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        cleaned = raw_text.strip().strip("`").removeprefix("json").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {"type": "chat", "message": "I had trouble understanding that — could you rephrase?"}


# ---------- Stage 1: router — cheap, name+one-liner only, cost independent
# of how detailed each tool's schema is ----------

def _build_router_prompt() -> str:
    tool_lines = "\n".join(f'- {t["name"]}: {t["description"]}' for t in TOOLS_INFO)
    return f"""You are the routing step for FlowPDF, a PDF editing assistant.
Below is the FULL list of supported tools (name: one-line description):

{tool_lines}

Given the conversation and the user's latest message, decide:

- Greeting, thanks, small talk, unrelated to PDF editing:
  {{"type": "chat", "message": "a brief warm reply, mentioning what you can help with"}}
- About PDF editing but matches NONE of the tools above:
  {{"type": "unsupported", "message": "plainly say it's not supported yet"}}
- Otherwise:
  {{"type": "workflow", "candidate_tools": ["tool_a", "tool_b"]}}

For "candidate_tools", be generous — include every tool that might be
needed, including ones needed to complete a follow-up answer to a prior
clarifying question. Omitting a needed tool is worse than including an
unnecessary one.

Output ONLY the JSON object, nothing else."""


def _route(user_message: str, documents: list[dict], history: list[dict]) -> dict:
    history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    docs_text = "\n".join(f"{d['label']}: {d['page_count']} pages" for d in documents) or "(none uploaded yet)"
    user_content = (
        f"Documents in this conversation:\n{docs_text}\n\n"
        f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
        f"Latest request: {user_message}"
    )
    return _call_llm(_build_router_prompt(), user_content)


# ---------- Stage 2: detailed planner — only sees the tools the router picked ----------

def _build_tools_description(tools: list[dict]) -> str:
    lines = []
    for t in tools:
        schema_str = (
            ", ".join(f"{k}: {v}" for k, v in t["params_schema"].items())
            if t["params_schema"] else "no params"
        )
        output_note = f" [produces {t['output_count']} documents]" if t.get("output_count", 1) > 1 else ""
        lines.append(f"- {t['name']}: {t['description']} (params — {schema_str}){output_note}")
        for note in t.get("usage_notes", []):
            lines.append(f"    NOTE: {note}")
    return "\n".join(lines)


def _build_detailed_system_prompt(candidate_tools: list[dict]) -> str:
    tools_text = _build_tools_description(candidate_tools)
    tool_names = ", ".join(f'"{t["name"]}"' for t in candidate_tools)

    return f"""You are FlowPDF's assistant. Users chat with you to edit PDFs
they've uploaded, each identified by a short label like "doc_1", "doc_2".

For THIS request, the following tools are relevant (a routing step already
narrowed the full tool catalog down to these):
{tools_text}

Output ONLY a JSON object, nothing else. Choose exactly one "type":

1. "workflow" — an ordered list of steps. Each step's "inputs" is a list of
   document keys — an original label ("doc_1") or a previous step's
   "output" key, letting you chain edits before a merge/split/etc:

{{"type": "workflow", "steps": [
  {{"id": "rotate_doc1", "tool": "rotate_pages", "inputs": ["doc_1"], "output": "doc1_rotated",
    "params": {{"rotations": [{{"page": 3, "rotation_degrees": 90}}]}}}}
], "final_outputs": ["doc1_rotated"]}}

Rules:
- Valid tool names are ONLY: {tool_names}. Never invent a tool or use one
  not in this list — if what's needed truly isn't here, use "unsupported".
- Give each step an "id" describing what it does, never generic ids like "s1".
- "final_outputs" lists the output keys that are the actual result documents.
- Edits to a document always run BEFORE that document is consumed by a
  merge or other multi-input tool.
- All page numbers refer to each document's ORIGINAL page numbering,
  before edits in this request are applied.
- Tools producing more than one document use "outputs": [list of keys]
  instead of "output". List every one of those keys in "final_outputs"
  unless the user only asked for a specific part.
- Follow any per-tool NOTE lines above exactly — they contain rules
  (unit conversions, defaults, etc.) specific to that tool.

2. "clarification" — the request matches a listed tool but is missing a
   required detail:
{{"type": "clarification", "message": "Which page would you like to rotate?"}}
If multiple details are missing across the request, ask for all of them
in ONE message, not one at a time.

2b. "password_required" — the tool needed is "protect_pdf" or "unlock_pdf"
    and no password was given. NEVER ask for a password in chat text.
    Include any OTHER requested edits as "pending_steps" (same shape as a
    workflow step) so nothing the user asked for gets dropped:
{{"type": "password_required", "tool": "protect_pdf", "target": "doc_1", "pending_steps": []}}

3. "unsupported" — doesn't match any tool listed above, even though these
   are only the tools relevant to THIS request (not the full catalog):
{{"type": "unsupported", "message": "I can't do that yet — right now I can help with: <name the relevant tools listed above>. Want to try one of those?"}}

Output ONLY the JSON object — no other text."""


def _plan_detailed(user_message: str, documents: list[dict], history: list[dict], candidate_tool_names: list[str]) -> dict:
    candidate_tools = [t for t in TOOLS_INFO if t["name"] in candidate_tool_names]
    history_text = "\n".join(f"{m['role']}: {m['content']}" for m in history)
    docs_text = "\n".join(f"{d['label']}: {d['page_count']} pages" for d in documents) or "(none uploaded yet)"
    user_content = (
        f"Documents in this conversation:\n{docs_text}\n\n"
        f"Conversation so far:\n{history_text if history_text else '(no prior messages)'}\n\n"
        f"Latest request: {user_message}"
    )
    result = _call_llm(_build_detailed_system_prompt(candidate_tools), user_content)
    result.setdefault("type", "workflow" if result.get("steps") else "chat")
    return result


# ---------- Public entry point — unchanged signature, so nothing calling
# plan() elsewhere needs to change ----------

def plan(user_message: str, documents: list[dict], history: list[dict] | None = None) -> dict:
    history = history or []
    routed = _route(user_message, documents, history)

    if routed.get("type") == "chat":
        routed.setdefault("message", "Hey! What would you like me to help with?")
        return routed

    if routed.get("type") == "unsupported":
        # don't trust a negative verdict from the cheap router alone — the
        # router only sees one-line descriptions and can misfire, so give
        # the detailed planner a chance against the FULL catalog before
        # actually telling the user "no". This costs a normal-size prompt
        # only in this one (should be rare) fallback path, not on every call.
        fallback = _plan_detailed(user_message, documents, history, [t["name"] for t in TOOLS_INFO])
        if fallback.get("type") != "unsupported":
            return fallback
        fallback.setdefault("message", routed.get("message", "I can't do that yet — could you tell me more about what edit you need?"))
        return fallback

    candidate_tools = routed.get("candidate_tools", [])
    if not candidate_tools:
        return {"type": "unsupported", "message": "I couldn't match that to anything I support yet — could you rephrase?"}

    return _plan_detailed(user_message, documents, history, candidate_tools)