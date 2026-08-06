"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Text from "@/components/ui/Text";
import { ToolFaqItem } from "@/lib/tools/tool-content";

export function ToolFAQAccordion({ items }: { items: ToolFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="rounded-2xl border border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <Text size="sm" weight="semibold" className="text-gray-900">
                {item.question}
              </Text>
              <ChevronDown
                className={`size-4 shrink-0 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4">
                <Text size="sm" color="text-secondary" className="leading-relaxed">
                  {item.answer}
                </Text>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}