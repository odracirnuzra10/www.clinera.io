import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import HomeV3 from "@/components/home-v3/HomeV3";
import { HOME_FAQ } from "@/content/home-faq";

export const metadata: Metadata = {
  title: "Clinera.io | El sistema con IA que opera y estandariza tus clínicas",
  description:
    "Agentes de IA que operan la agenda de todo tu equipo y todas tus sedes por WhatsApp: agendan, confirman, cobran y recuperan pacientes 24/7. Visibilidad y control central. +52 clínicas en Chile y LATAM.",
  alternates: { canonical: "https://www.clinera.io/" },
  openGraph: {
    url: "https://www.clinera.io/",
    title: "Clinera.io — Opera y estandariza todas tus clínicas con IA",
    description:
      "Agentes de IA sobre la agenda de tu equipo y tus sedes por WhatsApp: agendan, confirman, cobran y recuperan pacientes 24/7, sin que se te escape un lead. Visibilidad y control central.",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clinera.io",
  url: "https://www.clinera.io",
  logo: "https://www.clinera.io/images/brand/clinera-icon-512.png",
  sameAs: [
    "https://cl.linkedin.com/company/clinera-io",
    "https://www.instagram.com/clinera.io",
    "https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ",
  ],
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Plataforma con IA para grupos clínicos y clínicas con volumen: agentes que agendan, confirman, cobran y recuperan pacientes por WhatsApp 24/7, con visibilidad y control central de toda la operación.",
  url: "https://www.clinera.io",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "129",
    highPrice: "1500",
    priceCurrency: "USD",
    offerCount: "4",
  },
  // Fuente única de rating: coherente con "+52 clínicas activas" visible en el sitio
  // (mismo valor que softwareSchema en src/components/seo/schemas.ts).
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "52",
    bestRating: "5",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <NavV3 />
      <main>
        <HomeV3 />
      </main>
      <FooterV3 />
    </>
  );
}
