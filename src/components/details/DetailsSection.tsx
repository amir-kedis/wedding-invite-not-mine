"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Calendar } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

export default function DetailsSection() {
  const t = useTranslations("details");
  const locale = useLocale() as "en" | "ar";
  const venue = weddingConfig.venue;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-script-family)] text-4xl md:text-5xl text-sage-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-sans tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Venue info card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border p-8 rounded-lg flex flex-col justify-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-sage-light flex items-center justify-center">
              <MapPin className="w-6 h-6 text-sage-dark" />
            </div>
            <h3 className="font-[family-name:var(--font-display-family)] text-2xl text-sage-dark mb-3">
              {t("location")}
            </h3>
            <span className="font-[family-name:var(--font-display-family)] text-lg text-sage-dark block mb-3">
              {venue.name[locale]}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Clock className="w-4 h-4" />
              <span className="font-sans">{venue.time[locale]}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={venue.mapsUrl}
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

          {/* Map embed */}
          <div className="rounded-lg overflow-hidden">
            <div className="rounded-lg overflow-hidden border border-border relative">
              <iframe
                src={venue.embedUrl}
                width="100%"
                height="350"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
                className="sepia-[0.15] hover:sepia-0 transition-all duration-500"
                style={{ border: 0 }}
              />
            </div>
          </div>
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
