import Link from "next/link";
import Text from "../ui/Text";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog/posts";

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <Text size="2xs" color="text-secondary">
          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          {" · "}
          {post.readingTime}
        </Text>
        <ArrowUpRight className="size-4 text-text-secondary transition-colors group-hover:text-primary" />
      </div>
      <Text as="h2" size="lg" weight="semibold" family="heading" className="transition-colors group-hover:text-primary">
        {post.title}
      </Text>
      <Text size="sm" color="text-secondary">
        {post.description}
      </Text>
    </Link>
  );
}