// app/not-found.tsx
import Link from "next/link";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { FileSearch } from "lucide-react";
import type { Metadata } from "next";

// A dedicated not-found.tsx makes sure Next.js returns a real HTTP 404
// (rather than a "soft 404" that resolves with a 200 status), which Google
// explicitly calls out as something to avoid. It's also just a much better
// experience than a blank error screen, and the links below keep visitors
// (and crawlers) moving through the site instead of bouncing.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <FileSearch className="size-7 text-primary" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-2">
        <Text as="h1" size={{ base: "2xl", lg: "3xl" }} weight="bold" family="heading">
          We couldn&apos;t find that page
        </Text>
        <Text as="p" size="sm" color="text-secondary" className="mx-auto max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to editing PDFs.
        </Text>
      </div>

      <Link href="/">
        <Button size="lg">Back to FlowPDF</Button>
      </Link>
    </main>
  );
}
