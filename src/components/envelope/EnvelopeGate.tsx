"use client";

import { useState, useEffect, useCallback } from "react";
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

  const handleOpen = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("playing");
    
    const video = document.getElementById("envelope-video") as HTMLVideoElement;
    if (video) {
      video.play().catch(() => {
        // Fallback if autoplay/play gets blocked
        setTimeout(onOpen, 1500);
      });
      video.onended = () => {
        onOpen();
      };
    } else {
      setTimeout(onOpen, 1500);
    }
  }, [phase, onOpen]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white cursor-pointer"
      onClick={handleOpen}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <video
        id="envelope-video"
        poster={weddingConfig.media.envelopeImage}
        className="w-full h-full object-cover"
        playsInline
        muted
        preload="auto"
      >
        {weddingConfig.media.envelopeVideoWebm && (
          <source
            src={weddingConfig.media.envelopeVideoWebm}
            type="video/webm"
          />
        )}
        <source
          src={weddingConfig.media.envelopeVideo}
          type="video/mp4"
        />
      </video>

      <AnimatePresence>
        {phase === "sealed" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            {/* Poster fallback image */}
            <img
              src={weddingConfig.media.envelopeImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            
            {/* "Dear Guest" header */}
            <div className="absolute top-8 inset-x-0 text-center pointer-events-none">
              <p className="text-black/60 text-xs tracking-[0.4em] uppercase mb-1 font-sans">
                {t("dear")}
              </p>
              <p className="font-[family-name:var(--font-script-family)] text-3xl md:text-4xl text-black drop-shadow-lg">
                {t("guest")}
              </p>
            </div>

            {/* Tap to open indicator */}
            <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-3 pointer-events-none">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute w-20 h-20 rounded-full border border-white/25 animate-ping"
                  style={{ animationDuration: "1.8s" }}
                />
                <div
                  className="absolute w-14 h-14 rounded-full border border-white/35 animate-ping"
                  style={{
                    animationDuration: "1.8s",
                    animationDelay: "0.4s",
                  }}
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
