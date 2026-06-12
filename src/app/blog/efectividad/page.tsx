import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EfectividadArticle from "@/components/interior-v3/EfectividadArticle";

export const metadata: Metadata = {
  title: "Estudio de Efectividad 2026: 100% de agendamientos en ≤3 intentos",
  description:
    "Reporte interno de evals del agente de IA de Clinera. 95.2% pass@1, 100% pass@3 sobre 42 casos, 14 flujos y 3 clínicas reales. Metodología, arquitectura y código.",
  keywords: [
    "estudio efectividad agente IA clínicas",
    "benchmark IA agendamiento LATAM",
    "pass@k agente médico",
    "arquitectura agente juez self-refine",
    "evals LangGraph agente clínica",
  ],
  alternates: { canonical: "https://www.clinera.io/blog/efectividad" },
  openGraph: {
    type: "article",
    url: "https://www.clinera.io/blog/efectividad",
    siteName: "Clinera.io",
    title: "Estudio de Efectividad 2026 — 100% de agendamientos en ≤3 intentos",
    description:
      "Reporte técnico auditable del agente de IA de Clinera: 95.2% pass@1, 100% pass@3 sobre 42 casos reales.",
    publishedTime: "2026-04-23T00:00:00.000Z",
    modifiedTime: "2026-04-23T00:00:00.000Z",
    authors: ["Equipo de Ingeniería Clinera"],
    tags: ["IA", "Agendamiento", "Evals", "LangGraph"],
    locale: "es_LA",
    images: [
      {
        url: "/images/efectividad/reporte-pagina-1.webp",
        width: 1200,
        height: 1697,
        alt: "Reporte técnico de efectividad del agente IA de Clinera — métricas 95.2% pass@1, 97.6% pass@2, 100% pass@3",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estudio de Efectividad 2026 — 100% de agendamientos en ≤3 intentos",
    description:
      "95.2% pass@1, 100% pass@3 sobre 42 casos reales en 3 clínicas. Metodología, arquitectura y código.",
    images: ["/images/efectividad/reporte-pagina-1.webp"],
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
      "@type": "Article",
      "@id": "https://www.clinera.io/blog/efectividad#article",
      headline: "Estudio de Efectividad 2026: 100% de agendamientos en ≤3 intentos",
      description:
        "Reporte interno de evals del agente de IA de Clinera. 95.2% pass@1, 100% pass@3 sobre 42 casos, 14 flujos y 3 clínicas reales.",
      author: {
        "@type": "Organization",
        name: "Equipo de Ingeniería Clinera",
        url: "https://www.clinera.io",
      },
      publisher: {
        "@type": "Organization",
        name: "Clinera",
        url: "https://www.clinera.io",
        logo: {
          "@type": "ImageObject",
          url: "https://www.clinera.io/clinera-logo.png",
        },
      },
      datePublished: "2026-04-23",
      dateModified: "2026-04-23",
      mainEntityOfPage: "https://www.clinera.io/blog/efectividad",
      image: "https://www.clinera.io/images/efectividad/reporte-pagina-1.webp",
      inLanguage: "es",
      about: [
        { "@type": "Thing", name: "Inteligencia Artificial" },
        { "@type": "Thing", name: "Agendamiento Automatizado" },
        { "@type": "Thing", name: "Software Médico" },
        { "@type": "Thing", name: "LangGraph" },
        { "@type": "Thing", name: "Evals de LLMs" },
      ],
      isBasedOn: { "@id": "https://www.clinera.io/efectividad#dataset" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.clinera.io/blog/efectividad#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es pass@1 y por qué importa más que pass@3?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "pass@1 es el porcentaje de casos que la IA resuelve correctamente en el primer intento. Importa más que pass@3 porque los pacientes reales no tienen self-refine: si fallan al primer intento, simplemente se van. En Clinera el pass@1 es 95.2%.",
          },
        },
        {
          "@type": "Question",
          name: "¿El paciente tiene que escribir varias veces si la IA falla?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "No. El paciente escribe una sola vez. Si el agente principal falla, un segundo agente juez detecta el error y reintenta internamente. El paciente solo nota que la respuesta tardó 90 o 120 segundos en lugar de 40.",
          },
        },
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
          name: "¿Qué pasa si intentan manipular al agente con un precio falso?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "El agente no cede. Tiene patrones de detección de concesión y reglas anti-concesiones en el prompt. Si el paciente insiste, el sistema deriva a un humano antes que negociar precios no autorizados por la clínica.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué modelo de IA usa Clinera?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "El modelo base del estudio publicado es google/gemini-3-flash-preview vía OpenRouter. La arquitectura es agnóstica al modelo: puede intercambiarse por Claude, GPT-4o o Llama según el caso.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cada cuánto actualiza Clinera este estudio?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "La suite completa corre en cada release. Clinera publica un reporte resumido trimestralmente. La próxima actualización está planificada para julio de 2026.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo se verifican los resultados del estudio?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Los clientes activos pueden solicitar el JSONL crudo de resultados. Investigadores y periodistas pueden coordinar una auditoría en entorno sandbox. La suite de tests está disponible bajo NDA.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué diferencia hay entre Clinera y otros chatbots para clínicas?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Tres diferencias auditables: arquitectura de dos niveles con agente juez y self-refine, tests de evals contra clínicas reales publicados, y trazabilidad completa desde el mensaje hasta el turno creado en la base de datos.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io" },
        { "@type": "ListItem", position: 2, name: "Novedades", item: "https://www.clinera.io/novedades" },
        { "@type": "ListItem", position: 3, name: "Efectividad", item: "https://www.clinera.io/blog/efectividad" },
      ],
    },
  ],
};

export default function BlogEfectividadPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <EfectividadArticle />
      </main>
      <FooterV3 />
    </>
  );
}
