import WorkspaceContent from "@/components/workspace/WorkspaceContent";
import { Suspense } from "react";
import type { Metadata } from "next";

// This route renders private, per-session document data (?ids=...). It's
// already disallowed in robots.txt so it shouldn't get crawled, but a
// page-level noindex is added as a second layer: if a workspace link ever
// gets shared or linked to externally, this ensures Google won't index a
// bare, content-less URL for it even in that edge case.
export const metadata: Metadata = {
  title: "Your Workspace",
  robots: {
    index: false,
    follow: false,
  },
};

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