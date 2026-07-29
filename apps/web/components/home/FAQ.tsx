// components/home/FAQ.tsx
"use client";

import { useState } from "react";
import Text from "../ui/Text";
import { ChevronDown } from "lucide-react";

// Real questions people actually type into Google before landing on a PDF
// tool, answered plainly. This does double duty:
//   1. It's genuinely useful, people-first content (helps the "why would
//      someone bookmark or recommend this page" bar, not just keyword bait).
//   2. Paired with FAQPage structured data below, it gives both classic
//      Search snippets and generative AI features (AI Overviews / AI Mode)
//      a clean, quotable, already-structured answer to ground responses in.
const faqs = [
  {
    question: "Is FlowPDF really free to use?",
    answer:
      "Yes. Uploading a PDF and asking FlowPDF to rotate, delete, merge, or otherwise edit pages doesn't require payment or an account.",
  },
  {
    question: "Do I need to create an account or sign up?",
    answer:
      "No. There's no sign-up step — upload your PDF and start editing right away. This also means we don't hold onto a profile or account data for you.",
  },
  {
    question: "Is it safe to upload sensitive or private PDFs?",
    answer:
      "Your files are transferred over an encrypted connection and are never shared with third parties beyond what's strictly needed to run the edit (like the AI model interpreting your request). That said, no online system is perfectly secure, so avoid uploading anything you couldn't afford to have exposed.",
  },
  {
    question: "What can I actually ask FlowPDF to do?",
    answer:
      "Common requests include rotating or deleting pages, merging multiple PDFs into one, splitting a PDF apart, adding page numbers, unlocking a password-protected file, and converting to formats like Word or PowerPoint. If a request isn't supported yet, FlowPDF tells you directly instead of guessing.",
  },
  {
    question: "Can I undo a change if the result isn't what I wanted?",
    answer:
      "Yes. Every edit is versioned, so you can undo a change and get back to a previous version of your document from the workspace.",
  },
  {
    question: "Is there a file size or page limit?",
    answer:
      "FlowPDF is built for everyday documents — reports, contracts, forms, and similar files. Extremely large files may take longer to process.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <Text
        as="h2"
        size={{ base: "2xl", lg: "3xl" }}
        weight="bold"
        family="heading"
        align="center"
        className="mb-3"
      >
        Frequently asked questions
      </Text>
      <Text
        as="p"
        size={{ base: "sm", lg: "base" }}
        color="text-secondary"
        align="center"
        className="mx-auto mb-10 max-w-lg lg:mb-12"
      >
        Everything you might want to know before uploading a file.
      </Text>

      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className="rounded-2xl border border-gray-100 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <Text size="sm" weight="semibold" className="text-gray-900">
                  {faq.question}
                </Text>
                <ChevronDown
                  className={`size-4 shrink-0 text-text-secondary transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <Text size="sm" color="text-secondary" className="leading-relaxed">
                    {faq.answer}
                  </Text>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
