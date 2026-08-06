"use client";

import React, { useRef, useState } from "react";
import { CloudUpload, LockKeyhole, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import PasswordModal from "@/components/workspace/PasswordModal";
import { ACCEPTED_UPLOAD_TYPES } from "@/lib/types/api";
import { useDocumentUploadFlow } from "@/lib/hooks/useDocumentUploadFlow";

interface ToolUploadHeroProps {
  toolName: string; // must match TOOL_REGISTRY key, e.g. "rotate_pages"
  label: string; // short verb phrase, e.g. "Rotate"
  prompt: string; // small hint chip above the button
}

export function ToolUploadHero({ toolName, label, prompt }: ToolUploadHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const {
    isUploading,
    handleFilesSelected,
    pendingUploadPasswords,
    handleUploadPasswordSubmit,
    handleCancelUploadPassword,
    isSubmittingPassword,
    passwordError,
  } = useDocumentUploadFlow(toolName);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) handleFilesSelected(files);
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length > 0) handleFilesSelected(files);
  }

  return (
    <>
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragActive ? "border-primary/40 bg-primary/5" : "border-gray-200 bg-gray-50/60"
        }`}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <Text size="xs" weight="medium" className="text-blue-600">
            {prompt}
          </Text>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_UPLOAD_TYPES}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <Button prefixIcon={<CloudUpload />} size="lg" onClick={handleButtonClick} disabled={isUploading}>
          {isUploading ? "Uploading…" : `Upload PDF to ${label}`}
        </Button>

        <Text size="sm" color="text-secondary">
          {isDragActive ? "Drop your PDF here" : "or drag & drop your PDF here"}
        </Text>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="h-4 w-4 text-primary" />
            <Text size="xs" color="text-secondary">No sign up</Text>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <Text size="xs" color="text-secondary">Secure & private</Text>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary" />
            <Text size="xs" color="text-secondary">Free to use</Text>
          </div>
        </div>
      </section>

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