import { useMutation } from "@tanstack/react-query";
import { submitSecureAction } from "@/lib/api/messages";

// lib/hooks/useSubmitSecureAction.ts
export function useSubmitSecureAction(workspaceId: string) {
  return useMutation({
    mutationFn: (params: { documentId: string; tool: string; password: string; pendingSteps: object[] }) =>
      submitSecureAction(workspaceId, params.documentId, params.tool, params.password, params.pendingSteps),
  });
}