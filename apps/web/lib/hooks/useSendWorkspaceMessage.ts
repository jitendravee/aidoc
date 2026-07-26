import { useMutation } from "@tanstack/react-query";
import { sendWorkspaceMessage } from "@/lib/api/messages";

export function useSendWorkspaceMessage(documentIds: string[]) {
  return useMutation({
    mutationFn: (message: string) => sendWorkspaceMessage(documentIds, message),
  });
}