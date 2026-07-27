import Text from "../../ui/Text";
import { CheckCheck, CheckCircle2, Download } from "lucide-react";
import type { ChatEntry } from "../ChatPanel";

export default function MobileChatBubble({
  entry,
  onDownload,
}: {
  entry: ChatEntry;
  onDownload: (url: string, filename: string) => void;
}) {
  const isUser = entry.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${isUser ? "bg-primary/10" : "border border-border bg-surface"}`}>
        <div className="flex items-start gap-2">
          {!isUser && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />}
          <Text size="sm">{entry.text}</Text>
        </div>

        {entry.documents?.map((doc) =>
          doc.download_url ? (
            <button
              key={doc.document_id}
              onClick={() => onDownload(doc.download_url, doc.filename)}
              className="mt-2 flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5"
            >
              <Download className="size-3.5 text-primary" />
              <Text size="xs" color="primary" weight="medium">Download {doc.filename}</Text>
            </button>
          ) : null,
        )}

        <div className="mt-1 flex items-center justify-end gap-1">
          <Text size="3xs" color="text-secondary">{entry.timestamp}</Text>
          {isUser && <CheckCheck className="size-3 text-primary" />}
        </div>
      </div>
    </div>
  );
}