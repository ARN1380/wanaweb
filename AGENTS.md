# AGENTS.md

> **Read this file before touching anything.** It is the shared, persistent memory
> of every agent that works on this repository. It exists so that any agent can
> pick up exactly where the last one stopped — without re-discovering the
> architecture, breaking conventions, or repeating solved mistakes.

---

## 0. The rule every agent must follow

**This is not optional and it applies to every agent, every session.**

Before you finish a work session on this repository, you must:

1. **Update the Status Board** (§2) if you changed what is done, in progress, or
   deliberately out of scope.
2. **Append an entry to the Agent Log** (§11). Never edit or delete an existing
   entry — the log is append-only. A valid entry has:
   - a timestamp and the agent/author name,
   - **a brief of what you are doing** — the goal, in one or two sentences,
   - the files you created or modified,
   - the exact verification you ran and its result,
   - what is left, and what the next agent should do.
3. **Update `README.md`** if your change affects setup, usage, content locations,
   or anything a human developer needs to know.
4. **Update the Backlog** (§10) — move what you finished out, add what you
   discovered, and leave hints for the next agent.
5. **Never leave the repository in a state that fails `tsc` or `lint`.** If you
   must, say so loudly in the Agent Log and in §2, with the reason.

If you are running as a sub-agent or teammate, your final message back to the
orchestrator must also summarise your Agent Log entry. The orchestrator is
responsible for making sure it reaches this file.

**Why this matters:** the value of this repo is not only the site — it is the
accumulated knowledge of how it was built. Undocumented work is wasted work.

---

## 1. What this project is

**WanaWeb** is the marketing site for a small independent web studio. The studio's
pitch is threefold, and the site must *demonstrate* all three rather than claim them:

1. **Fast** — performance budgets, measured and enforced.
2. **Clean code** — strict TypeScript, small composable components, documented.
3. **Real 3D** — hand-written WebGL/GLSL, not decorative stock animation.

It is a single-page, statically prerendered site (App Router) published in
**English, Persian and Arabic**, with two live WebGL scenes, an editorial design
system, and a contact form that hands off to email.

**Live repository:** https://github.com/ARN1380/wanaweb

---

## 2. Status board

| Area | State | Notes |
| --- | --- | --- |
| Scaffold + tooling | ✅ Done | Next.js 16.3.5, React 19.2, TS 5, Tailwind v4, ESLint 9 |
| Design system (`app/globals.css`) | ✅ Done | Tokens, utilities, grain/aurora/grid, reduced-motion |
| Content layer (`lib/`) | ✅ Done | All copy centralised; no strings inside components |
| Nav + Footer | ✅ Done | Scroll progress, scroll-spy, full-screen mobile menu |
| Hero + WebGL scene | ✅ Done | GPU noise-displaced core, particle field, bloom |
| Studio / Manifesto | ✅ Done | Animated counters, three pillars |
| Services | ✅ Done | Six cards, gradient rings |
| 3D Lab | ✅ Done | Torus knot, transmissive glass orbs, instanced halo |
| Process | ✅ Done | Sticky scroll tracking |
| Toolkit / Stack | ✅ Done | Four groups |
| Team | ✅ Done | Seven members, generated monogram avatars |
| Testimonials | ✅ Done | Three quotes, anonymised attribution |
| Contact form | ✅ Done | Client validation + `mailto:` handoff (no backend) |
| **Selected Work** | ✅ Done | Four case studies, sticky-stacked cards |
| **Site gallery (WebGL room)** | ✅ Done | Real 3D room of the four sites, camera dollied by scroll; screens are runtime canvas textures — see §8.15–8.17 |
| **FAQ** | ✅ Done | Accessible accordion |
| **Intro preloader** | ✅ Done | Once per session, respects reduced motion |
| **Multilingual routing** | ✅ Done | `/` = English, `/fa`, `/ar`; all three prerendered |
| **RTL + locale fonts** | ✅ Done | `html[lang]` type roles, `dir="rtl"` typography — see §5 |
| **Accent display faces** | ✅ Done | Lalezar (fa) / Cairo Play (ar) on the coloured words, with measured mask headroom — see §8.14 |
| **Language switcher** | ✅ Done | `components/LanguageSwitcher.tsx`, desktop nav + mobile menu |
| **Custom 404** | ✅ Done | `app/[locale]/[...rest]/not-found.tsx`, localised |
| **sitemap / robots** | ✅ Done | `app/sitemap.ts` (hreflang), `app/robots.ts` |
| Persian / Arabic copy review | ⬜ Blocked | Machine-drafted, needs a native speaker — see §8 |
| Real project photography | ⛔ Out of scope | No image assets by design — see §8 |
| Contact backend | ⛔ Out of scope | Deliberately client-side only — see §8 |
| Deployment (Vercel) | ⬜ Not done | Repo pushes fine; no Vercel project linked |
| Domain + real content | ⬜ Blocked | Needs the human — see §8 "Placeholders" |

Legend: ✅ done · 🔄 in progress · ⬜ not started · ⛔ deliberately not doing

---

## 3. Architecture / file map

```
wanaweb/
├─ proxy.ts              ← locale routing: `/` → `/en`, `/en/…` → `/`, unknown → default
├─ app/
│  ├─ globals.css        ← THE design system. Single source of visual truth.
│  ├─ [locale]/
│  │  ├─ layout.tsx      ← THE root layout: <html lang dir>, fonts, metadata, chrome
│  │  ├─ page.tsx        ← section composition + JSON-LD. Keep this file thin.
│  │  └─ [...rest]/
│  │     ├─ page.tsx     ← anything else under a locale: calls notFound()
│  │     └─ not-found.tsx← the 404, localised from the request header
│  ├─ sitemap.ts         ← generated /sitemap.xml, with hreflang alternates
│  └─ robots.ts          ← generated /robots.txt
├─ components/
│  ├─ three/
│  │  ├─ shaders.ts      ← ALL GLSL lives here (incl. Ashima simplex noise, MIT)
│  │  ├─ HeroScene.tsx   ← hero canvas: Core + ParticleField
│  │  ├─ LabScene.tsx    ← lab canvas: composition, lights, OrbitControls
│  │  ├─ LabObjects.tsx  ← knot / glass orbs / instanced cube ring
│  │  ├─ GalleryScene.tsx ← gallery canvas: room, camera rig, viewport guard
│  │  ├─ GalleryObjects.tsx ← textured site panels + reflective hall floor
│  │  └─ siteTexture.ts  ← draws a project's site into a canvas texture
│  ├─ sections           ← Hero, Manifesto, Work, Showcase (the gallery),
│  │                       SiteFrame (a site mockup), Services, Lab, Process,
│  │                       Stack, Team, Testimonials, Faq, Contact│  └─ atoms             ← Nav, Footer, Logo, LanguageSwitcher, Reveal,
│                          SectionHeading, Marquee, Magnetic, Counter, Cursor,
│                          SmoothScroll, Preloader, ServiceIcon
└─ lib/
   ├─ i18n.ts            ← locale list, per-locale config, URL helpers, LOCALE_HEADER
   ├─ dictionaries/
   │  ├─ en.ts           ← the reference dictionary: schema + copy
   │  ├─ fa.ts, ar.ts    ← translations, type-checked against en.ts
   │  ├─ types.ts        ← Widen, Dictionary, Accent, ServiceIconName
   │  └─ index.ts        ← getDictionary(locale)
   ├─ util.ts            ← cn, splitEmphasis, createRandom, prefersReducedMotion,
   │                       NAV_OFFSET, setSmoothScrollStopped
   └─ accents.ts         ← accent → class/colour maps shared by Work and Showcase
                           setSmoothScrollStopped
```

