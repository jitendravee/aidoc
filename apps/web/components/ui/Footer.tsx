// components/layout/footer.tsx
import Image from "next/image";
import Text from "../ui/Text";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

const productLinks = [
  { label: "Edit a PDF", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto  px-4 py-10 sm:px-6 md:px-8 xl:px-30 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* Brand + trust signals */}
          <div className="flex flex-col gap-4 lg:max-w-xs">
            <Image src="/logo.png" alt="FlowPDF" width={173} height={60} className="h-auto w-28" />
            <Text size="sm" color="text-secondary">
              Edit PDFs by simply asking. New tools are added to the AI regularly — if it can't
              do something yet, it'll tell you plainly instead of guessing.
            </Text>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2">
                <LockKeyhole className="size-3.5 text-primary" />
                <Text size="xs" color="text-secondary">Files are private and never shared</Text>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-primary" />
                <Text size="xs" color="text-secondary">No sign-up required</Text>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <Text size="xs" color="text-secondary">New AI tools shipped continuously</Text>
              </div>
            </div>
          </div>

          {/* Link columns — only real, live pages */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <Text size="xs" weight="semibold" className="uppercase tracking-wide">
                Product
              </Text>
              {productLinks.map((link) => (
                <a key={link.href} href={link.href} className="w-fit">
                  <Text size="sm" color="text-secondary" className="transition-colors hover:text-primary">
                    {link.label}
                  </Text>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Text size="xs" weight="semibold" className="uppercase tracking-wide">
                Legal
              </Text>
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href} className="w-fit">
                  <Text size="sm" color="text-secondary" className="transition-colors hover:text-primary">
                    {link.label}
                  </Text>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Text size="xs" color="text-secondary">
            © {new Date().getFullYear()} FlowPDF. All rights reserved.
          </Text>
          <Text size="xs" color="text-secondary">
            Built with AI that's upfront about what it can't do yet.
          </Text>
        </div>
      </div>
    </footer>
  );
}