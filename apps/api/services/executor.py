import os
import zipfile
from apps.api.services.kinds import format_extension
from workers.tools.registry import TOOL_REGISTRY
from workers.tools.base import ToolError
from apps.api.services.workflow_validator import validate_workflow, get_output_keys


def _zip_paths(paths: list[str], zip_path: str) -> str:
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in paths:
            zf.write(p, arcname=os.path.basename(p))
    for p in paths:
        os.remove(p)
    return zip_path


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
        return {"status": "error", "error": {"code": "INVALID_WORKFLOW", "message": validation_error}}

    # Every document is a bundle: {"paths": [...], "kind": ..., "format": ...}.
    # Originals are always PDFs today — wrapped once here.
    documents: dict[str, dict] = {
        label: {"paths": [path], "kind": "pdf", "format": "pdf"} for label, path in doc_paths.items()
    }
    provenance: dict[str, set[str]] = {label: {label} for label in doc_paths}
    diff_summaries = []

    for step in steps:
        error = _validate_step(step, documents)
        if error:
            return {"status": "error", "error": {"code": "INVALID_STEP", "message": error}}

        tool = TOOL_REGISTRY[step["tool"]]
        input_paths = [documents[key]["paths"][0] for key in step["inputs"]]
        output_keys = get_output_keys(step)
        output_count = tool.get("output_count", 1)
        output_kind = tool.get("output_kind", "pdf")
        # tools without a distinct output_format (all the pdf-in/pdf-out
        # tools) just fall back to their kind, which is "pdf" for them
        output_format = tool.get("output_format", output_kind)
        ext = format_extension(output_format)

        if output_count == "dynamic":
            step_dir = os.path.join(cache_dir, step["id"])
            os.makedirs(step_dir, exist_ok=True)
            result = _run_tool(tool, step.get("params", {}), input_paths, output_dir=step_dir)
        else:
            output_paths = [
                os.path.join(cache_dir, f"{step['id']}_{i}{ext}" if output_count > 1 else f"{step['id']}{ext}")
                for i in range(output_count)
            ]
            result = _run_tool(tool, step.get("params", {}), input_paths, output_paths=output_paths)

        if result["status"] != "success":
            return result

        result_paths = result["result"].get("output_paths") or [result["result"]["output_path"]]

        if output_count != "dynamic" and len(result_paths) != len(output_keys):  # type: ignore
            return {
                "status": "error",
                "error": {
                    "code": "OUTPUT_MISMATCH",
                    "message": f"Step '{step['id']}' produced {len(result_paths)} document(s) but declared {len(output_keys)}.",  # type: ignore
                },
            }

        # any tool with more than one output can opt into zipping —
        # collapses N result files into ONE .zip, which then flows through
        # every downstream branch (upload, doc creation, response shape)
        # exactly like a normal single-file result.
        final_kind = output_kind
        final_format = output_format
        if len(result_paths) > 1 and tool.get("zip_outputs"):
            zip_path = os.path.join(cache_dir, f"{step['id']}_bundle.zip")
            result_paths = [_zip_paths(result_paths, zip_path)]
            final_kind = "zip"
            final_format = "zip"

        combined_provenance = set().union(*(provenance.get(k, {k}) for k in step["inputs"]))
        for key in output_keys:  # type: ignore
            documents[key] = {"paths": result_paths, "kind": final_kind, "format": final_format}
            provenance[key] = combined_provenance

        diff_summaries.append(result["result"]["diff_summary"])

    final_outputs = plan.get("final_outputs") or get_output_keys(steps[-1])
    consumed = {key for step in steps for key in step["inputs"] if key in doc_paths}
    untouched = set(doc_paths) - consumed

    results = []
    for out_key in final_outputs:  # type: ignore
        bundle = documents[out_key]
        labels = sorted(provenance.get(out_key, {out_key}) & set(doc_paths))
        results.append({"labels": labels, "paths": bundle["paths"], "kind": bundle["kind"], "format": bundle["format"]})
    for label in untouched:
        results.append({
            "labels": [label],
            "paths": documents[label]["paths"],
            "kind": documents[label]["kind"],
            "format": documents[label]["format"],
        })

    keep_paths = {p for r in results for p in r["paths"]}
    original_paths = set(doc_paths.values())
    for bundle in documents.values():
        for path in bundle["paths"]:
            if path in keep_paths or path in original_paths:
                continue
            if os.path.exists(path):
                os.remove(path)

    return {
        "status": "success",
        "results": results,
        "diff_summary": " ".join(diff_summaries) if diff_summaries else "No changes made.",
    }


# _validate_step and _run_tool — unchanged, no edits needed
def _validate_step(step: dict, documents: dict[str, dict]) -> str | None:
    tool_name = step.get("tool")
    if tool_name not in TOOL_REGISTRY:
        return f"Unknown tool: {tool_name}"

    inputs = step.get("inputs")
    if not inputs or not isinstance(inputs, list):
        return f"Step '{step.get('id')}' must specify a non-empty 'inputs' list"

    for key in inputs:
        if key not in documents:
            return f"Step '{step.get('id')}' references unknown document '{key}'"
        if len(documents[key]["paths"]) != 1:
            return f"Step '{step.get('id')}' references '{key}', a group of {len(documents[key]['paths'])} files — no tool can take a group as input yet"

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
    if expected_count != "dynamic" and len(output_keys) != expected_count:
        return f"Tool '{tool_name}' produces {expected_count} document(s), step declared {len(output_keys)}"
    if expected_count == "dynamic" and len(output_keys) != 1:
        return f"Tool '{tool_name}' produces a variable count — step must declare exactly one output key"

    return None


def _run_tool(tool: dict, params: dict, input_paths: list[str], output_paths: list[str] | None = None, output_dir: str | None = None) -> dict:
    full_params = dict(params)
    full_params["input_path" if tool["arity"] == "single" else "input_paths"] = (
        input_paths[0] if tool["arity"] == "single" else input_paths
    )
    if output_dir is not None:
        full_params["output_dir"] = output_dir
    elif output_paths is not None:
        full_params["output_paths" if tool.get("output_count", 1) > 1 else "output_path"] = (
            output_paths if tool.get("output_count", 1) > 1 else output_paths[0]
        )

    try:
        tool_input = tool["input_model"](**full_params)
        result = tool["run"](tool_input)
        return {"status": "success", "result": result.model_dump()}
    except ToolError as e:
        return {"status": "error", "error": {"code": e.code.value, "message": e.message}}