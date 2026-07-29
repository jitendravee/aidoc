import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/terms", "/privacy", "/blog"];

  const staticEntries = staticRoutes.map((route) => ({
    url: `https://flowpdf.online${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.5,
  }));

  const postEntries = BLOG_POSTS.map((post) => ({
    url: `https://flowpdf.online/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}