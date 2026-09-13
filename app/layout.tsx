import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/content";

import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "web studio",
    "Next.js development",
    "React Three Fiber",
    "WebGL development",
    "3D websites",
    "performance engineering",
    "clean code",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-ink text-bone">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:text-ink focus:uppercase"
        >
          Skip to content
        </a>

        <div className="grid-pattern gridlines" aria-hidden="true" />
        <div className="aurora" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <Cursor />
        <SmoothScroll />
        {/* Mounted after SmoothScroll so its scroll-lock event has a listener. */}
        <Preloader />
        <Nav />

        <div className="relative z-10 flex min-h-full flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
