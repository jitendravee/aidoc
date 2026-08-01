"use client";

import Link from "next/link";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <AlertTriangle className="size-7 text-primary" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-2">
        <Text as="h1" size={{ base: "2xl", lg: "3xl" }} weight="bold" family="heading">
          Something went wrong
        </Text>
        <Text as="p" size="sm" color="text-secondary" className="mx-auto max-w-sm">
          An unexpected error occurred. Try again, or head back to the homepage.
        </Text>
      </div>

      <div className="flex gap-3">
        <Button size="lg" variant="outline" onClick={reset}>Try again</Button>
        <Link href="/">
          <Button size="lg">Back to FlowPDF</Button>
        </Link>
      </div>
    </main>
  );
}
