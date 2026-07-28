// lib/api/documents.ts
import { apiClient } from "./axiosClient";

export async function uploadMultipleDocuments(files: File[]) {
  const results = [];
  const passwordPrompts = [];

  for (const file of files) {
    const result = await uploadDocument(file);
    if (result.status === "password_required") {
      passwordPrompts.push(result); // { upload_token, filename }
    } else {
      results.push(result);
    }
  }

  return { results, passwordPrompts };
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
// lib/api/documents.ts
export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { status: "success", document_id, filename, download_url, page_count }
              // OR { status: "password_required", upload_token, filename }
}

export async function completeUpload(uploadToken: string, password: string) {
  const { data } = await apiClient.post("/documents/complete-upload", {
    upload_token: uploadToken,
    password,
  });
  return data;
}