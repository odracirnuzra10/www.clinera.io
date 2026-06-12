import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EfectividadV3 from "@/components/interior-v3/EfectividadV3";

export const metadata: Metadata = {
  title: "Efectividad de Clinera | 100% de agendamientos exitosos",
  description:
    "Clinera agenda el 95.2% de los pacientes al primer intento y el 100% en máximo tres. Auditado sobre 42 casos y 14 flujos en 3 clínicas reales.",
  keywords: [
    "efectividad clinera",
    "clinera funciona",
    "clinera resultados",
    "IA clínicas confiable",
    "agente IA agendamiento",
  ],
  alternates: { canonical: "https://www.clinera.io/efectividad" },
  openGraph: {
    type: "website",
    url: "https://www.clinera.io/efectividad",
    siteName: "Clinera.io",
    title: "Efectividad de Clinera — 100% de agendamientos en ≤3 intentos",
    description:
      "95.2% pass@1 · 97.6% pass@2 · 100% pass@3. Reporte técnico auditable sobre 42 casos en 3 clínicas reales.",
    locale: "es_LA",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Efectividad de Clinera — 100% de agendamientos en ≤3 intentos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Efectividad de Clinera — 100% de agendamientos en ≤3 intentos",
    description: "95.2% pass@1 · 100% pass@3. Reporte técnico auditable.",
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.clinera.io/efectividad#webpage",
      url: "https://www.clinera.io/efectividad",
      name: "Efectividad de Clinera | 100% de agendamientos exitosos",
      description:
        "Clinera agenda el 95.2% de los pacientes al primer intento y el 100% en máximo tres. Auditado sobre 42 casos y 14 flujos en 3 clínicas reales.",
      isPartOf: { "@id": "https://www.clinera.io/#website" },
      about: { "@id": "https://www.clinera.io/efectividad#dataset" },
      inLanguage: "es",
    },
    {
      "@type": "Dataset",
      "@id": "https://www.clinera.io/efectividad#dataset",
      name: "Clinera LangGraph Agent Evals — 2026-04-22",
      description:
        "Suite end-to-end de evals del agente de agendamiento de Clinera contra 3 clínicas reales. 42 casos, 14 flujos, métricas pass@k.",
      creator: { "@type": "Organization", name: "Clinera", url: "https://www.clinera.io" },
      datePublished: "2026-04-22",
      license: "https://www.clinera.io/terminos",
      variableMeasured: [
        { "@type": "PropertyValue", name: "pass@1", value: "95.2%" },
        { "@type": "PropertyValue", name: "pass@2", value: "97.6%" },
        { "@type": "PropertyValue", name: "pass@3", value: "100%" },
        { "@type": "PropertyValue", name: "total_cases", value: 42 },
        { "@type": "PropertyValue", name: "flows_covered", value: 14 },
        { "@type": "PropertyValue", name: "never_passed", value: 0 },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.clinera.io/efectividad#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué significa 100% de agendamientos exitosos?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "En la muestra auditada de 42 casos sobre 3 clínicas reales, todos los casos terminaron en agendamiento correcto o en derivación a humano correcta. Ningún caso quedó sin resolver.",
          },
        },
        {
          "@type": "Question",
          name: "¿El paciente tiene que escribir varias veces si la IA falla?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "No. Escribe una sola vez. Si el agente principal falla, un segundo agente juez lo detecta y reintenta internamente. El paciente solo percibe que la respuesta tardó 90 o 120 segundos en lugar de 40.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo auditar estos resultados?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Sí. Los clientes activos pueden solicitar el JSONL crudo de resultados. Periodistas e investigadores pueden coordinar una auditoría en sandbox bajo NDA.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cada cuánto actualizan el estudio?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "La suite corre en cada release y bloquea merge si pass@1 baja de 90%. Clinera publica un reporte resumido trimestralmente. Próxima actualización: julio 2026.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué hace Clinera distinto de otros chatbots para clínicas?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Tres cosas auditables: arquitectura de dos niveles con agente juez y self-refine, tests contra clínicas reales publicados, y trazabilidad completa desde el mensaje hasta el turno creado en la base de datos.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io" },
        { "@type": "ListItem", position: 2, name: "Efectividad", item: "https://www.clinera.io/efectividad" },
      ],
    },
  ],
};

export default function EfectividadPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <EfectividadV3 />
      </main>
      <FooterV3 />
    </>
  );
}
