"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { weddingConfig } from "@/config/wedding";

export default function EnvelopeGate({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const t = useTranslations("envelope");
  const [phase, setPhase] = useState<"sealed" | "playing">("sealed");
  const videoRef = useRef<HTMLVideoElement>(null);
  const calledRef = useRef(false);

  const triggerOpen = useCallback(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    onOpen();
  }, [onOpen]);

  const handleClick = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("playing");

    const video = videoRef.current;
    if (!video) {
      triggerOpen();
      return;
    }

    // Listen for video end — triggers once then auto-removes
    video.addEventListener("ended", triggerOpen, { once: true });

    // Fallback: if video fails or takes too long, navigate anyway
    const fallback = setTimeout(triggerOpen, 8000);
    video.addEventListener("ended", () => clearTimeout(fallback), { once: true });

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — just transition after a short delay
        clearTimeout(fallback);
        setTimeout(triggerOpen, 800);
      });
    }
  }, [phase, triggerOpen]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none"
      onClick={handleClick}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* The video is always mounted so it preloads — hidden behind the image overlay */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        preload="auto"
      >
        {weddingConfig.media.envelopeVideoWebm && (
          <source src={weddingConfig.media.envelopeVideoWebm} type="video/webm" />
        )}
        <source src={weddingConfig.media.envelopeVideo} type="video/mp4" />
      </video>

      {/* Image + UI overlay — fades out when playing starts */}
      <AnimatePresence>
        {phase === "sealed" && (
          <motion.div
            key="sealed-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <img
              src={weddingConfig.media.envelopeImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dear Guest header */}
            <div className="absolute top-8 inset-x-0 text-center">
              <p className="text-black/60 text-xs tracking-[0.4em] uppercase mb-1 font-sans">
                {t("dear")}
              </p>
              <p className="font-[family-name:var(--font-script-family)] text-3xl md:text-4xl text-black drop-shadow-lg">
                {t("guest")}
              </p>
            </div>

            {/* Tap to open indicator */}
            <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute w-20 h-20 rounded-full border border-white/25 animate-ping"
                  style={{ animationDuration: "1.8s" }}
                />
                <div
                  className="absolute w-14 h-14 rounded-full border border-white/35 animate-ping"
                  style={{ animationDuration: "1.8s", animationDelay: "0.4s" }}
                />
                <div className="relative w-10 h-10 rounded-full border border-white/60 bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white/80 text-base leading-none">✦</span>
                </div>
              </div>
              <p className="text-white/75 text-xs tracking-[0.4em] uppercase drop-shadow-md font-sans">
                {t("tapToOpen")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
