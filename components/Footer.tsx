import Logo from "@/components/Logo";
import { FadeUp } from "@/components/Reveal";
import type { Dictionary } from "@/lib/dictionaries/types";

type FooterProps = {
  footer: Dictionary["footer"];
  site: Dictionary["site"];
};

export default function Footer({ footer, site }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-[var(--shell)] py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <FadeUp className="flex max-w-sm flex-col gap-5">
            <Logo />
            <p className="text-sm leading-relaxed text-muted">{footer.blurb}</p>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex w-fit items-center gap-2 font-mono text-[0.72rem] tracking-[0.16em] text-lime uppercase"
            >
              {site.email}
              <span
                aria-hidden="true"
                className="arrow-forward [--arrow-duration:0.3s]"
              >
                →
              </span>
            </a>
          </FadeUp>

          {footer.columns.map((column, columnIndex) => (
            <FadeUp key={column.title} delay={columnIndex * 90}>
              <h3 className="kicker mb-5">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors duration-300 hover:text-bone"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>

        <div className="hairline-t mt-14 flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">
            © {year} {site.name}. {footer.legal}
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase transition-colors duration-300 hover:text-lime"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 font-mono text-[0.68rem] tracking-[0.14em] text-muted/70 uppercase">
          {footer.buildNote} · {site.location}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none px-[var(--shell)] pb-2"
      >
        <span className="iridescent-text block text-center text-[clamp(3.2rem,17vw,15rem)] leading-[0.8] font-semibold tracking-[-0.06em] opacity-15">
          WanaWeb
        </span>
      </div>
    </footer>
  );
}
