import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import MigracionV3 from "@/components/interior-v3/MigracionV3";

export const metadata: Metadata = {
  title: "Migración a Clinera | Cambia AgendaPro / Reservo / Medilink + Vambe por una sola plataforma",
  description:
    "Migra desde AgendaPro, Reservo o Medilink + Vambe.ai a Clinera. Importación masiva de pacientes y tratamientos, agenda con agente IA, ficha clínica y atribución de campañas. Ahorra USD 600+/mes y conecta el ciclo completo del paciente.",
  keywords: [
    "migrar a clinera",
    "alternativa AgendaPro",
    "alternativa Reservo",
    "alternativa Medilink",
    "alternativa Vambe.ai",
    "importación masiva tratamientos",
    "importar pacientes clínica",
    "agenda médica con IA",
    "agente IA WhatsApp clínicas",
    "migración software clínica",
  ],
  alternates: { canonical: "https://www.clinera.io/migracion" },
  openGraph: {
    type: "website",
    url: "https://www.clinera.io/migracion",
    siteName: "Clinera.io",
    title: "Migración a Clinera — una sola plataforma para todo el ciclo del paciente",
    description:
      "Cambia AgendaPro / Reservo / Medilink + Vambe.ai por Clinera. USD 800+ por 2 herramientas separadas vs USD 279 con todo conectado.",
    locale: "es_LA",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Migración a Clinera — una sola plataforma con agente IA incluido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Migración a Clinera — una sola plataforma para todo el ciclo",
    description:
      "Cambia AgendaPro / Reservo / Medilink + Vambe por Clinera. USD 279 con agente IA incluido.",
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
      "@id": "https://www.clinera.io/migracion#webpage",
      url: "https://www.clinera.io/migracion",
      name: "Migración a Clinera",
      description:
        "Migra desde AgendaPro, Reservo o Medilink + Vambe.ai a Clinera, un ecosistema único con agenda, agente IA, ficha clínica y atribución de campañas.",
      isPartOf: { "@id": "https://www.clinera.io/#website" },
      inLanguage: "es",
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.clinera.io/migracion#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Tengo que parar de atender mientras migramos?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "No. Importamos tu base en paralelo y hacemos el switch fuera de horario clínico. Cero downtime para el paciente.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué pasa con las citas futuras ya agendadas en AgendaPro / Reservo / Medilink?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Se importan tal cual están en Clinera con el mismo profesional, hora y servicio. Tus pacientes no notan nada.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo seguir usando mi agenda actual y solo agregar Clinera?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Técnicamente sí, pero el agente IA solo verá la mitad del ciclo y no podrá atribuir campañas. Vas a estar pagando dos herramientas sin aprovechar ninguna al máximo. Por eso recomendamos migrar.",
          },
        },
        {
          "@type": "Question",
          name: "¿Hay permanencia o costo de implementación?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Sin permanencia: cancelas cuando quieras. La implementación es un pago único de USD 450 (onboarding asistido por un humano que configura AURA, conecta tu WhatsApp Business, importa tus pacientes y tratamientos, integra tu agenda y capacita a tu equipo). Quedas operando el mismo día.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto tiempo toma la migración completa?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Diagnóstico el día 1, importación durante la primera semana, go-live en menos de 1 hora. Para clínicas con +5.000 pacientes históricos puede tomar hasta 2 semanas.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io" },
        { "@type": "ListItem", position: 2, name: "Migración", item: "https://www.clinera.io/migracion" },
      ],
    },
  ],
};

export default function MigracionPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <MigracionV3 />
      </main>
      <FooterV3 />
    </>
  );
}
