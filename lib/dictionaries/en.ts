/**
 * English — the reference dictionary.
 *
 * This file is the single source of truth for both the copy *and* its structure:
 * the `Dictionary` type in `./types.ts` is derived from it, so a translation
 * that is missing a field (or misspells one) fails `tsc` rather than shipping
 * a half-translated page.
 *
 * Values that are not language-specific — the domain, project ids, accent
 * names, technology names — are repeated in every locale on purpose, so each
 * dictionary reads as one complete, self-contained document.
 */

export const en = {
  meta: {
    title: "WanaWeb — We build the web of tomorrow, today.",
    titleTemplate: "%s · WanaWeb",
    description:
      "WanaWeb is a small studio of engineers and 3D artists shipping fast, clean-coded, professionally crafted websites — including real-time 3D on the open web.",
    keywords: [
      "web studio",
      "Next.js development",
      "React Three Fiber",
      "WebGL development",
      "3D websites",
      "performance engineering",
      "clean code",
    ],
    areaServed: "Worldwide",
    knowsAbout: [
      "Next.js development",
      "React Three Fiber",
      "WebGL and GLSL",
      "Core Web Vitals performance",
      "Design systems",
      "Motion design",
    ],
  },

  site: {
    name: "WanaWeb",
    url: "https://wanaweb.studio",
    tagline: "We build the web of tomorrow, today.",
    email: "hello@wanaweb.studio",
    location: "Remote-first — working worldwide",
    founded: 2021,
    socials: [
      { label: "GitHub", href: "https://github.com/ARN1380/wanaweb" },
      { label: "X / Twitter", href: "https://x.com/" },
      { label: "LinkedIn", href: "https://linkedin.com/" },
      { label: "Dribbble", href: "https://dribbble.com/" },
    ],
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Studio", href: "#studio" },
    { label: "Services", href: "#services" },
    { label: "3D Lab", href: "#lab" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    kicker: "Independent web studio — est. 2021",
    /** Rendered as masked, individually animated lines. */
    headline: ["We build the web", "of tomorrow,", "at the speed of now."],
    /** Word inside `headline` that is rendered in the accent serif face. */
    emphasis: "tomorrow",
    sub: "Fast. Clean. Unmistakably professional. From conversion-focused marketing sites to fully interactive 3D experiences that run at 60fps in the browser.",
    primaryCta: { label: "Start a project", href: "#contact" },
    secondaryCta: { label: "See what we build", href: "#services" },
    scrollCue: "Scroll to explore",
    status: "Available for new work — Q1",
  },

  marquee: [
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
  ],

  stats: [
    { value: 120, suffix: "+", label: "Projects shipped", hint: "Since 2021" },
    {
      value: 99,
      suffix: "/100",
      label: "Median Lighthouse score",
      hint: "Performance, mobile",
    },
    {
      value: 47,
      suffix: "ms",
      label: "Median interaction latency",
      hint: "INP, p75",
    },
    {
      value: 14,
      suffix: " days",
      label: "Average time to launch",
      hint: "Design to deploy",
    },
  ],

  manifesto: {
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
  },

  services: {
    label: "Services",
    title: "What we do, and do properly.",
    emphasis: "properly",
    body: "Six disciplines, one team, no handoffs. Every engagement is scoped so we can own the outcome from first sketch to production monitoring.",
    items: [
      {
        id: "web",
        index: "01",
        title: "Website Design & Development",
        blurb:
          "Marketing sites, corporate platforms and product launches built on Next.js. Editorial layouts, custom design systems and content models your team can actually run.",
        icon: "layout",
        points: [
          "Next.js & React",
          "Headless CMS",
          "Design systems",
          "SEO & accessibility",
        ],
      },
      {
        id: "three-d",
        index: "02",
        title: "3D & Real-Time WebGL",
        blurb:
          "Scroll-driven 3D scenes, product configurators, generative backgrounds and shader work — hand-written GLSL tuned to stay smooth on a mid-range phone.",
        icon: "cube",
        points: [
          "Three.js & R3F",
          "Custom GLSL",
          "Product configurators",
          "60fps budgets",
        ],
      },
      {
        id: "performance",
        index: "03",
        title: "Performance Engineering",
        blurb:
          "We profile, diagnose and rebuild. Streaming, caching, bundle surgery and render-path work that moves Core Web Vitals into the green and keeps them there.",
        icon: "bolt",
        points: [
          "Core Web Vitals",
          "Bundle analysis",
          "Edge caching",
          "CI budgets",
        ],
      },
      {
        id: "product",
        index: "04",
        title: "Product & Interface Design",
        blurb:
          "Interfaces designed against real constraints: state, motion, empty states, error states and the fifteen edge cases nobody put in the brief.",
        icon: "compass",
        points: [
          "UX architecture",
          "UI systems",
          "Prototyping",
          "Motion specs",
        ],
      },
      {
        id: "commerce",
        index: "05",
        title: "Commerce & Conversion",
        blurb:
          "Storefronts and checkout flows engineered around one question: what makes the next click obvious? Then proven with experiments, not opinions.",
        icon: "cart",
        points: [
          "Headless commerce",
          "Checkout UX",
          "A/B testing",
          "Analytics",
        ],
      },
      {
        id: "motion",
        index: "06",
        title: "Motion & Micro-Interaction",
        blurb:
          "Scroll choreography, page transitions and the small reactions that make an interface feel alive — all built to respect reduced-motion preferences.",
        icon: "wave",
        points: [
          "GSAP & ScrollTrigger",
          "Page transitions",
          "Micro-interactions",
          "A11y aware",
        ],
      },
    ],
  },

  projects: {
    label: "Selected work",
    title: "Proof, not promises.",
    emphasis: "Proof",
    body: "Four live sites that show the range: a portfolio one viewport tall, a Tehran café that opened in 1995, a halal drinks bar with a mixer of its own, and a sourdough bakery. Scroll to move through them.",
    cta: "Start something like this",
    items: [
      {
        id: "portfolio-arn",
        index: "01",
        client: "Alireza Naghavi",
        sector: "Personal portfolio",
        title: "A portfolio one viewport tall",
        summary:
          "No pages and no document scroll: a single WebGL canvas is the entire site, and the document is exactly as tall as the window it is drawn in. Next.js streams the shell; three.js r182 renders everything inside it, frame by frame.",
        services: ["Real-time 3D", "Single viewport", "Portfolio"],
        stack: ["Next.js", "three.js", "WebGL"],
        accent: "violet",
      },
      {
        id: "godot-cafe",
        index: "02",
        client: "Café Godot",
        sector: "Café · Valiasr St, Tehran",
        title: "A quiet place to wait",
        summary:
          "A corner café on Valiasr Street, opened in 1995 and named after the man who never arrives: white facade, blue wooden doors, Beckett portraits above the chairs. The site makes the case in the house's own voice — the manifesto, the menu from caramel macchiato to San Sebastián cheesecake, a gallery of the room, table booking, and the 4.5 out of 5 its guests keep giving it.",
        services: ["Manifesto", "Menu", "Gallery", "Table booking"],
        stack: ["Next.js", "React", "Tailwind"],
        accent: "cyan",
      },
      {
        id: "digital-mixology",
        index: "03",
        client: "Kafe Nooshin",
        sector: "Halal drinks bar · Tehran",
        title: "Build your own flavour",
        summary:
          "A modern coffee house with no alcohol in it, and a mixer at the centre of the offer: choose the syrups, watch them settle into layers in the glass, add ice and a garnish, and take the name of your own signature drink. Forty-odd drinks on the menu, traditional Iranian flavours in most of them, and a door that stays open until 2am at the weekend.",
        services: ["Drink mixer", "Menu", "About us", "Newsletter"],
        stack: ["Next.js", "React", "Tailwind"],
        accent: "lime",
      },
      {
        id: "bakery-manfi",
        index: "04",
        client: "Minus One",
        sector: "Sourdough bakery · Karim Khan St, Tehran",
        title: "Real sourdough, from loaves to biscuits",
        summary:
          "A handmade bakery below street level on Karim Khan Street, worked with wild sourdough rather than commercial yeast: six categories and twenty-six products, from plain and seeded loaves to croissants, biscuits and fruit pies. The site is a shop as much as a menu — stock, prices, a cart — and it holds 4.8 from 1,267 reviews.",
        services: ["Menu", "Cart", "Catalogue", "Storefront"],
        stack: ["Next.js", "React"],
        accent: "violet",
      },
    ],
  },

  gallery: {
    label: "The gallery",
    title: "Every site we ship, hung on one wall.",
    emphasis: "one wall",
    body: "The same four sites, this time as themselves. Scroll to walk the wall — the frame that reaches the front is the one the caption describes. Each screen is a real screenshot of the live site, captured at 1440px and hung on the wall as a texture.",
    hint: "Scroll to walk the wall",
    hintInner: "Hover a frame to read the page",
    cta: "Start something like this",
  },

  process: {
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
        deliverables: [
          "Art direction",
          "Design system",
          "Prototype",
          "Motion specs",
        ],
      },
      {
        step: "03",
        title: "Build",
        duration: "Weeks 2–4",
        body: "Typed components, a headless content model and — where it earns its place — 3D. Weekly staging deploys so you can watch progress instead of waiting for a reveal.",
        deliverables: [
          "Component library",
          "CMS setup",
          "3D / WebGL",
          "Staging deploys",
        ],
      },
      {
        step: "04",
        title: "Ship & sharpen",
        duration: "Ongoing",
        body: "We launch behind monitoring and analytics, then iterate on real behaviour. Handover includes documentation, a recorded walkthrough and 30 days of support.",
        deliverables: [
          "Launch",
          "Analytics",
          "Documentation",
          "30-day support",
        ],
      },
    ],
  },

  stack: {
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
        items: [
          "Three.js",
          "React Three Fiber",
          "GLSL / WebGPU",
          "GSAP",
          "Blender",
        ],
      },
      {
        name: "Platform",
        items: [
          "Vercel",
          "Cloudflare",
          "Sanity",
          "PostgreSQL",
          "GitHub Actions",
        ],
      },
      {
        name: "Quality",
        items: [
          "Playwright",
          "Vitest",
          "Lighthouse CI",
          "axe-core",
          "Sentry",
        ],
      },
    ],
  },

  lab: {
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
  },

  team: {
    label: "The people",
    title: "A small team, on purpose.",
    emphasis: "small",
    body: "No account managers, no telephone game between three agencies. You talk directly to the people writing the code and drawing the artwork.",
    members: [
      {
        name: "Alireza Naghavi",
        role: "Founder & Lead Engineer",
        initials: "AN",
        accent: "violet",
        focus: "Next.js · Performance · Architecture",
        bio: "Co-founded WanaWeb, and still writes most of what ships. Turns ambitious design into fast, typed systems — and sets the performance budgets he then has to hit.",
        links: [{ label: "GitHub", href: "https://github.com/ARN1380" }],
      },
      {
        name: "Abbas Vaziri",
        role: "Founder",
        initials: "AV",
        accent: "lime",
        focus: "Direction · Partnerships · Strategy",
        bio: "Sets the studio's direction and stays close to every engagement we take on. Co-founded WanaWeb on a stubborn belief that craft and speed are not a trade-off.",
        links: [],
      },
      {
        name: "Sara Mehrabi",
        role: "Creative Director",
        initials: "SM",
        accent: "violet",
        focus: "Art direction · Typography · Brand",
        bio: "Turns a positioning paragraph into a visual language. Obsessive about grids, type scales and the exact grey of a background.",
        links: [],
      },
      {
        name: "Daniyal Okafor",
        role: "3D & WebGL Developer",
        initials: "DO",
        accent: "cyan",
        focus: "Three.js · GLSL · Simulation",
        bio: "Lives in shader code. Builds scenes that look expensive and still load in under a second on a phone from 2019.",
        links: [],
      },
      {
        name: "Mina Tabatabaei",
        role: "Frontend & Motion Engineer",
        initials: "MT",
        accent: "violet",
        focus: "React · GSAP · Accessibility",
        bio: "Believes motion should explain something. Every animation she ships has a reduced-motion path and a reason to exist.",
        links: [],
      },
      {
        name: "Luca Ferrari",
        role: "Platform & DevOps",
        initials: "LF",
        accent: "cyan",
        focus: "Edge · CI/CD · Observability",
        bio: "Makes deploys boring and rollbacks instant. If something breaks at 3am, he knows because the alert reached him first.",
        links: [],
      },
      {
        name: "Roza Farhadi",
        role: "Product Designer",
        initials: "RF",
        accent: "lime",
        focus: "UX · Research · Prototyping",
        bio: "Interviews the people who will actually use the thing, then designs for the edge cases everyone else skips.",
        links: [],
      },
    ],
  },

  testimonials: {
    label: "Signal",
    title: "What partners say.",
    emphasis: "partners",
    items: [
      {
        quote:
          "They rebuilt our marketing site in three weeks and cut median page load from 4.1s to 0.6s. Organic traffic followed. The codebase is the cleanest thing in our stack.",
        name: "Head of Growth",
        company: "B2B SaaS platform",
      },
      {
        quote:
          "We asked for a 3D product configurator and expected a compromise on performance. We got both — and it still runs smoothly on older Android devices.",
        name: "Product Lead",
        company: "Consumer hardware brand",
      },
      {
        quote:
          "The handover was the most professional part: documentation, a recorded walkthrough, monitoring dashboards. Our in-house team shipped their first feature on day two.",
        name: "Engineering Manager",
        company: "Fintech scale-up",
      },
    ],
  },

  faq: {
    label: "Questions",
    title: "The things people ask first.",
    emphasis: "first",
    body: "If your question is not here, ask it directly — you will get a straight answer, including a no.",
    cta: "Ask us directly",
    items: [
      {
        q: "How does a project usually start?",
        a: "With a short written brief: what you are building, who it is for, what success looks like, and your constraints around time and budget. We reply within one business day with either a proposal or an honest recommendation that we are not the right fit. First calls are 30 minutes and free.",
      },
      {
        q: "What does a website cost?",
        a: "A focused marketing site typically lands between $8k and $25k. A platform with a CMS, custom design system and 3D work usually falls between $25k and $60k. We scope as a fixed price against a written deliverable list, so the number does not move unless the scope does.",
      },
      {
        q: "How long does it take?",
        a: "Fourteen days for a small site, three to six weeks for a typical engagement, longer for platforms and 3D. You get a staging URL in week one and weekly deploys after that, so you are never waiting for a big reveal at the end.",
      },
      {
        q: "Is 3D actually worth it for my site?",
        a: "Sometimes. 3D earns its place when it explains something a photo cannot — a configurable product, a spatial concept, a change over time. When it is decoration, we will say so and recommend spending the budget on typography, photography and speed instead.",
      },
      {
        q: "Can you work with our in-house developers?",
        a: "Yes, and it often works well. We can lead the front end, build a design system your team maintains, or act purely as a performance and 3D specialist on top of your existing stack. Everything we hand over is typed, documented and reviewed with your engineers.",
      },
      {
        q: "What happens after launch?",
        a: "You get the repository, documentation, a recorded walkthrough and 30 days of support. After that most clients keep a small monthly retainer for iteration and monitoring, but there is no lock-in — the code is yours to run without us.",
      },
      {
        q: "Who owns the code and the design?",
        a: "You do, entirely, on final payment. We keep no proprietary framework, no licence fee and no hosted lock-in. The only third-party pieces are the open-source libraries we declare up front.",
      },
    ],
  },

  contact: {
    label: "Contact",
    title: "Let's build something worth loading.",
    emphasis: "worth loading",
    body: "Tell us what you are building and what is getting in the way. You will hear back within one business day — from an engineer, not a sales funnel.",
    cta: "Send the brief",
    note: "Prefer email?",
    responseTime: "Typical reply: under 24 hours",
    budgetOptions: [
      "Under $5k",
      "$5k – $15k",
      "$15k – $50k",
      "$50k and up",
      "Not sure yet",
    ],
    projectTypes: [
      "Marketing website",
      "3D / WebGL experience",
      "Web application",
      "Performance rescue",
      "Design system",
      "Something else",
    ],
    form: {
      name: "Name *",
      email: "Email *",
      company: "Company",
      projectType: "Project type",
      budget: "Budget",
      brief: "The brief *",
      namePlaceholder: "Ada Lovelace",
      emailPlaceholder: "you@company.com",
      companyPlaceholder: "Optional",
      briefPlaceholder:
        "What are you building, what is getting in the way, and when does it need to be live?",
      disclaimer: "No newsletters. No CRM. Just an engineer replying.",
    },
    sent: {
      title: "Your brief is on its way.",
      body: "We opened your email client with the details filled in — press send and it lands with us. If nothing opened, write to",
      again: "Write another",
    },
    mail: {
      subject: "New project brief",
      name: "Name",
      email: "Email",
      company: "Company",
      budget: "Budget",
      projectType: "Project type",
    },
  },

  footer: {
    blurb:
      "An independent web studio building fast, clean-coded, professionally crafted websites — and 3D experiences that run right in the browser.",
    columns: [
      {
        title: "Studio",
        links: [
          { label: "Selected work", href: "#work" },
          { label: "The studio", href: "#studio" },
          { label: "Services", href: "#services" },
          { label: "Team", href: "#team" },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "3D Lab", href: "#lab" },
          { label: "Gallery", href: "#gallery" },
          { label: "Process", href: "#process" },
          { label: "Toolkit", href: "#stack" },
          { label: "FAQ", href: "#faq" },
        ],
      },
    ],
    legal: "All rights reserved.",
    buildNote: "Built with Next.js, React Three Fiber and hand-written GLSL.",
  },

  ui: {
    skipToContent: "Skip to content",
    backToTop: "back to top",
    openForWork: "Open for work",
    startProject: "Start a project",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    navPrimary: "Primary",
    navMobile: "Mobile",
    navSections: "Site sections",
    language: {
      label: "Language",
    },
    preloader: {
      compiling: "Compiling shaders · preparing the scene",
    },
    labStage: {
      live: "WebGL / live",
      geometry: "0 assets · 1 draw call / 28 cubes",
    },
    notFound: {
      title: "Page not found",
      kicker: "Error 404",
      headline: "Lost",
      body: "This page does not exist — or it moved while we were rewriting the render path. Everything worth seeing is on the studio site.",
      home: "Back to the studio",
    },
  },
} as const;
