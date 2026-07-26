// lib/hooks/useUploadDocument.ts
import { useMutation } from "@tanstack/react-query";
import { uploadDocument } from "@/lib/api/documents";

export function useUploadDocument() {
  return useMutation({
    mutationFn: (file: File) => uploadDocument(file),
  });
}