**Data flow:** `getDictionary(locale)` → `app/[locale]/page.tsx` → section
components → atoms. Atoms hold no marketing copy. `app/globals.css` is imported
once, in the root layout.

**Hard rule: never hardcode a user-visible string in a component.** It belongs in
`lib/dictionaries/*.ts` — in *every* locale. `en.ts` is the schema.

**Hard rule: sections never import a dictionary.** They receive the copy they
render as props, so a page ships one language's strings and nothing else.

---

## 4. Conventions you must follow

- **TypeScript:** strict. No `any`. Type props with a local `type XxxProps = { … }`.
- **No UMD `React.*` namespace.** Inside a module, `React.ReactNode` does not
  resolve and fails the build. Import types explicitly:
  `import type { ReactNode, CSSProperties } from "react";`
- **Client components:** add `"use client"` only where genuinely needed (hooks,
  browser APIs, motion, R3F). Everything else stays a server component.
- **3D is always dynamically imported:**
  `dynamic(() => import("@/components/three/X"), { ssr: false, loading: () => <div className="canvas-fallback absolute inset-0" /> })`
- **Class names:** compose with `cn()` from `lib/util.ts`. Never concatenate strings.
- **New copy → new field in `lib/`.** New visual token → `app/globals.css`.
- **Comments explain *why*, not *what*.** Match the existing density and tone.
- **File size limit:** the editor tool rejects a single edit over ~6000 characters.
  Split large files into small sequential edits (create, then append using a unique
  `old_text` anchor). This bites everyone — plan for it.

### Internationalisation conventions

- **Copy lives in `lib/dictionaries/`, never in a component.** `en.ts` is the
  schema: `Dictionary` is derived from it, so adding a field there and forgetting
  it in `fa.ts`/`ar.ts` is a `tsc` error, not a half-translated page.
- **Never import a dictionary into a section.** Sections take the slice they
  render as a prop (`dict.hero`, `dict.faq`, `ui`, …). Client components in
  particular: whatever you pass is serialised into the RSC payload, so slice,
  do not hand over the whole dictionary.
- **`emphasis` must be an exact substring of its `title`/`headline` line.**
  `MaskedLines` uses `splitEmphasis` to find the word it renders in the accent
  face; if it does not match, that heading silently loses its accent styling.
- **Latin stays Latin.** Brand names, technology names, project ids, accent
  names, `href`s and numerals are the same in every dictionary. Do not localise
  digits — the section numbering and metrics are Latin by design.
- **New locale roles go in `globals.css`.** Add the family in
  `app/[locale]/layout.tsx`, then map `--font-body` / `--font-label` /
  `--font-accent` under `html[lang="…"]`.
- **RTL is CSS, not branches.** Use logical utilities (`ps-*`, `text-start`), the
  `.arrow-forward` / `.flip-rtl` classes for direction-aware glyphs, and check
  that `document.documentElement.scrollWidth === clientWidth` on a RTL page
  before you call it done.

### Motion conventions

- Global easing is `--ease-out-expo`; in Tailwind use the `ease-expo` class.
- Reveals use the existing primitives — `<FadeUp>` and `<MaskedLines>` from
  `components/Reveal.tsx`. Do not hand-roll new scroll reveals.
- **Every animation needs a reduced-motion path.** Global CSS kills transitions
  under `prefers-reduced-motion`; anything JS-driven must also check
  `prefersReducedMotion()` from `lib/util.ts`.

---

## 5. Design system reference

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#050506` | Page canvas |
| `--ink-raised` | `#0b0b10` | Panels |
| `--bone` | `#f4f1ea` | Primary text (warm off-white) |
| `--muted` | bone @ 56% | Secondary text |
| `--hairline` | bone @ 9% | 1px dividers |
| `--violet` | `#7c5cff` | Iridescent ramp start |
| `--cyan` | `#3ddcff` | Ramp middle |
| `--lime` | `#c8ff4d` | **Signature accent**, CTAs |
| `--iridescent` | violet→cyan→lime, 115° | Gradient text and fills |

**Type:** Geist (display/UI) · Geist Mono (kickers, labels, numerals) ·
Instrument Serif *italic* (editorial accent words, applied via
`<em className="serif-accent">` inside `MaskedLines`). Persian and Arabic swap
in their own families through the same three roles — see *Languages and type
roles* at the end of this section.

**Accent faces are modern display cuts, not a Latin italic.** The coloured word
in a headline renders in **Lalezar** in Persian and **Cairo Play** in Arabic
(`--font-accent-fa` / `--font-accent-ar`, wired to `--font-accent` under
`html[lang]`). Both are contemporary display faces, both drop the italic slant (a
synthesised oblique breaks cursive letterforms) and both keep the iridescent
ramp. The Arabic accent is set at weight 700 so it carries the same optical
weight as Lalezar, which is heavy at its only weight. If you add a locale, pick a
*display* cut for its accent — a text face renders like a fallback. If you change
one, re-measure the mask headroom (§8.14).

**Custom utilities in `globals.css`:** `kicker`, `display-type`, `serif-accent`,
`iridescent-text`, `glass`, `hairline-t`, `hairline-b`.
**Layers:** `.grain`, `.aurora`, `.grid-pattern` + `.gridlines` (fixed) /
`.gridlines-local` (absolute), `.noise-veil`, `.canvas-fallback`.
**Cursor:** `body.has-custom-cursor`; elements opt in with `data-cursor="hover"|"drag"`.
**Z-index map:** content `z-10` · nav `z-70` · progress bar `z-80` · grain `z-90` ·
preloader `z-95` · cursor `z-100`. Respect this map; do not invent new layers.

**Languages and type roles.** Every type style resolves through three variables —
`--font-body` (display + body), `--font-label` (kickers, labels, numerals),
`--font-accent` (the editorial `serif-accent`) — which `html[lang]` swaps per
locale. `app/globals.css` also carries the only RTL-specific rules there are, and
they are typographic necessities rather than taste: Arabic script joins cursively,
so tracking is zeroed, and its ascenders/descenders need more leading than the
Latin ramp's `0.92` or the masked reveal clips them. A new locale needs no
component changes — only a dictionary and a `html[lang]` block.

**Locale URLs.** `lib/i18n.ts` owns the mapping: `localePath()` is the internal
route the router matches (`/en`, `/fa`, `/ar`), `publicHref()` is the canonical
URL to link and crawl (`/`, `/fa`, `/ar`). Use `publicHref` for anything a human
or a crawler follows; only `proxy.ts` deals in `localePath`.

**Section numbering:** `SectionHeading` takes an explicit `index`. The numbered run
is Studio=1, Services=2, Lab=3, Process=4, Stack=5, Team=6, Signal=7, Contact=8.
`Work` and `Faq` deliberately sit outside that run (they render their own headers).
If you insert a numbered section, renumber the whole set — do not leave gaps.

---

## 6. Verification workflow — run all four, every time

Work from `D:\Naghavi\temp\wanaweb`.

