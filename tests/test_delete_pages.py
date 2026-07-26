import pikepdf
import pytest
from workers.tools.delete_pages import run, DeletePagesInput
from workers.tools.base import ToolError, ToolErrorCode


@pytest.fixture
def sample_pdf(tmp_path):
    """Creates a throwaway 5-page PDF for testing, so you don't
    depend on a fixture file existing yet."""
    path = tmp_path / "sample.pdf"
    pdf = pikepdf.new()
    for _ in range(5):
        pdf.add_blank_page(page_size=(200, 200))
    pdf.save(str(path))
    pdf.close()
    return str(path)


def test_delete_single_page(sample_pdf, tmp_path):
    output_path = str(tmp_path / "output.pdf")
    result = run(DeletePagesInput(
        input_path=sample_pdf,
        output_path=output_path,
        pages=[3],
    ))
    assert result.pages_remaining == 4
    assert "page(s) 3" in result.diff_summary

    with pikepdf.open(output_path) as pdf:
        assert len(pdf.pages) == 4


def test_delete_multiple_pages(sample_pdf, tmp_path):
    output_path = str(tmp_path / "output.pdf")
    result = run(DeletePagesInput(
        input_path=sample_pdf,
        output_path=output_path,
        pages=[1, 4],
    ))
    assert result.pages_remaining == 3


def test_delete_out_of_range_raises(sample_pdf, tmp_path):
    output_path = str(tmp_path / "output.pdf")
    with pytest.raises(ToolError) as exc_info:
        run(DeletePagesInput(
            input_path=sample_pdf,
            output_path=output_path,
            pages=[99],
        ))
    assert exc_info.value.code == ToolErrorCode.PAGE_OUT_OF_RANGE