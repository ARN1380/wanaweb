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
| Selected work | `components/Work.tsx` | Four live sites in sticky-stacked cards |
| The gallery | `components/Showcase.tsx` | WebGL room of the four sites, walked by scroll |
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

Three independent WebGL scenes. There are **no model files** anywhere in this
repository and every texture is generated in the browser — except the gallery's
four screenshots, which are real captures of the studio's live sites (see
**Screenshots** below).

- **`components/three/HeroScene.tsx`** — an icosahedron displaced on the GPU by
  two octaves of 3D simplex noise (`components/three/shaders.ts`), shaded with an
  iridescent ramp and a fresnel rim, wrapped in a geodesic wireframe shell and a
  900-particle additive field. Post-processed with bloom and vignette.
- **`components/three/LabScene.tsx`** — a chrome torus knot, four refracting glass
  orbs and a 28-cube instanced halo, lit by a *procedurally rendered* environment
  built from `Lightformer`s. Drag to orbit; it auto-rotates otherwise.
- **`components/three/GalleryScene.tsx`** — the gallery: four textured screens in a
  dark hall with a mirror floor, a key light that travels with the camera, and a
  camera dollied by the page's scroll.

## The gallery

`components/Showcase.tsx` — a real WebGL room with the four case studies hanging in
it as lit screens, which the page's own scroll walks you past.

- `components/three/GalleryScene.tsx` is the room: a canvas inside a sticky
  viewport, an opaque background (bloom adds light to transparent pixels and the
  browser throws it away — see §8.2), a procedurally lit environment, a genuinely
  reflecting floor, and a camera that reads scroll progress from a motion value
  **inside the frame loop**, so scrubbing the gallery never re-renders React.
- One tall track (`100svh + 62vh per site`) maps scroll distance onto the camera's
  travel. The caption strip, the dots and the scroll markers work exactly as they
  did before the renderer changed.
- Two renderers, one design: `components/three/siteTexture.ts` frames each site as
  a screen — device bezel, browser chrome, the deployment's real address, and the
  capture itself in the window — while `components/SiteFrame.tsx` is the same
  frame as real DOM, which is what the reduced-motion grid shows. They are
deliberate twins: **change both** when the frame's design changes.
- **RTL**: the room reads `document.documentElement.dir` when it builds its
  textures, so the Persian and Arabic walls are laid out right-to-left — first
  site on the right — and the camera travels that way with them.
- Accessibility: scrolling is the interaction, so the caption strip duplicates
  the state (index, client, sector) and the dots are anchors onto scroll markers
  (`#gallery-1`…`#gallery-4`) that SmoothScroll already knows how to reach.
- `prefers-reduced-motion` drops the whole 3D track and renders the same four
  previews as a static two-column grid instead. That is a *different tree*, so
  the check goes through `usePrefersReducedMotion()` in `components/Reveal.tsx`,
  which reads the media query through `useSyncExternalStore` — reading it during
  the first client render would mismatch the server's HTML and throw a hydration
  error.### Performance guards

- Both canvases are dynamically imported with `ssr: false` and swap in a CSS
gradient placeholder while loading.
- The render loop pauses (`frameloop="never"`) whenever the section scrolls out
  of view (`useInView`) — and that same signal gates the screenshots, so the
  captures are only fetched once the wall is actually reached.
- Device pixel ratio is capped (`dpr={[1, 1.8]}` / `[1, 1.7]`), and the gallery
  re-asserts its drawing buffer against its own box every frame — see the note on
  R3F's container measurement below.
- `prefers-reduced-motion` freezes all 3D animation and every CSS animation, and
  renders all reveal states immediately.
- The 28-cube halo is a single `InstancedMesh` — one draw call.

### A note on canvas sizing

R3F measures a canvas's container when it mounts and keeps that value. On this
site it has latched a *stale* one: measured in the Persian page, a 1425×1001
drawing buffer inside a 1425×900 box. A buffer that disagrees with its box renders
the scene at the wrong aspect — visibly stretched — and only in that locale.
`components/three/GalleryScene.tsx` therefore compares the canvas's own buffer
against its host element every frame and corrects the renderer and the store when
they disagree; it settles within a frame or two and then does nothing.

## Screenshots

The gallery hangs four **real captures** of the studio's live sites on its wall.
They live in `public/shots/` and every frame reads them through `lib/shots.ts`,
which pairs a project id with its image, its deployment URL and the address the
chrome shows.

```bash
node scripts/capture-shots.mjs               # all four sites
node scripts/capture-shots.mjs godot-cafe    # just one
node scripts/capture-shots.mjs --text        # print each page's copy, for the dictionaries
```

The script drives headless Chrome over the DevTools protocol: it warms the page
by scrolling it once (so lazy content exists), waits for the webfonts, captures
beyond the fold, and re-encodes the result at the 964 px the panel's screen area
actually needs. It also measures each shot and prints the numbers: a WebGL page
renders to a *flat* canvas in a browser with no GPU and reports no error while
doing it, so every run prints pixel statistics and warns when a capture looks
blank.

Re-run it when a site changes: a stale screenshot is a stale claim. Tune
`VIEWPORT`, `TARGET_WIDTH` and `SETTLE` at the top of the script if a capture
needs different treatment.

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
| `lib/shots.ts` | Project id → screenshot, source URL and displayed address |
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
- **The four projects are the studio's own live sites** — an ARN portfolio, Café
  Godot, Kafe Nooshin and Minus One. Their copy describes what each site actually
  is and claims nothing about delivery that has not been measured: the invented
  metrics and years were removed rather than replaced with guesses. Add real
  figures only when you have them.
- The frames' address bars show `*.vercel.app` **deployment hosts**, because those
  are where the sites are served from. When a real domain is attached, update
  `lib/shots.ts` and re-capture (see **Screenshots**).

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
  `.aurora`, `.grid-pattern` + `.gridlines`).
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
