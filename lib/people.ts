/** The humans behind WanaWeb, and what partners say about working with us. */

export const team = {
  label: "The people",
  title: "A small team, on purpose.",
  emphasis: "small",
  body: "No account managers, no telephone game between three agencies. You talk directly to the people writing the code and drawing the artwork.",
  members: [
    {
      name: "Abbas Vaziri",
      role: "Founder",
      initials: "AV",
      accent: "lime",
      focus: "Direction · Partnerships · Strategy",
      bio: "Started WanaWeb on a stubborn belief that craft and speed are not a trade-off. Sets the studio's direction and stays close to every engagement we take on.",
      links: [],
    },
    {
      name: "Alireza Naghavi",
      role: "Lead Engineer",
      initials: "AN",
      accent: "violet",
      focus: "Next.js · Performance · Architecture",
      bio: "Turns ambitious design into fast, typed systems. Writes the performance budgets he then has to hit.",
      links: [{ label: "GitHub", href: "https://github.com/ARN1380" }],
    },
    {
      name: "Sara Mehrabi",
      role: "Creative Director",
      initials: "SM",
      accent: "lime",
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
} as const;

export type TeamMember = (typeof team.members)[number];

export const testimonials = {
  label: "Signal",
  title: "What partners say.",
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
} as const;
