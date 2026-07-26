// app/workspace/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSendMessage } from "@/lib/hooks/useSendWorkspaceMessage";

interface ChatEntry {
  role: "user" | "assistant";
  text: string;
  downloadUrl?: string;
}

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const documentIds = idsParam.split(",").filter(Boolean);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatEntry[]>([]);

  const sendMessage = useSendMessage(documentIds);

  function handleSend() {
    if (!input.trim()) return;

    const userMessage = input;
    setHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    sendMessage.mutate(userMessage, {
      onSuccess: (data) => {
        if (data.status === "success") {
          setHistory((prev) => [
            ...prev,
            { role: "assistant", text: data.diff_summary, downloadUrl: data.download_url },
          ]);
        } else if (data.status === "clarification_needed") {
          setHistory((prev) => [...prev, { role: "assistant", text: data.question }]);
        } else {
          setHistory((prev) => [...prev, { role: "assistant", text: `Error: ${data.message}` }]);
        }
      },
      onError: (error) => {
        setHistory((prev) => [...prev, { role: "assistant", text: `Request failed: ${error.message}` }]);
      },
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col p-4">
      <h1 className="mb-1 text-lg font-semibold">Workspace</h1>
      <p className="mb-4 text-sm text-gray-500">
        {documentIds.length} document(s) loaded:
        <span className="block break-all text-xs text-gray-400">{documentIds.join(", ")}</span>
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-gray-200 p-4">
        {history.length === 0 && (
          <p className="text-sm text-gray-400">
            Try: &quot;delete page 2 of the first document, rotate page 4 of the
            second by 90 degrees, then merge both&quot;
          </p>
        )}

        {history.map((entry, i) => (
          <div key={i} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                entry.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <p>{entry.text}</p>
              {entry.downloadUrl && (
                <a
                  href={entry.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-medium underline"
                >
                  Download result
                </a>
              )}
            </div>
          </div>
        ))}

        {sendMessage.isPending && <p className="text-sm text-gray-400">Thinking…</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an edit request across your documents…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sendMessage.isPending || documentIds.length === 0}
        />
        <button
          onClick={handleSend}
          disabled={sendMessage.isPending || documentIds.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}