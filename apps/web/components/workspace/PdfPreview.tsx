import Text from "../ui/Text";
import { FileX2 } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";

export default function PdfPreview({ doc }: { doc: WorkspaceDocument | undefined }) {
  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <FileX2 className="size-8 text-text-secondary/40" />
        <Text size="sm" color="text-secondary">
          No document selected
        </Text>
      </div>
    );
  }

  if (!doc.download_url) {
    return (
      <div className="h-full w-full animate-pulse bg-surface-secondary" />
    );
  }

  return (
    <iframe key={doc.download_url} src={doc.download_url} className="h-full w-full" title={doc.filename} />
  );
}