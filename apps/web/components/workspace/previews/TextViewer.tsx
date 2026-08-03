// components/workspace/previews/TextViewer.tsx
"use client";
import { useEffect, useState } from "react";
import type { WorkspaceDocument } from "@/lib/types/api";

export default function TextViewer({ doc }: { doc: WorkspaceDocument }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    fetch(doc.download_url)
      .then((res) => res.text())
      .then(setText)
      .catch(() => setText("Couldn't load this file."));
  }, [doc.download_url]);

  return (
    <pre className="h-full w-full overflow-auto whitespace-pre-wrap bg-white p-6 text-sm text-gray-800">
      {text ?? "Loading…"}
    </pre>
  );
}