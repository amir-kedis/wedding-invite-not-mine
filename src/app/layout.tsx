import type { Metadata } from "next";
import "./globals.css";
import { weddingConfig } from "@/config/wedding";

const c = weddingConfig.couple;

export const metadata: Metadata = {
  title: `${c.partner1.en} & ${c.partner2.en} — Wedding Invitation`,
  description: `You are cordially invited to the wedding of ${c.partner1.en} & ${c.partner2.en}`,
  openGraph: {
    title: `${c.partner1.en} & ${c.partner2.en} — Wedding Invitation`,
    description: `You are cordially invited to the wedding of ${c.partner1.en} & ${c.partner2.en}`,
    images: [weddingConfig.media.ogImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${c.partner1.en} & ${c.partner2.en} — Wedding Invitation`,
    description: `You are cordially invited to the wedding of ${c.partner1.en} & ${c.partner2.en}`,
    images: [weddingConfig.media.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
