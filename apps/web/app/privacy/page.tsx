import Text from "@/components/ui/Text";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How FlowPDF handles your files and data.",
  alternates: { canonical: "https://flowpdf.online/privacy" },
};
const sections = [
  {
    title: "1. What we collect",
    body: "The PDF files you upload, the chat messages you send while editing them, and basic technical data (like error logs) needed to operate the service. We don't require sign-up, so we don't collect account or profile information.",
  },
  {
    title: "2. How we use it",
    body: "Your files and messages are used solely to run the requested edit — including sending the relevant content to our AI provider to interpret your instructions — and to maintain version history so you can undo changes.",
  },
  {
    title: "3. Storage and retention",
    body: "Files are stored with our cloud storage provider. Uploaded documents and their edit history are retained only as long as needed to support your session; older versions are automatically cleaned up rather than kept indefinitely.",
  },
  {
    title: "4. Sharing",
    body: "We don't sell your data or share your files with third parties, other than the infrastructure and AI providers strictly necessary to run the editing service (for example, cloud storage and the AI model used to interpret your requests).",
  },
  {
    title: "5. Security",
    body: "Files are transferred over encrypted connections and stored with access controls. No system is perfectly secure, so avoid uploading documents with highly sensitive information you can't afford to have exposed.",
  },
  {
    title: "6. Your choices",
    body: "You can delete a document and its version history at any time from the workspace. Because no account is required, we have no way to locate your data without the document links themselves.",
  },
  {
    title: "7. Changes to this policy",
    body: "We'll update this page if how we handle data changes materially, and note the date at the top so you can check back.",
  },
  {
    title: "8. Contact",
    body: "Questions about this policy? Reach out at the contact details listed on our site.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-8">
      <Text as="h1" size="3xl" weight="bold" family="heading" className="mb-2">
        Privacy Policy
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