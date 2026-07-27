// lib/hooks/useSendWorkspaceMessage.ts
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api/messages";

export function useSendMessage(workspaceId: string, documentIds: string[]) {
  return useMutation({
    mutationFn: (message: string) => sendMessage(workspaceId, documentIds, message),
  });
}