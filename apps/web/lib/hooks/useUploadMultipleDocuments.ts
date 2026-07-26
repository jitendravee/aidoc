import { useMutation } from "@tanstack/react-query";
import { uploadMultipleDocuments } from "@/lib/api/documents";

export function useUploadMultipleDocuments() {
  return useMutation({
    mutationFn: (files: File[]) => uploadMultipleDocuments(files),
  });
}