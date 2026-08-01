import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removes the "X-Powered-By: Next.js" response header — no SEO benefit
  // to broadcasting the framework, and it's one less thing to strip at a
  // reverse proxy layer.
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Security headers on every response. These don't move rankings
        // directly, but Search Console's "page experience" signals and
        // Lighthouse's best-practices score both look at them, and a missing
        // X-Frame-Options/Content-Type-Options pairing is a common flag in
        // third-party SEO/security audits of this kind of app.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
