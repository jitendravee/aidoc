import WorkspaceContent from "@/components/workspace/WorkspaceContent";
import { Suspense } from "react";

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-sm text-text-secondary">
          Loading…
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}