"use client";

import { useState, useRef, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { weddingConfig } from "@/config/wedding";

export default function BackgroundMusic() {
  const t = useTranslations("music");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — that's ok
      });
    }
    setIsPlaying(!isPlaying);
  };

  if (!weddingConfig.sections.music) return null;

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src={weddingConfig.media.backgroundMusic} type="audio/mpeg" />
      </audio>
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-sage-dark/80 text-primary-foreground backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
        aria-label={isPlaying ? t("pause") : t("play")}
      >
        {isPlaying ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Music className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
