// lib/api/messages.ts
import { apiClient } from "./axiosClient";

export async function sendMessage(  workspaceId: string,documentIds: string[], message: string) {
  const { data } = await apiClient.post("/workspace/messages", {      workspace_id: workspaceId,

    message,
    document_ids: documentIds,
  });
  return data; // { status, documents?, diff_summary, question?, message? }
}