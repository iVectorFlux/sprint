import type { Metadata } from "next";
import { Libre_Baskerville, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lumi6 Skill Lab",
    template: "%s — Lumi6 Skill Lab",
  },
  description:
    "AI-native adaptive learning and simulation platform. Rapidly acquire, retain, and operationalize future-of-work capabilities through personalized deliberate practice.",
  keywords: [
    "AI learning",
    "skill development",
    "simulation",
    "adaptive learning",
    "corporate training",
    "deliberate practice",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
