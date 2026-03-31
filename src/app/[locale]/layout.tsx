import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  Dancing_Script,
  Libre_Baskerville,
  Raleway,
  Tajawal,
} from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script-family",
  display: "swap",
  weight: ["400", "700"],
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
  weight: ["300", "400", "500"],
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-arabic-body",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${dancingScript.variable} ${libreBaskerville.variable} ${raleway.variable} ${tajawal.variable}`}
    >
      <head>
        {/* Arabic fonts from Google */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`min-h-screen bg-background text-foreground antialiased ${
          locale === "ar" ? "font-[Amiri]" : ""
        }`}
        style={{
          fontFamily:
            locale === "ar"
              ? "var(--font-arabic-body), 'Amiri', serif"
              : "var(--font-body-family), sans-serif",
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
