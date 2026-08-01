import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/Footer";

const SITE_URL = "https://flowpdf.online";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// themeColor/colorScheme moved out of `metadata` and into a dedicated
// `viewport` export — Next.js warns (and eventually errors) if these stay
// in the metadata object, and a correct theme-color also improves how the
// site looks in the mobile browser chrome / when added to a home screen,
// which feeds into overall page-experience signals.
export const viewport: Viewport = {
  themeColor: "#2563eb",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FlowPDF — Edit PDFs by Just Asking | Free AI PDF Editor",
    template: "%s | FlowPDF",
  },
  description:
    "Rotate, delete, and merge PDF pages by chatting in plain English. No sign-up, no software to install — upload a PDF and tell FlowPDF what you need done.",
  keywords: [
    "edit pdf online",
    "edit pdf free",
    "AI pdf editor",
    "chat with pdf",
    "merge pdf online",
    "merge pdf free",
    "rotate pdf pages",
    "rotate pdf online",
    "delete pdf pages",
    "remove pages from pdf",
    "pdf editor no sign up",
    "pdf tool online free",
    "combine pdf files",
    "pdf ai assistant",
    "online pdf manipulation",
  ],
  authors: [{ name: "FlowPDF" }],
  creator: "FlowPDF",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "FlowPDF",
    title: "FlowPDF — Edit PDFs by Just Asking",
    description:
      "Rotate, delete, and merge PDF pages by chatting in plain English. No sign-up required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlowPDF — AI-powered PDF editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowPDF — Edit PDFs by Just Asking",
    description:
      "Rotate, delete, and merge PDF pages by chatting in plain English. No sign-up required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  // <link rel="alternate" type="application/rss+xml"> lets feed readers and
  // some crawlers auto-discover the blog feed from any page, without the
  // user having to know the /blog/rss.xml URL ahead of time.
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [{ url: "/blog/rss.xml", title: "FlowPDF Blog RSS Feed" }],
    },
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          Sitewide Organization + WebSite structured data. This is separate
          from the SoftwareApplication JSON-LD on the homepage: Organization
          gives search engines and AI answer engines (via RAG/grounding) a
          stable entity to attach the brand to across every page, not just "/".
          Update `sameAs` with real social/profile URLs once they exist —
          verified sameAs links measurably help entity recognition.
        */}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FlowPDF",
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            sameAs: [],
          })}
        </Script>
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FlowPDF",
            url: SITE_URL,
          })}
        </Script>

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}