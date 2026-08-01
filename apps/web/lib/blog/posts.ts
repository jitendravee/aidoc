export interface BlogPostSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt: string;
  readingTime: string;
  sections: BlogPostSection[];
  ctaText: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-add-confidential-watermark-to-pdf",
    title: "How to Add a Confidential Watermark to a PDF (Free, No Signup)",
    description:
      "A complete guide to adding a CONFIDENTIAL watermark to a PDF, including when you need one, how to write the text, common mistakes, and the fastest way to do it online without Adobe Acrobat.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    readingTime: "11 min read",
    sections: [
      {
        heading: "What a Confidential Watermark Actually Does",
        paragraphs: [
          "A confidential watermark is a piece of text or an image placed semi-transparently across a PDF page so it doesn't block the content underneath but is still impossible to miss. Most people picture the word CONFIDENTIAL stamped diagonally across a page, but the same idea covers labels like INTERNAL USE ONLY, DRAFT, DO NOT COPY, or PRIVILEGED AND CONFIDENTIAL.",
          "It isn't encryption and it isn't a password. A watermark doesn't stop anyone from opening, copying, or forwarding a file. What it does is signal intent. It tells every person who sees the document, before they read a single line, that the content inside is sensitive and shouldn't be shared casually. That distinction matters, because a lot of people search for a watermark expecting it to lock the file down the way a password would, and it doesn't.",
          "Legal teams, healthcare providers, accountants, and HR departments use confidential watermarks constantly, mostly because contracts, patient records, financial statements, and personnel files pass through a lot of hands before they're finalized. A visible reminder on every page reduces the chance that someone forwards a draft to the wrong person or treats a sensitive file like a routine attachment.",
        ],
      },
      {
        heading: "When You Actually Need One",
        paragraphs: [
          "Not every PDF needs a watermark, and stamping CONFIDENTIAL on everything trains people to ignore it. It's worth adding one when a document meets at least one of these conditions:",
        ],
        list: [
          "It contains information that would cause harm if it reached the wrong person: client data, salary details, unreleased financials, medical records",
          "It's being shared outside your organization, even with a trusted partner or vendor",
          "It's a draft or unfinished version that could be mistaken for a final document",
          "Multiple people will handle the file before it's approved or published",
          "You need a paper trail showing the document was clearly marked as restricted at the time it was shared",
        ],
      },
      {
        heading: "Writing the Watermark Text",
        paragraphs: [
          "The word CONFIDENTIAL by itself works fine for most cases, but a more specific label often does more. Consider what you're actually trying to prevent and word the watermark around that.",
        ],
        list: [
          "CONFIDENTIAL — general-purpose, works for most sensitive documents",
          "INTERNAL USE ONLY — for material that should stay inside the company but isn't necessarily secret",
          "PRIVILEGED AND CONFIDENTIAL — standard phrasing for attorney-client communications",
          "DO NOT DISTRIBUTE — when the main risk is forwarding, not just viewing",
          "DRAFT — for documents that could be mistaken for a finished version",
          "[Company Name] — CONFIDENTIAL — adds accountability by naming the document's owner",
        ],
      },
      {
        heading: "Three Ways to Add a Confidential Watermark",
        paragraphs: [
          "There isn't one single correct method. Which one makes sense depends on the software you already have and whether you're doing this once or repeatedly.",
          "Microsoft Word works if the document started as a Word file. Open the file, go to the Design tab, choose Watermark, and either pick a built-in CONFIDENTIAL option or create a custom one. Once it looks right, save or export as PDF. This only works cleanly if you have the original Word file; watermarking after the fact by opening a PDF in Word usually causes formatting to shift.",
          "Adobe Acrobat is the traditional route for people who already pay for it. Open the PDF, go to Edit, then Add content, then Watermark, and type or upload your watermark. It gives you full control over rotation, opacity, and position, but the paid subscription is a real barrier if you only need to watermark a handful of files.",
          "An online PDF tool skips the software entirely. You upload the file, add the watermark text or image, and download the result. This is usually the fastest option when you don't already have Acrobat installed and don't want to recreate the document in Word.",
        ],
      },
      {
        heading: "Adding a Watermark With FlowPDF",
        paragraphs: [
          "If you just need to mark a document as confidential before sending it, FlowPDF handles this without any menus to dig through. Upload the PDF, then type what you want, for example 'add a CONFIDENTIAL watermark' or 'add a DRAFT watermark diagonally across every page.' The AI applies it and gives you the file back.",
          "This matters most when you're doing something quick and one-off, like watermarking a contract before it goes to a client this afternoon. You don't need to know which menu Acrobat hides the watermark tool in, and you don't need to sign up for anything or install software. It works entirely in the browser, and nothing about the process requires a subscription.",
          "If you're watermarking dozens of documents a week with the same recipient-tracking or dynamic username variables, a dedicated document security platform is the better tool for the job. For the far more common case of stamping a handful of files before sharing them, a browser-based tool like FlowPDF is faster than opening desktop software.",
        ],
      },
      {
        heading: "Common Mistakes",
        paragraphs: [
          "Most watermarking problems come down to a handful of repeatable errors.",
        ],
        list: [
          "Opacity too high — a solid, dark watermark makes the underlying text hard to read, which defeats the point",
          "Opacity too low — a watermark that's barely visible is easy to crop out or simply ignore",
          "Watermarking only the first page — someone can screenshot or forward page 3 alone with no confidentiality marking on it at all",
          "Using Word's built-in watermark and assuming it's permanent — it's just text on a layer and can be removed by anyone who opens the file in an editor",
          "Forgetting to also restrict editing — a watermark discourages careless sharing, but it doesn't stop someone from deleting it if they can edit the PDF",
        ],
      },
      {
        heading: "Watermark Alone Isn't Real Security",
        paragraphs: [
          "It's worth being direct about this: a watermark is a deterrent, not a lock. Anyone with basic PDF editing tools can remove a standard text or image watermark in a few minutes. If the goal is genuinely preventing unauthorized access rather than just reminding people to be careful, pair the watermark with a password.",
          "A reasonable workflow for a truly sensitive document is to add the watermark first, then apply a password so the file can't even be opened without the right credentials. That combination covers both problems: the watermark handles the human factor of careless forwarding, and the password handles the technical factor of unauthorized access.",
        ],
      },
      {
        heading: "Troubleshooting",
        paragraphs: [
          "A few issues come up often enough to be worth addressing directly.",
        ],
        list: [
          "Watermark doesn't show up on every page: check whether the tool applied it to a page range instead of the whole document",
          "Watermark looks pixelated: this usually happens with image watermarks scaled up too far; use a higher-resolution source image or switch to text",
          "Text watermark won't print the way it looks on screen: some printers ignore transparency settings, so print a test page before sending a large batch",
          "Watermark disappeared after editing the PDF elsewhere: some PDF editors flatten or strip layers on save, so add the watermark as the last step before finalizing the file",
        ],
      },
      {
        heading: "Frequently Asked Questions",
        paragraphs: [
          "Does a confidential watermark stop someone from copying my document? No. It's a visual signal, not a technical restriction. Copying and forwarding are still possible unless you also apply permission settings or a password.",
          "Can I remove a watermark once it's added? Usually, yes, especially if it was added as an editable text layer. If you need a watermark that can't easily be stripped out, you'll need a document security tool built specifically for that, not a standard watermarking feature.",
          "Is it legal to add a confidential label to someone else's document? Yes, if you own the document or have the rights to distribute it. Adding your own confidentiality marking to your own file is standard business practice.",
          "Should the watermark go on every page or just the first? Every page, generally. A single page can be separated from the rest of the document, whether by accident or on purpose, and lose its confidentiality marking entirely.",
          "What's the difference between a confidential watermark and a copyright watermark? A confidential watermark restricts who should view or share the document. A copyright watermark asserts ownership of the content, usually to prevent reproduction rather than sharing.",
        ],
      },
      {
        heading: "Related PDF Tasks",
        paragraphs: [
          "Watermarking often comes up alongside a few other document tasks. If you're preparing a sensitive document for distribution, it's worth also looking at how to password protect a PDF so the file can't be opened without permission, or how to compress a PDF if the watermarked version needs to be emailed and the file size is too large. If you're combining several confidential files into a single package before sending, merging PDFs into one document keeps everything together and easier to track than sending separate attachments.",
        ],
      },
    ],
    ctaText:
      "Upload your PDF and type 'add a CONFIDENTIAL watermark' — FlowPDF applies it in seconds, no signup or software required.",
  },
  {
    slug: "merge-pdf-files-free",
    title: "How to Merge PDF Files for Free (No Sign-Up Required)",
    description:
      "Combine two or more PDFs into a single document in seconds — no software install, no account, no watermark. Here's exactly how, plus what to check before you merge.",
    publishedAt: "2026-07-29",
    updatedAt: "2026-07-29",
    readingTime: "4 min read",
    ctaText: "Merge your PDFs now",
    sections: [
      {
        heading: "Why merge PDFs in the first place?",
        paragraphs: [
          "Merging PDFs is one of the most common document tasks there is — combining an invoice with a receipt, stitching together scanned pages into one file, or assembling a report from sections written by different people. Whatever the reason, most people don't want to install desktop software or hand a sensitive document to an unfamiliar site just to do it once.",
        ],
      },
      {
        heading: "How to merge PDFs online for free",
        paragraphs: [
          "The fastest way is to use a browser-based tool that doesn't require creating an account. Here's the general process, whichever tool you use:",
        ],
        list: [
          "Upload the PDF files you want to combine — order matters, since most tools merge them in the sequence you add them.",
          "Reorder the files if needed, so the final document reads in the right sequence.",
          "Run the merge and download the combined file.",
        ],
      },
      {
        heading: "Merge PDFs by just describing what you want",
        paragraphs: [
          'FlowPDF skips the drag-and-drop reordering entirely — upload your files, then just type what you want, like "merge these two PDFs" or "rotate the first page of doc 1, then merge it with doc 2." The AI figures out the right order of operations and hands you back the combined file, with no sign-up and nothing installed.',
        ],
      },
      {
        heading: "What to check before you merge",
        paragraphs: [
          "A couple of things are easy to miss and annoying to fix after the fact:",
        ],
        list: [
          "Page order — double check which file should come first, especially with more than two documents.",
          "Rotated or sideways pages — fix these before merging, since a merged file with mixed orientations is harder to clean up afterward.",
          "File size — very large merges (dozens of scanned pages) can take longer to process; splitting into two merges is sometimes faster than one giant one.",
        ],
      },
    ],
  },
  {
    slug: "rotate-pdf-pages-online",
    title: "How to Rotate a PDF Page Online for Free",
    description:
      "Fix a sideways or upside-down scan in under a minute — no desktop software, no account. Here's how to rotate one page or an entire PDF for free.",
    publishedAt: "2026-07-29",
    updatedAt: "2026-07-29",
    readingTime: "3 min read",
    ctaText: "Rotate a PDF now",
    sections: [
      {
        heading: "The most common cause of a sideways PDF",
        paragraphs: [
          "Rotated pages almost always come from scanning — a phone scanning app or an office scanner captures a page in landscape when the rest of the document is portrait, or a page gets scanned upside down entirely. It's a small, common annoyance, and fixing it shouldn't require opening a heavyweight PDF editor.",
        ],
      },
      {
        heading: "How to rotate a PDF page for free",
        paragraphs: ["Most free online tools follow the same basic flow:"],
        list: [
          "Upload the PDF.",
          "Select the specific page (or pages) that need rotating — most tools let you rotate just one page rather than the whole document.",
          "Choose the rotation angle: 90°, 180°, or 270°.",
          "Download the corrected file.",
        ],
      },
      {
        heading: "Rotate by just describing the page",
        paragraphs: [
          'With FlowPDF, there\'s no page-picker UI to hunt through — upload the PDF and type something like "rotate page 3 by 90 degrees" and it\'s done. You can chain it with other edits in the same request too, like "rotate page 1 and delete page 4," and the AI handles both in the right order before handing back the result.',
        ],
      },
      {
        heading: "One rotation angle isn't always obviously correct",
        paragraphs: [
          "If a page looks sideways, it's not always clear whether it needs 90° or 270° — they look similar at a glance but rotate in opposite directions. If the first attempt lands the page upside down instead of right-side up, just rotate it again by 180° to correct it, or specify the other direction directly.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    description:
      "Shrink a large PDF for email or upload limits while keeping text sharp and images clear. What actually makes a PDF huge, and the fastest free way to fix it.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    readingTime: "6 min read",
    ctaText: "Compress your PDF now",
    sections: [
      {
        heading: "Why PDFs get so big in the first place",
        paragraphs: [
          "A PDF made almost entirely of text is usually a few hundred kilobytes, no matter how many pages it has. The files that balloon to 20, 50, or 100 MB are almost always the ones with images: scanned pages, embedded photos, or a design exported at print resolution when it only needs to be viewed on a screen.",
          "That's actually good news, because it means compression has a clear target. A PDF compressor doesn't need to touch your text at all — it re-encodes the images inside the file at a lower resolution and strips out data the file doesn't need, like unused fonts or old edit history.",
        ],
      },
      {
        heading: "What 'without losing quality' really means",
        paragraphs: [
          "No compressor can promise zero change and a dramatically smaller file at the same time — those two goals pull in opposite directions. What a good compressor does is stay under the threshold where the difference is actually visible.",
          "For most documents, images can lose a fair amount of resolution before anyone notices on a screen or a standard printout. The goal isn't literally zero quality loss, it's quality loss small enough that the file still looks identical for its intended use.",
        ],
      },
      {
        heading: "How to compress a PDF online for free",
        paragraphs: [
          "The general process is the same across most free tools:",
        ],
        list: [
          "Upload the PDF you want to shrink.",
          "Pick a compression level if the tool offers one — usually labeled something like Low, Medium, or High.",
          "Run the compression and download the smaller file.",
          "Check the file size and open the result to confirm the images still look acceptable.",
        ],
      },
      {
        heading: "Compress a PDF by just asking",
        paragraphs: [
          'With FlowPDF, there\'s no compression-level dropdown to guess at — upload the file and type "compress this PDF" or "compress this PDF so it\'s under 5MB" if you have a specific size limit for an email attachment or a form upload. The AI picks a sensible compression level and hands back the smaller file.',
        ],
      },
      {
        heading: "If compression alone isn't enough",
        paragraphs: [
          "Sometimes a PDF is still too large after compression, usually because it has dozens of high-resolution scanned pages rather than a handful of photos. In that case, cutting down the page count helps more than further compression. Extracting just the pages you actually need to send, instead of the entire document, is often the faster fix.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "A few things trip people up when compressing PDFs.",
        ],
        list: [
          "Compressing a file repeatedly — each pass re-compresses already-compressed images, which degrades quality faster than doing it once at a stronger setting",
          "Compressing a text-only PDF and expecting a big size drop — there's often very little to remove if the file has no images",
          "Not checking the result before sending — always open the compressed file and skim it before it goes to someone else",
        ],
      },
      {
        heading: "Related PDF tasks",
        paragraphs: [
          "If your PDF is still too large after compressing, splitting it into smaller sections or extracting just the pages you need can help. And if the file needs to go out securely once it's small enough, password protecting it is worth doing at the same time.",
        ],
      },
    ],
  },
  {
    slug: "split-pdf-into-multiple-files",
    title: "How to Split a PDF Into Multiple Files for Free",
    description:
      "Break one PDF into several separate files — by page range, in half, or one file per page. No software, no account, no cost.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    readingTime: "5 min read",
    ctaText: "Split your PDF now",
    sections: [
      {
        heading: "When splitting a PDF actually makes sense",
        paragraphs: [
          "Splitting comes up more often than people expect. A scanned batch of forms needs to become individual files, one per person. A 200-page report needs to become chapters. An invoice bundle from a vendor needs to be broken apart so each invoice can be filed separately. In every case, the underlying task is the same: take one PDF and turn part or all of it into standalone files.",
        ],
      },
      {
        heading: "Split vs. extract — they're not quite the same",
        paragraphs: [
          "These two get used interchangeably, but there's a useful distinction. Splitting usually means dividing an entire document into several smaller documents, covering every page. Extracting usually means pulling out a specific subset of pages and leaving the rest behind. If you want a 60-page report turned into three 20-page sections, that's splitting. If you want just pages 14 through 22 pulled out as their own file, that's extracting.",
        ],
      },
      {
        heading: "How to split a PDF online for free",
        paragraphs: ["The typical flow across most free tools:"],
        list: [
          "Upload the PDF.",
          "Choose how to split it: by page range, at specific page breaks, or into one file per page.",
          "Run the split — you'll usually get back a ZIP file containing the separate PDFs.",
          "Download and rename the resulting files.",
        ],
      },
      {
        heading: "Split a PDF by describing the result you want",
        paragraphs: [
          'FlowPDF handles this without a page-picker interface — upload the file and type what you want, like "split this after page 10" or "split this into three files of 5 pages each." You can also just say "extract pages 8 to 15" if you only need one section rather than the whole document broken apart.',
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "A few things are worth double-checking before you split a document you can't easily reassemble.",
        ],
        list: [
          "Splitting at the wrong page — recount before running the split, especially with scanned documents where the page order isn't obvious at a glance",
          "Losing track of which output file is which — rename files immediately after downloading rather than after you've opened several of them",
          "Splitting a document that should have been merged with something else first — if the final deliverable needs to be one file, merge first and split later, not the other way around",
        ],
      },
      {
        heading: "Related PDF tasks",
        paragraphs: [
          "If you're splitting a large document down into a specific section rather than every page, extracting pages directly is often faster. And if the pieces need to be recombined differently later, merging PDFs back together takes just as little effort.",
        ],
      },
    ],
  },
  {
    slug: "add-page-numbers-to-pdf",
    title: "How to Add Page Numbers to a PDF for Free",
    description:
      "Number every page of a PDF for reports, contracts, or theses — including where to start counting and how to skip a cover page.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    readingTime: "5 min read",
    ctaText: "Add page numbers now",
    sections: [
      {
        heading: "Why page numbers matter more than they seem to",
        paragraphs: [
          "Page numbers look like a minor formatting detail, but they solve a real problem the moment a document leaves your hands. Once a PDF has more than a few pages and more than one person reading it, referencing 'the paragraph near the middle of page 8' only works if page 8 is actually labeled page 8. Contracts, reports, theses, and anything reviewed by multiple people all benefit from numbering, mostly because it makes discussion about the document precise instead of approximate.",
        ],
      },
      {
        heading: "Deciding where numbering should start",
        paragraphs: [
          "This is the part people get stuck on. A cover page, title page, or table of contents usually shouldn't display 'Page 1' — it looks unfinished. The common convention is to start visible numbering on the first real content page, even if that page is technically the fourth or fifth sheet in the file.",
          "There are two ways to handle this: skip numbering entirely on the front matter and start the sequence at 1 once the content begins, or number the front matter with lowercase roman numerals (i, ii, iii) and switch to arabic numerals (1, 2, 3) for the body. Academic and legal documents often use the roman numeral approach; business reports usually just skip the front pages.",
        ],
      },
      {
        heading: "How to add page numbers online for free",
        paragraphs: ["Most free tools follow the same basic steps:"],
        list: [
          "Upload the PDF.",
          "Choose the position: top or bottom, left, center, or right.",
          "Set the starting number and, if needed, the page to start counting from.",
          "Run the tool and download the numbered file.",
        ],
      },
      {
        heading: "Add page numbers by just asking",
        paragraphs: [
          'FlowPDF handles this the same way as everything else — upload the PDF and type "add page numbers to the bottom center of every page" or "add page numbers starting on page 3." No settings panel required.',
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "A few details are easy to overlook.",
        ],
        list: [
          "Numbering the cover page as 'Page 1' — reads as unpolished in a formal document",
          "Placing the number where it overlaps existing footer content, like a company name or confidentiality notice",
          "Forgetting to re-number after merging documents — if you combine files first, add page numbers afterward so the numbering runs continuously across the whole document rather than restarting per section",
        ],
      },
      {
        heading: "Related PDF tasks",
        paragraphs: [
          "Page numbers are usually one of the last steps in preparing a document. If you're combining several files first, merge them before numbering so the sequence stays continuous. If the finished document also needs to go out securely, consider password protecting it once numbering is done.",
        ],
      },
    ],
  },
  {
    slug: "convert-pdf-to-jpg-free",
    title: "How to Convert a PDF to JPG for Free",
    description:
      "Turn PDF pages into JPG images for social media, websites, or presentations — no software, no account, no cost.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    readingTime: "4 min read",
    ctaText: "Convert your PDF to JPG now",
    sections: [
      {
        heading: "Why convert a PDF to JPG at all",
        paragraphs: [
          "PDFs are built for documents, not images, and a lot of platforms simply don't accept them. Social media posts, website embeds, presentation slides, and most image-upload fields all expect a JPG or PNG, not a PDF. Converting turns each page of the PDF into its own standalone image file, which can then go anywhere a document file can't.",
        ],
      },
      {
        heading: "One JPG per page, not one JPG total",
        paragraphs: [
          "This trips people up the first time they try it: converting a 10-page PDF produces 10 separate JPG files, one per page, usually packaged in a ZIP for download. If you only need one page as an image, most tools let you convert or select just that page rather than the whole document.",
        ],
      },
      {
        heading: "How to convert a PDF to JPG online for free",
        paragraphs: ["The typical process:"],
        list: [
          "Upload the PDF.",
          "Choose full-page conversion (each page becomes an image) rather than image extraction (pulling out photos already embedded in the PDF), unless you specifically want the latter.",
          "Run the conversion and download the JPG files, usually as a ZIP if there's more than one page.",
        ],
      },
      {
        heading: "Convert with a simple request",
        paragraphs: [
          'FlowPDF handles this the same way as its other tools — upload the PDF and type "convert this to JPG." If you only need a specific page, say so directly, like "convert page 2 to JPG," and the AI returns just that image instead of the whole document.',
        ],
      },
      {
        heading: "A note on image quality",
        paragraphs: [
          "The resulting JPG quality depends on the resolution the page is rendered at, not on the size of the original PDF. A PDF that looks sharp on screen will generally produce a sharp JPG. If the output looks blurry, it's usually because the source PDF itself was a low-resolution scan to begin with, not a fault of the conversion.",
        ],
      },
      {
        heading: "Related PDF tasks",
        paragraphs: [
          "If you need to go the other direction and turn images back into a PDF, or you're preparing a document for a presentation instead of an image upload, converting to PowerPoint is worth a look if that's the actual end goal.",
        ],
      },
    ],
  },
  {
    slug: "delete-pages-from-pdf",
    title: "How to Delete Pages From a PDF for Free",
    description:
      "Remove a blank scan, a duplicate page, or an outdated section from a PDF without touching the rest of the document. No software required.",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-01",
    readingTime: "4 min read",
    ctaText: "Delete pages from your PDF now",
    sections: [
      {
        heading: "The usual reasons a page needs to go",
        paragraphs: [
          "Deleting pages is one of the simplest PDF edits, and also one of the most common. A scanner adds a blank page between documents. A contract template includes a boilerplate page that doesn't apply this time. A report has a draft section that got cut but never removed from the file. In every case, the fix is the same: remove the page without disturbing anything else in the document.",
        ],
      },
      {
        heading: "How to delete pages from a PDF online for free",
        paragraphs: ["The general steps most tools follow:"],
        list: [
          "Upload the PDF.",
          "View the pages, usually as thumbnails, and select the ones to remove.",
          "Confirm the deletion and download the shortened file.",
        ],
      },
      {
        heading: "Delete pages by just saying which ones",
        paragraphs: [
          'With FlowPDF, there\'s no thumbnail grid to click through — upload the file and type "delete pages 2 and 5" or "delete the last page." You can combine it with other edits in the same request, like "delete page 3 and rotate page 1," and everything happens in one pass.',
        ],
      },
      {
        heading: "Double-check page numbers before deleting",
        paragraphs: [
          "The most common mistake here is straightforward: counting pages wrong, especially in a long or scanned document where the visible page number printed on the page doesn't match its actual position in the PDF (for example, if there's an unnumbered cover page). Open the document and confirm the page you're about to remove is really the one you mean to remove before running the deletion.",
        ],
      },
      {
        heading: "Related PDF tasks",
        paragraphs: [
          "If you're removing most of a document and keeping only a few pages, extracting the pages you want to keep is often faster than deleting everything else one page at a time. And if pages need to be deleted after a merge, do the merge first so you're only deleting once from the final combined file.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

// Finds the section that actually contains a sequential "how to do this"
// step list (every post has one, titled "How to X online for free"). Used
// to emit HowTo structured data straight from the existing content instead
// of maintaining a second, parallel steps list that could drift out of
// sync — and it means HowTo schema only appears where the content genuinely
// supports it, per Google's guidance not to add HowTo to non-instructional
// pages.
export function getHowToSection(post: BlogPost): BlogPostSection | undefined {
  return post.sections.find(
    (s) => /^how to\b/i.test(s.heading) && s.list && s.list.length > 0
  );
}

// Simple, deterministic "related articles" picker: scores every other post by
// shared significant words with the current post's title + description, then
// falls back to most recently published so every post always has 3 related
// links. This is what lets each article page link to related articles per
// the internal-linking pass, without hand-maintaining a related-posts map
// that drifts out of date as posts are added.
const STOPWORDS = new Set([
  "a", "an", "the", "to", "of", "in", "on", "for", "and", "or", "is", "your",
  "you", "how", "with", "without", "into", "free", "pdf", "pdfs", "online",
  "no", "signup", "add", "from",
]);

function significantWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const currentWords = significantWords(`${current.title} ${current.description}`);

  const scored = BLOG_POSTS.filter((p) => p.slug !== slug).map((post) => {
    const words = significantWords(`${post.title} ${post.description}`);
    let overlap = 0;
    for (const w of words) if (currentWords.has(w)) overlap++;
    return { post, overlap };
    
  });
 
  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime();
  });


  return scored.slice(0, count).map((s) => s.post);
}