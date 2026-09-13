import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import Manifesto from "@/components/Manifesto";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Stack from "@/components/Stack";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import { site } from "@/lib/content";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  areaServed: "Worldwide",
  foundingDate: String(site.founded),
  knowsAbout: [
    "Next.js development",
    "React Three Fiber",
    "WebGL and GLSL",
    "Core Web Vitals performance",
    "Design systems",
    "Motion design",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main id="main" className="flex flex-col">
        <Hero />
        <Manifesto />
        <Services />
        <Lab />
        <Process />
        <Stack />
        <Team />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
