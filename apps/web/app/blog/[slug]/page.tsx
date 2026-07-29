import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog/posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://flowpdf.online/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://flowpdf.online/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { "@type": "Organization", name: "FlowPDF" },
            publisher: { "@type": "Organization", name: "FlowPDF" },
            mainEntityOfPage: `https://flowpdf.online/blog/${post.slug}`,
          }),
        }}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-8">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-text-secondary hover:text-primary">
          <ArrowLeft className="size-3.5" />
          <Text size="sm" color="text-secondary">Back to blog</Text>
        </Link>

        <Text size="2xs" color="text-secondary" className="mb-2">
          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          {" · "}
          {post.readingTime}
        </Text>
        <Text as="h1" size={{ base: "2xl", lg: "3xl" }} weight="bold" family="heading" className="mb-8">
          {post.title}
        </Text>

        <div className="flex flex-col gap-8">
          {post.sections.map((section) => (
            <div key={section.heading}>
              <Text as="h2" size="lg" weight="semibold" family="heading" className="mb-3">
                {section.heading}
              </Text>
              {section.paragraphs.map((p, i) => (
                <Text key={i} size="sm" color="text-secondary" className="mb-3">
                  {p}
                </Text>
              ))}
              {section.list && (
                <ul className="mt-2 flex flex-col gap-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                      <Text size="sm" color="text-secondary">{item}</Text>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <Sparkles className="size-5 shrink-0 text-primary" />
          <div className="flex-1">
            <Text size="sm" weight="medium">Try it yourself</Text>
            <Text size="xs" color="text-secondary">No sign-up, nothing to install.</Text>
          </div>
          <Link href="/">
            <Button size="sm">{post.ctaText}</Button>
          </Link>
        </div>
      </main>
    </>
  );
}