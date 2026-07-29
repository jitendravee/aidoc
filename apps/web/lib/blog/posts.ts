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
          "FlowPDF skips the drag-and-drop reordering entirely — upload your files, then just type what you want, like \"merge these two PDFs\" or \"rotate the first page of doc 1, then merge it with doc 2.\" The AI figures out the right order of operations and hands you back the combined file, with no sign-up and nothing installed.",
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
        paragraphs: [
          "Most free online tools follow the same basic flow:",
        ],
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
          "With FlowPDF, there's no page-picker UI to hunt through — upload the PDF and type something like \"rotate page 3 by 90 degrees\" and it's done. You can chain it with other edits in the same request too, like \"rotate page 1 and delete page 4,\" and the AI handles both in the right order before handing back the result.",
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
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}