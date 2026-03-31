"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

export default function RSVPSection() {
  const t = useTranslations("rsvp");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Signature canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(2, 2);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || attending === null) return;

    setSubmitting(true);
    setError("");

    try {
      const signatureData =
        hasSignature && canvasRef.current
          ? canvasRef.current.toDataURL("image/png")
          : null;

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name.trim(),
          attending,
          message: message.trim() || null,
          signature_data: signatureData,
          locale,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(t("error"));
      }
    } catch {
      setError(t("error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="rsvp" className="section-padding bg-secondary/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/80 backdrop-blur-sm border border-border p-10 rounded-lg"
          >
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="font-[family-name:var(--font-script-family)] text-3xl md:text-4xl text-sage-dark mb-4">
              {t("success")}
            </h2>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="section-padding bg-secondary/50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-script-family)] text-4xl md:text-5xl text-sage-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-sans tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card/80 backdrop-blur-sm border border-border p-8 md:p-10 rounded-lg shadow-sm space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className="block font-sans text-sm text-sage-dark mb-2 tracking-wide">
              {t("fullName")} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-border bg-background font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t("namePlaceholder")}
              maxLength={100}
              required
            />
          </div>

          {/* Attend toggle */}
          <div>
            <label className="block font-sans text-sm text-sage-dark mb-3 tracking-wide">
              {t("willAttend")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`relative flex flex-col items-center gap-2 py-6 px-4 rounded-xl border-2 text-sm font-sans transition-all duration-300 ${
                  attending === true
                    ? "border-sage-dark bg-sage-dark/5 text-sage-dark"
                    : "border-border text-muted-foreground hover:border-sage/50 hover:bg-muted/50"
                }`}
              >
                <span className="text-3xl">🎉</span>
                <span className="font-[family-name:var(--font-display-family)] font-medium text-base">
                  {t("yesAttend")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`relative flex flex-col items-center gap-2 py-6 px-4 rounded-xl border-2 text-sm font-sans transition-all duration-300 ${
                  attending === false
                    ? "border-sage-dark bg-sage-dark/5 text-sage-dark"
                    : "border-border text-muted-foreground hover:border-sage/50 hover:bg-muted/50"
                }`}
              >
                <span className="text-3xl">😢</span>
                <span className="font-[family-name:var(--font-display-family)] font-medium text-base">
                  {t("noAttend")}
                </span>
              </button>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block font-sans text-sm text-sage-dark mb-2 tracking-wide">
              {t("message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-border bg-background font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder={t("messagePlaceholder")}
              maxLength={500}
            />
          </div>

          {/* Signature Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-sans text-sm text-sage-dark tracking-wide">
                {t("signature")}
              </label>
              {hasSignature && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <canvas
              ref={canvasRef}
              className="w-full h-32 rounded-md border border-border bg-background signature-canvas"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !name.trim() || attending === null}
            className="w-full py-3 rounded-md bg-sage-dark text-primary-foreground font-sans text-sm tracking-wider uppercase hover:bg-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "..." : t("submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
