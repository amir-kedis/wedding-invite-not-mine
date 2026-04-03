"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { weddingConfig } from "@/config/wedding";

type Phase = "sealed" | "playing" | "done";

export default function EnvelopeGate({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const t = useTranslations("envelope");
  const [phase, setPhase] = useState<Phase>("sealed");
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openedRef = useRef(false);

  const triggerOpen = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    setPhase("done");
    onOpen();
  }, [onOpen]);

  // Show skip button after 1.5s once video is playing
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  const handleClick = useCallback(() => {
    // If video is already playing — treat as "skip"
    if (phase === "playing") {
      triggerOpen();
      return;
    }
    if (phase !== "sealed") return;

    setPhase("playing");

    const video = videoRef.current;
    if (!video) {
      triggerOpen();
      return;
    }

    // Safety timeout — navigate after 6s no matter what
    const fallback = setTimeout(triggerOpen, 6000);

    video.addEventListener(
      "ended",
      () => {
        clearTimeout(fallback);
        triggerOpen();
      },
      { once: true }
    );

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked autoplay — skip after short delay
        clearTimeout(fallback);
        setTimeout(triggerOpen, 600);
      });
    }
  }, [phase, triggerOpen]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none"
      onClick={handleClick}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Video always mounted — preloads in background */}
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

      {/* Static image overlay — hidden once video starts */}
      <AnimatePresence>
        {phase === "sealed" && (
          <motion.div
            key="sealed"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <img
              src={weddingConfig.media.envelopeImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dear Guest */}
            <div className="absolute top-8 inset-x-0 text-center">
              <p className="text-black/60 text-xs tracking-[0.4em] uppercase mb-1 font-sans">
                {t("dear")}
              </p>
              <p className="font-[family-name:var(--font-script-family)] text-3xl md:text-4xl text-black drop-shadow-lg">
                {t("guest")}
              </p>
            </div>

            {/* Tap to open */}
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

      {/* Skip button — appears after 1.5s of video playing */}
      <AnimatePresence>
        {phase === "playing" && showSkip && (
          <motion.div
            key="skip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-10 inset-x-0 z-20 flex justify-center pointer-events-none"
          >
            <span className="text-white/60 text-xs tracking-[0.3em] uppercase font-sans">
              Tap to skip
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
