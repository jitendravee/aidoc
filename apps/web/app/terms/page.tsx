import Text from "@/components/ui/Text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing your use of FlowPDF's PDF editing tools.",
  alternates: { canonical: "https://flowpdf.online/terms" },
};
const sections = [
  {
    title: "1. What FlowPDF does",
    body: "FlowPDF lets you upload PDF files and edit them using natural-language chat instructions — for example, rotating, deleting, or merging pages. We add new editing tools over time; if a request isn't supported yet, the assistant will tell you directly rather than guessing.",
  },
  {
    title: "2. Your files",
    body: "You retain all rights to the files you upload. We store your documents only to provide the editing service, and you can delete your work at any time. We do not claim ownership over your content and do not use your files to train models.",
  },
  {
    title: "3. Acceptable use",
    body: "Don't upload files you don't have the right to use, or use FlowPDF to process illegal, infringing, or harmful content. We may suspend access for accounts that misuse the service.",
  },
  {
    title: "4. No warranty",
    body: "FlowPDF is provided \"as is.\" AI-driven edits are generally reliable but not infallible — review output before relying on it for anything important, and use the undo feature if a result isn't what you expected.",
  },
  {
    title: "5. Limitation of liability",
    body: "To the extent permitted by law, FlowPDF and its operators aren't liable for indirect or consequential damages arising from use of the service.",
  },
  {
    title: "6. Changes",
    body: "We may update these terms as the product evolves. Continued use after a change means you accept the updated terms.",
  },
  {
    title: "7. Contact",
    body: "Questions about these terms? Reach out at the contact details listed on our site.",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-8">
      <Text as="h1" size="3xl" weight="bold" family="heading" className="mb-2">
        Terms of Use
      </Text>
      <Text size="sm" color="text-secondary" className="mb-10">
        Last updated: July 2026
      </Text>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <Text as="h2" size="lg" weight="semibold" className="mb-2">
              {section.title}
            </Text>
            <Text size="sm" color="text-secondary">
              {section.body}
            </Text>
          </div>
        ))}
      </div>
    </main>
  );
}