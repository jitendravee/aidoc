import { useQuery } from "@tanstack/react-query";
import { getTools } from "@/lib/api/tools";

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: getTools,

    // Show immediately
    placeholderData: MOCK_TOOLS,

    // Always try fetching the real data
    staleTime: 0,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
// lib/api/mockTools.ts

export const MOCK_TOOLS = [
  {
    name: "delete_pages",
    label: "Delete Pages",
    description: "Delete one or more pages from a document.",
    category: "page",
    available: true,
  },
  {
    name: "add_header_footer",
    label: "Add Header Footer",
    description:
      "Stamp custom text (e.g. a company name, date, or file reference) into the header or footer of every page.",
    category: "page",
    available: true,
  },
  {
    name: "pdf_to_txt",
    label: "Pdf To Txt",
    description:
      "Extract all readable text from a PDF into a plain .txt file, with no formatting or layout.",
    category: "conversion",
    available: true,
  },
  {
    name: "duplicate_pages",
    label: "Duplicate Pages",
    description:
      "Duplicate a specific page, inserting one or more extra copies right after it.",
    category: "page",
    available: true,
  },
  {
    name: "rotate_pages",
    label: "Rotate Pages",
    description: "Rotate one or more pages.",
    category: "page",
    available: true,
  },
  {
    name: "split_pdf",
    label: "Split Pdf",
    description: "Split a document into two parts after a given page number.",
    category: "page",
    available: true,
  },
  {
    name: "redact_pages",
    label: "Redact Pages",
    description:
      "Permanently black out and remove specific rectangular areas of a document (e.g. sensitive text, SSNs, signatures).",
    category: "page",
    available: true,
  },
  {
    name: "extract_pages",
    label: "Extract Pages",
    description:
      "Pull specific pages out into a brand new document, preserving the order given.",
    category: "page",
    available: true,
  },
  {
    name: "flatten_pdf",
    label: "Flatten Pdf",
    description:
      "Flatten fillable form fields and annotations so the document can no longer be edited.",
    category: "document",
    available: true,
  },
  {
    name: "reverse_pages",
    label: "Reverse Pages",
    description: "Reverse the order of every page in a document.",
    category: "page",
    available: true,
  },
  {
    name: "fill_form",
    label: "Fill Form",
    description: "Fill in values for an existing fillable PDF form's fields.",
    category: "document",
    available: true,
  },
  {
    name: "remove_metadata",
    label: "Remove Metadata",
    description: "Strip all metadata from a document.",
    category: "security",
    available: true,
  },
  {
    name: "resize_pages",
    label: "Resize Pages",
    description:
      "Resize every page of a document to a standard paper size.",
    category: "page",
    available: true,
  },
  {
    name: "extract_images",
    label: "Extract Images",
    description: "Extract embedded images from a PDF.",
    category: "conversion",
    available: true,
  },
  {
    name: "edit_metadata",
    label: "Edit Metadata",
    description: "Edit a document's metadata.",
    category: "document",
    available: true,
  },
  {
    name: "grayscale_pdf",
    label: "Grayscale Pdf",
    description: "Convert every page of a document to grayscale.",
    category: "document",
    available: true,
  },
  {
    name: "pdf_to_xlsx",
    label: "Pdf To Xlsx",
    description: "Extract tables from a PDF into Excel.",
    category: "conversion",
    available: true,
  },
  {
    name: "organize_pdf",
    label: "Organize Pdf",
    description: "Reorder all pages in a document.",
    category: "page",
    available: true,
  },
  {
    name: "pdf_to_png",
    label: "Pdf To Png",
    description: "Convert every page of a PDF into PNG images.",
    category: "conversion",
    available: true,
  },
  {
    name: "insert_blank_page",
    label: "Insert Blank Page",
    description: "Insert a blank page into a document.",
    category: "page",
    available: true,
  },
  {
    name: "docx_to_pdf",
    label: "Docx To Pdf",
    description: "Convert a DOCX document into a PDF.",
    category: "conversion",
    available: true,
  },
  {
    name: "images_to_pdf",
    label: "Images To Pdf",
    description: "Combine images into a single PDF.",
    category: "conversion",
    available: true,
  },
  {
    name: "pdf_to_docx",
    label: "Pdf To Docx",
    description: "Convert a PDF into an editable Word document.",
    category: "conversion",
    available: true,
  },
  {
    name: "pdf_to_jpg",
    label: "Pdf To Jpg",
    description: "Convert every page of a PDF into JPG images.",
    category: "conversion",
    available: true,
  },
  {
    name: "pdf_to_pptx",
    label: "Pdf To Pptx",
    description: "Convert a PDF into a PowerPoint presentation.",
    category: "conversion",
    available: true,
  },
  {
    name: "crop_pdf",
    label: "Crop Pdf",
    description: "Crop margins off every page.",
    category: "page",
    available: true,
  },
  {
    name: "add_page_numbers",
    label: "Add Page Numbers",
    description: "Stamp page numbers onto every page.",
    category: "page",
    available: true,
  },
  {
    name: "merge_pdfs",
    label: "Merge Pdfs",
    description: "Merge multiple PDFs into one.",
    category: "document",
    available: true,
  },
  {
    name: "compress_pdf",
    label: "Compress Pdf",
    description: "Reduce PDF file size.",
    category: "document",
    available: true,
  },
  {
    name: "watermark_pdf",
    label: "Watermark Pdf",
    description: "Stamp a text watermark across every page.",
    category: "security",
    available: true,
  },
  {
    name: "protect_pdf",
    label: "Protect Pdf",
    description: "Add password protection to a PDF.",
    category: "security",
    available: true,
  },
  {
    name: "unlock_pdf",
    label: "Unlock Pdf",
    description: "Remove password protection from a PDF.",
    category: "security",
    available: true,
  },
  {
    name: "pdf_to_word",
    label: "PDF to Word",
    description: "Convert PDF files into editable Word documents.",
    category: "convert",
    available: false,
  },
  {
    name: "pdf_to_powerpoint",
    label: "PDF to PowerPoint",
    description: "Convert PDF files into PowerPoint presentations.",
    category: "convert",
    available: false,
  },
  {
    name: "pdf_to_excel",
    label: "PDF to Excel",
    description: "Extract PDF data into Excel spreadsheets.",
    category: "convert",
    available: false,
  },
  {
    name: "word_to_pdf",
    label: "Word to PDF",
    description: "Convert Word documents into PDFs.",
    category: "convert",
    available: false,
  },
  {
    name: "ocr_pdf",
    label: "OCR PDF",
    description: "Convert scanned PDFs into searchable documents.",
    category: "extract",
    available: false,
  },
  {
    name: "translate_pdf",
    label: "Translate PDF",
    description: "Translate PDF files while preserving layout.",
    category: "ai",
    available: false,
  },
  {
    name: "summarize_pdf",
    label: "AI Summarizer",
    description: "Generate concise summaries of PDF documents.",
    category: "ai",
    available: false,
  },
  {
    name: "sign_pdf",
    label: "Sign PDF",
    description: "Electronically sign PDF documents.",
    category: "security",
    available: false,
  },
] as const;