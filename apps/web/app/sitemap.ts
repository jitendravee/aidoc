
import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { TOOL_PAGES } from "@/lib/tools/tool-content";

const BASE_URL = "https://flowpdf.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/terms", "/privacy", "/blog"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.5,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOL_PAGES.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...toolEntries,
    ...postEntries,
  ];
}

