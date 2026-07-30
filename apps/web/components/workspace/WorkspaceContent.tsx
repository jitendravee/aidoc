"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSendMessage } from "@/lib/hooks/useSendMessage";
import { useUploadMultipleDocuments } from "@/lib/hooks/useUploadMultipleDocuments";
import { useUndoDocument } from "@/lib/hooks/useUndoDocument";
import { completeUpload, getDocument } from "@/lib/api/documents";
import type { WorkspaceDocument } from "@/lib/types/api";
import DocumentTabBar from "@/components/workspace/DocumentTabBar";
import PdfPreview from "@/components/workspace/PdfPreview";
import ChatPanel, { ChatEntry } from "@/components/workspace/ChatPanel";
import Text from "@/components/ui/Text";
import { ChevronsLeft, Loader2 } from "lucide-react";
import MobileTabBar, {
  MobileTab,
} from "@/components/workspace/mobile/MobileTabBar";
import MobileDocStrip from "@/components/workspace/mobile/MobileDocStrip";
import MobileChatSheet from "@/components/workspace/mobile/MobileChatSheet";
import { useSubmitSecureAction } from "@/lib/hooks/useSubmitSecureAction";
import PasswordModal from "./PasswordModal";

const MIN_CHAT_PCT = 24;
const MAX_CHAT_PCT = 46;
const DEFAULT_CHAT_PCT = 34;

