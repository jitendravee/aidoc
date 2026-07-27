import { useEffect, useRef } from "react";
import Text from "../../ui/Text";
import MobileChatBubble from "./MobileChatBubble";
import TypingIndicator from "../TypingIndicator";
import { ChevronDown, ChevronUp, Send, Sparkles } from "lucide-react";
import type { ChatEntry } from "../ChatPanel";

interface MobileChatSheetProps {
  history: ChatEntry[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  isSending: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

export default function MobileChatSheet({
  history,
  input,
  onInputChange,
  onSend,
  isSending,
  expanded,
  onToggleExpand,
}: MobileChatSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, isSending, expanded]);

  function handleDownload(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  return (
    <div
      className={`absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t border-border bg-surface shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-[height] duration-300 ease-out ${
        expanded ? "h-[70%]" : "h-[15%]"
      }`}
    >
      <button
        onClick={onToggleExpand}
        className="flex items-center justify-between px-4 pt-3 pb-2"
        aria-label={expanded ? "Collapse chat" : "Expand chat"}
      >
        <div className="flex items-center gap-2 text-left">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <Text size="sm" weight="semibold">FlowPDF AI</Text>
            <Text size="2xs" color="text-secondary">Ask anything about your PDF</Text>
          </div>
        </div>
        {expanded ? <ChevronDown className="size-4 text-text-secondary" /> : <ChevronUp className="size-4 text-text-secondary" />}
      </button>

      {expanded && (
        <>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-2">
            {history.map((entry, i) => (
              <div key={i} className="animate-message-in">
                <MobileChatBubble entry={entry} onDownload={handleDownload} />
              </div>
            ))}
            {isSending && <TypingIndicator />}
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Ask anything…"
              disabled={isSending}
              className="flex-1 rounded-full border border-border bg-surface-secondary px-4 py-2.5 text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            <button
              onClick={onSend}
              disabled={isSending}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}