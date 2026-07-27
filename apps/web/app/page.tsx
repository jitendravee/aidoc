// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Hero } from "@/components/home/hero";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";

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
    <main className="w-full">
      <div className="max-w-360 mx-auto px-4 md:px-8 xl:px-30 py-6 lg:py-8 ">
        <Hero onFilesSelected={handleFilesSelected} isUploading={uploadDocuments.isPending} />
      </div>
    </main>
  );
}