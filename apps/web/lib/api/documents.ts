// lib/api/documents.ts
import { apiClient } from "./axiosClient";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { document_id, download_url, page_count }
}

export async function uploadMultipleDocuments(files: File[]) {
  // upload sequentially, not Promise.all — avoids hammering the API
  // with N simultaneous large file uploads from one user action
  const results = [];
  for (const file of files) {
    const result = await uploadDocument(file);
    results.push({ ...result, filename: file.name });
  }
  return results; // [{ document_id, download_url, page_count, filename }, ...]
}
// lib/api/documents.ts — add this
export async function getDocument(documentId: string) {
  const { data } = await apiClient.get(`/documents/${documentId}`);
  return data; // { document_id, filename, download_url, page_count }
}
// lib/api/documents.ts — add
export async function undoDocument(documentId: string) {
  const { data } = await apiClient.post(`/documents/${documentId}/undo`);
  return data; // { document_id, filename, download_url, page_count, can_undo }
}