```powershell
# 1. types
npx tsc --noEmit                              # must be silent
# 2. lint  (includes Next 16's React Compiler rules)
npm run lint                                  # must be silent
# 3. production build
npm run build                                 # must print "Compiled successfully"
# 4. runtime smoke test
npx next start -p 3123                        # then:
curl.exe -s -o page.html -w "%{http_code}" http://localhost:3123/
```

For step 4, grep the saved HTML for headline copy and for `canvas-fallback` (the
3D placeholder that must appear in SSR output). A passing smoke test is
**HTTP 200 + expected copy present + no React error markers**.

**Multilingual smoke test** — run this as well whenever you touch routing, fonts
or a dictionary. The status codes *are* the routing contract:

```powershell
$expect = @{ "/" = 200; "/fa" = 200; "/ar" = 200; "/en" = 308; "/nope" = 404; "/fa/nope" = 404 }
foreach ($p in $expect.Keys) {
  "$p -> $(curl.exe -s -o /dev/null -w '%{http_code}' "http://localhost:3123$p") (expect $($expect[$p]))"
}
# The document must declare the language it is written in, not just return it:
curl.exe -s http://localhost:3123/fa | Select-String 'lang="fa"','dir="rtl"'
curl.exe -s http://localhost:3123/ar | Select-String 'lang="ar"','dir="rtl"'
```

Two checks an HTML grep cannot make — do them in a browser (headless Chrome over
the DevTools protocol works well and is how the last session verified this):

- `document.documentElement.clientWidth === scrollWidth`. RTL layouts overflow
  silently; the whole page gaining a horizontal scrollbar is the classic symptom.
- `getComputedStyle(document.body).fontFamily` starts with the locale's family
  (Vazirmatn / Noto Sans Arabic), and `document.fonts` shows it as loaded. If the
  family is missing from the CSS, the page silently falls back to a system font.
- The accent face is the one that actually clips: measure **real ink** with
  `ctx.measureText().actualBoundingBoxAscent/Descent` against the `.reveal-mask`
  box, using a zero-height `inline-block` probe to find each baseline. Comparing
  element boxes instead will tell you a lie — see §8.14.

### Environment gotchas (learned the hard way — do not re-learn these)

| Gotcha | What to do instead |
| --- | --- |
| Shell commands **time out at 30 s** | Never run `npm install`/`build` inline. Use `Start-Process cmd.exe -ArgumentList "/c <cmd> > D:\Naghavi\temp\x.log 2>&1" -WindowStyle Hidden`, then poll the log with a separate command. |
| `Invoke-WebRequest` fails in NonInteractive mode | Use `curl.exe` (not the `Invoke-WebRequest` cmdlet, not the `curl` alias). |
| No `gh` CLI, no `GITHUB_TOKEN` | Push over HTTPS. Git Credential Manager (`manager`) is already authenticated — `git push` just works. |
| Git prints progress to stderr | PowerShell surfaces it as red `NativeCommandError` text. Read `$LASTEXITCODE` to judge success; exit 0 means it worked. |
| Editor tool rejects edits > ~6000 chars | Split into create + append-with-anchor edits. |
| `LayoutProps<"/">` type not found in `tsc` | It only exists after Next generates its route types. Type layout props explicitly instead. |
| A media query read during render breaks hydration | It is a *tree* mismatch when the component renders a different structure, and React throws `Minified React error #418`. Branch on reduced motion only through `usePrefersReducedMotion()` (`components/Reveal.tsx`), which carries a server snapshot — see §8.15. |

### React Compiler lint rules (Next 16 / eslint-config-next)

These are **errors**, not warnings. Two traps already solved here:

1. **`react-hooks/purity` — no impure calls during render.** `Math.random()` inside
   `useMemo`/render is rejected. Use `createRandom(seed)` from `lib/util.ts`
   (deterministic mulberry32) so generated scenes are also stable across builds.
2. **`react-hooks/immutability` — do not mutate hook return values.** Mutating a
   `useMemo`-returned `uniforms` object inside `useFrame` is rejected. Instead keep
   a `materialRef` and mutate `materialRef.current.uniforms.*`.

Never silence these with `eslint-disable` — restructure the code, as above.

---

## 7. Publishing

```powershell
cd D:\Naghavi\temp\wanaweb
git add -A
git commit -m "type: summary" -m "body"
git push                                 # origin = https://github.com/ARN1380/wanaweb.git
git ls-remote origin                     # confirm the remote SHA matches local HEAD
```

The remote `main` is the source of truth for review. Commit messages are
conventional-prefixed (`feat:`, `fix:`, `docs:`, `perf:`, `refactor:`).

---

## 8. Known limitations & deliberate decisions

These are **conscious choices**, not oversights. Do not "fix" them without reading this.

1. **No image assets anywhere.** Every visual is CSS, SVG or WebGL — so the repo
   stays self-contained, has no licensing questions, and nothing blocks the LCP.
   Case-study imagery and real team photos are the natural next addition.
2. **Both canvases have an opaque `#050506` background.** This is required: bloom
   adds light to transparent pixels, which the browser then discards (alpha 0), so
   the glow would be invisible. The hero instead layers gridlines and a `noise-veil`
   *above* the canvas to blend it into the page.
3. **`decay={0}` on point/spot lights in `LabScene`.** three r155+ uses physically
   correct lighting, so intensities fall off as 1/d² and small values render black.
4. **The environment map is procedural.** `Environment` wraps `Lightformer`
   children, so no HDRI is fetched from a CDN at runtime.
5. **The contact form has no backend.** It validates, composes a pre-filled
   `mailto:`, and hands off to the visitor's mail client. No secrets, no spam
   surface. Swapping in a route handler is documented in `README.md`.
6. **The preloader is decorative** and runs at most once per browser session
   (`sessionStorage`), never for reduced-motion users.
7. **Team names, bios, testimonials and case-study metrics are placeholders.**
   They are written to be plausible and to exercise the layout. Replace before launch.
8. **The preloader costs LCP.** It covers the viewport for ~0.9 s, so
   Largest Contentful Paint is attributed to it rather than the hero. That is an
   accepted trade for a creative studio site. If you ever need to chase a perfect
   Lighthouse score, shorten `DURATION` in `components/Preloader.tsx` to `0` or
   delete the component from `app/layout.tsx` — the site is complete without it.
9. **`next.config.ts` opts into `experimental.optimizePackageImports`.** The build
   prints an informational "Experiments (use with caution)" line for it. That is
   expected, not a warning. It exists to tree-shake `motion` and
   `@react-three/drei`; remove it only if it ever changes the rendered output.
10. **The hero core is intentionally dim.** It sits directly behind the headline,
    so its exposure is a legibility budget, not a taste call. Current values:
    fresnel `0.85`, a global `color *= 0.85` in `coreFragmentShader`, and bloom at
    `luminanceThreshold 0.35` / `intensity 0.9`. If you brighten any of these,
    re-check that the hero `h1` and sub-copy are still comfortably readable.

11. **The RTL typographic overrides in `globals.css` are required, not stylistic.**
    Arabic script joins cursively, so the Latin ramp's tracking (positive *and*
    negative) has to be zeroed for `dir="rtl"`, and the display leading is raised
    from `0.92` to `1.3` — otherwise the masked line reveal clips Persian and
    Arabic descenders. Sizes, weights, gradients, masks and timings are unchanged;
    only these two Latin-only properties stand down.
