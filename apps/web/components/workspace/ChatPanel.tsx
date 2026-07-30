import { useEffect, useRef } from "react";
import Text from "../ui/Text";
import Button from "../ui/Button";
import DocumentChip from "./DocumentChip";
import TypingIndicator from "./TypingIndicator";
import { ChevronsRight, Download, Send, Sparkles } from "lucide-react";
import type { WorkspaceDocument } from "@/lib/types/api";

export interface ChatEntry {
  role: "user" | "assistant";
  text: string;
  documents?: WorkspaceDocument[];
  timestamp?: string;
}
interface ChatPanelProps {
  history: ChatEntry[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  isSending: boolean;
  onViewDoc: (id: string) => void;
  onUndoDoc: (id: string) => void;
  isUndoing: boolean;
  onCollapse: () => void;
}

export default function ChatPanel({
  history,
  input,
  onInputChange,
  onSend,
  isSending,
  onViewDoc,
  onUndoDoc,
  isUndoing,
  onCollapse,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasSending = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, isSending]);

  useEffect(() => {
    if (wasSending.current && !isSending) {
      inputRef.current?.focus();
    }
    wasSending.current = isSending;
  }, [isSending]);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, isSending]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-4 text-primary" />
          <Text size="sm" weight="semibold" family="heading">
            FlowPDF AI
          </Text>
        </div>
        <button
          onClick={onCollapse}
          className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text"
          aria-label="Collapse chat panel"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {history.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center">
            <Text size="sm" weight="medium">
              Tell FlowPDF what to do
            </Text>
            <Text size="xs" color="text-secondary" className="max-w-[220px]">
              Try "rotate page 1 by 90°" or "merge these two PDFs"
            </Text>
          </div>
        )}

        {history.map((entry, i) => (
          <div
            key={i}
            className={`flex animate-message-in ${entry.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 ${
                entry.role === "user"
                  ? "bg-primary text-white"
                  : "bg-surface-secondary"
              }`}
            >
              <Text
                size="sm"
                color={entry.role === "user" ? "foreground" : "text"}
                className={entry.role === "user" ? "!text-white" : ""}
              >
                {entry.text}
              </Text>

              {entry.documents?.map((doc) => (
                  <DocumentChip
                  key={doc.document_id}
                    doc={doc}
                    onView={onViewDoc}
                    onUndo={onUndoDoc}
                    isUndoing={isUndoing}
                  />
              ))}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex animate-message-in justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask anything…"
          disabled={isSending}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        <Button
          size="md"
          onClick={onSend}
          disabled={isSending}
          prefixIcon={<Send />}
          className="px-3"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
