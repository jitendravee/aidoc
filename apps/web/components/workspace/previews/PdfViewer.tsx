// components/workspace/previews/PdfViewer.tsx
import type { WorkspaceDocument } from "@/lib/types/api";

export default function PdfViewer({ doc }: { doc: WorkspaceDocument }) {
  return <iframe src={doc.download_url} title={doc.filename} className="h-full w-full" />;
}