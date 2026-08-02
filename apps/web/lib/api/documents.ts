// lib/api/documents.ts
import { apiClient } from "./axiosClient";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const isImageFile = (file: File) =>
  IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
  // { status: "success", document_id, filename, download_url, kind, page_count, can_undo, group_id, group_index, group_total }
  // OR { status: "password_required", upload_token, filename }
}

// Bundles N image files into ONE zip document server-side — one request,
// one storage object, one DB row — instead of uploading each image
// individually. Use this whenever more than one image is selected at once.
export async function uploadImagesBatch(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await apiClient.post("/documents/batch-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
  // { status: "success", document_id, filename, download_url, kind: "zip", page_count: null, ..., image_count }
}

export async function completeUpload(uploadToken: string, password: string) {
  const { data } = await apiClient.post("/documents/complete-upload", {
    upload_token: uploadToken,
    password,
  });
  return data;
}

export async function getDocument(documentId: string) {
  const { data } = await apiClient.get(`/documents/${documentId}`);
  return data; // { document_id, filename, download_url, kind, page_count, can_undo, group_id, group_index, group_total }
}

export async function undoDocument(documentId: string) {
  const { data } = await apiClient.post(`/documents/${documentId}/undo`);
  return data; // { document_id, filename, download_url, kind, page_count, can_undo, group_id, group_index, group_total }
}

// Uploads a mixed batch of files picked in one go:
// - a single image just goes through the normal single-document upload
// - 2+ images get zipped server-side into one document via uploadImagesBatch
// - everything else (pdf, etc.) uploads individually as before
export async function uploadMultipleDocuments(files: File[]) {
  const results: any[] = [];
  const passwordPrompts: any[] = [];

  const images = files.filter(isImageFile);
  const others = files.filter((f) => !isImageFile(f));

  if (images.length === 1) {
    others.push(images[0]);
  } else if (images.length > 1) {
    const batchResult = await uploadImagesBatch(images);
    if (batchResult.status === "success") {
      results.push(batchResult);
    }
    // batch-images has no password_required path — images are never encrypted
  }

  for (const file of others) {
    const result = await uploadDocument(file);
    if (result.status === "password_required") {
      passwordPrompts.push(result); // { upload_token, filename }
    } else if (result.status === "success") {
      results.push(result);
    }
  }

  return { results, passwordPrompts };
}