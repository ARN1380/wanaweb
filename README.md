# WanaWeb

The studio site for **WanaWeb** — an independent web studio building fast,
clean-coded, professionally crafted websites, including real-time 3D that runs
in the browser.

Built with Next.js (App Router), React 19, Tailwind CSS v4, React Three Fiber
and hand-written GLSL.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
```

## What's on the page

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `components/Hero.tsx` | Masked line reveal over a live WebGL scene |
| Studio | `components/Manifesto.tsx` | Position, animated counters, three pillars |
| Selected work | `components/Work.tsx` | Four case studies in sticky-stacked cards |
| Services | `components/Services.tsx` | Six capability cards |
| 3D Lab | `components/Lab.tsx` | Interactive, draggable 3D scene |
| Process | `components/Process.tsx` | Four phases with sticky scroll tracking |
| Toolkit | `components/Stack.tsx` | The technologies we actually use |
| Team | `components/Team.tsx` | Six people, generated portraits from initials |
| Signal | `components/Testimonials.tsx` | Partner quotes |
| FAQ | `components/Faq.tsx` | Accessible accordion, no JS height measuring |
| Contact | `components/Contact.tsx` | Brief form that composes an email |

Also included: an intro preloader (`components/Preloader.tsx`, once per session),
a custom 404 (`app/not-found.tsx`), and generated `robots.txt` / `sitemap.xml`
(`app/robots.ts`, `app/sitemap.ts`).

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

All copy lives in `lib/`, separate from layout and animation code:

| File | Contains |
| --- | --- |
| `lib/content.ts` | Brand, nav, hero, marquee, stats, manifesto |
| `lib/projects.ts` | Case studies for the Selected Work section |
| `lib/work.ts` | Services, process, toolkit, 3D lab copy |
| `lib/people.ts` | Team members and testimonials |
| `lib/faq.ts` | FAQ questions and answers |
| `lib/contact.ts` | Contact form copy and footer |
| `lib/util.ts` | Helpers (`cn`, `splitEmphasis`, `createRandom`, reduced-motion) |

### Placeholders to replace before launch

- `site.url` in `lib/content.ts` — currently a placeholder domain, used as
  `metadataBase` and in the structured data.
- `site.email` — used by the contact form's `mailto:` handoff.
- `site.socials` — the X, LinkedIn and Dribbble URLs are placeholders.
- **Team names, roles and bios in `lib/people.ts` are illustrative** — swap them
  for the real team, or delete entries (the grid reflows automatically).
- Testimonials in `lib/people.ts` are written as anonymous role + company
  attributions; replace them with real, attributable quotes before publishing.
- **Case studies in `lib/projects.ts` are illustrative.** The client names,
  metrics and outcomes were written to demonstrate the layout. Replace them with
  real, permissioned work — or delete entries; the stack reflows automatically.

## Design system

Defined once in `app/globals.css`:

- Palette: obsidian `#050506`, warm bone `#f4f1ea`, and an iridescent
  violet → cyan → lime ramp with acid lime `#c8ff4d` as the signature accent.
- Type: Geist (display + UI), Geist Mono (kickers and labels), Instrument Serif
  italic (editorial accents via `<em class="serif-accent">`).
- Custom utilities: `kicker`, `display-type`, `serif-accent`,
  `iridescent-text`, `glass`, `hairline-t`, `hairline-b`.
- Supporting layers: film grain, aurora wash and a masked grid (`.grain`,
  `.aurora`, `.grid-pattern` + `.gridlines`).

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
