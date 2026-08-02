// app/viewer/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileX2, Loader2, Pencil } from "lucide-react";
import Text from "@/components/ui/Text";
import { uploadDocument } from "@/lib/api/documents";
import { ACCEPTED_UPLOAD_TYPES } from "@/lib/types/api";

// Formats a browser can render natively from a local blob — no upload,
// no library needed.
const NATIVE_RENDERABLE = new Set(["application/pdf", "image/jpeg", "image/png"]);

// Formats that need a small client-side library to render, but still
// never touch the network — only pptx (and anything else unlisted)
// falls back to server-side conversion.
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type ViewerState =
  | { status: "empty" }
  | { status: "local-native"; file: File; blobUrl: string }
  | { status: "local-docx"; file: File; html: string }
  | { status: "local-xlsx"; file: File; sheets: { name: string; rows: unknown[][] }[] }
  | { status: "converting"; file: File }
  | { status: "converted"; file: File; documentId: string; downloadUrl: string }
  | { status: "error"; message: string };

export default function ViewerPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ViewerState>({ status: "empty" });

  const handleFile = useCallback(async (file: File) => {
    if (NATIVE_RENDERABLE.has(file.type)) {
      const blobUrl = URL.createObjectURL(file);
      setState({ status: "local-native", file, blobUrl });
      return;
    }

    if (file.type === DOCX_MIME) {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setState({ status: "local-docx", file, html: result.value });
      } catch {
        setState({ status: "error", message: "Couldn't read this Word document." });
      }
      return;
    }

    if (file.type === XLSX_MIME) {
      try {
        const XLSX = await import("xlsx");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheets = workbook.SheetNames.map((name) => ({
          name,
          rows: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }) as unknown[][],
        }));
        setState({ status: "local-xlsx", file, sheets });
      } catch {
        setState({ status: "error", message: "Couldn't read this spreadsheet." });
      }
      return;
    }

    // pptx and anything else: no client-side renderer exists, fall
    // back to the existing upload + conversion pipeline.
    setState({ status: "converting", file });
    try {
      const result = await uploadDocument(file);
      if (result.status === "success") {
        setState({
          status: "converted",
          file,
          documentId: result.document_id,
          downloadUrl: result.download_url,
        });
      } else {
        setState({ status: "error", message: "Couldn't process this file." });
      }
    } catch {
      setState({ status: "error", message: "Upload failed — please try again." });
    }
  }, []);

  function handleEditClick() {
    if (state.status === "converted") {
      router.push(`/workspace?ids=${state.documentId}`);
      return;
    }
    // any purely-local state (native, docx, xlsx) hasn't been uploaded
    // yet — do it now, on demand, only when the user actually wants to edit
    if (
      state.status === "local-native" ||
      state.status === "local-docx" ||
      state.status === "local-xlsx"
    ) {
      uploadDocument(state.file).then((result) => {
        if (result.status === "success") {
          router.push(`/workspace?ids=${result.document_id}`);
        }
      });
    }
  }

  const currentFile =
    state.status === "local-native" ||
    state.status === "local-docx" ||
    state.status === "local-xlsx" ||
    state.status === "converting" ||
    state.status === "converted"
      ? state.file
      : null;

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-16">
      {state.status === "empty" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <FileX2 className="size-10 text-text-secondary/40" />
          <Text as="h1" size="2xl" weight="bold">
            View any document online
          </Text>
          <Text size="sm" color="text-secondary" className="max-w-sm">
            PDFs, images, Word docs, and spreadsheets open instantly, right
            in your browser — nothing is uploaded unless you choose to edit.
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_UPLOAD_TYPES}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Upload className="size-4" />
            Choose a file
          </button>
        </div>
      )}

      {state.status === "converting" && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary" />
          <Text size="sm" color="text-secondary">
            Preparing preview for {state.file.name}…
          </Text>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <Text size="sm" className="text-red-600">{state.message}</Text>
          <button
            onClick={() => setState({ status: "empty" })}
            className="text-sm text-primary underline"
          >
            Try another file
          </button>
        </div>
      )}

      {currentFile && state.status !== "converting" && (
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Text size="sm" weight="medium" className="truncate">
              {currentFile.name}
            </Text>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-secondary"
            >
              <Pencil className="size-3.5" />
              Edit with AI
            </button>
          </div>

          <div className="h-[75vh] w-full overflow-auto rounded-xl border border-border bg-surface-secondary/40">
            {state.status === "local-native" && currentFile.type.startsWith("image/") && (
              <img src={state.blobUrl} alt={currentFile.name} className="h-full w-full object-contain" />
            )}
            {state.status === "local-native" && currentFile.type === "application/pdf" && (
              <iframe src={state.blobUrl} title={currentFile.name} className="h-full w-full" />
            )}
            {state.status === "local-docx" && (
              <div
                className="prose max-w-none bg-white p-8"
                dangerouslySetInnerHTML={{ __html: state.html }}
              />
            )}
            {state.status === "local-xlsx" && (
              <div className="p-4">
                {state.sheets.map((sheet) => (
                  <div key={sheet.name} className="mb-6">
                    <Text size="sm" weight="semibold" className="mb-2">
                      {sheet.name}
                    </Text>
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        {sheet.rows.map((row, i) => (
                          <tr key={i}>
                            {(row as unknown[]).map((cell, j) => (
                              <td key={j} className="border border-border px-2 py-1">
                                {String(cell ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
            {state.status === "converted" && (
              <iframe src={state.downloadUrl} title={currentFile.name} className="h-full w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}