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
| **FAQ** | ✅ Done | Accessible accordion |
| **Intro preloader** | ✅ Done | Once per session, respects reduced motion |
| **Multilingual routing** | ✅ Done | `/` = English, `/fa`, `/ar`; all three prerendered |
| **RTL + locale fonts** | ✅ Done | `html[lang]` type roles, `dir="rtl"` typography — see §5 |
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
│  │  └─ LabObjects.tsx  ← knot / glass orbs / instanced cube ring
│  ├─ sections           ← Hero, Manifesto, Work, Services, Lab, Process,
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
   └─ util.ts            ← cn, splitEmphasis, createRandom, prefersReducedMotion,
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

### Environment gotchas (learned the hard way — do not re-learn these)

| Gotcha | What to do instead |
| --- | --- |
| Shell commands **time out at 30 s** | Never run `npm install`/`build` inline. Use `Start-Process cmd.exe -ArgumentList "/c <cmd> > D:\Naghavi\temp\x.log 2>&1" -WindowStyle Hidden`, then poll the log with a separate command. |
| `Invoke-WebRequest` fails in NonInteractive mode | Use `curl.exe` (not the `Invoke-WebRequest` cmdlet, not the `curl` alias). |
| No `gh` CLI, no `GITHUB_TOKEN` | Push over HTTPS. Git Credential Manager (`manager`) is already authenticated — `git push` just works. |
| Git prints progress to stderr | PowerShell surfaces it as red `NativeCommandError` text. Read `$LASTEXITCODE` to judge success; exit 0 means it worked. |
| Editor tool rejects edits > ~6000 chars | Split into create + append-with-anchor edits. |
| `LayoutProps<"/">` type not found in `tsc` | It only exists after Next generates its route types. Type layout props explicitly instead. |

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



