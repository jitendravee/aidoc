// components/home/hero.tsx
"use client";

import React, { useRef, useState } from "react";
import Text from "../ui/Text";
import Button from "../ui/Button";
import { CloudUpload, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { ACCEPTED_UPLOAD_TYPES } from "@/lib/types/api";

interface HeroProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export const Hero = ({ onFilesSelected, isUploading }: HeroProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files ?? []).filter(
      (f) => f.type === ".pdf,.jpg,.jpeg,.png",
    );
    if (files.length > 0) onFilesSelected(files);
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-8 py-8 lg:py-12 rounded-xl transition-colors ${
        isDragActive ? "bg-primary/5 ring-2 ring-primary/30" : ""
      }`}
    >
      <div className="flex flex-col gap-5 lg:gap-8 w-full lg:w-fit items-center lg:items-start text-center lg:text-left ">
        <Text
          as="h1"
          size={{ base: "4xl", lg: "6xl" }}
          color="primary"
          weight="semibold"
          family="heading"
        >
          Edit PDFs <br className="hidden md:block" />
          Just by{" "}
          <Text
            as="span"
            size={{ base: "4xl", lg: "6xl" }}
            color="primary"
            weight="bold"
            family="sans"
          >
            Asking.
          </Text>
        </Text>

        <Text as="p" size={{ base: "sm", md: "xl" }} color="text-secondary">
          Chat with FlowPDF and get anything <br className="hidden md:block" />
          done with your PDF, Fast. Simple. Secure
        </Text>

        <div className="flex flex-col gap-4 items-center lg:items-start w-full">
          <input
            ref={fileInputRef}
            type="file"
  accept={ACCEPTED_UPLOAD_TYPES}
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          <Button
            prefixIcon={<CloudUpload />}
            size="lg"
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading…" : "Upload"}
          </Button>

          <Text size={{ base: "xs", md: "sm" }} color="text-secondary">
            {isDragActive
              ? "Drop your PDF(s) here"
              : "or drag & drop your PDF here"}
          </Text>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-6 items-center justify-center">
          <div className="flex flex-row gap-1.5 items-center">
            <LockKeyhole className="text-primary w-4 h-4 md:w-4 md:h-4" />
            <Text size={{ base: "2xs", md: "xs" }} color="text-secondary">
              No sign up
            </Text>
          </div>
          <div className="flex flex-row gap-1.5 items-center">
            <ShieldCheck className="text-primary w-4 h-4 md:w-4 md:h-4" />
            <Text size={{ base: "2xs", md: "xs" }} color="text-secondary">
              Secure & Private
            </Text>
          </div>
          <div className="flex flex-row gap-1.5 items-center">
            <Zap className="text-primary w-4 h-4 md:w-4 md:h-4" />
            <Text size={{ base: "2xs", md: "xs" }} color="text-secondary">
              Free to use
            </Text>
          </div>
        </div>
      </div>

      <div className="relative w-full lg:flex-1 h-[320px] md:h-[450px] lg:h-full lg:min-h-[500px]">
        <Image
          src="/hero_mobile.png"
          alt="FlowPDF chat interface showing a PDF being edited by typing a plain-English request"
          fill
          priority
          sizes="100vw"
          className="block md:hidden object-contain"
        />
        <Image
          src="/hero_tablet.png"
          alt="FlowPDF chat interface showing a PDF being edited by typing a plain-English request"
          fill
          priority
          sizes="100vw"
          className="hidden md:block lg:hidden object-contain"
        />
        <Image
          src="/hero.png"
          alt="FlowPDF chat interface showing a PDF being edited by typing a plain-English request"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="hidden lg:block object-contain"
        />
      </div>
    </section>
  );
};
