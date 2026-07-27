import { useState } from "react";
import Text from "../../ui/Text";
import { FileText, MoreHorizontal, Plus } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";

interface MobileDocStripProps {
  activeDoc: WorkspaceDocument | undefined;
  documents: WorkspaceDocument[];
  onSelect: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  isAdding: boolean;
}

export default function MobileDocStrip({
  activeDoc,
  documents,
  onSelect,
  onAddFiles,
  isAdding,
}: MobileDocStripProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative border-b border-border bg-surface px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-error/10">
          <FileText className="size-4 text-error" />
        </div>
        <Text size="sm" weight="medium" truncate className="flex-1">
          {activeDoc?.filename ?? "No document"}
        </Text>
        {activeDoc && (
          <Text size="xs" color="text-secondary" className="shrink-0">
            {activeDoc.page_count} pages
          </Text>
        )}
        <div className="h-4 w-px bg-border" />
        <button onClick={() => setMenuOpen((v) => !v)} className="p-1 text-text-secondary" aria-label="Document options">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-full z-20 mt-1 w-56 rounded-lg border border-border bg-surface p-1.5 shadow-lg">
          {documents.map((d) => (
            <button
              key={d.document_id}
              onClick={() => {
                onSelect(d.document_id);
                setMenuOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left ${
                d.document_id === activeDoc?.document_id ? "bg-primary/5" : "hover:bg-surface-secondary"
              }`}
            >
              <FileText className="size-3.5 shrink-0 text-text-secondary" />
              <Text size="xs" truncate>{d.filename}</Text>
            </button>
          ))}
          <label className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-primary hover:bg-primary/5">
            <Plus className="size-3.5" />
            <Text size="xs" color="primary">{isAdding ? "Adding…" : "Add PDF"}</Text>
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                setMenuOpen(false);
                if (files.length) onAddFiles(files);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}