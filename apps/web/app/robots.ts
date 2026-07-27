// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/workspace"], // dynamic session pages — nothing to index
    },
    sitemap: "https://flowpdf.online/sitemap.xml",
  };
}