12. **The Persian and Arabic fonts are not preloaded.** They are instantiated with
    `preload: false` so the English page's critical path stays exactly as it was;
    the browser fetches them when a rule actually uses them. They are still
    self-hosted by `next/font` — no third-party font request at runtime. The swap
    lands behind the intro curtain, and on repeat visits the font is cached.
13. **The fa/ar copy is machine-drafted.** It is written to be idiomatic and to
    exercise the layout (same line counts, same emphasis words), but nobody has
    proof-read it as a native speaker. Treat it as a first pass — see the status
    board.
14. **The masked reveal opens its window wider than the Latin mask, and each
    script asks for its own amount.** The mask is `overflow: hidden`, so whatever
    ink overflows the line box is cut off, and a canvas ink box says that is real:
    ~2 px of the Latin Instrument Serif descender, 36 px (0.48em) of Nastaliq
    ascenders in Persian under the old calligraphic pairing, and ~16 px of Cairo
    Play's descender when the accent was first swapped in at Kufi's old padding.
    Each locale gets the headroom its *current* face needs, and every rule pairs
    `padding` with an equal, opposite `margin`, so the window grows while the
    **line itself does not move** — the heading metrics are byte-identical to the
    Latin ones:

    | Selector | top | bottom (net flow) |
    | --- | --- | --- |
    | `.reveal-mask` | `0.06em` | `0.12em` with `margin-bottom: -0.06em` → `0.06em` |
    | `html[dir="rtl"] .reveal-mask` | – | `0.12em` with `margin-bottom: -0.06em` → `0.06em` |
    | `html[lang="fa"] .reveal-mask` | `0.12em` | inherited |
    | `html[lang="ar"] .reveal-mask` | `0.12em` | inherited |

    The RTL rows were `0.36em` / `0.6em` / `0.3em` while the accents were Nastaliq
    and Kufi; Lalezar and Cairo Play descend far less, so the RTL mask now matches
    the Latin one and RTL headings regained the Latin rhythm. Measured clearances
    after the swap (minimum across every masked accent run, at the largest
    heading): Persian **+14 / +15.5 px**, Arabic **+9.2 / +13.5 px**, Latin
    **+7.4 / +2.5 px**.

    Do not "tidy" those negative margins away: deleting one silently adds or
    removes vertical space in that locale's headings. If you change an accent face
    or its size, re-measure before trusting it — an ascent is not predictable from
    an em box. Note that a masked line is *translated* until its reveal fires, and
    a transform moves `getBoundingClientRect`: settle the reveals before measuring
    or every number comes back wrong.

