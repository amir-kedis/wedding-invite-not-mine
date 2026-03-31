"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Heart, Quote } from "lucide-react";

interface GuestEntry {
  id: string;
  full_name: string;
  message: string;
  signature_data?: string;
  created_at: string;
}

export default function GuestbookSection() {
  const t = useTranslations("guestbook");
  const [entries, setEntries] = useState<GuestEntry[]>([]);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setEntries(json.data);
      })
      .catch(() => {
        // Silently fail — guestbook is optional
      });
  }, []);

  if (entries.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-script-family)] text-4xl md:text-5xl text-sage-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-sans tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6"
            >
              <Quote className="w-8 h-8 text-sage/20 mb-2" />
              <p className="font-[family-name:var(--font-display-family)] text-sm text-foreground italic mb-4 leading-relaxed">
                &ldquo;{entry.message}&rdquo;
              </p>
              {entry.signature_data && (
                <img
                  src={entry.signature_data}
                  alt={`${entry.full_name}'s signature`}
                  className="h-12 w-auto mb-3 opacity-60"
                />
              )}
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-3.5 h-3.5 text-sage-dark fill-sage-dark" />
                <span className="font-sans text-sage-dark font-medium">
                  {entry.full_name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
