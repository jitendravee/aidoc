// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const uploadDocuments = useUploadMultipleDocuments();
function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const newFiles = Array.from(e.target.files ?? []);

  setFiles((prev) => {
    // avoid duplicate entries if the same file gets picked twice
    const combined = [...prev, ...newFiles];
    const seen = new Set<string>();
    return combined.filter((f) => {
      const key = `${f.name}-${f.size}-${f.lastModified}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });

  e.target.value = ""; // reset so picking the same file again still fires onChange
}
  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleUpload() {
    if (files.length === 0) return;

    uploadDocuments.mutate(files, {
      onSuccess: (results) => {
        const ids = results.map((r) => r.document_id);
        if (ids.length === 1) {
          router.push(`/documents/${ids[0]}`);
        } else {
          router.push(`/workspace?ids=${ids.join(",")}`);
        }
      },
    });
  }

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-lg font-semibold">Upload PDF(s)</h1>

      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="w-full text-sm"
      />

      {files.length > 0 && (
        <ul className="w-full space-y-1 text-sm text-gray-600">
          {files.map((file, i) => (
            <li key={i} className="flex items-center justify-between rounded bg-gray-50 px-2 py-1">
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="ml-2 text-xs text-red-500 hover:underline"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploadDocuments.isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {uploadDocuments.isPending
          ? `Uploading ${files.length} file(s)…`
          : `Upload ${files.length || ""} & Start Editing`}
      </button>

      {uploadDocuments.isError && (
        <p className="text-sm text-red-600">
          Upload failed: {uploadDocuments.error.message}
        </p>
      )}
    </div>
  );
}