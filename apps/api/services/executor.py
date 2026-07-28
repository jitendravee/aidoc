import os
from workers.tools.registry import TOOL_REGISTRY
from workers.tools.base import ToolError
from apps.api.services.workflow_validator import validate_workflow, get_output_keys


def execute_plan(plan: dict, doc_paths: dict[str, str], cache_dir: str) -> dict:
    plan_type = plan.get("type", "workflow")

    if plan_type in ("chat", "unsupported"):
        return {"status": plan_type, "message": plan.get("message", "")}

    if plan_type == "clarification":
        return {"status": "clarification_needed", "question": plan.get("message")}

    steps = plan.get("steps", [])
    if not steps:
        return {"status": "clarification_needed", "question": "Could you clarify what you'd like to do?"}

    validation_error = validate_workflow(plan, known_documents=set(doc_paths))
    if validation_error:
        return {"status": "error", "code": "invalid_workflow", "message": validation_error}

    documents = dict(doc_paths)
    provenance: dict[str, set[str]] = {label: {label} for label in doc_paths}
    diff_summaries = []

    for step in steps:
        error = _validate_step(step, documents)
        if error:
            return {"status": "error", "code": "invalid_step", "message": error}

        tool = TOOL_REGISTRY[step["tool"]]
        input_paths = [documents[key] for key in step["inputs"]]
        output_keys = get_output_keys(step)
        output_count = tool.get("output_count", 1)
        output_paths = [
            os.path.join(cache_dir, f"{step['id']}_{i}.pdf" if output_count > 1 else f"{step['id']}.pdf")
            for i in range(output_count)
        ]

        result = _run_tool(tool, step.get("params", {}), input_paths, output_paths)
        if result["status"] != "success":
            return result

        result_paths = result["result"].get("output_paths") or [result["result"]["output_path"]]
        if len(result_paths) != len(output_keys): # type: ignore
            return {
                "status": "error",
                "code": "output_mismatch",
                "message": f"Step '{step['id']}' produced {len(result_paths)} document(s) but declared {len(output_keys)} output key(s).", # type: ignore
            }

        combined_provenance = set().union(*(provenance.get(k, {k}) for k in step["inputs"]))
        for key, path in zip(output_keys, result_paths): # type: ignore
            documents[key] = path
            provenance[key] = combined_provenance

        diff_summaries.append(result["result"]["diff_summary"])

    final_outputs = plan.get("final_outputs") or get_output_keys(steps[-1])
    consumed = {key for step in steps for key in step["inputs"] if key in doc_paths}
    untouched = set(doc_paths) - consumed

    results = []
    for out_key in final_outputs: # type: ignore
        labels = sorted(provenance.get(out_key, {out_key}) & set(doc_paths))
        results.append({"labels": labels, "path": documents[out_key]})
    for label in untouched:
        results.append({"labels": [label], "path": documents[label]})

    keep_paths = {r["path"] for r in results}
    original_paths = set(doc_paths.values())
    for path in documents.values():
        if path in keep_paths or path in original_paths:
            continue
        if os.path.exists(path):
            os.remove(path)

    return {
        "status": "success",
        "results": results,
        "diff_summary": " ".join(diff_summaries) if diff_summaries else "No changes made.",
    }


def _validate_step(step: dict, documents: dict[str, str]) -> str | None:
    tool_name = step.get("tool")
    if tool_name not in TOOL_REGISTRY:
        return f"Unknown tool: {tool_name}"

    inputs = step.get("inputs")
    if not inputs or not isinstance(inputs, list):
        return f"Step '{step.get('id')}' must specify a non-empty 'inputs' list"

    for key in inputs:
        if key not in documents:
            return f"Step '{step.get('id')}' references unknown document '{key}'"

    tool = TOOL_REGISTRY[tool_name]
    arity = tool.get("arity", "single")
    if arity == "single" and len(inputs) != 1:
        return f"Tool '{tool_name}' takes exactly one input document"
    if arity == "multi" and len(inputs) < 2:
        return f"Tool '{tool_name}' needs at least two input documents"

    output_keys = get_output_keys(step)
    if not output_keys:
        return f"Step '{step.get('id')}' must specify an 'output' string or 'outputs' list"

    expected_count = tool.get("output_count", 1)
    if len(output_keys) != expected_count:
        return f"Tool '{tool_name}' produces {expected_count} document(s), but step declared {len(output_keys)} output key(s)"

    return None


def _run_tool(tool: dict, params: dict, input_paths: list[str], output_paths: list[str]) -> dict:
    full_params = dict(params)
    full_params["input_path" if tool["arity"] == "single" else "input_paths"] = (
        input_paths[0] if tool["arity"] == "single" else input_paths
    )
    full_params["output_paths" if tool.get("output_count", 1) > 1 else "output_path"] = (
        output_paths if tool.get("output_count", 1) > 1 else output_paths[0]
    )

    try:
        tool_input = tool["input_model"](**full_params)
        result = tool["run"](tool_input)
        return {"status": "success", "result": result.model_dump()}
    except ToolError as e:
        return {"status": "error", "code": e.code.value, "message": e.message}