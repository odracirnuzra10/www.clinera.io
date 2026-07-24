import type { Metadata } from "next";
import PlataformaLanding from "@/components/plataforma/PlataformaLanding";

export const metadata: Metadata = {
  title: "La plataforma con IA que unifica toda la operación de tu clínica",
  description:
    "Clinera unifica agenda, WhatsApp, fichas, cobros y recuperación de pacientes de todas tus sedes en una sola plataforma operada con IA. Para clínicas medianas y grandes: 2+ sedes o alto volumen.",
  alternates: { canonical: "https://www.clinera.io/plataforma" },
  openGraph: {
    url: "https://www.clinera.io/plataforma",
    title: "Una clínica que crece no se opera en cinco sistemas — Clinera.io",
    description:
      "Agenda, WhatsApp, fichas, cobros y recuperación de todas tus sedes en un solo sistema, operado con IA. Visibilidad y control central.",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Plataforma", item: "https://www.clinera.io/plataforma" },
  ],
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Plataforma con IA que unifica agenda, WhatsApp, ficha clínica, cobros, recuperación de pacientes y control central de todas las sedes de una clínica o grupo clínico.",
  url: "https://www.clinera.io/plataforma",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "279",
    highPrice: "1500",
    priceCurrency: "USD",
    offerCount: "4",
  },
};

export default function PlataformaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />

      <main>
        <PlataformaLanding />
      </main>
    </>
  );
}
