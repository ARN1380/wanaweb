import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_HEADER, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

/** Static assets and metadata routes never take part in locale routing. */
const FILE_PATH = /\.[a-z0-9]+$/i;

/**
 * Tag the request with the locale the route is about to render. The page props
 * carry it for real routes; this is how the 404 boundary — which receives no
 * params — still finds it.
 */
function requestWithLocale(request: NextRequest, locale: Locale): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  return requestHeaders;
}

/**
 * Locale routing, with English unprefixed.
 *
 * `/` is rewritten onto the default locale's route (`/en`) so the canonical
 * home page stays the bare domain and every locale is still prerendered as a
 * static route. `/en/…` is redirected back to the unprefixed URL so the same
 * document is never crawlable twice, and any path whose first segment is not a
 * known locale is treated as default-locale content — which is what lets the
 * `[locale]/[...rest]` route answer with a localised 404.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (FILE_PATH.test(pathname)) return NextResponse.next();

  const segment = pathname.split("/")[1] ?? "";

  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(segment)) {
    return NextResponse.next({
      request: { headers: requestWithLocale(request, segment) },
    });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.rewrite(url, {
    request: { headers: requestWithLocale(request, defaultLocale) },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
