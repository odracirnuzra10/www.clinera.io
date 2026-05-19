import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import HomeV3 from "@/components/home-v3/HomeV3";

export const metadata: Metadata = {
  title: "Clinera.io | Tu empleado digital para clínicas · 24/7 por WhatsApp",
  description:
    "No es un chatbot. Es un empleado digital que ejecuta funciones: crea citas, re-agenda, consulta pagos y revisa sesiones. Desde $129 USD/mes. +52 clínicas en Chile y LATAM.",
  alternates: { canonical: "https://clinera.io/" },
  openGraph: {
    url: "https://clinera.io/",
    title: "Clinera.io — Tu empleado digital. 24/7. Por WhatsApp.",
    description:
      "AURA agenda, re-agenda, consulta pagos y revisa sesiones. Hace el 100% del trabajo de tu recepcionista. Activa tu clínica en menos de 1 hora.",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clinera.io",
  url: "https://clinera.io",
  logo: "https://clinera.io/images/brand/clinera-icon-512.png",
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
    "Empleado digital con IA para clínicas: agenda, re-agenda, consulta pagos y revisa sesiones por WhatsApp, 24/7. Ejecuta el 100% del trabajo de una recepcionista.",
  url: "https://clinera.io",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "129",
    highPrice: "358",
    priceCurrency: "USD",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "500",
  },
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

      <NavV3 />
      <main>
        <HomeV3 />
      </main>
      <FooterV3 />
    </>
  );
}
