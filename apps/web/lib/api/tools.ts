// lib/api/tools.ts
import { apiClient } from "./axiosClient";

export async function getTools() {
  const { data } = await apiClient.get("/tools");
  return data.tools; // [{ name, label, description, category, available }]
}