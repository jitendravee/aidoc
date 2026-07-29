import Text from "@/components/ui/Text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How FlowPDF handles your files and data.",
  alternates: { canonical: "https://flowpdf.online/privacy" },
};

const sections = [
  // ========== NEW: Legal Entity Disclosure ==========
  {
    title: "0. About FlowPDF (Data Controller)",
    body: "FlowPDF is operated by [Insert Your Legal Company Name], registered at [Insert Full Physical Address, City, Country]. For all privacy-related matters, contact our Data Protection representative directly at: support@flowpdf.online. This establishes the legal entity responsible for your data under applicable privacy laws (including GDPR and CCPA).",
  },
  // ===================================================
  {
    title: "1. What we collect",
    body: "The PDF files you upload, the chat messages you send while editing them, and basic technical data (like error logs) needed to operate the service. We don't require sign-up, so we don't collect account or profile information.",
  },
  {
    title: "2. How we use it",
    body: "Your files and messages are used solely to run the requested edit — including sending the relevant content to our AI provider to interpret your instructions — and to maintain version history so you can undo changes.",
  },
  // ========== REPLACED: Storage & Retention ==========
  {
    title: "3. Storage, Retention, and Session Definition",
    body: "Files are stored with our secure cloud infrastructure provider (currently AWS S3 / Google Cloud). A 'session' begins when you upload a file and ends when you close your browser tab or remain inactive for more than 60 minutes. Uploaded documents and their edit history are retained ONLY during this active session and are permanently purged from our servers immediately after the session ends. Older versions are automatically cleaned up and cannot be recovered.",
  },
  // ===================================================
  // ========== REPLACED: Sharing (Transparency) ==========
  {
    title: "4. Third-Party Providers (Transparency)",
    body: "We do not sell your data. To process your edits, we securely transmit your file content to our trusted AI partner: [e.g., Microsoft Azure OpenAI with a Zero-Data-Retention policy, meaning your file content is not logged or used to train their models]. Your file is also stored temporarily with our infrastructure provider (e.g., AWS S3). Both partners are contractually bound to process data only on our behalf and delete it immediately after processing.",
  },
  // ===================================================
  // ========== REPLACED: Security (Positive rewrite) ==========
  {
    title: "5. Enterprise-Grade Security",
    body: "All file uploads and downloads are encrypted in transit using TLS 1.2/1.3. Files are encrypted at rest using AES-256. Processing occurs in isolated, ephemeral compute environments that are destroyed after your session ends. We strictly limit internal access to our systems. If we ever identify a security incident, we will notify affected users via the contact email provided (or via this page). Your security is our priority.",
  },
  // ===================================================
  {
    title: "6. Your choices",
    body: "You can delete a document and its version history at any time from the workspace. Because no account is required, we have no way to locate your data without the document links themselves.",
  },
  {
    title: "7. Changes to this policy",
    body: "We'll update this page if how we handle data changes materially, and note the date at the top so you can check back.",
  },
  // ========== REPLACED: Contact ==========
  {
    title: "8. Contact Us",
    body: "Have questions or privacy requests (e.g., data deletion inquiry)? Please email us directly at: support@flowpdf.online. We respond to all privacy requests within 72 hours.",
  },
  // ========================================
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