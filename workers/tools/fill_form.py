# workers/tools/fill_form.py
import pikepdf
from workers.tools.base import ToolInput, ToolOutput, ToolError, ToolErrorCode


class FillFormInput(ToolInput):
    input_path: str
    output_path: str
    fields: dict[str, str]  # field name -> value to fill in


class FillFormOutput(ToolOutput):
    output_path: str
    diff_summary: str
    page_count: int


def run(params: FillFormInput) -> FillFormOutput:
    with pikepdf.open(params.input_path) as pdf:
        if "/AcroForm" not in pdf.Root:
            raise ToolError(
                code=ToolErrorCode.INVALID_INPUT, # type: ignore
                message="This document doesn't contain any fillable form fields.",
            )

        filled = 0
        acroform = pdf.Root.AcroForm
        for field in acroform.get("/Fields", []):
            name = str(field.get("/T", ""))
            if name in params.fields:
                field["/V"] = pikepdf.String(params.fields[name])
                filled += 1

        page_count = len(pdf.pages)
        pdf.save(params.output_path)

    if filled == 0:
        raise ToolError(
            code=ToolErrorCode.INVALID_INPUT, # type: ignore
            message="None of the given field names matched fields in this document's form.",
        )

    return FillFormOutput(
        output_path=params.output_path,
        diff_summary=f"Filled in {filled} form field(s).",
        page_count=page_count,
    )