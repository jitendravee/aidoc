# apps/api/services/executor.py
from workers.tools.registry import TOOL_REGISTRY
from workers.tools.base import ToolError


def execute_plan(plan: dict, input_path: str, output_path: str) -> dict:
    operations = plan.get("operations", [])

    if not operations:
        return {"status": "clarification_needed", "question": plan.get("clarification")}

    rotate_ops = [op for op in operations if op["tool"] == "rotate_pages"]
    delete_ops = [op for op in operations if op["tool"] == "delete_pages"]
    unknown_ops = [op for op in operations if op["tool"] not in ("rotate_pages", "delete_pages")]

    if unknown_ops:
        return {"status": "error", "message": f"Unknown tool(s): {[o['tool'] for o in unknown_ops]}"}

    current_path = input_path
    diff_summaries = []

    # Step 1: all rotations first — they never change page count,
    # so they're safe to apply in any order without touching numbering.
    for i, op in enumerate(rotate_ops):
        result = _run_tool("rotate_pages", op["params"], current_path,
                            _next_path(output_path, f"rotate_{i}"))
        if result["status"] != "success":
            return result
        current_path = result["result"]["output_path"]
        diff_summaries.append(result["result"]["diff_summary"])

    # Step 2: merge every delete_pages op into ONE call, so the tool's
    # internal highest-to-lowest sort handles all of them together —
    # this is what actually prevents the "second delete hits shifted
    # index" bug, not just ordering delete calls by page number.
    if delete_ops:
        merged_pages = []
        for op in delete_ops:
            merged_pages.extend(op["params"]["pages"])
        merged_pages = sorted(set(merged_pages))

        result = _run_tool("delete_pages", {"pages": merged_pages}, current_path, output_path)
        if result["status"] != "success":
            return result
        current_path = result["result"]["output_path"]
        diff_summaries.append(result["result"]["diff_summary"])

    return {
        "status": "success",
        "final_output_path": current_path,
        "diff_summary": " ".join(diff_summaries),
    }


def _run_tool(tool_name: str, params: dict, input_path: str, output_path: str) -> dict:
    tool = TOOL_REGISTRY[tool_name]
    full_params = dict(params)
    full_params["input_path"] = input_path
    full_params["output_path"] = output_path
    try:
        tool_input = tool["input_model"](**full_params)
        result = tool["run"](tool_input)
        return {"status": "success", "result": result.model_dump()}
    except ToolError as e:
        return {"status": "error", "code": e.code, "message": e.message}


def _next_path(base_output_path: str, suffix: str) -> str:
    # intermediate file for multi-step chains, e.g. .../v_abc123_rotate_0.pdf
    root, ext = base_output_path.rsplit(".", 1)
    return f"{root}_{suffix}.{ext}"