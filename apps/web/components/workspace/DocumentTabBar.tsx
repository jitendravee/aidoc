import { useRef } from "react";
import Text from "../ui/Text";
import { FileText, Plus, Loader2 } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";

interface DocumentTabBarProps {
  documents: WorkspaceDocument[];
  activeDocId: string | null;
  onSelect: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  isAdding: boolean;
}

export default function DocumentTabBar({
  documents,
  activeDocId,
  onSelect,
  onAddFiles,
  isAdding,
}: DocumentTabBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-2 py-1.5">
      {documents.map((doc) => {
        const isActive = doc.document_id === activeDocId;
        return (
          <button
            key={doc.document_id}
            onClick={() => onSelect(doc.document_id)}
            className={`group flex shrink-0 items-center gap-1.5 rounded-t-md border-b-2 px-3 py-2 transition-colors ${
              isActive
                ? "border-primary bg-primary/5"
                : "border-transparent hover:bg-surface-secondary"
            }`}
          >
            <FileText
              className={`size-3.5 shrink-0 ${isActive ? "text-primary" : "text-text-secondary"}`}
            />
            <Text
              size="xs"
              weight={isActive ? "medium" : "normal"}
              color={isActive ? "primary" : "text-secondary"}
              className="max-w-[140px] truncate"
            >
              {doc.filename}
            </Text>
          </button>
        );
      })}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onAddFiles(files);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isAdding}
        className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
      >
        {isAdding ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Plus className="size-3.5" />
        )}
        <Text
          size="xs"
          color="text-secondary"
          className={isAdding ? "" : "group-hover:text-primary"}
        >
          {isAdding ? "Adding…" : "Add File"}
        </Text>
      </button>
    </div>
  );
}
