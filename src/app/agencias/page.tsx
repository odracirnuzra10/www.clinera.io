import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import AgenciasLanding from "@/components/agencias/AgenciasLanding";

export const metadata: Metadata = {
  title: "Programa Partner para Agencias — Clinera.io",
  description:
    "El programa partner de Clinera para agencias de marketing en LATAM. 20% de descuento permanente para tus clientes, directorio de agencias recomendadas y capacitación 1:1. Conecta Meta Lead Ads, CRM y dashboards directo a la operación clínica vía API/Webhooks.",
  alternates: { canonical: "https://clinera.io/agencias" },
  openGraph: {
    url: "https://clinera.io/agencias",
    title: "Programa Partner para Agencias — Clinera.io",
    description:
      "20% descuento permanente, directorio recomendado y capacitación 1:1. Conecta Meta Ads y tu stack al WhatsApp de cada clínica.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Programa partner para agencias",
      },
    ],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Agencias", item: "https://clinera.io/agencias" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo funciona el 20% de descuento del programa partner?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Aplica permanentemente a todas las cuentas activas que la agencia traiga: Conect, Advanced o MAX. Sin tope, sin vencimiento. Se descuenta directo del precio del plan que paga la clínica.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el Directorio de Agencias Recomendadas de Clinera?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Un directorio público dentro de clinera.io donde aparecen las agencias partner verificadas. Cuando una clínica pregunta por una agencia experta en Clinera, derivamos contactos directamente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se conecta Meta Lead Ads con Clinera?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Vía webhook. Cada lead de la campaña dispara una automatización en Clinera que crea el lead en el sistema, registra origen (campaña, ad set) y arranca un flujo de WhatsApp con AURA. Setup típico de 30 segundos en n8n, Make o Zapier.",
      },
    },
  ],
};

export default function AgenciasPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <AgenciasLanding />
      </main>
      <FooterV3 />
    </>
  );
}
