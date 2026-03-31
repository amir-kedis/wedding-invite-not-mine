"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const c = weddingConfig.couple;

  const name1 = locale === "ar" ? c.partner1.ar : c.partner1.en;
  const name2 = locale === "ar" ? c.partner2.ar : c.partner2.en;

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

  const scrollToRsvp = () => {
    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background video */}
      <div className="absolute inset-0">
        <img
          src={weddingConfig.media.heroPoster}
          alt="Wedding background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
        >
          {weddingConfig.media.heroVideoWebm && (
            <source src={weddingConfig.media.heroVideoWebm} type="video/webm" />
          )}
          <source src={weddingConfig.media.heroVideo} type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-foreground/55" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p className="text-xs md:text-sm tracking-[0.5em] uppercase text-primary-foreground/80 mb-6 font-sans">
          {t("gettingMarried")}
        </p>

        <h1 className="mb-4">
          <span className="font-[family-name:var(--font-script-family)] text-5xl md:text-7xl lg:text-8xl text-primary-foreground block leading-tight drop-shadow-lg">
            {name1}
          </span>
          <span className="font-[family-name:var(--font-display-family)] text-2xl md:text-3xl lg:text-4xl font-light text-gold my-2 md:my-4 block italic drop-shadow-md">
            &amp;
          </span>
          <span className="font-[family-name:var(--font-script-family)] text-5xl md:text-7xl lg:text-8xl text-primary-foreground block leading-tight drop-shadow-lg">
            {name2}
          </span>
        </h1>

        {/* Diamond divider */}
        <div className="flex items-center justify-center gap-4 my-6 md:my-8">
          <span className="h-px bg-primary-foreground/50 w-12 md:w-20" />
          <span className="text-gold text-lg drop-shadow-md">✦</span>
          <span className="h-px bg-primary-foreground/50 w-12 md:w-20" />
        </div>

        <p className="text-base md:text-lg font-[family-name:var(--font-display-family)] tracking-wider text-primary-foreground/90 italic drop-shadow-md">
          {dateStr}
        </p>
      </motion.div>

      {/* Scroll CTA */}
      <button
        onClick={scrollToRsvp}
        className="absolute bottom-8 inset-x-0 z-10 flex flex-col items-center gap-2 text-center text-primary-foreground hover:text-primary-foreground/80 transition-colors cursor-pointer"
      >
        <span className="text-xs tracking-[0.3em] rtl:tracking-normal uppercase font-sans">
          {t("confirmAttendance")}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce-gentle" />
      </button>
    </section>
  );
}
