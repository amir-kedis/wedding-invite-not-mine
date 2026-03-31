"use client";

import { useTranslations, useLocale } from "next-intl";
import { weddingConfig } from "@/config/wedding";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as "en" | "ar";
  const c = weddingConfig.couple;
  const name1 = c.partner1[locale];
  const name2 = c.partner2[locale];

  const eventDate = new Date(weddingConfig.date);
  const dateStr =
    locale === "ar"
      ? eventDate.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : eventDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  return (
    <footer className="bg-sage-dark text-primary-foreground py-16 px-4 relative overflow-hidden">
      {/* Venue illustration watermark */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none opacity-10">
        <img
          src={weddingConfig.media.venueIllustration}
          alt=""
          className="w-full max-w-4xl h-auto object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h3 className="font-[family-name:var(--font-script-family)] text-3xl md:text-4xl mb-4">
          {name1}{" "}
          <span className="font-[family-name:var(--font-display-family)] text-xl italic text-primary-foreground/60">
            &amp;
          </span>{" "}
          {name2}
        </h3>

        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px bg-primary-foreground/30 w-12" />
          <span className="text-gold text-sm">✦</span>
          <span className="h-px bg-primary-foreground/30 w-12" />
        </div>

        <p className="font-[family-name:var(--font-display-family)] text-lg italic text-primary-foreground/80 mb-6">
          {dateStr}
        </p>
        <p className="font-sans text-xs text-primary-foreground/50 tracking-wider">
          {t("withLove")}
        </p>
      </div>
    </footer>
  );
}
