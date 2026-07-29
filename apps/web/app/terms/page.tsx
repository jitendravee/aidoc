import Text from "@/components/ui/Text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing your use of FlowPDF's PDF editing tools.",
  alternates: { canonical: "https://flowpdf.online/terms" },
};

const sections = [
  // ========== NEW: Acceptance & Operator ==========
  {
    title: "0. Acceptance and Operator",
    body: "These Terms govern your use of FlowPDF.online, operated by [Insert Your Legal Company Name], registered at [Insert Full Physical Address, City, Country]. By using the service, you agree to these terms. If you do not agree, please do not use the service.",
  },
  // =================================================
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
  // ========== REPLACED: Contact ==========
  {
    title: "7. Contact Us",
    body: "Questions about these Terms? Email us directly at: support@flowpdf.online.",
  },
  // ========================================
  // ========== NEW: Pricing & Refund ==========
  {
    title: "8. Pricing and Refund Policy",
    body: "FlowPDF is currently offered as a completely free service with no usage limits. We reserve the right to introduce paid premium plans or usage caps in the future. If we do, we will post a clear notice on the website at least 30 days in advance. Since the service is currently free, no refunds apply, and we do not store your payment information.",
  },
  // ===========================================
  // ========== NEW: Governing Law & Jurisdiction ==========
  {
    title: "9. Governing Law and Jurisdiction",
    body: "These Terms are governed by and construed in accordance with the laws of [Insert Country/State, e.g., Delaware, USA]. Any disputes arising out of or relating to these Terms shall be resolved exclusively in the courts located in [Insert City/County, e.g., Wilmington, Delaware]. You agree to submit to the personal jurisdiction of such courts.",
  },
  // =======================================================
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