// components/workspace/previews/ImageViewer.tsx
import type { WorkspaceDocument } from "@/lib/types/api";

export default function ImageViewer({ doc }: { doc: WorkspaceDocument }) {
  return <img src={doc.download_url} alt={doc.filename} className="h-full w-full object-contain" />;
}