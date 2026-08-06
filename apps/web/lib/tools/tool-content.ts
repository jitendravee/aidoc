export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolPageContent {
  slug: string;
  toolName: string;
  title: string;
  metaDescription: string;
  actionLabel: string;   // short verb for the upload button, e.g. "Rotate"
  uploadPrompt: string;  // small hint chip above the upload button
  intro: string;
  howToSteps: string[];
  faq: ToolFaqItem[];
}

export const TOOL_PAGES: ToolPageContent[] = [
{
    slug: "rotate-pdf",
    toolName: "rotate_pages",
    title: "Rotate PDF Pages Online — Free, No Sign-Up, No Watermarks",
    metaDescription: "Fix sideways or upside-down PDF pages instantly. Rotate individual pages, specific page ranges, or entire documents with a single instruction. No account required, completely free.",
    actionLabel: "Rotate",
    uploadPrompt: "Upload, then describe which pages need rotating",
    intro: "There's nothing more frustrating than opening a PDF only to find half the pages are sideways or completely upside down. Whether it's a scanner that misread the paper orientation, a mobile scanning app that captured a document in the wrong rotation, or a collaborative file where pages came from different sources — FlowPDF fixes it in seconds. Instead of hunting through complex menus or rotating pages one by one in desktop software, you simply describe the fix in plain English. Need to rotate only page 3 of a 50-page document? Done. Need to spin every page 90 degrees clockwise because the whole file was scanned in landscape? Also done. The rotation persists through downloads, meaning the fixed orientation stays intact whether you view it on a phone, tablet, or print it.[reference:0]",
    howToSteps: [
      "Upload your PDF by clicking the upload area or dragging your file in.",
      "Type your rotation instruction — for example, 'rotate page 3 by 90 degrees clockwise,' 'rotate pages 5-10 counterclockwise,' or 'rotate the whole document 180 degrees.'",
      "Review the rotated page preview to confirm the change looks correct.",
      "Download your fixed PDF — it's ready to use immediately, no waiting, no hidden charges."
    ],
    faq: [
      {
        question: "What rotation degrees does FlowPDF support?",
        answer: "FlowPDF supports all standard rotation angles: 90 degrees clockwise, 90 degrees counterclockwise (or 270 degrees clockwise), and 180 degrees.[reference:1] If you're unsure which direction to use, simply describe the problem — for example, 'this page is sideways' — and FlowPDF will apply the correct rotation automatically."
      },
      {
        question: "Can I rotate just one page instead of the whole document?",
        answer: "Absolutely. FlowPDF lets you rotate specific pages individually while leaving the rest of the document untouched.[reference:2] You can specify a single page number, a range like 'pages 3-6,' or a combination like 'pages 2, 5, and 8' — all in one instruction."
      },
      {
        question: "Does rotating a page affect the document's text layer or file quality?",
        answer: "No — rotation modifies only the page metadata and does not re-encode or re-compress the content.[reference:3] All form fields, annotations, bookmarks, and hyperlinks are preserved after rotation.[reference:4] File size and quality stay identical to the original."
      },
      {
        question: "Will a 90-degree rotation change my page from portrait to landscape?",
        answer: "Yes — a 90° or 270° rotation converts landscape to portrait and vice versa.[reference:5] This is particularly useful when you have a mix of page orientations in the same document and want to standardize them."
      },
      {
        question: "What happens if I rotate the wrong page or choose the wrong direction?",
        answer: "FlowPDF maintains a complete version history of your document. If you rotate the wrong page, simply undo the change from your workspace or send a new instruction to rotate it back. You have full control to iterate until the document looks exactly right."
      },
      {
        question: "Does this work on scanned PDFs and image-based documents?",
        answer: "Yes — rotation works on any PDF, regardless of how it was created. Scanned image PDFs rotate just as easily as digitally created documents, with no degradation in image quality.[reference:6] The tool operates on the page structure itself, not the content type."
      }
    ]
},
 {
    slug: "pdf-to-jpg",
    toolName: "pdf_to_jpg",
    title: "Convert PDF to JPG Online — Free, High Quality, No Sign-Up",
    metaDescription: "Turn every PDF page into a separate high-quality JPG image. Perfect for social media, presentations, archiving, or email attachments. Free, fast, no software required.",
    actionLabel: "Convert to JPG",
    uploadPrompt: "Upload your PDF for instant JPG conversion",
    intro: "Sometimes you don't need a document — you need images. Maybe you're building a presentation and only want certain pages as slides, or you need to extract a single page to share on social media or embed in an email. FlowPDF converts every page of your PDF into a separate JPG image at optimal quality, then packages them in a single zip file.[reference:7] No more downloading individual images one at a time, no more quality loss from screenshots, and no more hunting for separate conversion tools. You get page-sized JPGs that are perfect for everything from PowerPoint decks to web uploads, all with the actual resolution of the original page rather than a cropped or compressed version.[reference:8]",
    howToSteps: [
      "Upload your PDF file by dragging it into the upload area or clicking to select it.",
      "Simply say 'convert to JPG' or 'turn this PDF into images' — FlowPDF understands plain English instructions.",
      "FlowPDF processes each page and bundles them into a single zip file for easy download.",
      "Download the zip, extract it, and you'll have individual JPG images named sequentially for each page of your original PDF."
    ],
    faq: [
      {
        question: "What resolution do the JPG images have?",
        answer: "FlowPDF converts pages at their native resolution, ensuring the output JPG matches the page dimensions and DPI of the original PDF. For screen viewing, 72-150 DPI provides fast loading with good visual quality; for printing, 300 DPI is typically recommended.[reference:9][reference:10] The goal is to provide images that look crisp and clear for on-screen use and most print scenarios."
      },
      {
        question: "Can I convert only specific pages to JPG instead of the entire document?",
        answer: "Yes — you can specify a page range or individual pages. For example, say 'convert pages 3-6 to JPG' or 'convert page 1 and pages 5-8 to images.'[reference:11] FlowPDF will only generate JPGs for the pages you request, saving you time and keeping your download bundle smaller."
      },
      {
        question: "Do I get one download per page, or all pages together?",
        answer: "All converted JPGs are packaged into a single zip file.[reference:12] This means you get one download instead of dozens, making it much easier to manage. Each image is named sequentially corresponding to the original page number."
      },
      {
        question: "What's the difference between pdf-to-jpg and extract-images?",
        answer: "This is an important distinction. pdf-to-jpg converts each entire page into an image — it renders the full page as a JPG, including text, backgrounds, and any visual content. extract-images pulls out the actual embedded photos, illustrations, or graphics that already exist in the PDF as separate image files, preserving them in their original format and quality. Use pdf-to-jpg when you want full-page images. Use extract-images when you need specific pictures from inside the document."
      },
      {
        question: "Is it free to convert PDF to JPG with FlowPDF?",
        answer: "Yes — FlowPDF's PDF to JPG converter is completely free with no watermarks or quality limitations.[reference:13] You can convert unlimited PDFs without creating an account, and there are no daily caps or hidden charges.[reference:14]"
      },
      {
        question: "Will my images lose quality during conversion?",
        answer: "FlowPDF uses high-quality conversion settings optimized for different use cases.[reference:15] The output maintains the visual fidelity of the original pages. If you need ultra-high resolution for professional printing, you can specify that in your instruction and FlowPDF will adjust the output settings accordingly.[reference:16]"
      }
    ]
},
 {
    slug: "merge-pdf",
    toolName: "merge_pdfs",
    title: "Merge PDF Files Online — Free, No Sign-Up, No Watermarks",
    metaDescription: "Combine multiple PDFs into a single file, in the order you choose. Free, no account, no software to install. Merge up to 20 files at once.",
    actionLabel: "Merge",
    uploadPrompt: "Upload all your files, then set the order",
    intro: "Merging usually comes up when a document arrives in pieces — a signed contract scanned as three separate files, or a report where the appendix is its own PDF. FlowPDF combines them into one file and lets you specify the exact order in plain English instead of dragging thumbnails around.[reference:17] Instead of dealing with multiple files, you can create a single, structured document that's easier to manage, share, and store.[reference:18] Whether you're consolidating reports from multiple sources, combining invoice batches for accounting, or merging contracts for individual signing — FlowPDF handles it in seconds.[reference:19]",
    howToSteps: [
      "Upload all the PDFs you want combined (select multiple files at once, or drag them in together).",
      "Tell FlowPDF the order — for example, 'put contract.pdf first, then the appendix.' You can also drag files to reorder them if you prefer.[reference:20]",
      "Review the combined document in the preview.",
      "Download the merged PDF — no watermarks, no quality reduction.[reference:21]"
    ],
    faq: [
      {
        question: "How many files can I merge at once?",
        answer: "You can merge up to 20 PDF files in a single operation, with a combined size limit that works for everyday use cases — combining a handful of scans, reports, or contract sections.[reference:22][reference:23] There are no daily limits and no account required.[reference:24]"
      },
      {
        question: "Can I change the order of files before merging?",
        answer: "Yes — you can drag and drop the files to set the exact order you want. The merged PDF follows your arrangement exactly.[reference:25] You can also describe the order in plain English and FlowPDF will arrange them accordingly."
      },
      {
        question: "Does merging reduce the quality of my PDFs?",
        answer: "Never. FlowPDF maintains the original quality of every PDF you merge.[reference:26][reference:27] The output is identical in quality to what you'd get from professional desktop tools like Adobe Acrobat, with no compression, no degradation, and no watermarks or branding added.[reference:28]"
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer: "You'll need to unlock password-protected PDFs first using FlowPDF's Unlock PDF tool.[reference:29] Once unlocked, you can merge them like any other file. FlowPDF handles the entire workflow from unlocking to merging."
      },
      {
        question: "Does this work on mobile devices?",
        answer: "Yes — FlowPDF works on any device with a modern browser, including iPhones, iPads, Android phones, and tablets.[reference:30] No app to install, no software to download — just open your browser and go."
      },
      {
        question: "Can I merge PDFs offline?",
        answer: "After the first page load (which caches the processing engine), you can merge PDFs offline.[reference:31] This is particularly useful for air-gapped environments or low-connectivity situations where you're working with sensitive documents."
      }
    ]
},
 {
    slug: "split-pdf",
    toolName: "split_pdf",
    title: "Split a PDF Online — Free, No Sign-Up, No Watermarks",
    metaDescription: "Break one PDF into multiple separate files by page range. Extract specific pages, split by ranges, or separate every page into its own file. Free, no software install.",
    actionLabel: "Split",
    uploadPrompt: "Upload, then give the page ranges",
    intro: "Splitting is the opposite problem from merging: you have one large file — a scanned book, a bundled report, a batch of invoices in a single PDF — and you need pieces of it as their own separate files.[reference:32] Maybe you need to send just the signature page from a long contract, or you want to divide a 100-page document into chapters for different team members. FlowPDF lets you specify exactly which pages to extract and how to split them — by individual page numbers, by ranges, or by extracting every page as its own file.[reference:33] All processing happens in your browser, so your files stay private and secure.[reference:34]",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF where to split it — for example, 'split into three files: pages 1–10, 11–25, and 26 to the end,' or 'extract pages 3, 5, and 7-10 into a new file.'[reference:35]",
      "Review the resulting files in the preview.",
      "Download them individually or as a zip — your choice."
    ],
    faq: [
      {
        question: "What's the difference between splitting and extracting pages?",
        answer: "Splitting breaks one PDF into several separate files by page range. Extracting pulls out a specific set of pages into a single new file while leaving the rest of the original untouched. Use split-pdf when you want multiple output files; use extract-pages when you want just one specific set of pages pulled out."
      },
      {
        question: "Can I split by uneven page ranges?",
        answer: "Yes — describe the ranges however you need. You can use commas for individual pages and dashes for ranges, like '1-3, 5, 7-10' which extracts pages 1 through 3, page 5, and pages 7 through 10.[reference:36] You can also specify custom ranges like 'every 5 pages' or 'split after page 10.'"
      },
      {
        question: "Can I extract every page as a separate PDF?",
        answer: "Yes — select 'all' split mode and each page becomes its own PDF file, downloaded as a ZIP archive.[reference:37] This is perfect when you need to distribute individual pages from a large document to different people."
      },
      {
        question: "Does splitting work on scanned PDFs?",
        answer: "Yes — scanned PDFs (image-based) split just like regular PDFs.[reference:38] The tool works on the page structure, not the content type, so it doesn't matter whether your PDF contains text or images."
      },
      {
        question: "What happens to bookmarks and hyperlinks when I split a PDF?",
        answer: "Internal hyperlinks within the extracted pages are preserved.[reference:39] Bookmarks pointing to pages that are removed during the split will be dropped, as they no longer have a valid destination in the new file.[reference:40]"
      },
      {
        question: "Can I split a password-protected PDF?",
        answer: "You'll need to unlock the PDF first using FlowPDF's Unlock PDF tool.[reference:41] Once unlocked, you can split it like any other file. FlowPDF handles the entire workflow from unlocking to splitting."
      }
    ]
},
 {
    slug: "delete-pages",
    toolName: "delete_pages",
    title: "Delete Pages from a PDF Online — Free, No Sign-Up, No Watermarks",
    metaDescription: "Remove one or more pages from a PDF without touching the rest of the document. Delete blank pages, duplicates, or unwanted sections. Free, no account, no software install.",
    actionLabel: "Delete pages from",
    uploadPrompt: "Upload, then say which pages go",
    intro: "PDFs accumulate extra pages over time — blank divider pages, duplicate scans, cover sheets that shouldn't be in the final file, or outdated sections that no longer belong.[reference:42] FlowPDF removes exactly the pages you name and leaves everything else — including page order — untouched.[reference:43] Instead of re-creating the entire document from scratch or tediously selecting pages one by one, you simply describe what needs to go. The remaining pages stay clean and intact, with their original structure preserved.[reference:44] Whether you're cleaning up a contract before sending it to a client or removing internal notes from a report before publishing, FlowPDF makes page deletion instant and effortless.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF which pages to remove — for example, 'delete pages 2 and 7' or 'delete pages 5-10.'[reference:45]",
      "Review the result in the preview to confirm the right pages are gone.",
      "Download the updated PDF — the remaining pages are renumbered automatically."
    ],
    faq: [
      {
        question: "Can I delete non-contiguous pages, like 2, 5, and 9?",
        answer: "Yes — you can delete multiple non-consecutive pages in a single action.[reference:46] Simply list the page numbers you want removed, like 'delete pages 2, 5, and 9,' and FlowPDF removes just those pages regardless of whether they're next to each other.[reference:47]"
      },
      {
        question: "Can I delete a range of pages at once?",
        answer: "Yes — you can specify page ranges like 'delete pages 5-10' to remove all pages from 5 through 10.[reference:48] You can also combine ranges and individual pages in the same instruction, such as 'delete pages 2, 5-8, and 12.'"
      },
      {
        question: "What if I delete the wrong page by mistake?",
        answer: "Every edit is versioned, so you can undo the deletion and get back the previous version of your document from the workspace. FlowPDF gives you full control to iterate until the document looks exactly right."
      },
      {
        question: "Does deleting pages affect the formatting of the remaining pages?",
        answer: "No — FlowPDF preserves the original structure of the remaining pages.[reference:49] Your file stays clean and intact after editing, with page numbers automatically updated to reflect the new page count."
      },
      {
        question: "Can I delete pages from a scanned PDF?",
        answer: "Yes — deletion works on any PDF regardless of how it was created. Scanned image PDFs, text-based documents, and mixed-content files all work the same way. The tool operates on the page structure itself, not the content type."
      },
      {
        question: "Is there a limit to how many pages I can delete at once?",
        answer: "No — you can delete as many pages as your document has. Whether you're removing one page or fifty, FlowPDF processes the deletion instantly and gives you a clean, updated file."
      }
    ]
},
  {
    slug: "add-header-footer",
    toolName: "add_header_footer",
    title: "Add Headers and Footers to PDF Online — Free, No Sign-Up",
    metaDescription: "Stamp custom text like company names, dates, confidentiality notices, or file references into the header or footer of every PDF page. Free, no watermarks, no account.",
    actionLabel: "Add Header/Footer",
    uploadPrompt: "Upload, then tell us what to stamp and where",
    intro: "Headers and footers are the quiet workhorses of professional documentation. A page number might seem trivial until you're printing a 200-page contract and drop the stack. A company name in the header turns a generic printout into branded correspondence. A date stamp helps auditors track which version of a document was actually circulated. FlowPDF lets you stamp any text you want — top or bottom, left, center, or right — onto every page of your PDF in one go. You don't need to open a desktop publisher or fiddle with template layers. Just describe what you need: 'Add a footer saying CONFIDENTIAL on every page,' or 'Put our company name and the date in the top right.' The text becomes part of the page content — not a floating annotation that can be accidentally deleted — so it survives printing, merging, and further editing.",
    howToSteps: [
      "Upload your PDF.",
      "Describe your header or footer — for example, 'add a header with my company name on the left and page numbers on the right' or 'stamp DRAFT COPY in the footer of every page.'",
      "Check the preview to make sure the positioning and text look right.",
      "Download your finished PDF — every page now carries your chosen text."
    ],
    faq: [
      {
        question: "Can I put different headers on odd and even pages?",
        answer: "Yes — FlowPDF supports different content for left and right pages, which is essential for printed booklets or double-sided documents where the margin alignment shifts. For example, you can ask for 'the page number on the outside edge of every page' and FlowPDF will automatically flip the position based on odd/even."
      },
      {
        question: "What's the difference between a header and a watermark?",
        answer: "Headers live in the top or bottom margin and are typically small, discreet text meant for identification (dates, names, page numbers). Watermarks are usually large, diagonal text (like 'DRAFT' or 'CONFIDENTIAL') stamped across the center of the page, intended to be highly visible. Choose a header for practical information, and a watermark for status labeling."
      },
      {
        question: "Will the header show up if I convert the PDF to Word?",
        answer: "In most cases, yes — because the text becomes part of the page content, conversion tools like pdf_to_docx will carry it over as text or as a positioned element, depending on the converter. Unlike annotations that often get dropped, stamped content travels with the page."
      },
      {
        question: "Can I add a header to just the first page or only a specific section?",
        answer: "Yes — you can target specific page ranges. For example, you might want 'CONFIDENTIAL' on pages 1–10 and a different reference number on pages 11–20. Just describe the range along with your text and FlowPDF applies it only where you specify."
      },
      {
        question: "What if my document already has headers — will this overwrite them?",
        answer: "FlowPDF adds your new header on top of the existing page content. If the original PDF already has text in the same area, you'll see an overlap. You can ask FlowPDF to 'remove existing headers first, then add mine' to avoid clutter."
      },
      {
        question: "Can I use dynamic values like the current date or file name in my header?",
        answer: "Absolutely — you can include placeholders in your instruction. For example, say 'add a footer with the current date on the right side' and FlowPDF will stamp today's date. Or say 'use the original file name in the header' to make sure your printed documents are always traceable back to the source file."
      }
    ]
},
{
    slug: "pdf-to-txt",
    toolName: "pdf_to_txt",
    title: "Convert PDF to TXT Online — Free, No Sign-Up, Plain Text Output",
    metaDescription: "Extract all readable text from a PDF into a clean .txt file. Perfect for copying content, feeding into AI tools, or data analysis. No formatting, just raw text. Free.",
    actionLabel: "Extract Text",
    uploadPrompt: "Upload your PDF to get a clean .txt file",
    intro: "Sometimes you don't want a formatted document — you want the raw words. Maybe you need to paste a long passage into a translation tool that chokes on rich text formatting. Maybe you're feeding a document into a data analysis pipeline that expects plain .txt input. Or maybe you just want to copy text from a PDF without dealing with broken line breaks, strange font encodings, or accidental spaces. FlowPDF strips away everything — fonts, margins, colors, images, tables — and gives you the pure, unadulterated text content of your PDF, in reading order, saved as a simple .txt file. What you get is a clean slate: no invisible characters, no layout artifacts, just the words that were on the page, in the order they were meant to be read. This is particularly useful for researchers, students, and anyone who needs to analyze document content programmatically.",
    howToSteps: [
      "Upload your PDF.",
      "Simply say 'convert to text' or 'extract the text from this PDF.'",
      "FlowPDF processes the document and generates a plain .txt file containing all the readable content.",
      "Download the .txt file — ready to paste, edit, or analyze anywhere."
    ],
    faq: [
      {
        question: "Does pdf-to-txt work on scanned PDFs and images of text?",
        answer: "No — this tool extracts text that is already stored as text within the PDF. If your PDF is a scanned image (just a photograph of a page), there's no actual text data to extract. For scanned documents, you would need an OCR tool first to recognize the text and turn it into selectable characters. FlowPDF's pdf_to_txt reads the existing text layer — it doesn't perform optical character recognition."
      },
      {
        question: "How does the output handle multi-column layouts, like newspaper-style pages?",
        answer: "FlowPDF tries to preserve the logical reading order, which means it reads content left-to-right, top-to-bottom across columns. For complex multi-column layouts, the output might read across a column break and continue on the next column in sequence. If your document has a simple single-column flow, the output will be virtually identical to the original copy-text."
      },
      {
        question: "Will I lose accented characters, special symbols, or emojis?",
        answer: "The .txt format uses standard encoding (UTF-8 by default), so accented characters (é, ñ, ü) and most common symbols are preserved. However, very obscure glyphs or specialized math symbols that don't have a Unicode equivalent might be replaced with a placeholder character. For most business and academic documents, you won't notice any loss."
      },
      {
        question: "What happens to tables and numbered lists in the output?",
        answer: "Tables become tab-separated or space-separated values, which preserves the cells but loses grid lines. Numbered lists generally retain their numbers. If you need to preserve table structure for analysis, consider using pdf_to_xlsx (Excel) instead — that tool is specifically designed to detect and export tabular data."
      },
      {
        question: "Can I extract text from a specific page range instead of the whole document?",
        answer: "Yes — you can specify a range, such as 'extract text from pages 3 to 8' or 'just get the text from page 1.' This is helpful when you only need a small section of a large PDF for a quote or analysis."
      },
      {
        question: "Is the text extraction order guaranteed to match what a human reading the page would see?",
        answer: "FlowPDF extracts text in reading order based on the PDF's internal structure. For most professionally created PDFs, this matches what you'd expect. However, some PDFs are built with overlapping text boxes or arbitrary coordinate placements (especially documents generated from design software), which can result in unpredictable reading order. If you notice issues with sentence flow, it's usually because of how the original PDF was structured, not because of the extraction process itself."
      }
    ]
},
{
    slug: "duplicate-pages",
    toolName: "duplicate_pages",
    title: "Duplicate Pages in a PDF Online — Free, No Sign-Up",
    metaDescription: "Copy a specific page and insert one or more extra copies right after it. Perfect for creating templates, extending forms, or filling out multi-page applications. Free.",
    actionLabel: "Duplicate",
    uploadPrompt: "Upload, then tell us which page to copy",
    intro: "Duplicating a page is one of those subtle PDF operations that doesn't get much attention, but when you need it, you really need it. You've got a single-page form template with fields laid out perfectly, but you need three copies of that page in the same document for a multi-part application. Or you have a blank survey page that needs to be replicated five times for a workshop. Or maybe a single ID card needs to be printed twice on the same sheet for cutting out duplicates. FlowPDF copies the exact page you choose — including all text, images, form fields, and annotations — and inserts one or more extra copies right after it, without affecting the rest of your document. No need to manually copy and paste content, no need to rebuild layouts from scratch. The duplicated pages are pixel-for-pixel identical to the source.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF which page to duplicate and how many copies you need — for example, 'duplicate page 3 twice' or 'create 5 copies of page 1 after it.'",
      "Review the preview to confirm the duplicates are inserted in the right place.",
      "Download your expanded PDF — your duplicated pages are ready to use."
    ],
    faq: [
      {
        question: "Does duplicating a page also duplicate its form fields and fillable content?",
        answer: "Yes — if the source page contains form fields (text boxes, checkboxes, radio buttons, signature fields), they are duplicated exactly as they were. Each duplicated page gets its own independent set of fields, so you can fill in each copy separately without affecting the others."
      },
      {
        question: "Can I duplicate a page that contains annotations, such as comments or sticky notes?",
        answer: "Yes — all annotations associated with the original page are preserved in the duplicates. This is especially useful for collaborative review documents where you need multiple copies of the same draft with the same comment markers."
      },
      {
        question: "Can I duplicate a page and insert the copies somewhere else, not right after the original?",
        answer: "Yes — you can specify an insertion point. For example, 'copy page 3 and insert the duplicates after page 7' or 'duplicate page 5 and move the copies to the end of the document.' This gives you full control over where the replicated pages land."
      },
      {
        question: "Does duplicating pages significantly increase the file size?",
        answer: "It depends on the content of the page. A page with heavy embedded images will increase the file size roughly proportionally to the number of copies. A page with mostly text and simple vectors will see a much smaller increase because text is very compressible. Duplicating a page is typically more efficient than adding a completely new page with similar content because the underlying resources can often be shared."
      },
      {
        question: "Can I duplicate multiple different pages in one operation?",
        answer: "Yes — you can duplicate several pages in a single instruction. For example, 'duplicate page 2 once, and duplicate page 5 twice.' FlowPDF will process all duplications in order, inserting them after their respective originals."
      },
      {
        question: "What's the difference between duplicating a page and inserting a blank page?",
        answer: "A blank page is completely empty — you get a white canvas with no content, no fields, and no structure. Duplicating a page gives you an exact replica of the existing page, complete with its layout, text, images, and interactive elements. Use duplicate when you need another copy of something that already works; use insert_blank_page when you need a fresh, empty canvas to build from scratch."
      }
    ]
},{
    slug: "redact-pages",
    toolName: "redact_pages",
    title: "Redact PDF Pages Online — Permanently Remove Sensitive Content, Free",
    metaDescription: "Permanently black out and remove specific rectangular areas of a PDF — SSNs, signatures, confidential numbers, or entire sections. The underlying content is deleted, not just covered up. Free.",
    actionLabel: "Redact",
    uploadPrompt: "Upload, then show or describe what to black out",
    intro: "Redaction is not the same as drawing a black rectangle on a page. Anyone with basic PDF skills can remove that rectangle and see the text underneath — that's a cover-up, not a deletion. True redaction permanently removes the underlying content from the file structure, making it unrecoverable. This is the legal and professional standard for handling sensitive information — Social Security numbers, bank account details, client names, home addresses, signatures, or confidential contract clauses. FlowPDF actually deletes the content you specify, not just covers it with a visual block. You can redact by selecting a rectangular area on a page preview, or you can describe it in plain English: 'redact all SSNs on page 3' or 'black out the signature block on the last page.' The result is a PDF where the sensitive data has been physically removed from the document, not just hidden from view. This matters for GDPR compliance, HIPAA filings, legal discovery, and any scenario where the removal of data must be permanent and auditable.",
    howToSteps: [
      "Upload your PDF.",
      "Describe the area you need redacted — for example, 'redact the signature box on page 5' or 'black out the entire top section of page 2 containing the account number.' Alternatively, click and drag on the page preview to draw a selection box over the exact area.",
      "Confirm the redaction is applied in the preview.",
      "Download your redacted PDF — the content is permanently removed and cannot be recovered."
    ],
    faq: [
      {
        question: "What's the difference between redaction and simply covering text with a black box?",
        answer: "This is the most important distinction. Drawing a black box over text in a PDF editor is reversible — the text is still there, just visually hidden. Redaction actually deletes the selected content from the file's data, replacing it with a black bar. Once redacted, the original text cannot be extracted, copied, or recovered by any means. FlowPDF performs true redaction, which is the only legally accepted method for removing sensitive data from documents."
      },
      {
        question: "Can I redact specific words like SSNs or credit card numbers automatically?",
        answer: "Yes — you can describe the pattern you want redacted and FlowPDF will scan the document for matching patterns. For example, 'redact all SSNs' will find numbers matching the typical 3-2-4 format and remove them. Similarly, you can say 'redact all email addresses' or 'redact the client's name wherever it appears' for a thorough scrub."
      },
      {
        question: "Does redaction affect the PDF's file size or processing speed?",
        answer: "Redaction operates on the file's internal structure, so it can actually reduce file size slightly because the redacted content is removed. Processing speed depends on the document size, but for most documents, the operation is instant — the removal is applied in the document's structure, not by re-encoding the entire file."
      },
      {
        question: "Can I undo or recover a redaction if I made a mistake?",
        answer: "Once a redaction is applied and you download the file, the content is permanently gone. However, FlowPDF maintains a version history in your workspace, so if you redact the wrong area, you can revert to the previous version of the document before the redaction was applied. After you download and leave the workspace, the redacted version is final."
      },
      {
        question: "Does redaction work on scanned image-based PDFs?",
        answer: "Yes — you can redact areas on scanned PDFs by selecting a rectangular region. However, since the content is stored as image pixels rather than text, FlowPDF deletes the selected pixel area. For text-based PDFs, the underlying text characters are removed from the file. The result is visually the same — a black bar over the sensitive area — but the method of removal differs based on the content type."
      },
      {
        question: "Is redaction certified for legal use, like in e-discovery or court filings?",
        answer: "FlowPDF performs true content removal from the PDF structure. The resulting file does not contain the redacted data. While FlowPDF is used in professional and legal contexts, it is always recommended to verify the final document with a PDF inspection tool if the document is being filed in court or under a compliance audit. The redaction is permanent and complies with best practices for data removal."
      }
    ]
},
{
    slug: "extract-pages",
    toolName: "extract_pages",
    title: "Extract Pages from a PDF Online — Free, No Sign-Up, No Watermarks",
    metaDescription: "Pull specific pages out of a PDF into a new file. Extract a single page, a range, or scattered pages — preserving the order you give. Free, no account, no software.",
    actionLabel: "Extract pages from",
    uploadPrompt: "Upload, then tell us which pages to pull out",
    intro: "Extraction is the cleanest way to create a smaller PDF from a larger one. You don't need to split the whole document — you just need a subset. Maybe you're taking the signature page out of a 50-page contract to send separately for execution. Maybe you're pulling the methodology section from a large research report to share with a colleague who doesn't need the full appendix. Or maybe you're assembling an excerpt for a training manual and only need specific chapters. FlowPDF extracts exactly the pages you specify and builds them into a brand new PDF, preserving the page order and content quality exactly as they were in the original. Your source document stays untouched in the workspace — extraction creates a copy of the selected pages, not a cut-and-remove operation. You get a focused, lightweight document that contains only what you need, without the distraction of the rest of the file.",
    howToSteps: [
      "Upload your PDF.",
      "Describe which pages you want — for example, 'extract pages 4 through 6 into a new file' or 'extract pages 2, 5, and 8-10 in that order.'",
      "Review the extracted pages in the preview.",
      "Download the new, smaller PDF — it's ready to share or archive."
    ],
    faq: [
      {
        question: "What's the difference between extraction and splitting?",
        answer: "Extraction pulls a specific set of pages out of a document and creates one new file containing those pages. The original document remains intact. Splitting breaks a document into two or more separate files based on page ranges — it's a division of the whole document. Use extraction when you need one subset; use splitting when you need to divide the entire document into multiple parts."
      },
      {
        question: "Can I extract pages in a non-sequential order?",
        answer: "Yes — you can extract pages in any order you want. For example, 'extract page 5, then page 2, then pages 8-10' will create a new PDF where page 5 comes first, followed by page 2, followed by pages 8, 9, and 10 in that sequence. This is useful when you're creating a custom excerpt or restructuring content from multiple parts of the source document."
      },
      {
        question: "Does extraction preserve bookmarks and hyperlinks from the original?",
        answer: "Internal links that point to pages within the extracted set are preserved. However, bookmarks or links that point to pages that were not extracted will be dropped because their target no longer exists in the new document. If your document relies heavily on a table of contents with internal links, consider whether those links still make sense in the extracted version."
      },
      {
        question: "Can I extract pages from a scanned PDF or image-based document?",
        answer: "Absolutely — extraction works on the page structure itself, regardless of the content type. Scanned pages, image-heavy pages, and text pages all extract identically. The new PDF retains the original quality of the extracted pages with no degradation."
      },
      {
        question: "What happens to page numbers in the extracted PDF?",
        answer: "The pages in the extracted PDF are renumbered starting from 1. The physical page labels (like 'Page 1 of 10') inside the content remain as they were originally written — extraction doesn't automatically update text that says 'Page X' on the page itself. If you need the extracted document to show its new position, you can use the add_page_numbers tool afterward to stamp new numbers."
      },
      {
        question: "Can I extract multiple different sets of pages in one go?",
        answer: "Yes — you can describe multiple extraction sets. For example, 'extract pages 1-3 into a file called intro.pdf and extract pages 10-15 into a file called conclusion.pdf' — FlowPDF will produce two separate files, each containing only its designated pages. This is a huge time-saver compared to running the extraction multiple times for the same source document."
      }
    ]
},{
    slug: "flatten-pdf",
    toolName: "flatten_pdf",
    title: "Flatten a PDF Online — Lock Forms & Annotations Permanently, Free",
    metaDescription: "Flatten fillable form fields, signatures, and annotations so the document can no longer be edited or filled in. Perfect for finalizing contracts, invoices, and application forms. Free, no sign-up.",
    actionLabel: "Flatten",
    uploadPrompt: "Upload, then lock it down",
    intro: "A fillable PDF is great for collecting data — until it's time to finalize it. You don't want someone accidentally changing the signature date on a signed contract, or a collaborator editing a field after you've already submitted the form. Flattening turns your interactive PDF into a flat, static document: the form fields, annotations, and signatures become part of the page content itself. They can't be clicked, edited, or deleted by anyone using a PDF editor. This is the industry-standard way to 'lock' a PDF before distribution, archiving, or printing. It's what you do when you've finished filling out an application and want to send it to the government agency. It's what you do when you've collected all signatures on a contract and want to issue the final executed version. And crucially, flattening reduces file size and eliminates the risk of your data being modified downstream.",
    howToSteps: [
      "Upload your PDF containing form fields, signatures, or annotations.",
      "Tell FlowPDF to flatten it — for example, 'flatten this document' or 'lock all the fields and make it static.'",
      "Review the flat version in the preview to ensure everything looks correct.",
      "Download the flattened PDF — all fields are now permanently merged into the page."
    ],
    faq: [
      {
        question: "What's the difference between flattening and just printing to PDF?",
        answer: "Printing to PDF (using a virtual PDF printer) re-encodes the entire document, which can drastically increase file size and sometimes degrade image quality or break hyperlinks. Flattening, by contrast, operates on the document's internal structure — it merges the form fields and annotations into the page layer without re-encoding the entire PDF. The result is a much cleaner file with better preservation of the original quality and a smaller file size than a print-to-PDF approach."
      },
      {
        question: "Can I unflatten a PDF after it's been flattened?",
        answer: "No — flattening is irreversible. Once the fields and annotations are merged into the page content, the underlying form structure is gone. This is exactly why flattening is used for final documents — it ensures that no one can later edit the fields, because the fields no longer exist. Always keep a separate copy of the unfilled or editable version if you think you might need to make future changes."
      },
      {
        question: "Does flattening affect digital signatures?",
        answer: "Flattening a digitally signed PDF breaks the signature's validity because the document structure changes after signing. If you have a valid digital signature on a PDF, flattening will make that signature appear as a visual image only — the cryptographic verification will fail. The standard workflow is: apply all signatures first, and if you need the document to be editable after signing, don't flatten; only flatten after all signers have finalized the document and you're ready to distribute a read-only copy."
      },
      {
        question: "Will flattening remove my form field data or change the appearance of filled text?",
        answer: "No — flattening preserves the exact visual appearance of the filled data, signatures, and checkmarks as they appear on the page. The text you typed into fields becomes part of the page content, in the same font and size. The only difference is that the fields are no longer interactive — but what you see stays exactly the same."
      },
      {
        question: "Does flattening reduce file size, and by how much?",
        answer: "Often yes, sometimes significantly. Form fields, annotations, and signature metadata add overhead to the PDF structure. Flattening removes that overhead and consolidates the content, which typically reduces file size by 10–30%. For documents with many complex fields, the reduction can be even larger. The size reduction is a nice side benefit of the main goal: rendering the document uneditable."
      },
      {
        question: "What's the difference between flattening form fields and flattening the entire document?",
        answer: "Some tools offer 'flatten form fields' (only fields become static, annotations remain editable) or 'flatten all' (everything becomes static). FlowPDF's flatten operation merges all interactive elements — form fields, annotations, comments, and stamps — into the page. If you want to keep comments but remove form interactivity, you can specify that in your instruction. The default is a full flatten, which is what most users need for finalization."
      }
    ]
},{
    slug: "reverse-pages",
    toolName: "reverse_pages",
    title: "Reverse PDF Page Order Online — Free, No Sign-Up",
    metaDescription: "Flip your entire PDF upside-down in order — last page becomes first, first becomes last. Perfect for correcting reverse-scanned documents or preparing booklets. Free.",
    actionLabel: "Reverse",
    uploadPrompt: "Upload, then ask to reverse the order",
    intro: "Reverse page order sounds niche until your document comes out backwards. It happens more than you'd think — a duplex scanner that feeds pages in the wrong direction, a batch of images uploaded in reverse chronological order, or a manuscript that was compiled from the back to the front. FlowPDF reverses every page in your document, so the last page becomes the first and the first page becomes the last, with everything in between reordered accordingly. This is a full-page reversal of the entire document, not a rotation or a flip horizontally. The content of each page stays identical — only the sequence changes. It's a simple but essential fix that saves you from the tedious chore of dragging 50 page thumbnails back into place one at a time.",
    howToSteps: [
      "Upload your PDF.",
      "Say 'reverse the page order' or 'flip the document backwards.'",
      "Preview the reversed document to confirm the sequence is correct.",
      "Download the reordered PDF."
    ],
    faq: [
      {
        question: "Can I reverse only a section of the document, not the whole thing?",
        answer: "Yes — you can specify a range. For example, 'reverse the order of pages 5 to 12' will flip that section while leaving the rest of the document untouched. This is useful when you have a document where only the middle section got scanned backwards, or you want to create a mirrored effect for a specific chapter."
      },
      {
        question: "What's the difference between reversing and rotating a page?",
        answer: "Reversing changes the sequence of pages — page 5 moves to position 1, page 4 moves to position 2, and so on. Rotating changes the orientation of a single page — turning it 90, 180, or 270 degrees. They are completely different operations. A reversed document can still have pages in the correct orientation; only their order has changed."
      },
      {
        question: "Does reversing pages affect hyperlinks and bookmarks?",
        answer: "Internal hyperlinks and bookmarks that point to specific page numbers will break, because the page numbers have changed. For example, a link that pointed to 'page 5' in the original will now point to whatever page lands at position 5 after reversal. If your document relies heavily on a table of contents with internal links, reversing the order will make those links unreliable. You can use the edit_metadata or organize_pdf tools to rebuild bookmarks if needed."
      },
      {
        question: "Can I undo a reversal if I change my mind?",
        answer: "Yes — because FlowPDF versions every edit. If you reverse the document and then realize it was correct before, you can simply undo the operation from your workspace. You're not stuck with the reversed order. If you've already downloaded the file and left the workspace, you'd need to re-upload and reverse it again to get back to the original order (two reversals return to the original sequence)."
      },
      {
        question: "Will reversing pages affect the document's metadata, like author and title?",
        answer: "No — page reversal only affects the page order. The document's metadata (author, title, creation date, etc.) stays exactly the same. If you need to edit or remove metadata, use the separate edit_metadata or remove_metadata tools."
      },
      {
        question: "Does reverse-pages work on large documents with hundreds of pages?",
        answer: "Absolutely — the operation is structural and doesn't require rendering each page, so it's extremely fast even for very large documents. Reversing a 500-page PDF takes roughly the same time as reversing a 10-page PDF. The limitation is the upload time of the document itself, not the processing time for the reversal."
      }
    ]
},{
    slug: "fill-form",
    toolName: "fill_form",
    title: "Fill PDF Forms Online — Free, No Sign-Up, No Adobe Required",
    metaDescription: "Fill in values for fillable PDF forms — text fields, checkboxes, dropdowns, and radio buttons. No Adobe Acrobat needed. Free, fast, and private.",
    actionLabel: "Fill Form",
    uploadPrompt: "Upload, then tell us what to fill where",
    intro: "PDF forms are everywhere — government applications, tax documents, job applications, insurance claims, and registration forms. But opening one in a browser often gives you a stripped-down interface that doesn't support all field types. Or you don't have Adobe Acrobat installed. FlowPDF lets you fill out any fillable PDF form by simply telling it what goes where. You don't need to manually click each field and type — you can describe the entire form in plain English: 'Fill the first name as John, last name as Doe, check the 'citizen' box, and select 'Business' from the dropdown.' FlowPDF applies all your values to the correct fields, preserving the form's structure. The result is a fully filled-out PDF that you can download, print, or submit, with all fields locked into their new values. This is especially useful when you're filling out multiple similar forms (like W-9s for different clients) and want to apply consistent data across them without re-typing.",
    howToSteps: [
      "Upload your fillable PDF form.",
      "Describe what to fill — for example, 'Fill name: Jane Smith, email: jane@company.com, check the 'agree' box, and set date to 2026-08-06.'",
      "FlowPDF processes the form and populates all fields you mentioned.",
      "Download the filled form — ready to send, print, or archive."
    ],
    faq: [
      {
        question: "Does fill_form support all PDF form field types?",
        answer: "Yes — FlowPDF supports text fields, multi-line text areas, checkboxes, radio button groups, dropdown lists (combo boxes), list boxes, and signature fields (as visual placeholders). For radio buttons and checkboxes, you describe the option you want selected, and FlowPDF matches it by the option's label or export value, whichever is available in the form definition."
      },
      {
        question: "What if the form has dropdowns with pre-defined options — can I only choose from those?",
        answer: "Yes — FlowPDF respects the dropdown's defined options. If you specify a value that isn't in the dropdown list, FlowPDF will alert you and suggest the available options. This prevents submitting forms with invalid selections, which is crucial for government or financial forms that validate against a fixed set of choices."
      },
      {
        question: "Can I fill out a form that has no visible field labels (only field IDs)?",
        answer: "Yes — you can use the field's internal name if you know it. More commonly, you can describe the position of the field ('fill the field in the top-right corner with the date') or the context ('fill the blank after 'Date of Birth'). FlowPDF is designed to handle forms with missing or ambiguous labels by analyzing the layout and field positions."
      },
      {
        question: "Will the filled form still be editable by others after I fill it?",
        answer: "Yes — by default, the fields remain interactive after filling. If you want to lock the form so the fields can't be changed, you should use the flatten_pdf tool after filling. The standard workflow is: fill the form, then flatten it to produce a final, non-editable copy. This is recommended when you're submitting the form to a recipient who shouldn't modify your entries."
      },
      {
        question: "Can I fill the same form multiple times with different data without re-uploading?",
        answer: "Yes — once you upload a form, you can create multiple filled versions from it by giving different instructions. For example, 'fill this form for Alice' and then 'fill this same form for Bob.' FlowPDF will generate two separate filled PDFs, each with the specified data. This is incredibly useful for batch processing of employee forms, client intake sheets, or vendor applications."
      },
      {
        question: "What happens to form fields that I don't explicitly mention in my instruction?",
        answer: "They remain empty (or retain their default values if the form was originally filled). You only need to specify the fields you want to populate. Any field you don't mention stays as it was. This is intentional — it lets you fill partial forms or update only certain sections without overwriting data you've already entered manually in other fields."
      }
    ]
},{
    slug: "remove-metadata",
    toolName: "remove_metadata",
    title: "Remove Metadata from a PDF Online — Strip All Hidden Data, Free",
    metaDescription: "Strip all metadata from your PDF — author, title, creation date, software used, and document properties. Protect your privacy before sharing files. Free, no sign-up.",
    actionLabel: "Remove Metadata",
    uploadPrompt: "Upload, then strip the document properties",
    intro: "Every PDF carries hidden baggage — metadata that's invisible when you view the file but is easily read by anyone who knows where to look. That baggage includes the author's name, the document title, the creation date, the software that generated the file (down to the specific version of Word or Acrobat), and often a history of edits or conversion steps. For a freelance designer sending a final deliverable, that metadata might reveal internal file names or the original creator's personal account. For a lawyer sending a settlement agreement, it might show the editing history and the exact time the document was created. For any individual sharing a sensitive PDF, it's a privacy leak you didn't know existed. FlowPDF strips all of this — leaving only the page content and necessary technical structure, with none of the identifying or trackable properties. The resulting document is clean, anonymous, and safe for external distribution, while still being a fully functional PDF.",
    howToSteps: [
      "Upload your PDF.",
      "Ask FlowPDF to remove metadata — for example, 'remove all metadata from this file' or 'strip the document properties.'",
      "FlowPDF processes the file and generates a clean version.",
      "Download the metadata-stripped PDF — all identifying properties are gone."
    ],
    faq: [
      {
        question: "What exactly gets removed when I strip metadata?",
        answer: "FlowPDF removes: document title, author name, subject line, keywords, creation date, modification date, the software application that created the PDF (e.g., 'Microsoft Word 2016'), the PDF producer (e.g., 'Adobe Acrobat Pro'), file identifier strings, and any custom properties that were added by the creator. The page content, images, text, and form fields are completely untouched and remain fully accessible. You'll still be able to search, select text, and print the PDF."
      },
      {
        question: "Can I choose to remove only specific metadata fields instead of all of them?",
        answer: "Yes — you can specify which fields to keep or remove. For example, 'remove the author but keep the title' or 'strip the creation date but leave the subject.' This gives you fine-grained control over what identifying information stays and what goes. If you don't specify, FlowPDF removes all metadata by default."
      },
      {
        question: "Does removing metadata change the file hash or affect digital signatures?",
        answer: "Yes — any modification to the PDF structure changes the file's hash and will invalidate existing digital signatures. If you have a signed PDF and you remove metadata, the signature will appear as a visual image but will fail cryptographic verification. The standard practice is to strip metadata before signing, or to accept that the signature will be invalidated if you strip later. If you need to keep the signature valid, don't modify the file at all."
      },
      {
        question: "Can metadata be restored or recovered after it's been stripped?",
        answer: "No — once metadata is removed, it's gone from the document structure. Unlike OS-level file properties (which might be stored elsewhere), PDF metadata is embedded in the file itself. Removing it deletes that data from the file's object tree. There is no recovery from the PDF alone. Always keep an original version if you think you might need the metadata later for internal record-keeping."
      },
      {
        question: "Does remove-metadata also strip the document's version history or edit logs?",
        answer: "Some PDFs contain a changelog or incremental save history that can reveal earlier versions of the document. FlowPDF removes this historical data as part of the metadata cleanup, including the incremental update structures. The result is a 'fresh' PDF with no history of how it was built, which is exactly what you want when sharing externally."
      },
      {
        question: "Is metadata removal really necessary for privacy — can't people just not look at it?",
        answer: "You can't control what recipients do with your file. Metadata is trivially visible — anyone can open the document properties in a PDF reader (usually under File > Properties) or use a free online metadata viewer. If you've ever saved a PDF from a personal document, the author field might contain your full name. If you converted a Word file, the metadata carries the Word document's author and company. Removing metadata is a basic hygiene step for any PDF that leaves your control. It's especially critical for legal filings, financial disclosures, and any document shared with the public."
      }
    ]
},{
    slug: "resize-pages",
    toolName: "resize_pages",
    title: "Resize PDF Pages Online — Standardize A4, Letter, or Legal, Free",
    metaDescription: "Resize every page of your PDF to a standard paper size — A4, Letter, or Legal. Perfect for print preparation, submission requirements, and document standards. Free, no sign-up.",
    actionLabel: "Resize",
    uploadPrompt: "Upload, then pick your page size",
    intro: "Inconsistent page sizes are a nightmare for printing and professional presentation. You open a PDF — maybe it's a collection of slides, scans, and downloaded reports — and find a chaotic mix of A4, Letter, and arbitrary custom page dimensions. Some pages are too small to read comfortably, others are oversized and get cropped when printed. FlowPDF resizes every page in your document to your chosen standard size: A4 (210 × 297 mm), Letter (8.5 × 11 in), or Legal (8.5 × 14 in). Crucially, FlowPDF scales the content to fit the new page size, not just changes the page boundary. This means your text, images, and layout are proportionally adjusted so nothing gets cut off and nothing leaves awkward margins. The alternative — simply changing the page size without scaling — will crop or misalign your content, which is useless for any practical purpose. FlowPDF gets it right by scaling the content to fit the target page, preserving the aspect ratio and maintaining readability.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF the target size — for example, 'resize all pages to A4' or 'convert this document to Letter size.'",
      "FlowPDF scales every page to the new dimensions, fitting the content proportionally.",
      "Download the resized PDF — all pages now match the standard size you requested."
    ],
    faq: [
      {
        question: "What's the difference between A4, Letter, and Legal?",
        answer: "A4 is the international standard (210 × 297 mm, 8.27 × 11.69 in), used in most countries except the US and Canada. Letter is 8.5 × 11 inches, the standard US office size. Legal is 8.5 × 14 inches, also common in the US for contracts and legal documents. If you're printing for international distribution, choose A4. If you're printing in the US, Letter is usually the safest default. Legal is used specifically for documents that require extra length, like real estate contracts or some government filings."
      },
      {
        question: "Does resizing crop my content or stretch it?",
        answer: "FlowPDF scales the content to fit the new page size while preserving the aspect ratio. If the aspect ratio of the original page differs from the target page, FlowPDF centers the content and adds equal margins on the sides to avoid cropping or distortion. You can also specify whether you want the content to fill the page (which might crop a bit) or fit entirely within the page (which adds margins). The default is 'fit within the page,' which is the safest and most common approach."
      },
      {
        question: "Can I resize only certain pages, leaving others at their original size?",
        answer: "Yes — you can target specific page ranges. For example, 'resize pages 5-10 to A4, leave the rest untouched.' This is useful when you have a mixed document where only some pages came from a different source and need to be standardized, while the rest are already correct."
      },
      {
        question: "Will resizing affect the quality of images and text clarity?",
        answer: "Scaling vector content (text, lines, shapes) preserves quality perfectly because vectors scale infinitely. For raster images (photographs, scans), scaling up may introduce some blurriness if the image is enlarged significantly beyond its original resolution. Scaling down is generally fine. FlowPDF uses high-quality scaling algorithms to minimize any degradation. For most documents, the change in quality is imperceptible at the new page size."
      },
      {
        question: "What happens to margins and headers after resizing?",
        answer: "Since the entire page content is scaled, existing headers and footers scale proportionally and remain in the same relative position on the page. If you added a header or footer using FlowPDF's add_header_footer tool before resizing, it will scale along with the page. If you want to add new headers after resizing to align to the new page dimensions, you can do that as a separate step."
      },
      {
        question: "Does resizing change the page orientation (portrait vs landscape)?",
        answer: "No — resizing preserves the orientation of each page. If a page was originally portrait, it stays portrait after resizing; if it was landscape, it stays landscape. If you need to change orientation along with size, you can combine the resize operation with a rotation operation in the same instruction — for example, 'resize this page to A4 and rotate it 90 degrees to landscape.'"
      }
    ]
},{
    slug: "extract-images",
    toolName: "extract_images",
    title: "Extract Images from PDF Online — Free, Original Quality, No Sign-Up",
    metaDescription: "Pull embedded photos, illustrations, and graphics out of a PDF at their original quality and format. Extract every image in one click. Free, no account, no software.",
    actionLabel: "Extract Images",
    uploadPrompt: "Upload, then get all images as a zip",
    intro: "PDFs are surprisingly good at hiding high-quality images. You see a beautiful photograph or a crisp diagram on the page, but the moment you try to copy it — screenshot, right-click save, or screen grab — you lose resolution, introduce compression artifacts, and end up with a degraded mess. FlowPDF extracts the actual embedded images from your PDF at their original quality, preserving the exact resolution, color profile, and file format the creator embedded. This is fundamentally different from converting the entire page to an image — extraction reaches into the PDF's object structure, pulls out the original image objects, and delivers them as standalone files. You get JPEGs, PNGs, or whatever format the image was stored in, without any re-encoding or quality loss. This is essential for designers needing clean assets, researchers needing exact figures, or anyone building a presentation from a PDF source.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF you want the images — for example, 'extract all images' or 'get me the photos from this document.'",
      "FlowPDF scans the document, identifies all embedded images, and bundles them.",
      "Download the zip containing every image in its original format and resolution."
    ],
    faq: [
      {
        question: "What's the difference between extract-images and pdf-to-jpg?",
        answer: "This is the most common point of confusion. pdf-to-jpg renders each entire page as an image — it's like taking a screenshot of the page. You get the full page layout, including text, backgrounds, and headers, but only at the resolution of the page render. extract-images pulls out the individual image objects that were embedded in the PDF — a photo, a logo, an illustration — at their original resolution and in their original file format (JPEG, PNG, TIFF, etc.). If you need a specific photo from a report, use extract-images. If you need a full page image, use pdf-to-jpg. The outputs serve completely different purposes."
      },
      {
        question: "What image formats does FlowPDF support for extraction?",
        answer: "FlowPDF extracts images in whatever format they were stored in the PDF. Common formats include JPEG (for photographs), PNG (for graphics with transparency), TIFF (for high-resolution scans), JPEG2000, and GIF. The tool doesn't convert them — it preserves the original file format. This means you get exactly what the document creator embedded, with no unnecessary transcoding."
      },
      {
        question: "Will extracted images have the same resolution as the original upload?",
        answer: "Yes — FlowPDF extracts the image objects as they exist in the PDF. If the creator embedded a 300 DPI, 4000×3000 pixel photograph, you get that exact image, not a downscaled version. PDFs often store images at high resolution for print purposes, and extraction gives you access to that full resolution, which is perfect for repurposing in other design tools or for high-quality printing."
      },
      {
        question: "Can I extract only specific images from a PDF, not all of them?",
        answer: "Yes — you can describe which images you want, either by page number or by description. For example, 'extract the image from page 3' or 'extract the company logo on page 1.' If you just say 'extract all images,' you get everything in a zip. If you need only some, FlowPDF can target them specifically."
      },
      {
        question: "What if the PDF contains images that are actually vector graphics?",
        answer: "Vector graphics in PDFs (like logos created from mathematical shapes rather than pixels) are not stored as image objects — they're stored as drawing instructions. extract-images pulls only raster images. If your document contains vector logos or diagrams that you need as editable vector files, you'd need a separate tool that handles vector extraction. However, many PDFs embed vector logos as a raster preview for display compatibility, and that raster version can be extracted."
      },
      {
        question: "Does extracting images remove them from the PDF or just copy them?",
        answer: "Extraction creates copies of the images as separate files. The original PDF remains untouched in your workspace. This means you get the images as standalone assets while keeping your PDF intact. If you actually want to remove images from the PDF (to reduce file size or create a text-only version), that's a different operation — you'd need to use a redaction or deletion tool to remove the images from the document itself."
      }
    ]
},{
    slug: "edit-metadata",
    toolName: "edit_metadata",
    title: "Edit PDF Metadata Online — Change Title, Author, Subject, Free",
    metaDescription: "Edit a PDF's title, author, or subject metadata — the info shown in document properties. No visible content changes, just the hidden document info. Free, no sign-up.",
    actionLabel: "Edit Metadata",
    uploadPrompt: "Upload, then tell us what to change",
    intro: "Metadata is the invisible label on your PDF — the document title that appears in the browser tab, the author name that shows in file properties, and the subject that helps categorize the file in your document management system. It's surprisingly easy to end up with wrong metadata: a Word document with the wrong author name gets converted to PDF and carries that error forward, a file downloaded from a client has their internal title that you need to replace with your own, or you just want to standardize the naming convention across a batch of files. FlowPDF lets you edit the Title, Author, and Subject fields of your PDF without touching the page content. This is the clean, correct way to fix document properties — not by renaming the file on your desktop (which doesn't change the internal metadata), but by actually updating the embedded properties that every PDF viewer reads. Your updated metadata travels with the file, so recipients always see the correct author, title, and subject.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF the new metadata values — for example, 'set title to Q3 2026 Report, author to Jane Smith, subject to Financial Review.'",
      "FlowPDF updates the document properties.",
      "Download the PDF — the metadata is updated, and the page content is unchanged."
    ],
    faq: [
      {
        question: "What metadata fields can I edit with this tool?",
        answer: "FlowPDF supports editing the core document metadata fields: Title (the document name shown in title bars and search results), Author (the creator or owner of the document), Subject (a brief description for categorization), and Keywords (for search indexing). These are the standard fields that most PDF viewers display in the document properties panel. For advanced fields or custom properties, you'd need specialized metadata editing software."
      },
      {
        question: "Can I edit metadata for a scanned or image-based PDF?",
        answer: "Yes — metadata editing works on the document wrapper, not the content. Whether your PDF contains text or images, the metadata is stored separately and can be edited independently. You can add author and title information to a scanned document just as easily as to a digitally created one."
      },
      {
        question: "Will editing metadata change the file hash or break digital signatures?",
        answer: "Yes — any modification to the PDF file, including metadata edits, changes the file's checksum and will invalidate existing digital signatures. If you have a signed PDF, editing the metadata will cause the signature to fail verification. The standard workflow is to set metadata before signing, or to accept that the signature will be invalidated after metadata edits. For legal documents where signature validity is critical, make metadata changes before the signing process."
      },
      {
        question: "What's the difference between editing metadata and removing metadata?",
        answer: "edit-metadata lets you replace specific fields with new values — you want the author to be Jane instead of John, so you change just that field. remove-metadata deletes all metadata fields entirely, leaving them blank. Use edit-metadata when you want to correct information; use remove-metadata when you want to anonymize the file completely and remove all identifying document properties."
      },
      {
        question: "Does changing the Title metadata affect the filename when I download?",
        answer: "No — the filename is a separate operating system property. The Title metadata is embedded inside the PDF and is what shows up in the PDF viewer's title bar or document properties panel. When you download the file, it keeps the filename you see in your browser, but if someone opens the PDF, they'll see the new Title in the document properties. If you need the filename to match the title, you'll need to rename the file in your file explorer after downloading."
      },
      {
        question: "Can I see the current metadata before I edit it?",
        answer: "Yes — you can ask FlowPDF to 'show me the metadata' or 'what's the current title and author?' before making changes. This helps you know exactly what you're editing and avoid overwriting information you need to keep. The metadata is displayed in the workspace preview before you confirm any edits."
      }
    ]
},{
    slug: "grayscale-pdf",
    toolName: "grayscale_pdf",
    title: "Convert PDF to Grayscale Online — Black and White, Free, No Sign-Up",
    metaDescription: "Convert every page of your PDF to black and white (grayscale). Perfect for printing, reducing file size, or creating a professional monochrome look. Free, no account.",
    actionLabel: "Grayscale",
    uploadPrompt: "Upload, then ask to convert to black and white",
    intro: "Color is expensive. It costs more to print, takes up more file space, and sometimes distracts from the information you're actually trying to convey. A color document might look great on screen, but when you print it on a black and white printer, the colors become muddy grays that are hard to distinguish. Or you're preparing a document for a publication that only accepts grayscale submissions. Or you simply want a cleaner, more professional aesthetic for a text-heavy report. FlowPDF converts every page of your PDF to grayscale, transforming all color content into balanced black, white, and gray tones. The conversion applies to everything: images, text, backgrounds, and graphics. The result is a PDF that's optimized for monochrome printing, typically smaller in file size, and often more readable for text-heavy documents. The conversion is intelligent — it preserves contrast and readability, so you don't lose important visual distinctions in charts or diagrams.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF to convert it — for example, 'convert to grayscale' or 'make this PDF black and white.'",
      "FlowPDF processes every page, converting all color content to grayscale.",
      "Download the grayscale PDF — your color document is now monochrome."
    ],
    faq: [
      {
        question: "Does converting to grayscale reduce file size?",
        answer: "Typically yes, sometimes significantly. Color information takes up space in images and in PDF structures. Removing that color data and converting to grayscale compresses the file, especially for image-heavy PDFs. The reduction varies depending on the document: a photo-heavy PDF might shrink by 30-50%, while a text-heavy PDF with few images might see a smaller reduction. The trade-off is nearly always beneficial for file size and print cost."
      },
      {
        question: "Will grayscale conversion affect the readability of my document?",
        answer: "FlowPDF's conversion preserves luminance contrast, so text remains readable and charts with different data series are converted to distinguishable grays. However, if your document relies heavily on color-coding (like red for negative numbers and green for positive), that information will be lost in grayscale. If color-coding is essential to the meaning of your data, you may want to keep the color version or add text labels to clarify. For most documents, the conversion is seamless and readability is maintained."
      },
      {
        question: "Does grayscale conversion work on images inside the PDF?",
        answer: "Yes — every image, logo, photo, and illustration is converted to grayscale. The conversion applies to all visual content, including background images, watermarks, and embedded graphics. If a particular image needs to stay in color (like a company logo), you can tell FlowPDF to exclude it or convert it separately."
      },
      {
        question: "What's the difference between grayscale and black & white (1-bit)?",
        answer: "Grayscale uses 256 shades of gray between black and white. Black & white (also called 1-bit or monochrome) uses only two colors: pure black and pure white, with no intermediate shades. Grayscale preserves more detail, especially in photographs, while black & white is even smaller in file size and is used for line art or text-only documents. FlowPDF's grayscale conversion produces 8-bit grayscale images, which balances image quality and file size for most use cases."
      },
      {
        question: "Can I convert only specific pages to grayscale and keep others in color?",
        answer: "Yes — you can specify a page range. For example, 'convert pages 3-7 to grayscale, leave the rest in color.' This is useful when you have a document with a mix of content, like a cover page that needs to stay in color but interior pages that should be monochrome for printing."
      },
      {
        question: "Will converting to grayscale change the text layer or make the document unsearchable?",
        answer: "No — grayscale conversion only affects the visual appearance of the page. The text layer, OCR data, form fields, and other structural elements remain intact. Your PDF stays fully searchable and selectable after conversion. The only thing that changes is how colors are rendered on the page."
      }
    ]
},{
    slug: "pdf-to-xlsx",
    toolName: "pdf_to_xlsx",
    title: "Convert PDF to Excel Online — Extract Tables, Free, No Sign-Up",
    metaDescription: "Extract tables from your PDF into an Excel spreadsheet, one sheet per table found. Perfect for financial data, sales reports, and structured data. Free, no account.",
    actionLabel: "Convert to Excel",
    uploadPrompt: "Upload, then get tables as .xlsx",
    intro: "PDFs are where data goes to die. You have a beautiful table in a quarterly report, an invoice summary, or a sales spreadsheet, but you can't actually work with the data — it's locked in a static document. Copy-pasting from a PDF into Excel is a nightmare of broken columns, merged cells, and misplaced headers. FlowPDF detects and extracts tables from your PDF, converting them into clean Excel spreadsheets. Each table in the document becomes a separate sheet in the output .xlsx file, preserving rows, columns, and data with remarkable accuracy. This isn't just converting the whole PDF to a formatted Excel file (which tends to be a mess) — it specifically identifies table structures, understands headers, and extracts the data cleanly. This is essential for accountants, analysts, researchers, and anyone who needs to actually use the numbers in a PDF rather than just read them.",
    howToSteps: [
      "Upload your PDF containing tables.",
      "Ask FlowPDF to convert it — for example, 'extract the tables to Excel' or 'convert this to .xlsx.'",
      "FlowPDF detects all tables, preserves their structure, and builds a clean Excel workbook.",
      "Download the .xlsx file — each table is on its own sheet, ready for analysis."
    ],
    faq: [
      {
        question: "Will this work on scanned PDFs or image-based tables?",
        answer: "No — this tool extracts tables that are already structured as text or table objects within the PDF. If your PDF is a scanned image of a table (like a photograph of a printed spreadsheet), there's no machine-readable table data to extract. You would need an OCR tool with table detection first to recognize the table structure, which is a different capability. FlowPDF's pdf_to_xlsx works on digital PDFs where the data is already in text form."
      },
      {
        question: "How does the tool handle tables that span multiple pages?",
        answer: "FlowPDF attempts to identify multi-page tables and combine them into a single sheet when the header repeats or the table structure is consistent across page breaks. In cases where tables are clearly separate (like a different table on each page), they become separate sheets in the Excel workbook. The detection is designed to mimic how a human would parse the document."
      },
      {
        question: "Will the Excel output preserve formatting like merged cells, colors, or font sizes?",
        answer: "The primary goal is data extraction and structure preservation, not visual formatting. You'll get clean rows and columns with the data correctly placed. Merged cells that are essential to the table structure (like header columns that span multiple sub-columns) are preserved. Colors, borders, and font styling are not carried over to Excel — what you get is a working dataset with correct values, which you can then format however you like in Excel."
      },
      {
        question: "What if my PDF contains multiple tables on the same page?",
        answer: "FlowPDF can detect and separate multiple tables on the same page. Each distinct table becomes its own sheet in the Excel workbook, labeled with the page number and a table index (like 'Page1_Table1', 'Page1_Table2'). This is especially useful for documents like financial statements that have multiple data tables on a single page."
      },
      {
        question: "Does the conversion also extract text that's not in tables?",
        answer: "No — the conversion is table-focused. Text that appears as paragraphs, headers, or footnotes outside of table structures is not included in the Excel output. This is by design — including non-table text would clutter the spreadsheet and defeat the purpose of clean data extraction. If you need the full text content, use pdf_to_txt or pdf_to_docx instead."
      },
      {
        question: "Can I convert only specific tables from a PDF, not all of them?",
        answer: "Yes — you can specify which tables to extract by describing them. For example, 'extract the table on page 3' or 'extract the sales table, not the summary table.' This is helpful when you only need a subset of the data and want a smaller, focused Excel file rather than processing the entire document."
      }
    ]
},{
    slug: "organize-pdf",
    toolName: "organize_pdf",
    title: "Organize PDF Pages Online — Reorder, Move, and Arrange, Free",
    metaDescription: "Reorder all pages in a document into a new sequence. Move pages, reverse sections, or completely rearrange your PDF with a single instruction. Free, no sign-up.",
    actionLabel: "Organize",
    uploadPrompt: "Upload, then describe the new order",
    intro: "Page order ends up wrong more often than you'd expect. A scanner feeds sheets out of sequence. A report gets assembled with the appendix ahead of the conclusion. A collaborative document has pages in random order because different contributors added their sections at different times. Organizing a PDF by dragging thumbnails in a desktop app works fine for 5 pages, but for 50 pages it's an exercise in frustration. FlowPDF lets you describe the new page order in plain English — 'move page 8 to the front,' 'reverse the order of pages 3 to 6,' or 'put all appendix pages at the end in alphabetical order.' The tool applies your instructions and gives you a clean, correctly sequenced PDF. This isn't just about fixing mistakes — it's about restructuring documents efficiently without opening heavy software. You can combine moves, reversals, and deletions in a single instruction, making complex reorganizations fast and error-free.",
    howToSteps: [
      "Upload your PDF.",
      "Describe the new order — for example, 'move page 5 to the end, reverse pages 2-4, and put page 1 at the front.'",
      "Preview the reorganized document in the workspace.",
      "Download the updated PDF — perfectly sequenced."
    ],
    faq: [
      {
        question: "What's the difference between organize-pdf and reverse-pages?",
        answer: "organize-pdf is a general-purpose page reordering tool — you can move single pages, reverse sections, swap pages, or create completely custom sequences. reverse-pages is a specific operation that flips the entire document's page order (last page becomes first). Use organize-pdf when you need a custom arrangement; use reverse-pages when you just need to flip the entire document backwards."
      },
      {
        question: "Can I combine multiple reorganization actions in one instruction?",
        answer: "Absolutely — this is where FlowPDF shines. You can say 'move page 3 to after page 7, delete page 5, and reverse pages 10-15' and FlowPDF applies all actions in a logical sequence. This saves you from running separate operations and reduces the risk of making mistakes in between steps."
      },
      {
        question: "What happens to bookmarks and hyperlinks when I reorganize pages?",
        answer: "Internal links that point to specific page numbers will break, because the page numbers change after reorganization. For example, a link that pointed to 'page 5' in the original will now point to whatever page lands at position 5. If your document has a table of contents with internal links, you'll need to regenerate those links or bookmarks after reorganizing. FlowPDF preserves the link objects, but their targets change unless you update the page references."
      },
      {
        question: "Can I undo a reorganization if I don't like the result?",
        answer: "Yes — FlowPDF versions every edit. If you reorganize the document and the order isn't what you expected, you can undo the entire operation from your workspace and return to the previous state. This is especially helpful when you're experimenting with different page orders and want to compare arrangements before downloading."
      },
      {
        question: "Does organizing pages affect the document's file size or quality?",
        answer: "No — page reorganization is a structural operation that changes the page sequence without re-encoding or re-compressing the content. File size and quality remain identical to the original. If you need to reduce file size, use compress_pdf as a separate step after organizing."
      },
      {
        question: "Can I organize pages in a PDF that contains form fields and signatures?",
        answer: "Yes — the page content, including form fields, annotations, and visual signatures, moves with the page when you reorganize. However, if you have digital signatures that verify the document's integrity, reorganization will break those signatures because the document structure has changed. For signed documents, reorganize only before signing or after you've decided signature validity isn't critical."
      }
    ]
},{
    slug: "insert-blank-page",
    toolName: "insert_blank_page",
    title: "Insert Blank Pages into a PDF Online — Free, No Sign-Up, No Watermarks",
    metaDescription: "Insert a blank page into your PDF at any position. Perfect for adding divider pages, notes, or creating space for signatures. Free, no account, no software.",
    actionLabel: "Insert Blank Page",
    uploadPrompt: "Upload, then tell us where to add blank pages",
    intro: "Sometimes you just need empty space. A blank divider page between sections of a report, a blank page at the end for handwritten notes, or a blank page inserted for double-sided printing where you need content to start on the right-hand page. FlowPDF lets you insert one or more blank pages anywhere in your document — before page 1, between pages, or at the end. Each blank page is a clean, white canvas with no headers, footers, or watermarks — truly empty. This is the simplest PDF operation you'll ever do, but it's surprisingly hard to find in free online tools. Most PDF editors force you to create a blank document separately and then merge it, or they insert a blank page but with default margins that mess up your layout. FlowPDF inserts exactly what you need: a completely empty page in the exact position you specify, with the correct page dimensions matching the rest of your document.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF where to insert blank pages — for example, 'insert a blank page after page 3' or 'add two blank pages at the end.'",
      "FlowPDF inserts the blank pages at the specified positions.",
      "Download the updated PDF with your blank pages in place."
    ],
    faq: [
      {
        question: "Can I insert multiple blank pages at once?",
        answer: "Yes — you can insert any number of blank pages in a single instruction. For example, 'insert 5 blank pages at the end' or 'insert two blank pages after page 1 and three blank pages after page 5.' All insertions are applied simultaneously, saving you from running the operation multiple times."
      },
      {
        question: "What size are the blank pages?",
        answer: "The inserted blank pages match the page size of the document they're being inserted into. If your document uses A4, the blank pages are A4. If it's Letter, they're Letter. This ensures consistent printing and avoids any alignment issues. The blank pages have the same dimensions and orientation (portrait or landscape) as the surrounding pages."
      },
      {
        question: "Can I insert a blank page at the very beginning of the document?",
        answer: "Absolutely — just specify 'insert a blank page before page 1' or 'add a blank page at the front.' This is commonly used to create a title page or cover sheet that you can fill in later, or to add a blank page for note-taking before the document content begins."
      },
      {
        question: "Do blank pages have any margins, headers, or hidden content?",
        answer: "No — the blank pages are completely empty. No default margins, no hidden text, no watermarks, no page numbers. They're truly blank canvases. If you want to add page numbers or headers to the blank pages later, you can use the add_page_numbers or add_header_footer tools separately."
      },
      {
        question: "Can I insert blank pages in a PDF that already has form fields or annotations?",
        answer: "Yes — inserting blank pages doesn't affect the existing content or fields on other pages. The blank pages are new pages with no fields, annotations, or content. If you need to add fields to the blank pages later, you'd use a separate form creation tool."
      },
      {
        question: "What's the use case for inserting blank pages in a PDF?",
        answer: "The most common use cases are: adding divider pages between sections of a long report (often with a section title printed later), creating space for signatures or stamps after the content, ensuring that content starts on a right-hand page for double-sided booklets, adding pages for handwritten notes in a printed document, or simply creating room for future edits or additions. It's a simple but essential operation for document preparation."
      }
    ]
},{
    slug: "docx-to-pdf",
    toolName: "docx_to_pdf",
    title: "Convert Word to PDF Online — Free, No Sign-Up, Preserve Formatting",
    metaDescription: "Turn your Word documents (.docx) into professional PDFs. Perfect formatting preservation, fast conversion, no watermarks. Free, no account, no software install.",
    actionLabel: "Convert to PDF",
    uploadPrompt: "Upload your .docx for instant PDF conversion",
    intro: "Word documents are editable, collaborative, and flexible — but they're also unreliable for final delivery. Open a .docx on a different computer and the fonts shift, margins change, and page breaks move. What looked perfect on your screen becomes a formatting disaster on someone else's. PDF exists to solve exactly this problem: it's a fixed-layout format that looks identical everywhere. FlowPDF converts your .docx files to PDF with meticulous preservation of formatting — fonts, spacing, images, tables, headers, footers, and page layout all stay exactly as you intended. This is the professional standard for sending resumes, contracts, proposals, and any document where presentation matters. The conversion is fast, the quality is pristine, and you don't need to open Microsoft Word or any desktop software. Just upload your .docx and get a print-ready, share-ready PDF in seconds.",
    howToSteps: [
      "Upload your .docx file (Word document).",
      "FlowPDF automatically converts it to PDF, preserving all formatting.",
      "Preview the result to verify the conversion quality.",
      "Download the PDF — ready to share, print, or archive."
    ],
    faq: [
      {
        question: "Will my Word formatting be preserved in the PDF?",
        answer: "Yes — FlowPDF's conversion engine preserves fonts, spacing, margins, indentation, bulleted and numbered lists, tables, images, headers, footers, and page breaks. The output PDF is designed to match exactly what you see in Word when you open the document, with the same page count and layout. Complex elements like text boxes, embedded charts, and multi-column layouts are also preserved."
      },
      {
        question: "What if my Word document uses fonts that aren't available on other computers?",
        answer: "FlowPDF embeds all font information into the PDF, so the document displays correctly even on devices that don't have the original fonts installed. This is exactly why PDF is the preferred format for sharing documents — the recipient doesn't need to have your fonts or even have Word installed. The PDF contains everything needed to render the document perfectly."
      },
      {
        question: "Does the conversion handle tracked changes and comments from Word?",
        answer: "Tracked changes and comments are typically not preserved in the PDF output unless you accept the changes and delete comments before conversion. If you want the final document without markup, accept all changes in Word before uploading. If you need to keep comments visible, some PDF viewers allow comments to be displayed, but the standard is to finalize the document before converting to PDF."
      },
      {
        question: "Can I convert a password-protected Word document?",
        answer: "You'll need to enter the password to open the document before FlowPDF can convert it. If you have the password, you can unlock the Word file during upload or provide the password in your instruction. If you don't have the password, conversion isn't possible because FlowPDF can't read the encrypted content."
      },
      {
        question: "How does this compare to Word's built-in 'Save as PDF' feature?",
        answer: "The output quality is comparable — both produce professional PDFs with preserved formatting. FlowPDF's advantage is that you can convert from anywhere without needing Word installed, and you can convert multiple documents in batch. If you already have Word open and the document loaded, 'Save as PDF' is just as good. If you're on a device without Word, on a mobile phone, or want to convert a .docx without opening the desktop application, FlowPDF is the convenient alternative."
      },
      {
        question: "Can I convert a .doc file (older Word format) to PDF?",
        answer: "FlowPDF primarily supports .docx (the modern XML-based format used by Word 2007 and later). For older .doc files, you may need to open them in Word and save as .docx first, or use a dedicated .doc to PDF conversion tool. The .docx format is now the universal standard, and most documents created in the last 15 years are in this format."
      }
    ]
},{
    slug: "images-to-pdf",
    toolName: "images_to_pdf",
    title: "Convert Images to PDF Online — JPG, PNG, BMP, GIF, Free, No Sign-Up",
    metaDescription: "Combine one or more images into a single PDF, one image per page. Perfect for photo albums, scanned documents, and presentation materials. Free, no account, no watermarks.",
    actionLabel: "Create PDF from Images",
    uploadPrompt: "Upload your images, then click to merge",
    intro: "You have a collection of images — photos from a meeting, scanned receipts, screenshots of web pages, or artwork for a portfolio — and you need them in a single PDF. Maybe it's for a client presentation, a photo book, or a scan of a multi-page document that came as separate JPGs. FlowPDF combines all your images into one PDF, with each image on its own page, in the order you specify. The conversion is lossless where possible — images are embedded at their original resolution, so your PDF preserves the visual quality of the originals. You can upload a mix of image formats (JPG, PNG, BMP, GIF, WebP, TIFF) and FlowPDF handles each one correctly. This is the easiest way to turn scattered images into a organized, shareable document that anyone can open on any device, with no software required. Whether you're converting a batch of slides, a photo album, or a multi-page scan, FlowPDF makes the process seamless.",
    howToSteps: [
      "Upload your images (select multiple files at once or drag them in).",
      "FlowPDF automatically orders them by filename, or you can drag to reorder.",
      "The PDF is built with one image per page, in the sequence you specified.",
      "Download your PDF — all images are now in a single, shareable document."
    ],
    faq: [
      {
        question: "What image formats does FlowPDF support for conversion to PDF?",
        answer: "FlowPDF supports all common image formats: JPEG/JPG, PNG, BMP, GIF, TIFF, WebP, and SVG (as rasterized images). If an image is in an unsupported format, FlowPDF will alert you during upload. The supported formats cover virtually all use cases — phone photos (JPEG/HEIC), screenshots (PNG), scanned documents (JPEG/PNG), and web graphics (WebP)."
      },
      {
        question: "Will my images lose quality when converted to PDF?",
        answer: "No — FlowPDF embeds your images in the PDF at their original resolution and quality. The PDF acts as a container, not a converter. This means your images stay exactly as they were, with no compression artifacts or quality loss. The PDF's file size will be roughly the sum of the original image sizes (plus small PDF overhead), so you're not getting a compressed version of your photos unless you specifically request compression."
      },
      {
        question: "Can I control the page size and orientation of the PDF?",
        answer: "Yes — you can specify the page size and orientation in your instruction. For example, say 'create a PDF with A4 portrait pages' or 'make it Letter landscape.' If you don't specify, FlowPDF uses the image's own aspect ratio to determine the page size, with a default of A4 if images have varied dimensions. You can also request that all pages be the same size even if images have different proportions."
      },
      {
        question: "How does the tool handle images with different dimensions and orientations?",
        answer: "FlowPDF adjusts each image to fit within the selected page size while preserving the aspect ratio of the original image. If a horizontal image is placed on a vertical page, the tool adds margins on the top and bottom to keep the full image visible without cropping. If a vertical image is placed on a horizontal page, margins are added on the sides. You can also specify whether you want images to fill the page (which might crop the image) or fit within the page (which adds margins)."
      },
      {
        question: "Can I combine images and existing PDFs in one document?",
        answer: "Yes — you can upload a mix of images and PDFs, and FlowPDF will merge them into a single PDF. For example, you could upload 'cover.jpg,' 'contents.pdf,' and 'appendix.png' and get one PDF with all content in order. This is a powerful feature for creating comprehensive documents from mixed sources without using multiple tools."
      },
      {
        question: "Can I add text or annotations to the images during conversion?",
        answer: "The basic images-to-pdf tool creates a PDF with the images as-is. If you need to add text (like captions or page numbers) or annotations to the image pages, you can use the add_header_footer, add_page_numbers, or watermark_pdf tools after the initial PDF is created. This two-step approach gives you full control over the final document."
      }
    ]
},{
    slug: "pdf-to-word",
    toolName: "pdf_to_docx",
    title: "Convert PDF to Word Online — Free, Editable, No Sign-Up",
    metaDescription: "Turn your PDF into an editable Word document (.docx) with preserved text, layout, and basic formatting. Perfect for resumes, contracts, and reports. Free, no account.",
    actionLabel: "Convert to Word",
    uploadPrompt: "Upload your PDF to get an editable .docx",
    intro: "PDF is great for final delivery but terrible for editing. When you need to actually change the content — update a resume, revise a contract term, or correct a typo in a report — you need Word (or another editor). FlowPDF converts your PDF into an editable .docx document, extracting the text, preserving the layout, and maintaining basic formatting like fonts, sizes, and paragraph styles. This is not a simple text dump — it's a genuine conversion that produces a Word document you can open, edit, and save as a new PDF. The quality depends on how the original PDF was created: text-based PDFs (created from Word, InDesign, or similar) convert with high fidelity, preserving columns, tables, and images. Scanned PDFs (image-based) won't produce editable text because there's no text layer to extract — you'd need OCR first. For real-world use, pdf_to_docx is the bridge between the fixed PDF format and the flexibility of Word.",
    howToSteps: [
      "Upload your PDF.",
      "Ask FlowPDF to convert it — for example, 'convert this PDF to Word' or 'make this editable in Word.'",
      "FlowPDF processes the conversion, preserving text and layout where possible.",
      "Download the .docx file — open it in Word and make your edits."
    ],
    faq: [
      {
        question: "Will the formatting in my Word document look exactly like the PDF?",
        answer: "For PDFs that were originally created from Word, InDesign, or other text-based editors, the conversion is highly accurate — fonts, sizes, margins, paragraphs, and even most tables are preserved. For more complex layouts with floating elements, overlapping text boxes, or multiple columns, the conversion may approximate the layout rather than replicating it perfectly. The goal is an editable document that contains all the content, not a pixel-perfect replica of the original layout. In most cases, the result is good enough to edit and rebuild the formatting as needed."
      },
      {
        question: "Does pdf-to-docx work on scanned PDFs or photographed documents?",
        answer: "No — and this is one of the most common misunderstandings. A scanned PDF is just an image of text — there's no actual text data to extract. pdf_to_docx reads the existing text layer in the PDF. If your PDF is from a scan, you get a Word document with no text, just blank pages or embedded images. For scanned documents, you need OCR (optical character recognition) first to convert the image of text into actual text characters, and then you can convert to Word. FlowPDF doesn't include OCR in this tool, but you can use an OCR tool separately."
      },
      {
        question: "What happens to images, charts, and graphics in the conversion?",
        answer: "Images are extracted and embedded in the Word document at the best available resolution. Charts and graphs that were created in the original PDF are often preserved as images. Some complex vector graphics may appear differently in Word, but the visual information is generally retained. If high-quality graphics are essential to your workflow, consider whether Word is the right format, or if you should be editing in a design tool instead."
      },
      {
        question: "How does this compare to Adobe Acrobat's PDF to Word export?",
        answer: "FlowPDF's conversion quality is comparable to Acrobat for standard text-based PDFs. For highly complex documents with intricate layouts, Acrobat may have an edge due to its more sophisticated layout reconstruction algorithms. However, for the vast majority of everyday documents — reports, resumes, contracts, and business documents — FlowPDF produces perfectly usable Word files without the cost of an Acrobat subscription. The key advantage is accessibility: you can convert from any device, instantly, without software installation."
      },
      {
        question: "Can I convert a password-protected PDF to Word?",
        answer: "You'll need to unlock the PDF first using FlowPDF's unlock_pdf tool. Once unlocked, you can convert it to Word normally. FlowPDF doesn't bypass passwords — it requires the current password to access the content before conversion. If you have the password, the process is seamless. If you don't, you'll need to get it from the document owner."
      },
      {
        question: "What's the difference between pdf-to-docx and pdf-to-txt?",
        answer: "pdf-to-docx produces a fully formatted Word document with text, layout, fonts, and images arranged in a document you can edit. pdf-to-txt gives you only the raw text with no formatting — perfect for analysis, copying, or feeding into other applications. Use pdf-to-docx when you need to edit the content in Word. Use pdf-to-txt when you only need the text content and want the smallest, simplest file possible."
      }
    ]
},{
    slug: "pdf-to-pptx",
    toolName: "pdf_to_pptx",
    title: "Convert PDF to PowerPoint Online — Free, Editable Slides, No Sign-Up",
    metaDescription: "Turn your PDF into a PowerPoint presentation, one slide per page. Perfect for repurposing reports, converting slide decks, and creating presentations. Free, no account.",
    actionLabel: "Convert to PowerPoint",
    uploadPrompt: "Upload your PDF to get editable .pptx slides",
    intro: "You have a PDF that started as a PowerPoint presentation — but you've lost the original .pptx file, or you need to make edits and don't have access to the source. Or you have a multi-page document — a report, a white paper, a proposal — that you want to repurpose as presentation slides for a meeting. FlowPDF converts your PDF into a PowerPoint file, with each page becoming a separate slide. The conversion preserves text, images, and basic layout, giving you a starting point for editing in PowerPoint. This isn't just a 'paste content into PowerPoint' operation — it's a genuine conversion that creates editable slides, with text boxes you can click and edit, images you can reposition, and slide layouts that approximate the original pages. The result is a usable .pptx file that you can customize, add animations to, and present from. For PDFs that were originally created from PowerPoint, the conversion is often remarkably clean. For more complex PDFs, the output gives you a strong foundation to work from.",
    howToSteps: [
      "Upload your PDF.",
      "Ask FlowPDF to convert it — for example, 'convert this PDF to PowerPoint' or 'make slides from this document.'",
      "FlowPDF processes the file, creating one slide per page.",
      "Download the .pptx file and open it in PowerPoint."
    ],
    faq: [
      {
        question: "Will my slides look identical to the original PDF pages?",
        answer: "The conversion creates slides that closely approximate the original pages. Text, images, and basic shapes are preserved. The layout is maintained as much as possible, but complex designs with overlapping elements, text over images, or gradient backgrounds may render differently in PowerPoint than in the PDF. The goal is a workable starting point for editing, not a pixel-perfect replica. For the best results, test a few pages first before converting large documents."
      },
      {
        question: "Can I edit the text on the converted slides?",
        answer: "Yes — the text is extracted and placed in editable text boxes in PowerPoint. You can click any text, edit it, change fonts, resize, or reposition it. This is the main reason to convert to PowerPoint — you get a fully editable presentation that you can modify, update, and improve without rebuilding from scratch."
      },
      {
        question: "Does conversion work on PDFs with complex tables and charts?",
        answer: "Tables are often preserved as tables or as groups of text boxes. Charts that were created in the original presentation software may be converted as grouped shapes or images. For the best results, check the converted slides carefully and adjust any elements that didn't convert cleanly. Complex data visualizations may need to be re-created in PowerPoint for full editability."
      },
      {
        question: "What happens to animations, transitions, and speaker notes from the original presentation?",
        answer: "PDF doesn't contain animation, transition, or speaker note data from the original PowerPoint file. The conversion produces static slides with content only. You'll need to re-add animations, transitions, and speaker notes in PowerPoint after conversion. If these elements are critical, try to recover the original .pptx file instead of converting from PDF."
      },
      {
        question: "What about images — are they retained in the PowerPoint file?",
        answer: "Yes — images are extracted and embedded in the PowerPoint slides. The resolution is preserved as much as possible, though images that are heavily compressed in the PDF may appear lower quality. For PDFs with high-resolution embedded images (like professional presentations), the output images are clear and usable."
      },
      {
        question: "Is this better than just copying and pasting from PDF to PowerPoint?",
        answer: "Significantly better. Copy-pasting from a PDF into PowerPoint gives you unformatted text blocks, broken layouts, and no images. pdf_to_pptx creates a complete PowerPoint file with structured content, preserving the visual relationships between elements on the page. It's the difference between rebuilding a presentation from scratch and having a usable starting point. For presentations with dozens of pages, the time savings are enormous."
      }
    ]
},{
    slug: "crop-pdf",
    toolName: "crop_pdf",
    title: "Crop PDF Pages Online — Trim Margins, Remove White Space, Free",
    metaDescription: "Crop a uniform margin off every page of your PDF. Remove unwanted white space, scanner artifacts, or page borders with a single instruction. Free, no sign-up.",
    actionLabel: "Crop",
    uploadPrompt: "Upload, then describe how much to trim",
    intro: "Scanned documents almost always come with extra baggage. The scanner bed captures more than the page — you get a dark border, a skewed edge, or an uneven white margin that makes the document look unprofessional. Digital documents from different sources have inconsistent margins, making them awkward to print or read. FlowPDF crops a uniform margin off every page of your PDF, trimming away the excess and giving you clean, consistent pages. You specify how much to remove — say 'crop 0.5 inches from all sides' or 'remove the top 1 inch and bottom 0.5 inches' — and FlowPDF applies it to every page equally. This is not a manual rectangle selection per page; it's a consistent crop across the entire document, which is exactly what you need for printed materials, binding preparation, or simply making a document look polished. For PDFs with varying content positions on each page, you can also describe the crop area as a percentage of the page size.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF the crop amount — for example, 'crop 1 inch from every side' or 'remove the top 2 inches and bottom 1 inch.'",
      "FlowPDF applies the crop uniformly to every page.",
      "Download the cropped PDF — your pages are now clean and consistent."
    ],
    faq: [
      {
        question: "How does crop-pdf differ from resize-pages?",
        answer: "crop-pdf removes content from the edges of each page — it's a trim operation that makes the page smaller by cutting off parts of the existing content. resize-pages changes the entire page size while scaling the content to fit the new dimensions. Use crop-pdf when you have unwanted margins or scanner borders that need to be removed. Use resize-pages when you need to standardize page sizes (like converting Letter to A4) while keeping all content visible."
      },
      {
        question: "What if I need to crop different amounts from different pages?",
        answer: "The crop operation applies uniformly to all pages. If you need different crops for different pages, you have two options: first, extract the pages that need different crops into separate files, crop each file individually, and then merge them back together. Or, specify a crop amount that works for all pages (like removing a consistent scanner border). For documents with mixed content, the consistent crop is usually the cleanest approach."
      },
      {
        question: "What units can I use to specify the crop amount?",
        answer: "You can specify the crop in several units: inches (e.g., 'crop 0.5 inches'), centimeters (e.g., 'crop 1 cm'), millimeters (e.g., 'crop 10 mm'), or as a percentage of the page size (e.g., 'crop 10% from each side'). FlowPDF converts these to the correct pixel coordinates based on your PDF's page dimensions. If you don't specify units, FlowPDF assumes the values are in points (1/72 inch) by default."
      },
      {
        question: "Does cropping affect the document's text layer or file quality?",
        answer: "Cropping removes the edge portions of each page — including any text, images, or content in the cropped area. The remaining content stays exactly as it was, with no quality loss or re-encoding. If you crop a page that has form fields or annotations near the edge, those elements are removed if they fall into the cropped area. The text layer for the remaining content stays intact and searchable."
      },
      {
        question: "Can I crop only a specific range of pages instead of the whole document?",
        answer: "Yes — you can specify a page range for the crop. For example, 'crop 1 inch from pages 3-8' or 'crop the first 5 pages by 0.5 inches.' This is useful when only certain pages have scanner artifacts or inconsistent margins, while the rest of the document is already correctly formatted."
      },
      {
        question: "Does cropping reduce file size?",
        answer: "Yes — cropping can significantly reduce file size, especially if you're removing large borders from scanned documents. The cropped areas contain content that is removed from the PDF, so those pixels or objects no longer contribute to the file size. For image-heavy scanned PDFs with wide scanner borders, the reduction can be substantial — sometimes 10-20% of the total file size, depending on how much you're cutting away."
      }
    ]
},{
    slug: "add-page-numbers",
    toolName: "add_page_numbers",
    title: "Add Page Numbers to PDF Online — Free, Customizable, No Sign-Up",
    metaDescription: "Stamp page numbers onto every page of your PDF. Choose position, starting number, and numbering style. Essential for contracts, reports, and manuscripts. Free, no account.",
    actionLabel: "Add Page Numbers",
    uploadPrompt: "Upload, then tell us where and how to number",
    intro: "Page numbers are the unsung heroes of document organization. A contract without page numbers is a liability — pages can get lost or reordered, and there's no way to reference specific sections with precision. A report without page numbers is a reader's nightmare — you can't say 'see page 12' because no one knows what page 12 is. FlowPDF stamps page numbers onto every page of your PDF in the position and style you choose. You can add simple numbers ('1, 2, 3...') or include prefixes ('Page 1 of 10'), choose the starting number, and control where the numbering begins (e.g., start numbering from page 2, leaving the cover unnumbered). The numbers become part of the page content itself — not a floating annotation that might be lost when the document is printed or flattened. This is the cleanest, most reliable way to add page numbers to any PDF. Whether you're finalizing a legal brief, a thesis, a business report, or a multi-page form, FlowPDF gives you professional-looking page numbers in seconds.",
    howToSteps: [
      "Upload your PDF.",
      "Tell FlowPDF how you want the numbering — for example, 'add page numbers centered at the bottom, starting from page 1' or 'add numbers in the top-right corner, starting from page 2.'",
      "FlowPDF stamps the numbers onto each page.",
      "Download the numbered PDF — all pages are now properly identified."
    ],
    faq: [
      {
        question: "Can I add page numbers in different formats, like Roman numerals or letters?",
        answer: "Yes — FlowPDF supports multiple numbering formats: Arabic numerals (1, 2, 3), Roman numerals (I, II, III or i, ii, iii), and alphabetic numbering (A, B, C or a, b, c). This is especially useful for front matter in books (where you often use Roman numerals for the preface) and appendices (where you might use letter-based numbering). You can specify the format in your instruction, like 'use Roman numerals for the first five pages and Arabic numerals for the rest.'"
      },
      {
        question: "Can I skip numbering the first page, like a title page?",
        answer: "Yes — you can specify a starting page for numbering. For example, 'start numbering from page 2' or 'number from page 3 onward, leave the first two pages unnumbered.' This is standard practice for title pages, cover pages, or front matter that shouldn't have page numbers. FlowPDF handles the counting automatically — the number you specify is the number stamped on that page."
      },
      {
        question: "Can I add total page count to the numbering, like 'Page 3 of 10'?",
        answer: "Yes — you can include the total page count in the numbering format. Just specify 'use format Page X of Y' where Y is the total number of pages in the document. FlowPDF calculates the total automatically and stamps the correct number on each page. This is especially useful for documents that might be printed and referenced physically, as readers immediately know the total length of the document."
      },
      {
        question: "Does adding page numbers affect the document's text layer or file quality?",
        answer: "The page numbers are added as text content on the page, so they become part of the visible content and are selectable in PDF viewers. They do not affect the underlying content of the document — your existing text, images, and form fields remain unchanged. The file size increases slightly due to the added text elements, but the increase is usually negligible unless you're numbering a very large document."
      },
      {
        question: "Can I position the numbers in the header or footer instead of the page body?",
        answer: "Yes — you can specify any position: top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right. The numbers are stamped in the margin area as specified, avoiding overlap with your content. If you want the numbers to appear in the header or footer area (which may already contain other text), you can specify that as well. FlowPDF positions the numbers exactly where you ask."
      },
      {
        question: "Will the page numbers survive flattening or conversion to other formats?",
        answer: "Yes — because the numbers are stamped as visible content (not as annotations or overlay elements), they persist through flattening, printing, and conversion to other formats like Word or JPG. They are part of the page content, just like the original text. This is the key advantage over annotation-based numbering, which can be lost or hidden in some operations."
      }
    ]
},{
    slug: "pdf-to-png",
    toolName: "pdf_to_png",
    title: "Convert PDF to PNG Online — Free, High Quality, Transparent Background",
    metaDescription: "Turn every page of your PDF into a separate PNG image with transparent background support. Perfect for design assets, web graphics, and high-quality visuals. Free, no sign-up.",
    actionLabel: "Convert to PNG",
    uploadPrompt: "Upload your PDF for high-quality PNG conversion",
    intro: "PNG is the image format that designers choose when they need quality and transparency. While JPG handles photographs well, it struggles with text, sharp edges, and graphics where you need a transparent background. PNG preserves crisp text, clean lines, and supports a full alpha channel — meaning you can place the page on any background without a white box around it. FlowPDF converts every page of your PDF into a separate PNG image with excellent quality. Each page becomes a PNG file with the page's content rendered at high resolution, with transparent background where the page is blank. This is the go-to format for web design (no ugly white boxes over colored backgrounds), for slides (drop them into a presentation without cropping), and for any scenario where you need a clean, crisp image of a page with no background artifacts. Unlike JPG, PNG is lossless, so text and sharp edges stay perfect. You get all pages as a single zip download, ready to use in your design software, website, or presentation.",
    howToSteps: [
      "Upload your PDF.",
      "Ask FlowPDF to convert it — for example, 'convert to PNG' or 'make PNG images of every page.'",
      "FlowPDF renders each page as a high-quality PNG image.",
      "Download the zip containing one PNG per page."
    ],
    faq: [
      {
        question: "What's the difference between pdf-to-png and pdf-to-jpg?",
        answer: "This is the most frequent question because both tools convert PDF pages to images, but they serve different purposes. JPG files are smaller because they use lossy compression, making them great for photos and email attachments. PNG files are larger because they use lossless compression and support transparency, making them perfect for web graphics, design assets, and any scenario where you need sharp text and clean edges. Use pdf-to-jpg for quick image exports where file size matters more than pixel-perfect quality. Use pdf-to-png when you need professional-grade images with transparent backgrounds, crisp text, or sharp graphics."
      },
      {
        question: "Do PNG images have a transparent background?",
        answer: "Yes — FlowPDF's PNG conversion preserves the transparency of the PDF page. If a page has a white background, that white appears as white in the PNG. If a page has a transparent background (like a PDF with no background color), the PNG has a transparent background that you can place over any color without a white box. This is a key advantage over JPG, which always has a solid white background. For design work, this transparency is essential."
      },
      {
        question: "What resolution are the PNG images?",
        answer: "FlowPDF converts pages at a high resolution suitable for professional use — typically around 150-300 DPI depending on the PDF's native resolution and your instructions. You can request higher resolution by specifying it, like 'convert at 300 DPI.' The goal is to provide images that are crisp enough for both screen display and high-quality printing. The default resolution balances quality and file size for most use cases."
      },
      {
        question: "Can I convert only specific pages to PNG instead of the whole document?",
        answer: "Yes — you can specify a page range or individual pages. For example, say 'convert pages 3-6 to PNG' or 'convert page 1 and pages 5-8.' FlowPDF will only generate PNGs for the pages you request, saving you time and storage space. This is especially useful when you only need certain pages from a large document for design purposes."
      },
      {
        question: "Does PNG conversion preserve text quality and sharpness better than JPG?",
        answer: "Yes — significantly better. PNG uses lossless compression, so the rendered text and graphics are crisp and artifact-free. JPG's lossy compression introduces blurring and artifacts around sharp edges and text, especially at lower file sizes. If text readability is important — like for a screenshot of a document page or a design asset — PNG is the better choice. If you're converting photo-rich pages and file size is your priority, JPG is usually sufficient."
      },
      {
        question: "How does PNG file size compare to JPG for PDF conversion?",
        answer: "PNG files are typically 2-5 times larger than JPG files for the same resolution because PNG uses lossless compression. This is the trade-off: PNG gives you perfect quality and transparency at the cost of file size; JPG gives you small file size at the cost of some quality. For a standard letter-sized PDF page, a PNG might be 2-4 MB while a JPG is 0.5-1 MB at similar visual quality. Choose based on your needs — if you need the images for a website, JPG is usually fine; if you need them for design work, PNG is worth the extra size."
      }
    ]
  }

];

export function getToolPageBySlug(slug: string): ToolPageContent | undefined {
  return TOOL_PAGES.find((t) => t.slug === slug);
}