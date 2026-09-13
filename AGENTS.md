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

It is a single-page, statically prerendered site (App Router) with two live WebGL
scenes, an editorial design system, and a contact form that hands off to email.

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
| Team | ✅ Done | Six members, generated monogram avatars |
| Testimonials | ✅ Done | Three quotes, anonymised attribution |
| Contact form | ✅ Done | Client validation + `mailto:` handoff (no backend) |
| **Selected Work** | ✅ Done | Four case studies, sticky-stacked cards |
| **FAQ** | ✅ Done | Accessible accordion |
| **Intro preloader** | ✅ Done | Once per session, respects reduced motion |
| **Custom 404** | ✅ Done | `app/not-found.tsx` |
| **sitemap / robots** | ✅ Done | `app/sitemap.ts`, `app/robots.ts` |
| Real project photography | ⛔ Out of scope | No image assets by design — see §8 |
| Contact backend | ⛔ Out of scope | Deliberately client-side only — see §8 |
| Deployment (Vercel) | ⬜ Not done | Repo pushes fine; no Vercel project linked |
| Domain + real content | ⬜ Blocked | Needs the human — see §8 "Placeholders" |

Legend: ✅ done · 🔄 in progress · ⬜ not started · ⛔ deliberately not doing

---

## 3. Architecture / file map

```
wanaweb/
├─ app/
│  ├─ globals.css        ← THE design system. Single source of visual truth.
│  ├─ layout.tsx         ← fonts, metadata, chrome (Cursor/SmoothScroll/Nav/Footer/Preloader)
│  ├─ page.tsx           ← section composition + JSON-LD. Keep this file thin.
│  ├─ not-found.tsx      ← custom 404
│  ├─ sitemap.ts         ← generated /sitemap.xml
│  └─ robots.ts          ← generated /robots.txt
├─ components/
│  ├─ three/
│  │  ├─ shaders.ts      ← ALL GLSL lives here (incl. Ashima simplex noise, MIT)
│  │  ├─ HeroScene.tsx   ← hero canvas: Core + ParticleField
│  │  ├─ LabScene.tsx    ← lab canvas: composition, lights, OrbitControls
│  │  └─ LabObjects.tsx  ← knot / glass orbs / instanced cube ring
│  ├─ sections           ← Hero, Manifesto, Work, Services, Lab, Process,
│  │                       Stack, Team, Testimonials, Faq, Contact
│  └─ atoms              ← Nav, Footer, Logo, Reveal, SectionHeading, Marquee,
│                          Magnetic, Counter, Cursor, SmoothScroll, Preloader,
│                          ServiceIcon
└─ lib/
   ├─ content.ts         ← brand, nav, hero, marquee, stats, manifesto
   ├─ projects.ts        ← case studies for Selected Work
   ├─ work.ts            ← services, process, stack, 3D-lab copy
   ├─ people.ts          ← team, testimonials
   ├─ faq.ts             ← FAQ
   ├─ contact.ts         ← contact copy + footer columns
   └─ util.ts            ← cn, splitEmphasis, createRandom, prefersReducedMotion,
                           setSmoothScrollStopped
```

**Data flow:** `lib/*` (content) → section components → atoms. Atoms hold no
marketing copy. `app/globals.css` is imported once, in `layout.tsx`.

**Hard rule: never hardcode a user-visible string in a component.** It belongs in `lib/`.

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
`<em className="serif-accent">` inside `MaskedLines`).

**Custom utilities in `globals.css`:** `kicker`, `display-type`, `serif-accent`,
`iridescent-text`, `glass`, `hairline-t`, `hairline-b`.
**Layers:** `.grain`, `.aurora`, `.grid-pattern` + `.gridlines` (fixed) /
`.gridlines-local` (absolute), `.noise-veil`, `.canvas-fallback`.
**Cursor:** `body.has-custom-cursor`; elements opt in with `data-cursor="hover"|"drag"`.
**Z-index map:** content `z-10` · nav `z-70` · progress bar `z-80` · grain `z-90` ·
preloader `z-95` · cursor `z-100`. Respect this map; do not invent new layers.

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

### Placeholders the human must supply

- `site.url` (`https://wanaweb.studio`) — used as `metadataBase` and in JSON-LD.
- `site.email` (`hello@wanaweb.studio`) — used by the contact form and footer.
- `site.socials` — X / LinkedIn / Dribbble URLs are dummies.
- Team members (`lib/people.ts`), testimonials (same file).
- Case studies (`lib/projects.ts`) — names, metrics and outcomes are illustrative.

---

## 9. Recipe: how to add a new section

1. Add the copy to the right file in `lib/` (create a new file if the topic is new).
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



