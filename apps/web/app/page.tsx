// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";
import { completeUpload } from "@/lib/api/documents";
import PasswordModal from "@/components/workspace/PasswordModal";

interface PendingUploadPassword {
  uploadToken: string;
  filename: string;
}

export default function Page() {
  const router = useRouter();
  const uploadDocuments = useUploadMultipleDocuments();

  const [pendingUploadPasswords, setPendingUploadPasswords] = useState<PendingUploadPassword[]>([]);
  const [resolvedUploads, setResolvedUploads] = useState<any[]>([]);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  function handleFilesSelected(files: File[]) {
    uploadDocuments.mutate(files, {
      onSuccess: ({ results, passwordPrompts }) => {
        setResolvedUploads(results);
        if (passwordPrompts.length > 0) {
          setPendingUploadPasswords(
            passwordPrompts.map((p: any) => ({ uploadToken: p.upload_token, filename: p.filename }))
          );
        } else {
          const ids = results.map((r: any) => r.document_id);
          router.push(`/workspace?ids=${ids.join(",")}`);
        }
      },
    });
  }

  async function handleUploadPasswordSubmit(password: string) {
    const current = pendingUploadPasswords[0];
    setIsSubmittingPassword(true);
    setPasswordError(undefined);

    const result = await completeUpload(current.uploadToken, password);
    setIsSubmittingPassword(false);

    if (result.status === "error") {
      setPasswordError(result.message);
      setPendingUploadPasswords((prev) => [
        { uploadToken: result.upload_token, filename: current.filename },
        ...prev.slice(1),
      ]);
      return;
    }

    const remaining = pendingUploadPasswords.slice(1);
    const allResolved = [...resolvedUploads, result];
    setResolvedUploads(allResolved);
    setPendingUploadPasswords(remaining);

    if (remaining.length === 0) {
      const ids = allResolved.map((r) => r.document_id);
      router.push(`/workspace?ids=${ids.join(",")}`);
    }
  }

  function handleCancelUploadPassword() {
    setPendingUploadPasswords((prev) => prev.slice(1));
    setPasswordError(undefined);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FlowPDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://flowpdf.online",
            description:
              "Edit PDFs by chatting in plain English — rotate, delete, and merge pages with no sign-up required.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <main className="w-full">
        <div className="max-w-360 mx-auto px-4 md:px-8 xl:px-30 py-6 lg:py-8 ">
          <Hero onFilesSelected={handleFilesSelected} isUploading={uploadDocuments.isPending} />
          <HowItWorks />
        </div>
      </main>

      {pendingUploadPasswords.length > 0 && (
        <PasswordModal
          tool="unlock_pdf"
          onSubmit={handleUploadPasswordSubmit}
          onCancel={handleCancelUploadPassword}
          isSubmitting={isSubmittingPassword}
          error={passwordError}
        />
      )}
    </>
  );
}