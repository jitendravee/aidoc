// components/workspace/DocumentPreview.tsx
"use client";

import { useRef } from "react";
import Text from "../ui/Text";
import { FileX2, Upload, Loader2 } from "lucide-react";
import { ACCEPTED_UPLOAD_TYPES, type WorkspaceDocument } from "@/lib/types/api";
import { DOCUMENT_KIND_CONFIG } from "@/lib/config/documentKinds";

interface DocumentPreviewProps {
  doc: WorkspaceDocument | undefined;
  onAddFiles?: (files: File[]) => void;
  isAdding?: boolean;
}

export default function DocumentPreview({ doc, onAddFiles, isAdding }: DocumentPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <FileX2 className="size-8 text-text-secondary/40" />
        <Text size="sm" color="text-secondary">
          No document selected
        </Text>

        {onAddFiles && (
          <>
            <input
              ref={inputRef}
              type="file"
    accept={ACCEPTED_UPLOAD_TYPES}
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) onAddFiles(files);
                e.target.value = ""; // allow re-selecting the same file(s) later
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isAdding}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {isAdding ? "Uploading…" : "Upload a document"}
            </button>
          </>
        )}
      </div>
    );
  }

  if (!doc.download_url) {
    return <div className="h-full w-full animate-pulse bg-surface-secondary" />;
  }

  const { Preview } = DOCUMENT_KIND_CONFIG[doc.kind];
  return <Preview doc={doc} />;
}