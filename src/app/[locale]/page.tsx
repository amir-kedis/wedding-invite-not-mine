"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { weddingConfig } from "@/config/wedding";
import EnvelopeGate from "@/components/envelope/EnvelopeGate";
import HeroSection from "@/components/hero/HeroSection";
import CountdownSection from "@/components/countdown/CountdownSection";
import ProgrammeSection from "@/components/programme/ProgrammeSection";
import DetailsSection from "@/components/details/DetailsSection";
import DressCodeSection from "@/components/details/DressCodeSection";
import RSVPSection from "@/components/rsvp/RSVPSection";
import GuestbookSection from "@/components/guestbook/GuestbookSection";
import Footer from "@/components/footer/Footer";
import LanguageToggle from "@/components/ui/LanguageToggle";
import BackgroundMusic from "@/components/ui/BackgroundMusic";
import ScrollReveal from "@/components/ui/ScrollReveal";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function WeddingPage() {
  const [isOpen, setIsOpen] = useState(!weddingConfig.sections.envelope);

  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem("envelopeOpened") === "true") {
      setIsOpen(true);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    sessionStorage.setItem("envelopeOpened", "true");
  };

  const cfg = weddingConfig.sections;

  return (
    <>
      {/* Envelope overlay */}
      {cfg.envelope && !isOpen && (
        <EnvelopeGate onOpen={handleOpen} />
      )}

      {/* Language toggle — always visible */}
      <LanguageToggle />

      {/* Background music */}
      {cfg.music && isOpen && <BackgroundMusic />}

      {/* Main content */}
      <div
        className="bg-background"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.6s ease",
        }}
      >
        {/* Hero — no scroll reveal, full viewport */}
        {cfg.hero && <HeroSection />}

        {/* Countdown */}
        {cfg.countdown && (
          <ScrollReveal>
            <CountdownSection />
          </ScrollReveal>
        )}

        {/* Day Programme */}
        {cfg.programme && (
          <ScrollReveal>
            <ProgrammeSection />
          </ScrollReveal>
        )}

        {/* Day Details */}
        {cfg.details && (
          <ScrollReveal>
            <DetailsSection />
          </ScrollReveal>
        )}

        {/* Dress Code */}
        {cfg.dressCode && (
          <ScrollReveal>
            <DressCodeSection />
          </ScrollReveal>
        )}

        {/* RSVP */}
        {cfg.rsvp && (
          <ScrollReveal>
            <RSVPSection />
          </ScrollReveal>
        )}

        {/* Guestbook */}
        {cfg.guestbook && (
          <ScrollReveal>
            <GuestbookSection />
          </ScrollReveal>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
