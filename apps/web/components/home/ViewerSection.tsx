// components/home/ViewerSection.tsx
"use client";

import { useRouter } from "next/navigation";
import { Eye, FileText, Image as ImageIcon, Zap, ShieldCheck } from "lucide-react";
import Text from "../ui/Text";

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Opens instantly",
    description: "PDFs and images render straight in your browser — no upload, no waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "Nothing leaves your device unless you choose to edit it.",
  },
  {
    icon: FileText,
    title: "Any format",
    description: "PDF, JPG, PNG, and Word docs — one viewer for all of them.",
  },
];

export function ViewerSection() {
  const router = useRouter();

  return (
    <section id="viewer" className="py-16 lg:py-24">
      <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
        <Eye className="h-3.5 w-3.5 text-emerald-600" />
        <Text size="xs" weight="medium" className="text-emerald-600">
          No sign-up, no editing needed
        </Text>
      </div>

      <Text
        as="h2"
        size={{ base: "2xl", lg: "3xl" }}
        weight="bold"
        family="heading"
        align="center"
        className="mb-3"
      >
        Just need to view a file?
      </Text>
      <Text
        as="p"
        size={{ base: "sm", lg: "base" }}
        color="text-secondary"
        align="center"
        className="mx-auto mb-12 max-w-lg lg:mb-16"
      >
        Drop in a PDF, image, or document and it opens right away — right in your browser.
      </Text>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <Text size="sm" weight="semibold" className="text-gray-900">
              {title}
            </Text>
            <Text size="xs" color="text-secondary" className="mt-1 leading-relaxed">
              {description}
            </Text>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => router.push("/viewer")}
          className="flex items-center cursor-pointer gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Eye className="size-4" />
          Open the viewer
        </button>
      </div>
    </section>
  );
}