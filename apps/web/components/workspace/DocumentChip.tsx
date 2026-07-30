import Text from "../ui/Text";
import Button from "../ui/Button";
import { Download, FileText, Undo2 } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";

interface DocumentChipProps {
  doc: WorkspaceDocument;
  onView: (id: string) => void;
  onUndo: (id: string) => void;
  isUndoing: boolean;
}

export default function DocumentChip({
  doc,
  onView,
  onUndo,
  isUndoing,
}: DocumentChipProps) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <FileText className="size-3.5 shrink-0 text-primary" />
        <div className="min-w-0">
          <Text size="xs" weight="medium" truncate>
            {doc.filename}
          </Text>
          <Text size="2xs" color="text-secondary">
            {doc.page_count} {doc.page_count === 1 ? "page" : "pages"}
          </Text>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {doc.download_url && (
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = doc.download_url;
              a.download = doc.filename;
              a.click();
            }}
            className="rounded-md p-1.5 cursor-pointer text-text-secondary transition-colors hover:bg-surface-secondary hover:text-primary"
            aria-label={`Download ${doc.filename}`}
            title={`Download ${doc.filename}`}
          >
            <Download className="size-3.5" />
          </button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => onView(doc.document_id)}
        >
          View
        </Button>
        {doc.can_undo && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-text-secondary hover:text-error"
            prefixIcon={<Undo2 />}
            onClick={() => onUndo(doc.document_id)}
            disabled={isUndoing}
          >
            Undo
          </Button>
        )}
      </div>
    </div>
  );
}
