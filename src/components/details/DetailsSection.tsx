"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Calendar, Navigation } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

export default function DetailsSection() {
  const t = useTranslations("details");
  const locale = useLocale() as "en" | "ar";
  const locations = weddingConfig.locations;

  return (
    <section id="details" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-script-family)] text-4xl md:text-5xl text-sage-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-sans tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {locations.map((location) => (
            <div
              key={location.kind.en}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="w-12 h-12 mb-4 rounded-full bg-sage-light flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-sage-dark" />
                </div>
                <p className="font-sans text-xs tracking-[0.3em] rtl:tracking-normal uppercase text-muted-foreground mb-2">
                  {location.kind[locale]}
                </p>
                <h3 className="font-[family-name:var(--font-display-family)] text-2xl text-sage-dark mb-3">
                  {location.name[locale]}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="font-sans">{location.time[locale]}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground mb-6">
                  <Navigation className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span className="font-sans text-sm leading-relaxed">
                    {location.address[locale]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-sage-dark/40 text-sage-dark hover:bg-sage-dark hover:text-primary-foreground transition-colors text-sm font-sans"
                  >
                    <MapPin className="w-4 h-4" />
                    {t("openInMaps")}
                  </a>
                  <a
                    href={weddingConfig.calendarUrl(locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-sage-dark/40 text-sage-dark hover:bg-sage-dark hover:text-primary-foreground transition-colors text-sm font-sans"
                  >
                    <Calendar className="w-4 h-4" />
                    {t("addToCalendar")}
                  </a>
                </div>
              </div>

              <div className="border-t border-border">
                <iframe
                  src={location.embedUrl}
                  width="100%"
                  height="260"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${location.name.en} map`}
                  className="sepia-[0.15] hover:sepia-0 transition-all duration-500"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wedding car watermark */}
      <div className="flex justify-center mt-10 opacity-15">
        <img
          src={weddingConfig.media.weddingCar}
          alt=""
          className="w-full max-w-md h-auto object-contain"
          style={{
            filter:
              "sepia(1) saturate(0.6) hue-rotate(var(--illustration-hue, -30deg))",
          }}
        />
      </div>
    </section>
  );
}
