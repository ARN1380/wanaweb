/** Capabilities and the delivery process. */

export const services = [
  {
    id: "web",
    index: "01",
    title: "Website Design & Development",
    blurb:
      "Marketing sites, corporate platforms and product launches built on Next.js. Editorial layouts, custom design systems and content models your team can actually run.",
    icon: "layout",
    points: ["Next.js & React", "Headless CMS", "Design systems", "SEO & accessibility"],
  },
  {
    id: "three-d",
    index: "02",
    title: "3D & Real-Time WebGL",
    blurb:
      "Scroll-driven 3D scenes, product configurators, generative backgrounds and shader work — hand-written GLSL tuned to stay smooth on a mid-range phone.",
    icon: "cube",
    points: ["Three.js & R3F", "Custom GLSL", "Product configurators", "60fps budgets"],
  },
  {
    id: "performance",
    index: "03",
    title: "Performance Engineering",
    blurb:
      "We profile, diagnose and rebuild. Streaming, caching, bundle surgery and render-path work that moves Core Web Vitals into the green and keeps them there.",
    icon: "bolt",
    points: ["Core Web Vitals", "Bundle analysis", "Edge caching", "CI budgets"],
  },
  {
    id: "product",
    index: "04",
    title: "Product & Interface Design",
    blurb:
      "Interfaces designed against real constraints: state, motion, empty states, error states and the fifteen edge cases nobody put in the brief.",
    icon: "compass",
    points: ["UX architecture", "UI systems", "Prototyping", "Motion specs"],
  },
  {
    id: "commerce",
    index: "05",
    title: "Commerce & Conversion",
    blurb:
      "Storefronts and checkout flows engineered around one question: what makes the next click obvious? Then proven with experiments, not opinions.",
    icon: "cart",
    points: ["Headless commerce", "Checkout UX", "A/B testing", "Analytics"],
  },
  {
    id: "motion",
    index: "06",
    title: "Motion & Micro-Interaction",
    blurb:
      "Scroll choreography, page transitions and the small reactions that make an interface feel alive — all built to respect reduced-motion preferences.",
    icon: "wave",
    points: ["GSAP & ScrollTrigger", "Page transitions", "Micro-interactions", "A11y aware"],
  },
] as const;

export type Service = (typeof services)[number];

export const process = {
  label: "Process",
  title: "Four phases. No surprises.",
  emphasis: "No surprises.",
  steps: [
    {
      step: "01",
      title: "Discover",
      duration: "Week 1",
      body: "We map goals, audience, competitors and constraints. You get a written scope, a sitemap, a performance budget and a fixed timeline before a single line of code exists.",
      deliverables: ["Brief & scope", "Sitemap", "Perf budget", "Timeline"],
    },
    {
      step: "02",
      title: "Design",
      duration: "Weeks 1–2",
      body: "Art direction, typography and layout in a live, responsive prototype — not a static mockup. You review the real thing, in the browser, on your own device.",
      deliverables: ["Art direction", "Design system", "Prototype", "Motion specs"],
    },
    {
      step: "03",
      title: "Build",
      duration: "Weeks 2–4",
      body: "Typed components, a headless content model and — where it earns its place — 3D. Weekly staging deploys so you can watch progress instead of waiting for a reveal.",
      deliverables: ["Component library", "CMS setup", "3D / WebGL", "Staging deploys"],
    },
    {
      step: "04",
      title: "Ship & sharpen",
      duration: "Ongoing",
      body: "We launch behind monitoring and analytics, then iterate on real behaviour. Handover includes documentation, a recorded walkthrough and 30 days of support.",
      deliverables: ["Launch", "Analytics", "Documentation", "30-day support"],
    },
  ],
} as const;

export const stack = {
  label: "Toolkit",
  title: "Boring where it counts.",
  emphasis: "Boring",
  body: "We choose mature tools with long support horizons, and reach for cutting-edge ones only when the experience genuinely demands it.",
  groups: [
    {
      name: "Core",
      items: ["Next.js", "React 19", "TypeScript", "Node.js", "Tailwind CSS"],
    },
    {
      name: "3D & motion",
      items: ["Three.js", "React Three Fiber", "GLSL / WebGPU", "GSAP", "Blender"],
    },
    {
      name: "Platform",
      items: ["Vercel", "Cloudflare", "Sanity", "PostgreSQL", "GitHub Actions"],
    },
    {
      name: "Quality",
      items: ["Playwright", "Vitest", "Lighthouse CI", "axe-core", "Sentry"],
    },
  ],
} as const;

export const lab = {
  label: "The 3D lab",
  title: "Yes — we really do 3D.",
  emphasis: "really",
  body: "Everything in this scene is generated in your browser: hand-written shaders, a procedurally lit environment, and zero downloaded 3D assets. Drag it. This is the same pipeline we use for product configurators and immersive launch sites — with a frame budget attached.",
  hints: {
    drag: "Drag to orbit",
    auto: "Auto-rotating",
  },
  facts: [
    { k: "0 KB", v: "Model downloads" },
    { k: "60 fps", v: "Target frame rate" },
    { k: "WebGL2", v: "Renderer" },
    { k: "GLSL", v: "Custom shaders" },
  ],
} as const;
