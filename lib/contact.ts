/** Contact form copy and footer content. */

export const contact = {
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
} as const;

export const footer = {
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
        { label: "Process", href: "#process" },
        { label: "Toolkit", href: "#stack" },
        { label: "FAQ", href: "#faq" },
      ],
    },
  ],
  legal: "All rights reserved.",
  buildNote: "Built with Next.js, React Three Fiber and hand-written GLSL.",
} as const;
