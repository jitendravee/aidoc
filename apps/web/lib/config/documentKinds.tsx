// lib/config/documentKinds.tsx
import type { ComponentType } from "react";
import {
  FileText,
  Image as ImageIcon,
  Presentation,
  FileSpreadsheet,
  FileType2,
} from "lucide-react";
import type { DocumentKind, WorkspaceDocument } from "@/lib/types/api";
import PdfViewer from "@/components/workspace/previews/PdfViewer";
import ImageViewer from "@/components/workspace/previews/ImageViewer";
import UnsupportedPreview from "@/components/workspace/previews/UnsupportedPreview";

interface DocumentKindConfig {
  label: string;
  icon: typeof FileText;
  Preview: ComponentType<{ doc: WorkspaceDocument }>;
}

// Add a new kind here — nothing else in the app needs to change.
export const DOCUMENT_KIND_CONFIG: Record<DocumentKind, DocumentKindConfig> = {
  pdf: { label: "PDF", icon: FileText, Preview: PdfViewer },
  image: { label: "Image", icon: ImageIcon, Preview: ImageViewer },
  pptx: {
    label: "PowerPoint",
    icon: Presentation,
    Preview: UnsupportedPreview,
  },
  docx: { label: "Word", icon: FileType2, Preview: UnsupportedPreview },
  xlsx: { label: "Excel", icon: FileSpreadsheet, Preview: UnsupportedPreview },
  zip: { label: "Zip", icon: FileSpreadsheet, Preview: UnsupportedPreview },
};
