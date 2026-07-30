// components/workspace/previews/UnsupportedPreview.tsx
import Text from "@/components/ui/Text";
import { FileWarning } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";

export default function UnsupportedPreview({ doc }: { doc: WorkspaceDocument }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <FileWarning className="size-8 text-text-secondary/40" />
      <Text size="sm" color="text-secondary">
        No preview available — download to view {doc.filename}
      </Text>
      <a href={doc.download_url} download={doc.filename} className="text-sm text-primary underline">
        Download
      </a>
    </div>
  );
}