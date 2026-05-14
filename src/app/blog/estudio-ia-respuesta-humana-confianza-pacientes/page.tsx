import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import ConfianzaIAArticle from "@/components/interior-v3/ConfianzaIAArticle";

export const metadata: Metadata = {
  title: "Estudio Clinera 2026: los pacientes confían más en una IA que responde como humano",
  description:
    "Experimento A/B con 89 clínicas y +57.000 interacciones: la IA con timing humano (20–90 s) completa un 91% de interacciones vs 79% con respuesta instantánea. Qué significa para tu clínica.",
  keywords: [
    "estudio IA confianza pacientes clínicas",
    "timing respuesta IA agendamiento",
    "inteligencia artificial clínicas LATAM",
    "confianza chatbot salud",
    "IA agendamiento clínicas estéticas",
    "estudio A/B IA clínicas Chile",
  ],
  alternates: {
    canonical:
      "https://clinera.io/blog/estudio-ia-respuesta-humana-confianza-pacientes",
  },
  openGraph: {
    type: "article",
    url: "https://clinera.io/blog/estudio-ia-respuesta-humana-confianza-pacientes",
    siteName: "Clinera.io",
    title:
      "Estudio Clinera 2026: los pacientes confían más en una IA que responde como humano, no necesariamente más rápido",
    description:
      "A/B con 89 clínicas y +57.000 interacciones: timing humano logra 91% de completación vs 79% con respuesta instantánea.",
    publishedTime: "2026-05-14T00:00:00.000Z",
    modifiedTime: "2026-05-14T00:00:00.000Z",
    authors: ["Equipo de Producto Clinera"],
    tags: ["IA", "Confianza", "Agendamiento", "Estudio", "Clínicas"],
    locale: "es_LA",
    images: [
      {
        url: "/images/og/estudio-ia-respuesta-humana.webp",
        width: 1200,
        height: 630,
        alt: "Estudio Clinera 2026 — 91% completación con timing humano vs 79% con respuesta instantánea. 89 clínicas, +57.000 interacciones.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Estudio Clinera 2026: la IA con timing humano convierte 12% más pacientes",
    description:
      "A/B con 89 clínicas: 91% vs 79% de completación. La velocidad importa, pero la confianza importa más.",
    images: ["/images/og/estudio-ia-respuesta-humana.webp"],
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
      "@id":
        "https://clinera.io/blog/estudio-ia-respuesta-humana-confianza-pacientes#article",
      headline:
        "Estudio Clinera 2026: los pacientes confían más en una IA que responde como humano, no necesariamente más rápido",
      description:
        "Experimento A/B interno con 89 clínicas y más de 57.000 interacciones. La IA con timing humano (20–90 s) logró un 91% de tasa de completación vs 79% con respuesta instantánea.",
      author: {
        "@type": "Organization",
        name: "Equipo de Producto Clinera",
        url: "https://clinera.io",
      },
      publisher: {
        "@type": "Organization",
        name: "Clinera",
        url: "https://clinera.io",
        logo: {
          "@type": "ImageObject",
          url: "https://clinera.io/clinera-logo.png",
        },
      },
      datePublished: "2026-05-14",
      dateModified: "2026-05-14",
      mainEntityOfPage:
        "https://clinera.io/blog/estudio-ia-respuesta-humana-confianza-pacientes",
      inLanguage: "es",
      about: [
        { "@type": "Thing", name: "Inteligencia Artificial" },
        { "@type": "Thing", name: "Confianza en IA" },
        { "@type": "Thing", name: "Agendamiento Automatizado" },
        { "@type": "Thing", name: "Software Médico" },
        { "@type": "Thing", name: "Experiencia del Paciente" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id":
        "https://clinera.io/blog/estudio-ia-respuesta-humana-confianza-pacientes#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Es este un estudio científico o revisado por pares?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Es un estudio interno de Clinera basado en datos operacionales reales de 89 clínicas y más de 57.000 interacciones. No es un paper académico ni ha sido revisado externamente. Publicamos los resultados por transparencia.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué significa exactamente 'interacción completada'?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Una interacción se considera completada cuando el paciente llegó hasta el paso final del flujo conversacional: confirmar un agendamiento, obtener la información solicitada, o ser derivado a un agente humano correctamente.",
          },
        },
        {
          "@type": "Question",
          name: "¿Por qué los pacientes completarían más cuando la IA es más lenta?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La hipótesis más sólida es de confianza contextual: en salud, una respuesta instantánea puede parecer un bot genérico. Una respuesta con un pequeño retraso activa la percepción de que hay atención real detrás.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto tiempo de delay usó el Grupo B?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Entre 20 y 90 segundos, distribuidos según la complejidad percibida del mensaje. El objetivo era simular el tiempo que tomaría leer y redactar una respuesta humana real.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo aplico esto en mi clínica hoy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si usas Clinera, el modo de respuesta con timing humano puede activarse desde el panel de configuración de tu agente. Si aún no usas Clinera, agenda una demo en clinera.io/hablar-con-ventas.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://clinera.io",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Novedades",
          item: "https://clinera.io/novedades",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Estudio IA respuesta humana",
          item: "https://clinera.io/blog/estudio-ia-respuesta-humana-confianza-pacientes",
        },
      ],
    },
  ],
};

export default function BlogConfianzaIAPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <ConfianzaIAArticle />
      </main>
      <FooterV3 />
    </>
  );
}
