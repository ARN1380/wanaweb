import Link from "next/link";

import { localeConfig, locales, publicHref, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/util";

type LanguageSwitcherProps = {
  locale: Locale;
  /** Accessible group name — the word for "language", translated. */
  label: string;
  className?: string;
};

/**
 * The available languages as a segmented pill.
 *
 * The current language is rendered as a span rather than a link, because there
 * is nowhere to navigate to. Every link carries `lang` and `hreflang`, so
 * assistive tech announces the target language instead of reading a translated
 * page in the wrong voice.
 */
export default function LanguageSwitcher({
  locale,
  label,
  className,
}: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-hairline p-0.5",
        className,
      )}
    >
      {locales.map((candidate) => {
        const { code, htmlLang, englishLabel } = localeConfig[candidate];
        const active = candidate === locale;
        const shared = cn(
          "rounded-full px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.14em] uppercase transition-colors duration-300",
          active ? "bg-lime/15 text-lime" : "text-muted hover:text-bone",
        );

        return active ? (
          <span
            key={candidate}
            lang={htmlLang}
            aria-current="true"
            aria-label={`${label}: ${englishLabel}`}
            className={shared}
          >
            {code}
          </span>
        ) : (
          <Link
            key={candidate}
            href={publicHref(candidate)}
            lang={htmlLang}
            hrefLang={htmlLang}
            aria-label={`${label}: ${englishLabel}`}
            className={shared}
          >
            {code}
          </Link>
        );
      })}
    </div>
  );
}
