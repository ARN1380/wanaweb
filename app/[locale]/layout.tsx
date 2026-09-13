import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Noto_Kufi_Arabic,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Arabic,
  Vazirmatn,
} from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "../globals.css";

import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import { getDictionary } from "@/lib/dictionaries";
import {
  defaultLocale,
  isLocale,
  localeConfig,
  locales,
  publicHref,
} from "@/lib/i18n";
import { cn } from "@/lib/util";

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

/*
  Persian and Arabic families. Geist has no Arabic-script coverage, so the RTL
  locales need their own body, label and accent faces — the roles are wired up
  once in `globals.css` under `html[lang]`.

  The accent faces are display scripts rather than text faces: Nastaliq for
  Persian (the calligraphic hand the language is set in when it wants to look
  like itself) and Kufi for Arabic (geometric, which is what the iridescent ramp
  wants to travel along). Both are Noto, so neither skips the letters or the
  marks these languages actually use.

  `preload: false` is deliberate: the browser only fetches a webfont when a
  rule actually uses it, so keeping these off the preload list costs the
  English pages nothing, while the RTL pages pick them up from the same
  stylesheet. Every font is self-hosted by `next/font` — no third-party font
  request at runtime.
*/
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

const arabicSans = Noto_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

const accentPersian = Noto_Nastaliq_Urdu({
  variable: "--font-accent-fa",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

const accentArabic = Noto_Kufi_Arabic({
  variable: "--font-accent-ar",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

/** Both scripts are covered by every one of the RTL variable classes. */
const fontVariables = cn(
  geistSans.variable,
  geistMono.variable,
  instrumentSerif.variable,
  vazirmatn.variable,
  arabicSans.variable,
  accentPersian.variable,
  accentArabic.variable,
);

/** One prerendered route per language; nothing else is routable. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** hreflang map for crawlers, plus the `x-default` the default locale owns. */
function languageAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [
        localeConfig[locale].hreflang,
        publicHref(locale),
      ]),
    ),
    "x-default": publicHref(defaultLocale),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(dict.site.url),
    title: { default: dict.meta.title, template: dict.meta.titleTemplate },
    description: dict.meta.description,
    applicationName: dict.site.name,
    keywords: [...dict.meta.keywords],
    authors: [{ name: dict.site.name, url: dict.site.url }],
    creator: dict.site.name,
    alternates: {
      canonical: publicHref(locale),
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      url: publicHref(locale),
      siteName: dict.site.name,
      locale: localeConfig[locale].htmlLang,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;

  // The middleware only ever rewrites onto a known locale; this is the
  // belt-and-braces path when a route is reached some other way.
  if (!isLocale(raw)) notFound();

  const dict = getDictionary(raw);
  const { htmlLang, direction } = localeConfig[raw];

  return (
    <html
      lang={htmlLang}
      dir={direction}
      className={cn(fontVariables, "h-full antialiased")}
    >
      <body className="relative min-h-full bg-ink text-bone">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-6 focus:start-6 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:text-ink focus:uppercase"
        >
          {dict.ui.skipToContent}
        </a>

        <div className="grid-pattern gridlines" aria-hidden="true" />
        <div className="aurora" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <Cursor />
        <SmoothScroll />
        {/* Mounted after SmoothScroll so its scroll-lock event has a listener. */}
        <Preloader
          tagline={dict.site.tagline}
          compiling={dict.ui.preloader.compiling}
        />
        <Nav locale={raw} nav={dict.nav} site={dict.site} ui={dict.ui} />

        <div className="relative z-10 flex min-h-full flex-col">
          {children}
          <Footer footer={dict.footer} site={dict.site} />
        </div>
      </body>
    </html>
  );
}
