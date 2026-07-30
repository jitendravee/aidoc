// components/home/ToolsGrid.tsx
"use client";

import { useTools } from "@/lib/hooks/useTools";
import Text from "../ui/Text";
import {
  FileStack,
  Scissors,
  Merge,
  RotateCw,
  Trash2,
  FileText,
  FileSpreadsheet,
  Presentation,
  Lock,
  Unlock,
  Stamp,
  Crop,
  Hash,
  ScanText,
  Languages,
  Sparkles,
  PenLine,
  EyeOff,
  Sparkle, Image, 
  type LucideIcon,
} from "lucide-react";

interface Tool {
  name: string;
  label: string;
  description: string;
  category: string;
  available: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Page tools
  delete_pages: Trash2,
  rotate_pages: RotateCw,
  split_pdf: Scissors,
  extract_pages: FileText,
  organize_pdf: FileStack,
  crop_pdf: Crop,
  add_page_numbers: Hash,

  // Document tools
  merge_pdfs: Merge,
  compress_pdf: FileStack,

  // Security
  protect_pdf: Lock,
  unlock_pdf: Unlock,
  watermark_pdf: Stamp,

  // Convert
  pdf_to_jpg: Image,
  pdf_to_pptx: Presentation,
  pdf_to_word: FileText,
  pdf_to_powerpoint: Presentation,
  pdf_to_excel: FileSpreadsheet,
  word_to_pdf: FileText,

  // Extract
  ocr_pdf: ScanText,

  // AI
  translate_pdf: Languages,
  summarize_pdf: Sparkles,

  // Security (coming soon)
  redact_pdf: EyeOff,
  sign_pdf: PenLine,
};
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  page: { bg: "bg-blue-50", text: "text-blue-600" },
  document: { bg: "bg-violet-50", text: "text-violet-600" },
  security: { bg: "bg-rose-50", text: "text-rose-600" },
  convert: { bg: "bg-amber-50", text: "text-amber-600" },
  extract: { bg: "bg-emerald-50", text: "text-emerald-600" },
  ai: { bg: "bg-fuchsia-50", text: "text-fuchsia-600" },  conversion: { bg: "bg-amber-50", text: "text-amber-600" },

};

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? FileStack;
}

function getCategoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] ?? { bg: "bg-gray-100", text: "text-gray-500" }
  );
}

function ToolCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 p-5">
      <div className="mb-4 h-10 w-10 animate-pulse rounded-xl bg-gray-100" />
      <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
    </div>
  );
}

export function ToolsGrid() {
  const { data: tools, isLoading } = useTools();

  return (
    <section id="tools" className="py-16 lg:py-24">
      {" "}
      <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
        <Sparkle className="h-3.5 w-3.5 text-blue-600" />
        <Text size="xs" weight="medium" className="text-blue-600">
          Everything, just by asking
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
        One chat. Every PDF tool.
      </Text>
      <Text
        as="p"
        size={{ base: "sm", lg: "base" }}
        color="text-secondary"
        align="center"
        className="mx-auto mb-12 max-w-lg lg:mb-16"
      >
        No menus to hunt through — just tell FlowPDF what you need done.
      </Text>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
 {isLoading &&
  new Array(10).fill(null).map((_, i) => (
    <ToolCardSkeleton key={i} />
  ))}
        {tools?.map((tool: Tool) => {
          const Icon = getIcon(tool.name);
          const style = getCategoryStyle(tool.category);

          return (
            <div
              key={tool.name}
              className={`group relative flex flex-col rounded-2xl border p-5 transition-all ${
                tool.available
                  ? "border-gray-100 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                  : "border-gray-100 bg-gray-50/60"
              }`}
            >
              {!tool.available && (
                <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-400 ring-1 ring-inset ring-gray-200">
                  Soon
                </span>
              )}

              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${style.bg} ${
                  tool.available ? style.text : "text-gray-400"
                } transition-transform ${tool.available ? "group-hover:scale-105" : ""}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>

              <Text
                size="sm"
                weight="semibold"
                className={tool.available ? "text-gray-900" : "text-gray-500"}
              >
                {tool.label}
              </Text>
              <Text
                size="xs"
                color="text-secondary"
                className="mt-1 line-clamp-2 leading-relaxed"
              >
                {tool.description}
              </Text>
            </div>
          );
        })}
      </div>
    </section>
  );
}
