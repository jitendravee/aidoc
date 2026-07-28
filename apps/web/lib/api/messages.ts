// lib/api/messages.ts
import { apiClient } from "./axiosClient";

export async function sendMessage(
  workspaceId: string,
  documentIds: string[],
  message: string
) {
  const { data } = await apiClient.post("/workspace/messages", {
    workspace_id: workspaceId,
    message,
    document_ids: documentIds,
  });

  return data;
}
export async function submitSecureAction(
  workspaceId: string,
  documentId: string,
  tool: string,
  password: string,
  pendingSteps: object[],
) {
  const { data } = await apiClient.post("/workspace/messages/secure", {
    workspace_id: workspaceId,
    document_id: documentId,
    tool,
    password,
    pending_steps: pendingSteps,
  });
  return data;
}