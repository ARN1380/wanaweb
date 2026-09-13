/**
 * WanaWeb — central content layer.
 *
 * Every string rendered on the site lives here so copy can be rewritten
 * without touching layout or animation code.
 */

export const site = {
  name: "WanaWeb",
  /** Update this to the production domain before launch. */
  url: "https://wanaweb.studio",
  tagline: "We build the web of tomorrow, today.",
  description:
    "WanaWeb is a small studio of engineers and 3D artists shipping fast, clean-coded, professionally crafted websites — including real-time 3D on the open web.",
  email: "hello@wanaweb.studio",
  location: "Remote-first — working worldwide",
  founded: 2021,
  socials: [
    { label: "GitHub", href: "https://github.com/ARN1380/wanaweb" },
    { label: "X / Twitter", href: "https://x.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
  ],
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "3D Lab", href: "#lab" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  kicker: "Independent web studio — est. 2021",
  /** Rendered as masked, individually animated lines. */
  headline: ["We build the web", "of tomorrow,", "at the speed of now."],
  /** Word inside `headline` that is rendered in italic serif. */
  emphasis: "tomorrow",
  sub: "Fast. Clean. Unmistakably professional. From conversion-focused marketing sites to fully interactive 3D experiences that run at 60fps in the browser.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "See what we build", href: "#services" },
  scrollCue: "Scroll to explore",
  status: "Available for new work — Q1",
} as const;

export const marqueeItems = [
  "Next.js",
  "React Three Fiber",
  "TypeScript",
  "WebGL / GLSL",
  "GSAP",
  "Tailwind CSS",
  "Node.js",
  "Core Web Vitals",
  "Design Systems",
  "Motion Design",
] as const;

export const stats = [
  { value: 120, suffix: "+", label: "Projects shipped", hint: "Since 2021" },
  { value: 99, suffix: "/100", label: "Median Lighthouse score", hint: "Performance, mobile" },
  { value: 47, suffix: "ms", label: "Median interaction latency", hint: "INP, p75" },
  { value: 14, suffix: " days", label: "Average time to launch", hint: "Design to deploy" },
] as const;

export const manifesto = {
  label: "The studio",
  title: "Small team. Unreasonable standards.",
  emphasis: "Unreasonable",
  body: [
    "WanaWeb is a compact studio of engineers, designers and 3D artists who got tired of watching beautiful ideas ship as slow, brittle websites. So we built a practice around the opposite promise: every pixel intentional, every kilobyte justified.",
    "We write code the next developer will thank us for — typed end to end, componentised, documented and benchmarked. Then we put it in front of real people and measure what happens. Fast sites are not a nicety; they are the product.",
  ],
  pillars: [
    {
      title: "Fast by construction",
      body: "Performance budgets agreed up front, enforced in CI. Streaming, edge caching, image discipline and zero layout shift are defaults, not stretch goals.",
    },
    {
      title: "Clean code, no exceptions",
      body: "Strict TypeScript, small composable components, a real design system and tests where they earn their keep. Shipping is the start of a codebase's life, not the end.",
    },
    {
      title: "Craft you can feel",
      body: "Typography with rhythm, motion with intent, 3D with a purpose. Details are what separate a template from a brand.",
    },
  ],
} as const;
