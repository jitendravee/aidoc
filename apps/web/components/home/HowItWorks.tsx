import Text from "../ui/Text";
import { CloudUpload, MessageSquareText, Download } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: CloudUpload,
    title: "Upload your PDF",
    description: "Drag & drop or choose a file.",
  },
  {
    number: 2,
    icon: MessageSquareText,
    title: "Ask anything",
    description: "Tell us what you want to do.",
  },
  {
    number: 3,
    icon: Download,
    title: "Get it done",
    description: "Download your updated PDF.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to edit a PDF with FlowPDF",
            step: steps.map((step) => ({
              "@type": "HowToStep",
              position: step.number,
              name: step.title,
              text: step.description,
            })),
          }),
        }}
      />
      <Text as="h2" size={{ base: "2xl", lg: "3xl" }} weight="bold" family="heading" align="center" className="mb-12 lg:mb-16">
        How it works
      </Text>

      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-4 lg:gap-8">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center sm:contents">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="size-7 text-primary" strokeWidth={1.75} />
                </div>
                <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary">
                  <Text size="2xs" weight="semibold" className="!text-white">
                    {step.number}
                  </Text>
                </div>
              </div>
              <Text size="base" weight="semibold">
                {step.title}
              </Text>
              <Text size="sm" color="text-secondary" className="max-w-[160px]">
                {step.description}
              </Text>
            </div>

            {i < steps.length - 1 && (
              <div className="hidden h-px w-16 self-center border-t-2 border-dashed border-border sm:block lg:w-24" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}