15. **The gallery's reduced-motion branch is a different *tree*, which is why it
    cannot use `useReducedMotion`.** `components/Showcase.tsx` renders either a
    scroll-scrubbed 3D track or a static two-column grid. `motion`'s
    `useReducedMotion()` resolves the media query during the first client render —
    which the server cannot know about — so React reported a hydration error
    (#418) and regenerated the section on the client, every load, for
    reduced-motion visitors. `usePrefersReducedMotion()` in
    `components/Reveal.tsx` reads the same query through `useSyncExternalStore`
    with an explicit server snapshot, so hydration keeps the server's tree and the
    grid arrives one render later. Verified in dev mode: the error is present with
    the motion hook and gone with the store hook. It only bites when the
    *structure* changes — `Work.tsx` uses the plain `prefersReducedMotion()` util
    for a style-only difference, which React patches silently (§10.12).
16. **The gallery's screens are not screenshots.** `components/three/siteTexture.ts`
    paints each client's site into a canvas — bezel, chrome, domain, headline,
    metrics, RTL-aware — and that canvas is the texture on the 3D panel, so the
    gallery adds no assets and no network requests. The same mockup exists as real
    DOM in `components/SiteFrame.tsx`, which is what the reduced-motion grid
    renders: crisp text, real copy, screen-readable. The two are deliberate twins,
    so **change both** when the mockup's design changes. If real photography ever
    lands (§10.1), it belongs inside the screen's viewport area, behind the chrome
    and the caption strip, in both twins.
17. **R3F's container measurement latches, and the gallery guards against it.**
    Measured on this site: in the Persian page the gallery canvas was sized
    **1425×1001 inside a 1425×900 box** — and at that moment so were the hero's
    and the lab's canvases. A drawing buffer that disagrees with its box renders
    the scene at the wrong aspect (vertically stretched), in one locale only, with
    no console error. Neither gating the canvas on `document.fonts.ready` nor
    comparing R3F's `size` against the host fixed it: the store reported the
    correct height while the canvas kept the wrong one. `ViewportGuard` in
    `GalleryScene.tsx` therefore compares the **buffer itself** — ground truth —
    against the host box each frame and corrects `gl` and the store; it settles in
    a frame or two. The hero and lab canvases carry the same latent bug (§10.15).

### Placeholders the human must supply

- `site.url` (`https://wanaweb.studio`) — used as `metadataBase` and in JSON-LD.
- `site.email` (`hello@wanaweb.studio`) — used by the contact form and footer.
- `site.socials` — X / LinkedIn / Dribbble URLs are dummies.
- Team members (`lib/people.ts`), testimonials (same file).
- A native-speaker review of `lib/dictionaries/fa.ts` and `ar.ts` — the tone, the
  pricing bands and the testaments all deserve a real reader before launch.
- Case studies (`lib/dictionaries/en.ts`, `projects.items`) — client names, metrics
  and outcomes are illustrative.

---

## 9. Recipe: how to add a new section

1. Add the copy to **every** dictionary in `lib/dictionaries/` — `en.ts` first, it
   is the schema — and let `tsc` tell you what the other two are missing.
2. Create `components/YourSection.tsx`. Server component unless it needs hooks.
3. If it needs a heading, use `<SectionHeading index={n} label lines emphasis body />`
   and renumber the numbered run (§5).
4. If it needs motion, use `<FadeUp>` / `<MaskedLines>` from `components/Reveal.tsx`.
5. If it needs 3D, put the canvas in `components/three/` and dynamic-import it with
   `ssr: false` and a `.canvas-fallback` placeholder.
6. Register it in `app/page.tsx` **and** add a nav/footer link (`lib/content.ts`,
   `lib/contact.ts`) so it is reachable.
7. Run all four verification steps (§6). Then do §0.

---

## 10. Backlog — highest value first

| # | Item | Why | Hint |
| --- | --- | --- | --- |
| 1 | Real case-study imagery | Currently the work cards use generated gradients only | Add `next/image` with local files in `public/`, then set `images.formats` in `next.config.ts`. Keep them out of the critical path. |
| 2 | Case-study detail pages | `/work/[slug]` would deepen the IA | `projects` already has `id` + `slug`-ready data in `lib/projects.ts` |
| 3 | Dynamic OG image | Social shares currently fall back to a plain card | `app/opengraph-image.tsx` with `next/og` `ImageResponse` |
| 4 | Deploy to Vercel | Repo is push-ready but not hosted | `vercel link` then `vercel --prod`; no env vars required |
| 5 | Contact route handler | Removes the `mailto:` dependency | `app/api/brief/route.ts` + a provider (Resend). Read §8.5 first. |
| 6 | Bundle budget in CI | Makes the "fast" claim enforceable | GitHub Action running `next build` + a size check on `.next/static` |
| 7 | Lighthouse CI | Same reason | `@lhci/cli` against the Vercel preview URL |
| 8 | Heading-level audit | Ensure one `h1` and no skipped levels | Hero owns the `h1`; every section uses `h2` |
| 9 | WebGPU renderer path | Three.js/TSL alternative for capable browsers | Only if it degrades cleanly; see Codrops TSL experiments |
| 10 | Native-speaker pass on the fa/ar copy | The dictionaries are machine-drafted, not proof-read | Read `lib/dictionaries/fa.ts` and `ar.ts` end to end; keep every `emphasis` an exact substring |
| 11 | Locale switcher in the footer | The switcher is only in the nav today | Same component, pass `locale` + `ui.language.label`; `Footer` already has `site` |
| 12 | Move `Work.tsx` onto `usePrefersReducedMotion` | It is the last place that resolves a media query during the first client render | Style-only today, so React patches it silently — but it is the same trap as §8.15, one branch away from becoming a real error |
| 13 | Let the gallery frames open the case studies | A frame is currently only a picture; the caption CTA goes to `#contact` | Needs §10.2 first: wrap `SiteFrame` in a link to `/work/[slug]` and let the front frame own the clickable layer, not all four |
| 14 | A nav entry for the gallery | It is reachable only by scrolling past Work and from the footer's Explore column | At 1024 px the desktop nav has **101 px** of slack and a seventh item needs ~93 px. Re-measure before adding one, and never at 1440 only — the binding width is exactly 1024 |
| 15 | Guard the hero and lab canvases the same way | §8.17 is a framework-level latch, not a gallery bug — those two canvases are unguarded | Reuse `ViewportGuard`; it is a few lines and needs its own canvas's `gl` and `setSize`. Verify by comparing `canvas.height` with the host's `clientHeight` in each locale |
| 16 | Real textures for the gallery screens | §8.16's screens are drawn; a studio with real work wants photographs | Same seam as §10.1: an `ImageBitmap` from `public/` swapped for the generated canvas, keeping `siteTexture.ts`'s geometry |

---

## 11. Agent log (append-only — newest at the bottom)

### 2026-09-13 · Cline (session 1) · scaffold → first deployment

**What I was doing.** Build the entire WanaWeb studio site from an empty repo:
benchmark award-winning agency design, scaffold Next.js 16, design a creative dark
editorial system, add two real WebGL scenes, write all the studio copy, verify, and
push to `github.com/ARN1380/wanaweb`.

**What I did.**

- Benchmarked Awwwards (web-development-agency category) and the Codrops Playground
  to derive the visual direction: obsidian canvas, oversized editorial type,
  iridescent accents, WebGL hero, scroll choreography.
- Scaffolded with `create-next-app` (TS, Tailwind v4, ESLint, App Router, no `src/`).
  Installed `three`, `@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`, `motion`, `lenis`, `@types/three`.
- Wrote the design system in `app/globals.css` (tokens, custom utilities, grain,
  aurora, masked grid, marquee, reveals, cursor, reduced-motion).
- Wrote `components/three/shaders.ts` (Ashima simplex noise + core + particle GLSL)
  and the two scenes: `HeroScene.tsx`, `LabScene.tsx`, `LabObjects.tsx`.
- Built every section plus the atoms (Nav, Footer, Reveal, SectionHeading, Marquee,
  Magnetic, Counter, Cursor, SmoothScroll, Logo, ServiceIcon).
- Centralised all copy into `lib/` (5 files at that point).
- Fixed 8 real React-Compiler lint errors rather than suppressing them (see §6).
- Verified: `tsc` clean, `eslint` clean, `next build` compiled, production smoke test
  HTTP 200 / 162 KB SSR HTML, all 15 custom utilities present in the 48 KB CSS bundle.
- Pushed commit `df89ad0`; confirmed the remote SHA matched local.

**Outcome.** Site live on `main`, fully prerendered, zero build/lint/type errors.

### 2026-09-13 · Cline (session 2) · AGENTS.md + proof-of-work content

**What I was doing.** Create this file so other agents can continue, and close the
biggest content gap — an agency site with no visible work. Add a Selected Work
section, an FAQ, an intro preloader, a 404, and sitemap/robots.

**Files added.** `AGENTS.md`, `lib/projects.ts`, `lib/faq.ts`, `components/Work.tsx`,
`components/Faq.tsx`, `components/Preloader.tsx`, `app/not-found.tsx`,
`app/sitemap.ts`, `app/robots.ts`.
**Files modified.** `lib/content.ts` (nav + Work), `lib/contact.ts` (footer columns),
`app/layout.tsx` (mount Preloader), `app/page.tsx` (Work + Faq), `next.config.ts`,
`README.md`.

**Verification.** All four steps run and green:

- `npx tsc --noEmit` — silent, 0 errors.
- `npm run lint` — silent, 0 problems.
- `npm run build` — `Compiled successfully in 3.7s`; routes `/`, `/_not-found`,
  `/robots.txt`, `/sitemap.xml` all prerendered static.
- Runtime smoke test (`npx next start -p 3123`) — `/` HTTP 200 (197 KB SSR HTML),
  `/sitemap.xml` 200, `/robots.txt` 200, unknown path correctly returns **404**
  with the custom page. Confirmed all 11 section ids render
  (`top, work, studio, services, lab, process, stack, team, signal, faq, contact`),
  and verified `sitemap.xml` / `robots.txt` body content.

Two smoke-test "misses" were verified as false alarms: the masked-reveal markup
splits headline strings around `<em class="serif-accent">`, and the preloader is
intentionally client-only so it is absent from SSR output.

**Outcome.** Site now shows real proof-of-work plus an FAQ, an intro, a 404 and
SEO routes. Pushed as a second commit on `main`.

**Next agent:** the highest-value remaining item is the Backlog §10.1 — real
case-study imagery — because the Selected Work panels currently use only
generated gradients. Everything else in the backlog is optional polish. The
repository is green and safe to extend.

### 2026-09-13 · Cline (session 3) · hero legibility fix

**What I was doing.** Human feedback: the hero core was bright enough behind the
headline that the copy was hard to read. Requested scope was explicitly narrow —
*reduce the light of the core a little*, nothing else.

**What I did.** A focused exposure trim, no layout or structural change:

- `components/three/shaders.ts` — `coreFragmentShader`: fresnel rim multiplier
  `1.15 → 0.85`, and added a global `color *= 0.85` exposure trim.
- `components/three/HeroScene.tsx` — bloom `intensity 1.25 → 0.9`,
  `luminanceThreshold 0.2 → 0.35`, `luminanceSmoothing 0.3 → 0.32`,
  `radius 0.75 → 0.65`.

Raising the bloom threshold is the change that actually fixes readability: at
`0.2`, the core's mid-tones were blooming into a halo that washed across the
text. At `0.35` only genuine highlights glow.

**Deliberately not changed:** hero layout, core position, particle field, the
`noise-veil`, vignette, or any typography. The human asked for a light touch.

**Verification.** `npx tsc --noEmit` clean · `npm run lint` clean ·
`npm run build` `Compiled successfully` · smoke test `/` HTTP 200.

**Recorded** as §8.10 so a future agent treats the hero exposure as a legibility
budget rather than a knob to turn up freely.

### 2026-09-13 · Cline (session 4) · team change

**What I was doing.** Human request: add **Abbas Vaziri as the Founder** of the
studio.

**What I did.** `lib/people.ts` only — content, no component changes:

- Added **Abbas Vaziri**, `role: "Founder"`, as the first member in the array so
  he leads the grid. Accent `lime`, initials `AV`.
- **Retitled Alireza Naghavi** from `"Founder & Lead Engineer"` to
  `"Lead Engineer"`, and rewrote his bio — the old one began "Started WanaWeb…",
  which now contradicted Abbas being the founder.
- Accent distribution is still balanced and no two horizontally adjacent cards
  share an accent: lime · violet · lime · cyan · violet · cyan · lime.

**Judgement call to confirm with the human:** the request said Abbas is *the*
founder, so Alireza no longer claims that title. If they are in fact
co-founders, revert Alireza's `role` to `"Founder & Lead Engineer"` — that is a
one-line change.

**Layout note.** Seven members in a 3-column grid leaves a single orphan card in
the last row (3 / 3 / 1). Acceptable, but if the team grows to eight it will
balance again; adding a ninth would repeat the orphan.

**Verification.** `npx tsc --noEmit` clean · `npm run lint` clean ·
`npm run build` `Compiled successfully` · smoke test `/` HTTP 200 with
"Abbas Vaziri" and "Lead Engineer" present in the SSR output.

### 2026-09-13 · Buffy (Codebuff) · session 5 · multilingual: English + Persian + Arabic

**What I was doing.** Make the site multilingual as asked: English stays the
default and the canonical URL, Persian (`/fa`) and Arabic (`/ar`) join it, and
**every existing text style and effect survives** in the new languages — nothing
may look like a degraded version of the design.

**Routing.** English keeps `/`; the proxy rewrites unprefixed paths onto the
default locale's route (`/en`) and 308s `/en/…` back to the unprefixed URL, so
there is one crawlable document per language and `/` stays canonical. All three
locales are still prerendered static — verified in the build output. A new
`app/[locale]/[...rest]` route catches everything else under a locale, calls
`notFound()` and so gives 404s a real status code *and* the right copy.

**Content layer.** Every string moved out of `lib/*.ts` into
`lib/dictionaries/{en,fa,ar}.ts`. `types.ts` derives `Dictionary` from the
English file with `Widen<T>`, re-applying the literal unions components switch on
(`Accent`, `ServiceIconName`), so a missing key, a misspelled key or a bad accent
name is a compile error rather than a silently wrong colour. `lib/content.ts`,
`projects.ts`, `work.ts`, `people.ts`, `faq.ts` and `contact.ts` are gone.
Strings that were hardcoded in components (the services heading, the lab badges,
the FAQ CTA, the form labels, the preloader line, the nav labels) are all in the
dictionary now. Sections receive the slice they render as a prop, so a page ships
one language's copy.

**Typography — the part that needed the most care.** Geist has no Arabic-script
coverage, so the type roles (`--font-body`, `--font-label`, `--font-accent`) are
resolved per locale from `html[lang]`: Vazirmatn for Persian, Noto Sans Arabic
for Arabic, Noto Naskh Arabic as the editorial accent face (the Naskh is used
non-italic — a synthesised oblique looks broken on cursive letterforms — and
keeps its iridescent gradient). Two Latin-only properties had to stand down for
`dir="rtl"`: letter-spacing is zeroed (both scripts join cursively) and the
display leading is raised to `1.3` with more mask padding, or the reveal clips
descenders. Everything else — sizes, weights, ramps, masks, rotations, timings —
is shared, and glyph arrows mirror through the new `.arrow-forward` /
`.flip-rtl` classes so the hover step still travels in the reading direction.
A `LanguageSwitcher` atom sits in the nav (desktop + mobile menu).

**Verification.** All four steps, plus the locale matrix, plus headless-Chrome
probes over the DevTools protocol.

- `npx tsc --noEmit` — silent.
- `npm run lint` — silent.
- `npm run build` — `Compiled successfully`; `● /en`, `● /fa`, `● /ar` all
  prerendered, `ƒ /[locale]/[...rest]` dynamic, `proxy` active.
- Status matrix on `next start`: `/` 200 · `/fa` 200 · `/ar` 200 · `/en` 308 ·
  `/nope` 404 · `/fa/nope` 404 · `/ar/nope` 404 · `/sitemap.xml` 200 ·
  `/robots.txt` 200 · `/icon.svg` 200.
- HTML: `<html lang="fa" dir="rtl">`, Persian hero and nav copy present, Persian
  404 copy and title shipped, hreflang alternates (`en`, `fa-IR`, `ar`,
  `x-default`) in the head and in the sitemap as absolute URLs.
- Browser: `dir`, `lang`, body font family and loaded `document.fonts` correct per
  locale; **zero** horizontal overflow at 390 / 768 / 1440 px in all three
  locales; no console errors or exceptions on any route; clicking EN → FA → AR →
  EN in the switcher updates `<html lang/dir>`, the font and the copy each time.
- Glyph-ink measurement inside every masked headline: clearance of 10–52 px, i.e.
  nothing is clipped in any script, and all 18 `serif-accent` runs render in all
  three locales (proof the `emphasis` substrings all match).

**Judgement calls worth knowing.** (1) Tracking and leading are zeroed/loosened
for RTL only — see §8.11. (2) The three RTL families are instantiated with
`preload: false` so the English critical path is byte-for-byte what it was; the
swap hides behind the intro curtain — see §8.12. (3) The 404 boundary renders
inside `[locale]/[...rest]` rather than `[locale]/`, because a `headers()` call in
a segment-wide boundary is enough to make the static pages dynamic — that cost me
one build to learn, and moving the boundary down a level restored `● /en`, `/fa`,
`/ar`.

**Next agent.** The copy in `fa.ts` and `ar.ts` is machine-drafted: idiomatic and
layout-true, but unproof-read, so §10.10 is the honest next step (`site.email`,
the dummy socials and the illustrative case studies still need the human too).
Everything else in the backlog is optional polish. The repository is green.

### 2026-09-13 · Buffy (session 5) · two founders + script-native accent faces

**What I was doing.** Two human requests: (1) Alireza Naghavi is a founder too and
must lead the team grid, and (2) the coloured words in Persian and Arabic should
use something cooler than the text faces they had.

**What I did.**

- **Founders (content only).** `team.members` in all three dictionaries: Alireza
  Naghavi moved to position 0 with `role: "Founder & Lead Engineer"`
  (`مؤسس مشترک و مهندس ارشد` / `المؤسّس الشريك والمهندس الرئيسي`), Abbas Vaziri to
  position 1 as `Founder` (`مؤسس مشترک` / `المؤسّس الشريك`). Both bios now say
  they co-founded the studio, and the old wording that made Abbas the sole
  founder is gone. Accents still alternate violet → lime → violet → cyan, so no
  two horizontally adjacent cards share one.
- **Accent faces.** `app/[locale]/layout.tsx` adds two more families,
  `Noto_Nastaliq_Urdu` (`--font-accent-fa`) and `Noto_Kufi_Arabic`
  (`--font-accent-ar`), replacing the Naskh that session 4 shipped. `globals.css`
  points `--font-accent` at them under `html[lang]`, drops only the italic slant
  and keeps the gradient, sizes and every effect. Persian accent is `1.14em`,
  Arabic `1.06em` — Nastaliq reads small at the same nominal size.

**The bug this surfaced.** Nastaliq is a cascading script: its ascenders climb
well past the line box, and the masked reveal is `overflow: hidden`. Measuring the
real ink (Chrome's `actualBoundingBoxAscent/Descent`, with a zero-height
inline-block to locate each baseline) showed `خسته‌کننده` losing **36 px** off the
top — a sliced letter in a headline, not a rounding wobble. The same measurement
found 2.8 px in Arabic and, in English, the 2 px Latin descender nick that had
been there since session 1 without anyone noticing. Fixed with per-locale mask
headroom where every `padding` is paired with an equal, opposite `margin`, so the
window grows and **the text does not move a pixel** — §8.14 has the table and a
warning not to "tidy" those negative margins away.

**Verification.**

- `npx tsc --noEmit` — silent.
- `npm run lint` — silent.
- `npm run build` — `Compiled successfully`; `● /en`, `/fa`, `/ar` still
  prerendered, `ƒ /[locale]/[...rest]`, `proxy` active.
- Status matrix on `next start`: `/` 200 · `/fa` 200 · `/ar` 200 · `/en` 308 ·
  `/nope` 404 · `/fa/nope` 404 · `/ar/nope` 404 · sitemap / robots / icon 200.
- SSR copy: Alireza first and both founder roles present, in that order, in all
  three locales (grepped out of the served HTML, not just the source).
- Headless Chrome over CDP at **390 / 768 / 1440 px** × 3 locales: the accent runs
  render in `Noto Nastaliq Urdu` / `Noto Kufi Arabic` / `Instrument Serif` with
  `document.fonts.check` true; **0 of 33 masked accent runs clipped** (worst
  clearance now +3.3 px above, +0.9 px below); zero horizontal overflow; no
  console errors.

**Correction to session 4's log.** Its glyph-ink check compared element boxes
rather than real ink and so reported "nothing is clipped"; the canvas-ink method
above is the trustworthy one. Re-measure with it after any accent-face or
accent-size change.

**Next agent.** Same as before — the fa/ar copy still wants a native reader, and
nothing is committed from this session. The repository is green.

### 2026-09-13 · Buffy (session 6) · the gallery — a 3D wall of the work

**What I was doing.** Human request: a modern gallery for showcasing the studio's
sites, "it can be 3d or with GSAP or anything but the design should be
supercoll", then commit and push. The technique was mine to choose.

**The design decision, and why.** A hand-built **scroll-scrubbed 3D wall**, not a
third WebGL canvas. The site already ships two canvases and a third would have
bought depth at the price of the one thing this section needs most: legible,
localised, screen-readable *text*. CSS 3D keeps the four previews as real DOM, so
they render in Geist, Vazirmatn and Noto Sans Arabic (and their accent faces)
without a texture pipeline, stay translatable, stay in the SSR payload, and cost
no extra 3D dependency. The frames are drawn, never fetched — §8.16.

**What I did.**

- `components/Showcase.tsx` — a tall track (`100svh + 62vh` per slot) around a
  sticky viewport. Scroll progress fans out into **one `useTransform` per frame**
  (sideways 58% of its own width, 260 px back, 22° turned in), so the wall travels
  on the compositor and nothing re-renders. Cursor parallax leans the room ~3°,
  an accent wash cross-fades to the accent of the frame in front, and a caption
  strip carries what scrolling cannot: index, client, sector, dots and the CTA.
- `components/SiteFrame.tsx` — the preview: browser chrome, a generated domain,
  the project's headline, two metrics, a stack pill, a cropped ghost index. Sized
  entirely in container units (`cqw` inside `clamp()`), so one component is
  legible at 313 px wide on a phone and at 618 px at the front of the wall.
- `lib/accents.ts` — the accent → class/colour maps, now shared with `Work.tsx`
  instead of duplicated; `NAV_OFFSET` moved into `lib/util.ts` for the same
  reason.
- RTL without a branch: `--gallery-sign` is `1`, and `-1` under
  `html[dir="rtl"]` (`globals.css`), multiplied into the horizontal offset and the
  Y-rotation, so the wall travels the other way in Persian and Arabic.
- Reduced motion gets the same four previews as a static grid.
- `gallery` copy in all three dictionaries (+ a footer link; see §10.14 for why
  it is *not* in the primary nav).

**The bug this surfaced, and the fix.** The reduced-motion branch is a different
tree, and `motion`'s `useReducedMotion()` resolves the media query during the
first client render: React threw **#418** and regenerated the gallery on every
load for reduced-motion visitors. Diagnosed in `next dev` (the minified
production error names no component), then confirmed by disabling my branch — the
error vanished, so it was mine and not pre-existing. Fixed with
`usePrefersReducedMotion()` in `components/Reveal.tsx` via
`useSyncExternalStore`. Recorded as §8.15 and in the §6 gotchas, because the same
trap is one branch away in `Work.tsx` (§10.12).

**Verification.** All four steps, the locale matrix, and headless Chrome over CDP
— the only way to check a scroll-scrubbed scene without eyes on it.

- `npx tsc --noEmit` silent · `npm run lint` silent · `npm run build`
  `Compiled successfully` with `● /en`, `● /fa`, `● /ar` still prerendered.
- Status matrix on `next start`: `/` 200 · `/fa` 200 · `/ar` 200 · `/en` 308 ·
  `/nope` 404 · `/fa/nope` 404 · sitemap / robots 200.
- SSR copy: `id="gallery"`, the masked heading with its accent run
  (`hung on <em class="serif-accent">one wall</em>`), the four frames, the four
  scroll markers, `.gallery-floor`, `--gallery-sign` — in all three dictionaries,
  with the Persian and Arabic headings matching their `emphasis` field.
- CDP at **390 / 768 / 1440 px × 3 locales** (9 runs): track sticky, 4 frames,
  depth ordering correct, the caption in step with the active dot at the start,
  middle and end of the track, **0 px** of horizontal overflow everywhere, and
  148–239 px of clearance between the front frame and the caption strip.
- CDP with `prefers-reduced-motion: reduce`: no sticky track, 4 frames, the static
  grid, no overflow, **0 console errors and 0 hydration errors** (the same probe
  reported 1 before the fix).
- Nav slack measured at 1024/1180/1280/1440 px before deciding against a nav
  entry: 101 px free at the tightest width, ~93 px needed.

**Next agent.** Nothing about this section needs a follow-up; the honest next step
is still §10.10 — a native speaker on `fa.ts` and `ar.ts`. This commit carries both
this session's work and session 5's uncommitted multilingual changes (its log entry
ends "nothing is committed from this session"; it now is).

### 2026-09-13 · Buffy (session 7) · modern accent faces for Persian and Arabic

**What I was doing.** Human feedback: the coloured words in the RTL locales were
set in a **classic** pair — Noto Nastaliq Urdu (calligraphic) and Noto Kufi Arabic
(geometric-classical) — and they want a cool, modern face there instead. Change,
confirm, commit, push.

**What I did.** `app/[locale]/layout.tsx` and `app/globals.css` only — no
component changed, because the type roles were already resolved through
`--font-accent` from `html[lang]` (§5), which is exactly what that indirection
was for.

- Persian accent → **Lalezar**: heavy, wide, contemporary — an Iranian poster
  voice rather than a calligrapher's pen.
- Arabic accent → **Cairo Play** at weight 700: a modern variable Arabic display
  cut, set at 700 so it carries the same optical weight as Lalezar (heavy at its
  only weight).
- Dropped the optical size bump: Nastaliq read *small* and needed `1.14em`; both
  new faces read *large*, so the accent is `1em` in both locales and the heading
  keeps the Latin metrics.
- Re-tuned the mask headroom (§8.14 requires this after any accent change). The
  RTL bottom padding (`0.36em`) and the Persian top lift (`0.6em`) existed for
  Nastaliq's cascade; both are now `0.12em`, so the RTL mask matches the Latin one
  and RTL headings regained the Latin rhythm.

**The bug this surfaced.** Swapping the faces *without* re-measuring would have
silently clipped Cairo Play: at Kufi's old padding the Arabic accent's descender
overran the mask by **16 px** (measured clearance `-15.8 px` on `دليل`).

**Verification — measured, not assumed.** Headless Chrome over CDP, canvas ink
boxes (`actualBoundingBoxAscent/Descent`) against each `.reveal-mask` box, with
all reveals settled first. (A masked line is translated until its reveal fires and
a transform moves `getBoundingClientRect`, so the first run of this harness
returned nonsense; the lesson is recorded in §8.14.)

- Minimum clearance over every masked accent run at the largest heading: Persian
  **+14 / +15.5 px**, Arabic **+9.2 / +13.5 px**, Latin control **+7.4 / +2.5 px**
  — nothing clipped anywhere, and both new faces have more room than the Latin
  accent does.
- Ink envelope: Lalezar 0.81em above the baseline / 0.33em below; Cairo Play
  1.0em / 0.27em.
- Coverage: `document.fonts.check` true for every run, and every accent *word*'s
  ink width differs from its fallback family — so the words really render in
  Lalezar and Cairo Play rather than falling back to Vazirmatn / Noto Sans Arabic.
  The only same-width run is the 16 px decorative `“` in the testimonials, where
  both faces happen to share the advance.
- `npx tsc --noEmit` silent · `npm run lint` silent · `npm run build`
  `Compiled successfully` with `● /en`, `● /fa`, `● /ar` prerendered · route
  matrix unchanged (`/`, `/fa`, `/ar` 200 · `/en` 308 · `/nope`, `/fa/nope` 404) ·
  0 px horizontal overflow in all three locales.

**Considered and rejected**, so it does not get re-litigated: for Arabic — Kufam,
Reem Kufi and Rakkas (all still read as Kufi to anyone who is not a type
specialist, which is the objection), Alexandria / Almarai / Zain / IBM Plex Sans
Arabic (text faces; they make the accent look like body copy), Marhey (too
informal beside an editorial headline); for Persian — Estedad and Vazirmatn at a
heavier weight (too close to the body face to read as an accent), Mirza and Gulzar
(Nastaliq again).

**Open request, not started.** At the end of this session the human also asked
for "a 3D gallery for website showcases too" — wording that is ambiguous against
session 6's gallery, which already exists but is CSS 3D rather than WebGL. Ask
before building: replace the wall with a true WebGL scene, add a second showcase
alongside it, or deepen the existing one.

**Next agent.** The masks are correct for these faces *at these sizes*. Change
the face, the size or the padding, and re-run the ink measurement — §8.14 has the
method and the trap.

### 2026-09-13 · Buffy (session 8) · the gallery becomes a real WebGL room

**What I was doing.** The human asked for "a 3D gallery for website showcases
too". Session 6's gallery already showcased the sites, but it was **CSS 3D** —
transformed DOM. Asked which they meant, they chose **rebuild it as real WebGL**:
a lit 3D room where the site panels are actual textured meshes and the camera
moves through them.

**What I did.** The section kept its contract — same copy, same caption strip,
same dots, same scroll markers, same reduced-motion grid — and swapped the
renderer underneath it.

- `components/three/siteTexture.ts` — paints a project's site into a canvas:
  device bezel, browser chrome with a generated domain, the headline, two metrics
  in the iridescent ramp, a stack pill, a ghost index. RTL-aware (`ctx.direction`
  and aligned edges; domains and numerals stay Latin, as the i18n rules require).
- `components/three/GalleryObjects.tsx` — the panel mesh (the texture doubles as
  its emissive map, which is what makes a screen read as *lit*), plus a
  `MeshReflectorMaterial` floor and an accent key light that travels with the
  camera.
- `components/three/GalleryScene.tsx` — the room: opaque background (§8.2),
  procedural environment (§8.4), bloom above the screens' mid-tones so the
  artwork stays legible, and a camera rig that reads scroll progress and pointer
  parallax from motion values **inside the frame loop**, so scrubbing never
  re-renders React. Textures are built only after `document.fonts.ready` —
  drawing earlier would bake the fallback face into the screens for the session.
- `components/Showcase.tsx` — the CSS wall, `--gallery-sign` and `.gallery-floor`
  are gone; the canvas is dynamically imported with `ssr: false` and a
  `.canvas-fallback` placeholder, per the conventions.

**The bug this surfaced.** In Persian the canvas rendered at the wrong aspect:
**1425×1001 buffer inside a 1425×900 box**, which stretches the room vertically.
Found by screenshotting the page and reading the pixels, then bisected at runtime:
forcing the canvas height by hand stuck, and **all three** R3F canvases (gallery,
hero, lab) carried the same stale 1001.12px — so it is a framework-level latch,
not something the gallery caused, and the pre-existing canvases still have it
(§10.15). Neither gating the canvas on `document.fonts.ready` nor comparing R3F's
`size` against the host fixed it, because the store reported the right height
while the canvas kept the wrong one. `ViewportGuard` now compares the buffer
to the host box each frame and corrects both — recorded as §8.17.

**Verification.** All four steps plus the browser probes.

- `npx tsc --noEmit` silent · `npm run lint` silent · `npm run build`
  `Compiled successfully` with `● /en`, `● /fa`, `● /ar` prerendered.
- Status matrix: `/`, `/fa`, `/ar` 200 · `/en` 308 · `/nope`, `/fa/nope` 404.
- SSR: `id="gallery"`, the hint copy, the four markers and the
  `canvas-fallback` placeholder are all in the served HTML, in every locale; the
  old `gallery-floor` / `gallery-sign` rules are gone from the CSS bundle.
- Headless Chrome at **1440×900, 768×1024, 390×844 × en/fa**: WebGL 2.0 context,
  drawing buffer equal to the stage at every size (the aspect check that caught
  the Persian bug), **0 px** horizontal overflow, **0 console errors**, and
  **36–50 %** of the pixels changing between two scroll positions — which is the
  proof that the camera really walks the room, since I cannot see the screen.
- `prefers-reduced-motion: reduce`: no canvas, no sticky track, the static grid of
  four `SiteFrame` previews, no overflow.

**What I could not verify.** I have no eyes on the render: the checks above prove
it *renders*, changes with scroll, is correctly proportioned and logs nothing, not
that the composition is beautiful. Panel size, spacing, camera height and exposure
are the dials to turn if the human wants a different feel — the numbers are named
constants at the top of `GalleryObjects.tsx` and in `CameraRig`.

**Next agent.** §10.15 is the honest follow-up (the other two canvases still carry
the latch). Everything else here is taste.



