// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlowPDF — Edit PDFs by Just Asking",
    short_name: "FlowPDF",
    description:
      "Rotate, delete, merge, and edit PDF pages by chatting in plain English. No sign-up required.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
