# WanaWeb

The studio site for **WanaWeb** — an independent web studio building fast,
clean-coded, professionally crafted websites, including real-time 3D that runs
in the browser.

Built with Next.js (App Router), React 19, Tailwind CSS v4, React Three Fiber
and hand-written GLSL. Ships in **English, Persian and Arabic**.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
```

## Languages

The site is a single page, prerendered once per language:

| Language | URL | `lang` / `dir` | Fonts |
| --- | --- | --- | --- |
| English (default) | `/` | `en` / `ltr` | Geist, Geist Mono, Instrument Serif |
| Persian | `/fa` | `fa` / `rtl` | Vazirmatn + Lalezar (accent) |
| Arabic | `/ar` | `ar` / `rtl` | Noto Sans Arabic + Cairo Play (accent) |

- English keeps the unprefixed URL, so `/` stays canonical. `proxy.ts` rewrites
  unprefixed paths onto the default locale's route (`/en`) and redirects `/en/…`
  back to the unprefixed URL — one document per language, no duplicates.
- Every language is a static route: `/en`, `/fa` and `/ar` are prerendered at
  build time. The proxy only decides *which* one answers.
- `hreflang` alternates (`en`, `fa-IR`, `ar`, plus `x-default`) are emitted in the
  document head and in `sitemap.xml`.
- The language switcher lives in the nav (desktop and the mobile menu). Switching
  is a normal navigation, so the whole document — including `<html lang>` and
  `dir` — is re-rendered in the new language.
- The 404 is localised too: a `not-found` boundary cannot read route params, so
  the proxy passes the locale on the request and the boundary reads it back.

### Adding or changing a language

1. Add the locale code to `locales` in `lib/i18n.ts` and fill in its
   `localeConfig` entry (direction, labels, font key).
2. Copy `lib/dictionaries/en.ts` to `<locale>.ts`, translate the values and keep
   every key: the `Dictionary` type is derived from the English file, so a
   missing or misspelled field fails `tsc`. Register the file in
   `lib/dictionaries/index.ts`.
3. If the script is not Latin, add its families to `app/[locale]/layout.tsx` and
   map the type roles for `html[lang="<tag>"]` in `app/globals.css`.
4. Run the verification below — including a look at `/` and the new locale.

## What's on the page

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `components/Hero.tsx` | Masked line reveal over a live WebGL scene |
| Studio | `components/Manifesto.tsx` | Position, animated counters, three pillars |
| Selected work | `components/Work.tsx` | Four case studies in sticky-stacked cards |
| The gallery | `components/Showcase.tsx` | Scroll-scrubbed 3D wall of the four sites |
| Services | `components/Services.tsx` | Six capability cards |
| 3D Lab | `components/Lab.tsx` | Interactive, draggable 3D scene |
| Process | `components/Process.tsx` | Four phases with sticky scroll tracking |
| Toolkit | `components/Stack.tsx` | The technologies we actually use |
| Team | `components/Team.tsx` | Seven people, generated portraits from initials |
| Signal | `components/Testimonials.tsx` | Partner quotes |
| FAQ | `components/Faq.tsx` | Accessible accordion, no JS height measuring |
| Contact | `components/Contact.tsx` | Brief form that composes an email |

Also included: an intro preloader (`components/Preloader.tsx`, once per session),
a localised 404 (`app/[locale]/[...rest]/not-found.tsx`), and generated
`robots.txt` / `sitemap.xml` (`app/robots.ts`, `app/sitemap.ts`).

## The 3D work

Two independent WebGL scenes, both generated entirely in the browser. There are
**no model files and no downloaded textures** anywhere in this repository.

- **`components/three/HeroScene.tsx`** — an icosahedron displaced on the GPU by
  two octaves of 3D simplex noise (`components/three/shaders.ts`), shaded with an
  iridescent ramp and a fresnel rim, wrapped in a geodesic wireframe shell and a
  900-particle additive field. Post-processed with bloom and vignette.
- **`components/three/LabScene.tsx`** — a chrome torus knot, four refracting glass
  orbs and a 28-cube instanced halo, lit by a *procedurally rendered* environment
  built from `Lightformer`s. Drag to orbit; it auto-rotates otherwise.

## The gallery

`components/Showcase.tsx` + `components/SiteFrame.tsx` — a 3D wall of the four
case studies, turned by the page's own scroll.

- One tall track (`100svh + 62vh per slot`) holds a sticky viewport. Scroll
  progress fans out into a single transform per frame — sideways, back, and
  turned in — so nothing re-renders while the wall travels.
- `components/SiteFrame.tsx` is the preview: a browser window whose contents are
  **drawn in the browser** from the project's own copy and accent, down to the
  domain in the address bar. Consistent with the rest of the repository, there is
  no screenshot involved. Its type is sized in container units (`cqw`), so the
  same markup reads correctly as a phone-sized frame and as a 40 rem one.
- **RTL** is handled by one custom property: `--gallery-sign` is `1` in LTR and
  `-1` under `html[dir="rtl"]`, and the wall multiplies its horizontal offset and
  Y-rotation by it, so the gallery travels the other way without the component
  branching on direction.
- Accessibility: scrolling is the interaction, so the caption strip duplicates
  the state (index, client, sector) and the dots are anchors onto scroll markers
  (`#gallery-1`…`#gallery-4`) that SmoothScroll already knows how to reach.
