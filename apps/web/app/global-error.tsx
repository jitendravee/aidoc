"use client";

// A dedicated global-error.tsx replaces Next's default unstyled error
// screen with something on-brand when a Server Component throws. It has to
// render its own <html>/<body> because it replaces the root layout entirely
// when triggered. This mirrors the not-found.tsx treatment for consistency
// and keeps visitors who hit a rare server error moving through the site
// instead of bouncing on a broken-looking page — good for engagement
// signals and just a better experience.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-24 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold lg:text-3xl">Something went wrong</h1>
            <p className="mx-auto max-w-sm text-sm text-gray-500">
              An unexpected error occurred. You can try again, or head back to the homepage.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> is intentional: this boundary renders when the root layout has failed, so it must not depend on next/link's router context */}
            <a
              href="/"
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Back to FlowPDF
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
