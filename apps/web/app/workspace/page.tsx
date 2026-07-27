// app/workspace/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSendMessage } from "@/lib/hooks/useSendMessage";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";
import type { WorkspaceDocument } from "@/lib/types/api";
import { getDocument } from "@/lib/api/documents";
import { useUndoDocument } from "@/lib/hooks/useUndoDocument";

interface ChatEntry {
  role: "user" | "assistant";
  text: string;
  documents?: WorkspaceDocument[]; // was: downloadUrl?: string
}
// app/workspace/page.tsx — key changes

export default function WorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIds = (searchParams.get("ids") ?? "").split(",").filter(Boolean);

  const [isHydrating, setIsHydrating] = useState(true);

  const [documents, setDocuments] = useState<WorkspaceDocument[]>(
    initialIds.map((id) => ({
      document_id: id,
      filename: "Document",
      download_url: "",
      page_count: 0,
    })),
  );
  const [activeDocId, setActiveDocId] = useState<string | null>(
    initialIds[0] ?? null,
  );

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatEntry[]>([]);

  const documentIds = documents.map((d) => d.document_id);
  const sendMessage = useSendMessage(documentIds);
  const addDocuments = useUploadMultipleDocuments();
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const undoDocument = useUndoDocument();

  function handleUndo(documentId: string) {
    undoDocument.mutate(documentId, {
      onSuccess: (reverted) => {
        setDocuments((prev) =>
          prev.map((d) => (d.document_id === documentId ? reverted : d)),
        );
        setActiveDocId(documentId);
        setHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Reverted "${reverted.filename}" to its previous version.`,
          },
        ]);
      },
    });
  }
  function syncWorkspaceUrl(docs: WorkspaceDocument[]) {
    const ids = docs.map((d) => d.document_id);
    router.replace(`/workspace?ids=${ids.join(",")}`);
  }
  useEffect(() => {
    async function hydrate() {
      if (initialIds.length === 0) {
        setIsHydrating(false);
        return;
      }
      const fetched = await Promise.all(
        initialIds.map((id) => getDocument(id)),
      );
      setDocuments(fetched);
      setActiveDocId(fetched[0]?.document_id ?? null);
      setIsHydrating(false);
    }
    hydrate();
    // intentionally only on mount — subsequent state changes come from
    // sendMessage/add-file responses, not from re-reading the URL
  }, []);
  function handleSend() {
    if (!input.trim()) return;
    const userMessage = input;
    setHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    sendMessage.mutate(userMessage, {
      onSuccess: (data) => {
        if (data.status === "success") {
          const newDocs: WorkspaceDocument[] = data.documents;
          setDocuments(newDocs);
          syncWorkspaceUrl(newDocs);
          setActiveDocId(newDocs[0]?.document_id ?? null);

          setHistory((prev) => [
            ...prev,
            { role: "assistant", text: data.diff_summary, documents: newDocs },
          ]);
        } else if (data.status === "clarification_needed") {
          setHistory((prev) => [
            ...prev,
            { role: "assistant", text: data.question },
          ]);
        } else {
          setHistory((prev) => [
            ...prev,
            { role: "assistant", text: `Error: ${data.message}` },
          ]);
        }
      },
      onError: (error) => {
        setHistory((prev) => [
          ...prev,
          { role: "assistant", text: `Request failed: ${error.message}` },
        ]);
      },
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    addDocuments.mutate(files, {
      onSuccess: (results) => {
        const newDocs: WorkspaceDocument[] = results.map((r) => ({
          document_id: r.document_id,
          filename: r.filename,
          download_url: r.download_url,
          page_count: r.page_count,
        }));
        setDocuments((prev) => {
          const updated = [...prev, ...newDocs];
          syncWorkspaceUrl(updated);
          return updated;
        });
        setActiveDocId(newDocs[0].document_id);
      },
    });
  }
  if (isHydrating) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        Loading workspace…
      </div>
    );
  }
  const activeDoc = documents.find((d) => d.document_id === activeDocId);

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* LEFT: document preview with tabs */}
      <div className="flex w-2/3 flex-col rounded-xl border border-gray-200">
        <div className="flex items-center gap-1 border-b border-gray-200 p-2">
          {documents.map((doc) => (
            <button
              key={doc.document_id}
              onClick={() => setActiveDocId(doc.document_id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                doc.document_id === activeDocId
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              📄 <span className="max-w-[140px] truncate">{doc.filename}</span>
            </button>
          ))}

          <input
            ref={addFileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleAddFiles}
            className="hidden"
          />
          <button
            onClick={() => addFileInputRef.current?.click()}
            disabled={addDocuments.isPending}
            className="ml-auto rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 hover:border-gray-400"
          >
            {addDocuments.isPending ? "Adding…" : "+ Add PDF"}
          </button>
        </div>

        <div className="flex-1 bg-gray-50">
          {activeDoc?.download_url ? (
            <iframe
              src={activeDoc.download_url}
              className="h-full w-full"
              title={activeDoc.filename}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No preview available
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: chat */}
      <div className="flex w-1/3 flex-col rounded-xl border border-gray-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">FlowPDF AI</h2>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {history.map((entry, i) => (
            <div
              key={i}
              className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  entry.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p>{entry.text}</p>

                {entry.documents?.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <iframe
                      src={doc.download_url}
                      title={doc.filename}
                      className="h-40 w-full"
                    />
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="truncate text-xs text-gray-500">
                        {doc.filename}
                      </span>
                      <div className="flex gap-2">
                        <a
                          href={doc.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Open
                        </a>
                        {doc.can_undo && (
                          <button
                            onClick={() => handleUndo(doc.document_id)}
                            disabled={undoDocument.isPending}
                            className="text-xs font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"
                          >
                            Undo this
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {sendMessage.isPending && (
            <p className="text-sm text-gray-400">Thinking…</p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything…"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sendMessage.isPending}
          />
          <button
            onClick={handleSend}
            disabled={sendMessage.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
