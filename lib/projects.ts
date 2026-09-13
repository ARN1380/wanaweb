/**
 * Selected Work — case studies shown in the sticky-stacked section.
 *
 * ⚠️ PLACEHOLDER CONTENT: the client names, metrics and outcomes below are
 * illustrative examples written to demonstrate the layout. Replace them with
 * real, permissioned case studies before the site goes live.
 */

export type ProjectAccent = "violet" | "cyan" | "lime";

export type Project = {
  id: string;
  index: string;
  client: string;
  sector: string;
  year: string;
  title: string;
  summary: string;
  results: readonly { k: string; v: string }[];
  services: readonly string[];
  stack: readonly string[];
  accent: ProjectAccent;
};

export const projects: readonly Project[] = [
  {
    id: "halcyon",
    index: "01",
    client: "Halcyon",
    sector: "Fintech · Series B",
    year: "2025",
    title: "Rebuilding trust at 0.6 seconds",
    summary:
      "A regulated lending platform was losing sign-ups to a 4.1s homepage and an eight-step application. We rebuilt the marketing surface and the onboarding funnel on Next.js, cached the content model at the edge, and cut the form in half.",
    results: [
      { k: "0.6s", v: "LCP on mobile" },
      { k: "+38%", v: "Application starts" },
      { k: "−71%", v: "Time to first quote" },
    ],
    services: ["Platform build", "Funnel design", "Edge caching", "Analytics"],
    stack: ["Next.js", "TypeScript", "Sanity", "Vercel Edge", "Playwright"],
    accent: "violet",
  },
  {
    id: "ostrom",
    index: "02",
    client: "Ostrom",
    sector: "Consumer hardware",
    year: "2025",
    title: "A 3D configurator that runs on a 2019 phone",
    summary:
      "Four product variants, twelve finishes, and one hard requirement: it had to feel instant on mid-range Android. We built a WebGL configurator with hand-written shaders and no downloadable models — every material is generated at runtime.",
    results: [
      { k: "0 KB", v: "Asset downloads" },
      { k: "60 fps", v: "Mid-range Android" },
      { k: "+24%", v: "Add-to-cart rate" },
    ],
    services: ["Three.js / R3F", "Custom GLSL", "Product UX", "Perf budgets"],
    stack: ["React Three Fiber", "GLSL", "Next.js", "Sentry"],
    accent: "cyan",
  },
  {
    id: "verdant",
    index: "03",
    client: "Verdant",
    sector: "Climate technology",
    year: "2024",
    title: "Making a decade of data legible",
    summary:
      "A climate analytics team needed their research to survive contact with non-experts. We designed a narrative scroll that unfolds eleven years of emissions data, then shipped it as a statically generated site that loads in under a second anywhere.",
    results: [
      { k: "11 yrs", v: "Of data visualised" },
      { k: "100", v: "Lighthouse, all four" },
      { k: "3.4×", v: "Average read time" },
    ],
    services: ["Data storytelling", "Design system", "Static generation"],
    stack: ["Next.js", "D3", "GSAP", "Cloudflare"],
    accent: "lime",
  },
  {
    id: "cassia",
    index: "04",
    client: "Cassia Studio",
    sector: "Architecture practice",
    year: "2024",
    title: "A portfolio that behaves like a building",
    summary:
      "For a practice whose work is inherently spatial, a grid of thumbnails was never going to work. We built a scroll-choreographed portfolio where projects assemble as you move — plus a headless CMS the studio runs entirely on their own.",
    results: [
      { k: "14 days", v: "Brief to launch" },
      { k: "+58%", v: "Enquiry quality" },
      { k: "0", v: "Cumulative layout shift" },
    ],
    services: ["Art direction", "Motion choreography", "Headless CMS"],
    stack: ["Next.js", "ScrollTrigger", "Sanity", "Lenis"],
    accent: "violet",
  },
] as const;

export const work = {
  label: "Selected work",
  title: "Proof, not promises.",
  emphasis: "Proof",
  body: "Four engagements that show the range: a conversion rescue, a real-time configurator, a data story, and a portfolio. Scroll to move through them.",
  cta: "Start something like this",
} as const;
