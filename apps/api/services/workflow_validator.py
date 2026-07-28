def get_output_keys(step: dict) -> list[str] | None:
    """Normalizes a step's declared outputs — 'output' (single tools) or
    'outputs' (multi-output tools like split) — into a flat list."""
    if "outputs" in step:
        outputs = step["outputs"]
        if not isinstance(outputs, list) or not outputs:
            return None
        return outputs
    if step.get("output"):
        return [step["output"]]
    return None


def validate_workflow(plan: dict, known_documents: set[str]) -> str | None:
    steps = plan.get("steps", [])
    if not steps:
        return "Workflow has no steps."

    seen_ids = set()
    produced = set(known_documents)

    for step in steps:
        step_id = step.get("id")
        if not step_id:
            return "Every step needs an 'id'."
        if step_id in seen_ids:
            return f"Duplicate step id: '{step_id}'."
        seen_ids.add(step_id)

        inputs = step.get("inputs")
        if not inputs or not isinstance(inputs, list):
            return f"Step '{step_id}' must specify a non-empty 'inputs' list."

        for key in inputs:
            if key not in produced:
                return f"Step '{step_id}' references '{key}', which doesn't exist yet."

        output_keys = get_output_keys(step)
        if not output_keys:
            return f"Step '{step_id}' must specify an 'output' string or 'outputs' list."

        for key in output_keys:
            if key in produced:
                return f"Step '{step_id}' output '{key}' collides with an existing document key."
            produced.add(key)

    final_outputs = plan.get("final_outputs") or get_output_keys(steps[-1]) or []
    for key in final_outputs:
        if key not in produced:
            return f"final_outputs references '{key}', which no step produces."

    return None