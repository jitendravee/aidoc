// lib/types/api.ts
export interface WorkspaceDocument {
  document_id: string;
  filename: string;
  download_url: string;
  page_count: number;
}// lib/types/api.ts
export interface WorkspaceDocument {
  document_id: string;
  filename: string;
  download_url: string;
  page_count: number;
  can_undo?: boolean;
}