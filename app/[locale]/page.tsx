import { notFound } from "next/navigation";

import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import Manifesto from "@/components/Manifesto";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Stack from "@/components/Stack";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localeConfig } from "@/lib/i18n";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const dict = getDictionary(raw);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: dict.site.name,
    url: dict.site.url,
    email: dict.site.email,
    description: dict.meta.description,
    areaServed: dict.meta.areaServed,
    foundingDate: String(dict.site.founded),
    knowsAbout: [...dict.meta.knowsAbout],
    inLanguage: localeConfig[raw].htmlLang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main id="main" className="flex flex-col">
        <Hero hero={dict.hero} marquee={dict.marquee} />
        <Manifesto manifesto={dict.manifesto} stats={dict.stats} />
        <Work projects={dict.projects} />
        <Services services={dict.services} />
        <Lab lab={dict.lab} stage={dict.ui.labStage} />
        <Process process={dict.process} />
        <Stack stack={dict.stack} />
        <Team team={dict.team} />
        <Testimonials testimonials={dict.testimonials} />
        <Faq faq={dict.faq} />
        <Contact contact={dict.contact} site={dict.site} />
      </main>
    </>
  );
}
