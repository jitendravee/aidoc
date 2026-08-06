"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";
import { completeUpload } from "@/lib/api/documents";

interface PendingUploadPassword {
  uploadToken: string;
  filename: string;
}

export function useDocumentUploadFlow(toolName?: string) {
  const router = useRouter();
  const uploadDocuments = useUploadMultipleDocuments();

  const [pendingUploadPasswords, setPendingUploadPasswords] = useState<PendingUploadPassword[]>([]);
  const [resolvedUploads, setResolvedUploads] = useState<any[]>([]);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  function goToWorkspace(ids: string[]) {
    const params = new URLSearchParams({ ids: ids.join(",") });
    if (toolName) params.set("tool", toolName);
    router.push(`/workspace?${params.toString()}`);
  }

  function handleFilesSelected(files: File[]) {
    uploadDocuments.mutate(files, {
      onSuccess: ({ results, passwordPrompts }) => {
        setResolvedUploads(results);
        if (passwordPrompts.length > 0) {
          setPendingUploadPasswords(
            passwordPrompts.map((p: any) => ({ uploadToken: p.upload_token, filename: p.filename }))
          );
        } else {
          goToWorkspace(results.map((r: any) => r.document_id));
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
      goToWorkspace(allResolved.map((r) => r.document_id));
    }
  }

  function handleCancelUploadPassword() {
    setPendingUploadPasswords((prev) => prev.slice(1));
    setPasswordError(undefined);
  }

  return {
    isUploading: uploadDocuments.isPending,
    handleFilesSelected,
    pendingUploadPasswords,
    handleUploadPasswordSubmit,
    handleCancelUploadPassword,
    isSubmittingPassword,
    passwordError,
  };
}