// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Hero } from "@/components/home/hero";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function Page() {
  const router = useRouter();
  const uploadDocuments = useUploadMultipleDocuments();

  function handleFilesSelected(files: File[]) {
    uploadDocuments.mutate(files, {
      onSuccess: (results) => {
        const ids = results.map((r) => r.document_id);
        router.push(`/workspace?ids=${ids.join(",")}`);
      },
    });
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
    </>

  );
}