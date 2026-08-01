import type { Metadata } from "next";
import Text from "@/components/ui/Text";
import PostCard from "@/components/blog/PostCard";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog — PDF Guides & How-Tos",
  description:
    "Practical, free guides for common PDF tasks — merging, rotating, and editing PDFs without installing software.",
  alternates: { canonical: "https://flowpdf.online/blog" },
};

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://flowpdf.online" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://flowpdf.online/blog" },
            ],
          }),
        }}
      />
      <Text as="h1" size={{ base: "2xl", lg: "3xl" }} weight="bold" family="heading" className="mb-2">
        FlowPDF Blog
      </Text>
      <div className="mb-10 flex items-center justify-between gap-4">
        <Text size="sm" color="text-secondary">
          Free, practical guides for the PDF tasks people actually run into.
        </Text>
        <a
          href="/blog/rss.xml"
          className="shrink-0 text-xs font-medium text-text-secondary hover:text-primary"
        >
          RSS feed
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {BLOG_POSTS.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}