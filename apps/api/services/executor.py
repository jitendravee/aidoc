# apps/api/services/executor.py
import os
from workers.tools.registry import TOOL_REGISTRY
from workers.tools.base import ToolError


def execute_plan(plan: dict, doc_paths: dict[str, str], cache_dir: str) -> dict:
    plan_type = plan.get("type", "operations")

    if plan_type == "chat":
        return {"status": "chat", "message": plan.get("message", "")}

    if plan_type == "unsupported":
        return {"status": "unsupported", "message": plan.get("message", "")}

    if plan_type == "clarification":
        return {"status": "clarification_needed", "question": plan.get("message")}

    operations = plan.get("operations", [])
    if not operations:
        return {"status": "clarification_needed", "question": plan.get("clarification", "Could you clarify what you'd like to do?")}


    single_doc_ops = [op for op in operations if "target" in op]
    merge_ops = [op for op in operations if op["tool"] == "merge_pdfs"]

    current_paths = dict(doc_paths)
    diff_summaries = []

    by_target: dict[str, list[dict]] = {}
    for op in single_doc_ops:
        by_target.setdefault(op["target"], []).append(op)

    for target, ops in by_target.items():
        rotate_ops = [o for o in ops if o["tool"] == "rotate_pages"]
        delete_ops = [o for o in ops if o["tool"] == "delete_pages"]
        path = current_paths[target]

        for i, op in enumerate(rotate_ops):
            step_output = os.path.join(cache_dir, f"{target}_rotate_{i}.pdf")
            result = _run_tool("rotate_pages", op["params"], path, step_output)
            if result["status"] != "success":
                return result
            if path != doc_paths[target]:
                os.remove(path)
            path = result["result"]["output_path"]
            diff_summaries.append(f"[{target}] {result['result']['diff_summary']}")

        if delete_ops:
            merged_pages = sorted(set(p for o in delete_ops for p in o["params"]["pages"]))
            step_output = os.path.join(cache_dir, f"{target}_delete.pdf")
            result = _run_tool("delete_pages", {"pages": merged_pages}, path, step_output)
            if result["status"] != "success":
                return result
            if path != doc_paths[target]:
                os.remove(path)
            path = result["result"]["output_path"]
            diff_summaries.append(f"[{target}] {result['result']['diff_summary']}")

        current_paths[target] = path

    results = []            # [{"labels": [...], "path": ...}, ...]
    merged_labels = set()

    if merge_ops:
        merge_op = merge_ops[0]
        ordered_paths = [current_paths[label] for label in merge_op["targets"]]
        final_output_path = os.path.join(cache_dir, "merged_final.pdf")
        result = _run_tool("merge_pdfs", {"input_paths": ordered_paths}, None, final_output_path)
        if result["status"] != "success":
            return result

        for label in merge_op["targets"]:
            merged_labels.add(label)
            if current_paths[label] != doc_paths[label]:
                os.remove(current_paths[label])

        diff_summaries.append(result["result"]["diff_summary"])
        results.append({"labels": merge_op["targets"], "path": final_output_path})

    # every document not consumed by a merge is its own independent
    # result — whether it was edited above, or left completely untouched
    for label, path in current_paths.items():
        if label not in merged_labels:
            results.append({"labels": [label], "path": path})

    return {
        "status": "success",
        "results": results,
        "diff_summary": " ".join(diff_summaries) if diff_summaries else "No changes made.",
    }


def _run_tool(tool_name: str, params: dict, input_path, output_path: str) -> dict:
    tool = TOOL_REGISTRY[tool_name]
    full_params = dict(params)
    if input_path is not None:
        full_params["input_path"] = input_path
    full_params["output_path"] = output_path
    try:
        tool_input = tool["input_model"](**full_params)
        result = tool["run"](tool_input)
        return {"status": "success", "result": result.model_dump()}
    except ToolError as e:
        return {"status": "error", "code": e.code, "message": e.message}