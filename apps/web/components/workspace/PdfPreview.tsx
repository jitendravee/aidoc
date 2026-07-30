// components/workspace/PdfPreview.tsx → rename to DocumentPreview.tsx
import Text from "../ui/Text";
import { FileX2 } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";
import { DOCUMENT_KIND_CONFIG } from "@/lib/config/documentKinds";

export default function DocumentPreview({ doc }: { doc: WorkspaceDocument | undefined }) {
  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <FileX2 className="size-8 text-text-secondary/40" />
        <Text size="sm" color="text-secondary">No document selected</Text>
      </div>
    );
  }

  if (!doc.download_url) {
    return <div className="h-full w-full animate-pulse bg-surface-secondary" />;
  }

  const { Preview } = DOCUMENT_KIND_CONFIG[doc.kind];
  return <Preview doc={doc} />;
}