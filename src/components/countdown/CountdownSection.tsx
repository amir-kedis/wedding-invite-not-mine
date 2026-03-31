"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { weddingConfig } from "@/config/wedding";

function getTimeRemaining(targetDate: string) {
  const total = new Date(targetDate).getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function CircularProgress({
  value,
  max,
  label,
  unit,
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const offset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 md:w-28 md:h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-border"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-sage-dark"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[family-name:var(--font-display-family)] text-xl md:text-3xl text-sage-dark">
            {label}
          </span>
        </div>
      </div>
      <span className="text-muted-foreground text-xs md:text-sm tracking-wider uppercase font-sans">
        {unit}
      </span>
    </div>
  );
}

export default function CountdownSection() {
  const t = useTranslations("countdown");
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTime(getTimeRemaining(weddingConfig.date));
    
    const interval = setInterval(() => {
      setTime(getTimeRemaining(weddingConfig.date));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="countdown" className="section-padding bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-script-family)] text-4xl md:text-5xl text-sage-dark mb-2">
          {t("title")}
        </h2>
        <p className="text-muted-foreground font-sans tracking-wide mb-12">
          {t("subtitle")}
        </p>

        <div 
          className="grid grid-cols-4 gap-3 md:gap-6"
          style={{ opacity: isMounted ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          <CircularProgress
            value={time.days}
            max={365}
            label={String(time.days)}
            unit={t("days")}
          />
          <CircularProgress
            value={time.hours}
            max={24}
            label={String(time.hours)}
            unit={t("hours")}
          />
          <CircularProgress
            value={time.minutes}
            max={60}
            label={String(time.minutes)}
            unit={t("minutes")}
          />
          <CircularProgress
            value={time.seconds}
            max={60}
            label={String(time.seconds)}
            unit={t("seconds")}
          />
        </div>
      </div>

      {/* Venue illustration watermark */}
      <div className="flex justify-center mt-12 opacity-15">
        <img
          src={weddingConfig.media.venueIllustration}
          alt=""
          className="w-full max-w-2xl h-auto object-contain"
          style={{
            filter:
              "sepia(1) saturate(0.6) hue-rotate(var(--illustration-hue, -30deg))",
          }}
        />
      </div>
    </section>
  );
}
