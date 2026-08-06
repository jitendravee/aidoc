import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Text from "@/components/ui/Text";
import { TOOL_PAGES, getToolPageBySlug } from "@/lib/tools/tool-content";
import { ToolUploadHero } from "@/components/tools/ToolUploadHero";
import { ToolFAQAccordion } from "@/components/tools/ToolFAQAccordion";

export function generateStaticParams() {
  return TOOL_PAGES.map((t) => ({ slug: t.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolPageBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: { canonical: `https://flowpdf.online/tools/${tool.slug}` },
    openGraph: {
      type: "website",
      title: tool.title,
      description: tool.metaDescription,
      url: `https://flowpdf.online/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolPageBySlug(slug);
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: tool.title,
            step: tool.howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: tool.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-text-secondary hover:text-primary">
          <ArrowLeft className="size-3.5" />
          <Text size="sm" color="text-secondary">Back to home</Text>
        </Link>

        <Text as="h1" size={{ base: "2xl", lg: "3xl" }} weight="bold" family="heading" className="mb-4">
          {tool.title}
        </Text>
        <Text size="sm" color="text-secondary" className="mb-8">
          {tool.intro}
        </Text>

        <div className="mb-10">
          <ToolUploadHero
            toolName={tool.toolName}
            label={tool.actionLabel}
            prompt={tool.uploadPrompt}
          />
        </div>

        <Text as="h2" size="lg" weight="semibold" family="heading" className="mb-3">
          How it works
        </Text>
        <ol className="mb-10 flex flex-col gap-2">
          {tool.howToSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <Text size="sm" color="text-secondary">{step}</Text>
            </li>
          ))}
        </ol>

        <Text as="h2" size="lg" weight="semibold" family="heading" className="mb-3">
          Frequently asked questions
        </Text>
        <ToolFAQAccordion items={tool.faq} />
      </main>
    </>
  );
}