
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
        output_count = t.get("output_count", 1)
        if output_count == "dynamic":
            output_note = " [produces a VARIABLE number of documents — one per page; you MUST use \"outputs\" with a single key representing the whole group, not one key per page]"
        elif output_count > 1:
            output_note = f" [produces {output_count} documents]"
        else:
            output_note = ""
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