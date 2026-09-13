"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import Magnetic from "@/components/Magnetic";
import { FadeUp } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries/types";

type FormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  projectType: string;
  message: string;
};

type ContactProps = {
  contact: Dictionary["contact"];
  site: Dictionary["site"];
};

/** The form opens on the middle budget band and the first project type. */
function makeInitialForm(contact: Dictionary["contact"]): FormState {
  return {
    name: "",
    email: "",
    company: "",
    budget: contact.budgetOptions[1],
    projectType: contact.projectTypes[0],
    message: "",
  };
}

const fieldClass =
  "w-full rounded-xl border border-hairline bg-ink-raised/60 px-4 py-3 text-sm text-bone transition-colors duration-300 placeholder:text-muted/50 focus:border-lime/50 focus:bg-ink-raised focus:outline-none";

const labelClass = "font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase";

export default function Contact({ contact, site }: ContactProps) {
  const [form, setForm] = useState<FormState>(() => makeInitialForm(contact));
  const [sent, setSent] = useState(false);

  const update =
    (key: keyof FormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [key]: value }));
    };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { mail } = contact;
    const subject = `${mail.subject} — ${form.projectType} · ${form.budget}`;
    const body = [
      `${mail.name}: ${form.name}`,
      `${mail.email}: ${form.email}`,
      `${mail.company}: ${form.company || "—"}`,
      `${mail.budget}: ${form.budget}`,
      `${mail.projectType}: ${form.projectType}`,
      "",
      form.message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-[var(--shell)]">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              index={8}
              label={contact.label}
              lines={[contact.title]}
              emphasis={contact.emphasis}
              body={contact.body}
            />

            <FadeUp delay={160} className="mt-10 flex flex-col gap-4">
              <span className={labelClass}>{contact.note}</span>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex w-fit items-center gap-2 text-lg font-medium text-lime"
              >
                {site.email}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-expo group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-muted uppercase">
                {contact.responseTime}
              </span>
              <span className="mt-2 font-mono text-[0.62rem] tracking-[0.16em] text-muted/70 uppercase">
                {site.location}
              </span>
            </FadeUp>
          </div>

          <FadeUp delay={120}>
            <div className="relative overflow-hidden rounded-2xl">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-cyan to-lime opacity-[0.14]"
              />

              <div className="relative m-px rounded-[15px] bg-ink/95 p-6 sm:p-8">
                {sent ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex min-h-[22rem] flex-col items-start justify-center gap-4"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full bg-lime text-ink">
                      ✓
                    </span>
                    <h3 className="display-type text-2xl text-bone">
                      {contact.sent.title}
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-muted">
                      {contact.sent.body}{" "}
                      <a
                        href={`mailto:${site.email}`}
                        className="text-lime underline underline-offset-4"
                      >
                        {site.email}
                      </a>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(makeInitialForm(contact));
                        setSent(false);
                      }}
                      className="mt-2 font-mono text-[0.62rem] tracking-[0.18em] text-bone/70 uppercase transition-colors duration-300 hover:text-lime"
                    >
                      <span className="flip-rtl" aria-hidden="true">
                        ←
                      </span>{" "}
                      {contact.sent.again}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className={labelClass}>{contact.form.name}</span>
                        <input
                          required
                          name="name"
                          autoComplete="name"
                          value={form.name}
                          onChange={update("name")}
                          placeholder={contact.form.namePlaceholder}
                          className={fieldClass}
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className={labelClass}>{contact.form.email}</span>
                        <input
                          required
                          type="email"
                          name="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={update("email")}
                          placeholder={contact.form.emailPlaceholder}
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className={labelClass}>{contact.form.company}</span>
                      <input
                        name="company"
                        autoComplete="organization"
                        value={form.company}
                        onChange={update("company")}
                        placeholder={contact.form.companyPlaceholder}
                        className={fieldClass}
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className={labelClass}>
                          {contact.form.projectType}
                        </span>
                        <select
                          name="projectType"
                          value={form.projectType}
                          onChange={update("projectType")}
                          className={`${fieldClass} appearance-none`}
                        >
                          {contact.projectTypes.map((option) => (
                            <option key={option} value={option} className="bg-ink">
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className={labelClass}>{contact.form.budget}</span>
                        <select
                          name="budget"
                          value={form.budget}
                          onChange={update("budget")}
                          className={`${fieldClass} appearance-none`}
                        >
                          {contact.budgetOptions.map((option) => (
                            <option key={option} value={option} className="bg-ink">
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className={labelClass}>{contact.form.brief}</span>
                      <textarea
                        required
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={update("message")}
                        placeholder={contact.form.briefPlaceholder}
                        className={`${fieldClass} resize-none`}
                      />
                    </label>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Magnetic>
                        <button
                          type="submit"
                          className="group inline-flex items-center gap-2.5 rounded-full bg-lime px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-bone"
                        >
                          {contact.cta}
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-500 ease-expo group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </button>
                      </Magnetic>

                      <span className="font-mono text-[0.58rem] tracking-[0.14em] text-muted/70 uppercase">
                        {contact.form.disclaimer}
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