- `prefers-reduced-motion` drops the whole 3D track and renders the same four
  previews as a static two-column grid instead. That is a *different tree*, so
  the check goes through `usePrefersReducedMotion()` in `components/Reveal.tsx`,
  which reads the media query through `useSyncExternalStore` — reading it during
  the first client render would mismatch the server's HTML and throw a hydration
  error.

### Performance guards

- Both canvases are dynamically imported with `ssr: false` and swap in a CSS
  gradient placeholder while loading.
- The render loop pauses (`frameloop="never"`) whenever the section scrolls out
  of view (`useInView`).
- Device pixel ratio is capped (`dpr={[1, 1.8]}` / `[1, 1.7]`).
- `prefers-reduced-motion` freezes all 3D animation and every CSS animation, and
  renders all reveal states immediately.
- The 28-cube halo is a single `InstancedMesh` — one draw call.

## Editing content

All copy lives in `lib/dictionaries/`, one file per language, with the same keys
in each — separate from layout and animation code:

| File | Contains |
| --- | --- |
| `lib/dictionaries/en.ts` | The reference dictionary: brand, nav, hero, marquee, stats, manifesto, services, projects, process, toolkit, 3D lab, team, testimonials, FAQ, contact, footer, UI strings |
| `lib/dictionaries/fa.ts`, `ar.ts` | The same structure, translated |
| `lib/dictionaries/types.ts` | `Dictionary`, derived from `en.ts`, plus the literal unions (`Accent`, `ServiceIconName`) components switch on |
| `lib/dictionaries/index.ts` | `getDictionary(locale)` |
| `lib/i18n.ts` | The locale list, per-locale metadata, URL helpers |
| `lib/util.ts` | Helpers (`cn`, `splitEmphasis`, `createRandom`, reduced-motion) |

The English dictionary is the schema: add a field there first, then in the other
languages, and the compiler will hold you to it. `emphasis` fields must be an
exact substring of the `title`/`headline` line they belong to — that is the word
`MaskedLines` renders in the accent face.

### Placeholders to replace before launch

- `site.url` in `lib/dictionaries/en.ts` — currently a placeholder domain, used
  as `metadataBase` and in the structured data.
- `site.email` — used by the contact form's `mailto:` handoff.
- `site.socials` — the X, LinkedIn and Dribbble URLs are placeholders.
- **Team names, roles and bios (`team.members` in each dictionary) are
  illustrative** — swap them for the real team, or delete entries (the grid
  reflows automatically). Alireza Naghavi and Abbas Vaziri are the two founders;
  Alireza leads the list.
- Testimonials (`testimonials.items`) are written as anonymous role + company
  attributions; replace them with real, attributable quotes before publishing.
- **Case studies (`projects.items`) are illustrative.** The client names,
  metrics and outcomes were written to demonstrate the layout. Replace them with
  real, permissioned work — or delete entries; the stack reflows automatically.

## Design system

Defined once in `app/globals.css`:

- Palette: obsidian `#050506`, warm bone `#f4f1ea`, and an iridescent
  violet → cyan → lime ramp with acid lime `#c8ff4d` as the signature accent.
- Type roles: `--font-body`, `--font-label` and `--font-accent`, resolved per
  locale from `html[lang]`. Latin uses Geist / Geist Mono / Instrument Serif
  italic; Persian uses Vazirmatn with **Lalezar** for the accent, and Arabic uses
  Noto Sans Arabic with **Cairo Play** (weight 700) for the accent (see
  **Languages**). Both RTL accents are modern *display* cuts rather than the
  traditional hands — they carry the iridescent gradient and drop only the italic
  slant, which is why the coloured word stays an accent even without one. The
  editorial accent is still written `<em class="serif-accent">`.
- RTL: `html[dir="rtl"]` zeroes letter-spacing (both scripts join cursively) and
  loosens the display leading so the masked reveal cannot clip descenders.
  Everything else — sizes, weights, ramps, masks, timings — is shared.
- Masked reveal: the line mask opens by `0.06em` at each end and the box is
  pulled back by the same amount, so ink that overflows the line box — a Latin
  italic swash, Nastaliq's ascenders — is never sliced, while the line itself
  stays exactly where the layout put it. Persian and Arabic ask for more (see
  `html[lang]` blocks in `globals.css`).
- Custom utilities: `kicker`, `display-type`, `serif-accent`,
  `iridescent-text`, `glass`, `hairline-t`, `hairline-b`.
- Supporting layers: film grain, aurora wash and a masked grid (`.grain`,
  `.aurora`, `.grid-pattern` + `.gridlines`, `.gallery-floor`).
- Accent tinting is shared: `lib/accents.ts` maps an accent name to the classes
  and colour the Selected Work section and the gallery both use, so the two
  cannot drift apart.

## Accessibility

Skip link, semantic landmarks, labelled form fields, `aria-live` form status,
visible `:focus-visible` rings, `aria-label`ed icon-only controls, decorative
layers marked `aria-hidden`, and a full `prefers-reduced-motion` path.

## Contact form

The form validates in the browser, then composes a pre-filled email and hands off
to the visitor's mail client — so there is no backend, no secret key and no
third-party service in the repository. To switch to a real endpoint, post
`FormState` from `components/Contact.tsx` to your own route handler instead of
setting `window.location.href`.
