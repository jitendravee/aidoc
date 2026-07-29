// app/sitemap.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://flowpdf.online";

// Use real "last updated" dates per route instead of `new Date()`.
// Regenerating a fresh timestamp on every build tells crawlers every page
// changed today, which trains Google to distrust your lastmod signal and
// can waste crawl budget re-fetching pages that haven't actually changed.
// Bump a route's date only when its content meaningfully changes.
const routes: { path: string; lastModified: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", lastModified: "2026-07-01", changeFrequency: "weekly", priority: 1 },
  { path: "/terms", lastModified: "2026-07-01", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", lastModified: "2026-07-01", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}