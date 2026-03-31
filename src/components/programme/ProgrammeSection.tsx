"use client";

import { useTranslations, useLocale } from "next-intl";
import { weddingConfig } from "@/config/wedding";

export default function ProgrammeSection() {
  const t = useTranslations("programme");
  const locale = useLocale() as "en" | "ar";
  const events = weddingConfig.schedule;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-script-family)] text-4xl md:text-5xl text-sage-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-sans tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block relative">
          <div className="absolute top-16 left-0 right-0 h-px bg-sage/30" />
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${events.length}, minmax(0, 1fr))`,
            }}
          >
            {events.map((event, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="bg-sage-dark text-primary-foreground px-3 py-1.5 rounded-full text-sm font-[family-name:var(--font-display-family)] font-medium mb-4 group-hover:bg-sage transition-colors duration-300 z-10">
                  {event.time[locale]}
                </div>
                <div className="w-3 h-3 rounded-full bg-sage-dark mb-4 shadow-sm group-hover:scale-150 transition-all duration-300 z-10 border border-background" />
                <h3 className="font-[family-name:var(--font-display-family)] text-base lg:text-lg text-sage-dark mb-1 leading-tight">
                  {event.title[locale]}
                </h3>
                <p className="text-muted-foreground font-sans text-xs leading-relaxed px-1">
                  {event.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden relative">
          <div className="absolute left-6 rtl:right-6 rtl:left-auto top-0 bottom-0 w-px bg-sage/30" />
          <div className="space-y-6">
            {events.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-4 ps-1"
              >
                <div className="w-3 h-3 mt-1.5 rounded-full bg-sage-dark flex-shrink-0 shadow-sm z-10 border border-background" />
                <div className="flex-1 pt-0">
                  <div className="flex items-baseline gap-3 mb-0.5">
                    <span className="bg-sage-dark text-primary-foreground px-2 py-0.5 rounded text-xs font-[family-name:var(--font-display-family)] font-medium z-10">
                      {event.time[locale]}
                    </span>
                    <h3 className="font-[family-name:var(--font-display-family)] text-lg text-sage-dark">
                      {event.title[locale]}
                    </h3>
                  </div>
                  <p className="text-muted-foreground font-sans text-sm">
                    {event.description[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
