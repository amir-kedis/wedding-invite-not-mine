"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace the locale segment in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-foreground/40 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => switchLocale("en")}
        className={`px-3 py-1 rounded-full text-xs tracking-wide transition-colors font-sans ${
          locale === "en"
            ? "bg-primary-foreground text-foreground"
            : "text-primary-foreground/70 hover:text-primary-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("ar")}
        className={`px-3 py-1 rounded-full text-xs tracking-wide transition-colors font-sans ${
          locale === "ar"
            ? "bg-primary-foreground text-foreground"
            : "text-primary-foreground/70 hover:text-primary-foreground"
        }`}
      >
        عربي
      </button>
    </div>
  );
}
