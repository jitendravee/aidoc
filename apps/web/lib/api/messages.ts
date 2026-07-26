// lib/api/messages.ts
import { apiClient } from "./axiosClient";

export async function sendMessage(documentIds: string[], message: string) {
  const { data } = await apiClient.post("/workspace/messages", {
    message,
    document_ids: documentIds,
  });
  return data;
}