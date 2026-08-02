// lib/types/api.ts
export interface WorkspaceDocument {
  document_id: string;
  filename: string;
  download_url: string;
  page_count: number | null;
}// lib/types/api.ts
export type DocumentKind =
  | "pdf"
  | "image"
  | "pptx"
  | "docx" |"zip"
  | "xlsx";

export interface WorkspaceDocument {
  document_id: string;
  filename: string;
  download_url: string;

  kind: DocumentKind;

  page_count: number | null;

  can_undo: boolean;

  group_id: string | null;
  group_index: number | null;
  group_total: number | null;
}
export const ACCEPTED_UPLOAD_TYPES = ".pdf,.jpg,.jpeg,.png,.docx";