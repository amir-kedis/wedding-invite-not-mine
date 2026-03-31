"use client";

import { useLocale } from "next-intl";
import { Info } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

export default function DressCodeSection() {
  const locale = useLocale() as "en" | "ar";

  if (!weddingConfig.sections.dressCode) return null;

  return (
    <section className="section-padding bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-8 md:p-10 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-light flex items-center justify-center">
            <Info className="w-5 h-5 text-sage-dark" />
          </div>
          <p className="font-[family-name:var(--font-display-family)] text-lg md:text-xl text-foreground leading-relaxed whitespace-pre-line">
            {weddingConfig.dressCode[locale]}
          </p>
        </div>
      </div>
    </section>
  );
}
