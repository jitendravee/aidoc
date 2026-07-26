// lib/api/messages.ts
import { apiClient } from "./axiosClient";

export async function sendMessage(documentId: string, message: string) {
  const { data } = await apiClient.post(`/documents/${documentId}/messages`, { message });
  return data;
}

export async function sendWorkspaceMessage(documentIds: string[], message: string) {
  const { data } = await apiClient.post("/workspace/messages", {
    message,
    document_ids: documentIds,
  });
  return data; // { status, document_id, download_url, diff_summary }
}