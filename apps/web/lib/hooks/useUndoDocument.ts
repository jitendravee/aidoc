// lib/hooks/useUndoDocument.ts
import { useMutation } from "@tanstack/react-query";
import { undoDocument } from "@/lib/api/documents";

export function useUndoDocument() {
  return useMutation({
    mutationFn: (documentId: string) => undoDocument(documentId),
  });
}