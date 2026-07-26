// lib/hooks/useSendMessage.ts
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api/messages";

export function useSendMessage(documentIds: string[]) {
  return useMutation({
    mutationFn: (message: string) => sendMessage(documentIds, message),
  });
}