interface PendingUploadPassword {
  uploadToken: string;
  filename: string;
}
export default function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIds = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [chatExpanded, setChatExpanded] = useState(true);
  const [isHydrating, setIsHydrating] = useState(true);
  const [documents, setDocuments] = useState<WorkspaceDocument[]>(
    initialIds.map((id) => ({
      document_id: id,
      filename: "Document",
      download_url: "",

      kind: "pdf", // placeholder until real metadata is loaded
      page_count: null,

      can_undo: false,

      group_id: null,
      group_index: null,
      group_total: null,
    })),
  );
  const [activeDocId, setActiveDocId] = useState<string | null>(
    initialIds[0] ?? null,
  );
  const [pendingUploadPasswords, setPendingUploadPasswords] = useState<
    PendingUploadPassword[]
  >([]);

  const [isSubmittingUploadPassword, setIsSubmittingUploadPassword] =
    useState(false);
  const [uploadPasswordError, setUploadPasswordError] = useState<
    string | undefined
  >(undefined);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [chatPct, setChatPct] = useState(DEFAULT_CHAT_PCT);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [workspaceId] = useState<string>(
    () => searchParams.get("wsid") ?? crypto.randomUUID(),
  );
  const documentIds = documents.map((d) => d.document_id);
  const sendMessage = useSendMessage(workspaceId, documentIds);
  const addDocuments = useUploadMultipleDocuments();
  const undoDocument = useUndoDocument();
  const [pendingSecureAction, setPendingSecureAction] = useState<{
    tool: "protect_pdf" | "unlock_pdf";
    documentId: string;
    pendingSteps: object[];
  } | null>(null);

  const secureAction = useSubmitSecureAction(workspaceId);
  function syncWorkspaceUrl(docs: WorkspaceDocument[]) {
    router.replace(
      `/workspace?ids=${docs.map((d) => d.document_id).join(",")}&wsid=${workspaceId}`,
    );
  }
  function timestamp() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
  }, []);

  // --- resizable divider ---
  const onDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((rect.right - e.clientX) / rect.width) * 100;
    setChatPct(Math.min(MAX_CHAT_PCT, Math.max(MIN_CHAT_PCT, pct)));
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
  }, [onDragMove]);

  function onDragStart() {
    isDragging.current = true;
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  }

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
  function handleSecureSubmit(password: string) {
    if (!pendingSecureAction) return;
    secureAction.mutate(
      {
        documentId: pendingSecureAction.documentId,
        tool: pendingSecureAction.tool,
        password,
        pendingSteps: pendingSecureAction.pendingSteps,
      },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setDocuments(data.documents);
            syncWorkspaceUrl(data.documents);
            setHistory((prev) => [
              ...prev,
              {
                role: "assistant",
                text: data.diff_summary,
                documents: data.documents,
              },
            ]);
            setPendingSecureAction(null);
          }
          // on failure, keep the modal open so they can retry with a different password
        },
      },
    );
  }
  function handleSend() {
    if (!input.trim()) return;
    const userMessage = input;
    setHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

   sendMessage.mutate(userMessage, {
  onSuccess: (data) => {
    if (data.status === "password_required") {
      setPendingSecureAction({
        tool: data.tool,
        documentId: data.document_id,
        pendingSteps: data.pending_steps ?? [],
      });
      return;
    }
    if (data.status === "success") {
      setDocuments(data.documents);
      syncWorkspaceUrl(data.documents);
      setActiveDocId(data.documents[0]?.document_id ?? null);
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.diff_summary,
          documents: data.documents,
        },
      ]);
    } else if (data.status === "clarification_needed") {
      // ✅ Use data.message (the backend sends "message", not "question")
      setHistory((prev) => [
        ...prev,
        { role: "assistant", text: data.message || data.question || "Clarification needed" },
      ]);
    } else if (data.status === "chat" || data.status === "unsupported") {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", text: data.message, timestamp: timestamp() },
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

  function handleAddFiles(files: File[]) {
    addDocuments.mutate(files, {
      onSuccess: ({ results, passwordPrompts }) => {
        if (results.length > 0) {
          setDocuments((prev) => {
            const updated = [...prev, ...results];
            syncWorkspaceUrl(updated);
            return updated;
          });
          setActiveDocId(results[0].document_id);
        }
        if (passwordPrompts.length > 0) {
          setPendingUploadPasswords(
            passwordPrompts.map((p: any) => ({
              uploadToken: p.upload_token,
              filename: p.filename,
            })),
          );
        }
      },
    });
  }
  if (isHydrating) {
    return (
      <div className="flex h-screen  flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        <Text size="sm" color="text-secondary">
          Loading workspace…
        </Text>
      </div>
    );
  }
  async function handleUploadPasswordSubmit(password: string) {
    const current = pendingUploadPasswords[0];
    setIsSubmittingUploadPassword(true);
    setUploadPasswordError(undefined);

    const result = await completeUpload(current.uploadToken, password);
    setIsSubmittingUploadPassword(false);

    if (result.status === "error") {
      setUploadPasswordError(result.message);
      setPendingUploadPasswords((prev) => [
        { uploadToken: result.upload_token, filename: current.filename },
        ...prev.slice(1),
      ]);
      return;
    }

    setDocuments((prev) => {
      const updated = [...prev, result];
      syncWorkspaceUrl(updated);
      return updated;
    });
    setActiveDocId(result.document_id);
    setPendingUploadPasswords((prev) => prev.slice(1));
  }

  function handleCancelUploadPassword() {
    setPendingUploadPasswords((prev) => prev.slice(1));
    setUploadPasswordError(undefined);
  }
  const activeDoc = documents.find((d) => d.document_id === activeDocId);
  function handleMobileTabChange(tab: MobileTab) {
    setMobileTab(tab);
    if (tab === "chat") setChatExpanded(true);
    if (tab === "pages") setChatExpanded(false);
    if (tab === "download" && activeDoc?.download_url) {
      const a = document.createElement("a");
      a.href = activeDoc.download_url;
      a.download = activeDoc.filename;
      a.click();
    }
    if (tab === "more" && activeDoc?.can_undo)
      handleUndo(activeDoc.document_id);
  }
  return (
    <>
      {/* MOBILE — bottom-sheet layout */}
      <div className="flex h-[90vh] flex-col md:hidden">
        {/* <MobileHeader /> */}
        <MobileDocStrip
          activeDoc={activeDoc}
          documents={documents}
          onSelect={setActiveDocId}
          onAddFiles={handleAddFiles}
          isAdding={addDocuments.isPending}
        />
        <div className="relative flex-1 overflow-hidden bg-surface-secondary/40">
          <PdfPreview doc={activeDoc} />
          <MobileChatSheet
            history={history}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isSending={sendMessage.isPending}
            expanded={chatExpanded}
            onToggleExpand={() => setChatExpanded((v) => !v)}
          />
        </div>
        <MobileTabBar active={mobileTab} onChange={handleMobileTabChange} />
      </div>

      {/* DESKTOP — resizable split layout */}
      <div
        ref={containerRef}
        className="hidden h-[90vh] bg-background p-3 md:flex"
      >
        {/* LEFT: preview */}
        <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-surface">
          <DocumentTabBar
            documents={documents}
            activeDocId={activeDocId}
            onSelect={setActiveDocId}
            onAddFiles={handleAddFiles}
            isAdding={addDocuments.isPending}
          />
          <div className="flex-1 overflow-hidden rounded-b-xl bg-surface-secondary/40">
            <PdfPreview doc={activeDoc} />
          </div>
        </div>

        {/* collapsed chat rail */}
        {chatCollapsed && (
          <button
            onClick={() => setChatCollapsed(false)}
            className="ml-3 flex w-11 shrink-0 flex-col items-center gap-2 rounded-xl border border-border bg-surface py-3 text-text-secondary transition-colors hover:text-primary"
            aria-label="Expand chat panel"
          >
            <ChevronsLeft className="size-4" />
          </button>
        )}

        {/* drag handle + chat */}
        {!chatCollapsed && (
          <>
            <div
              onMouseDown={onDragStart}
              className="mx-1 w-1.5 shrink-0 cursor-col-resize rounded-full bg-transparent transition-colors hover:bg-primary/20 active:bg-primary/30"
            />
            <div
              style={{ width: `${chatPct}%` }}
              className="flex shrink-0 flex-col rounded-xl border border-border bg-surface"
            >
              <ChatPanel
                history={history}
                input={input}
                onInputChange={setInput}
                onSend={handleSend}
                isSending={sendMessage.isPending}
                onViewDoc={setActiveDocId}
                onUndoDoc={handleUndo}
                isUndoing={undoDocument.isPending}
                onCollapse={() => setChatCollapsed(true)}
              />
            </div>
          </>
        )}

        {pendingUploadPasswords.length > 0 && (
          <PasswordModal
            tool="unlock_pdf"
            onSubmit={handleUploadPasswordSubmit}
            onCancel={handleCancelUploadPassword}
            isSubmitting={isSubmittingUploadPassword}
            error={uploadPasswordError}
          />
        )}
      </div>
    </>
  );
}
