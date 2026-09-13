/** Frequently asked questions. Answers are written to be genuinely useful. */

export const faq = {
  label: "Questions",
  title: "The things people ask first.",
  emphasis: "first",
  body: "If your question is not here, ask it directly — you will get a straight answer, including a no.",
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
} as const;
