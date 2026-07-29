// components/layout/navbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Text from "../ui/Text";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Available tools", href: "/#tools" },
  { label: "FAQ", href: "/#faq" },

];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 xl:px-10">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="FlowPDF — AI PDF editor"
            width={173}
            height={60}
            className="h-auto w-28 sm:w-36 md:w-40 lg:w-43.25"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="group relative">
              <Text
                size="sm"
                weight="medium"
                color="text-secondary"
                className="transition-colors group-hover:text-primary"
              >
                {link.label}
              </Text>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </div>
{/* 
        <div className="hidden md:block">
          <Button size="sm" onClick={() => (window.location.href = "/#upload")}>
            Upload PDF
          </Button>
        </div> */}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-border/60 px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-secondary"
            >
              <Text size="sm" weight="medium">{link.label}</Text>
            </a>
          ))}
          {/* <Button
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              setMobileOpen(false);
              window.location.href = "/#upload";
            }}
          >
            Upload PDF
          </Button> */}
        </div>
      )}
    </nav>
  );
}