import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import FichasClinicasHubV3 from "@/components/interior-v3/FichasClinicasHubV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema } from "@/components/seo/schemas";

const URL = "https://www.clinera.io/novedades/fichas-clinicas";

export const metadata: Metadata = {
  title: "Ficha Clínica en Chile: Guía Completa 2026 | Clinera.io",
  description:
    "Todo sobre la ficha clínica en Chile: qué es, ley 20.584, formato electrónico, cómo pedirla y software para clínicas. Guía actualizada por Clinera.io.",
  keywords: [
    "ficha clinica",
    "ficha clinica chile",
    "ficha clinica electronica",
    "ley 20584",
    "elementos ficha clinica",
    "como pedir ficha clinica",
    "software ficha clinica",
    "FCE chile",
    "minsal ficha clinica",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: "Ficha Clínica en Chile: Guía Completa 2026",
    description:
      "Qué es, Ley 20.584, FCE, elementos obligatorios, cómo pedirla y software. Guía completa para clínicas y pacientes en Chile.",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Ficha Clínica en Chile — Guía Completa 2026 | Clinera.io",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ficha Clínica en Chile: Guía Completa 2026",
    description:
      "Qué es, Ley 20.584, FCE, elementos obligatorios, cómo pedirla y software. Para clínicas y pacientes.",
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const CLUSTER = [
  { slug: "que-es-una-ficha-clinica", name: "¿Qué es una ficha clínica?" },
  { slug: "ficha-clinica-electronica-chile", name: "Ficha clínica electrónica (FCE) en Chile" },
  { slug: "elementos-ficha-clinica-chile", name: "8 elementos obligatorios de una ficha clínica" },
  { slug: "normativa-ficha-clinica-chile-ley-20584", name: "Ley 20.584 y la ficha clínica" },
  { slug: "como-pedir-ficha-clinica-chile", name: "Cómo pedir tu ficha clínica en Chile" },
  { slug: "software-ficha-clinica-electronica", name: "Software de ficha clínica electrónica" },
  { slug: "ficha-clinica-papel-vs-electronica", name: "Ficha clínica en papel vs electrónica" },
  { slug: "ficha-clinica-estetica-vs-medica", name: "Ficha clínica en clínica estética vs médica" },
  { slug: "ficha-clinica-por-especialidad", name: "Ficha clínica por especialidad" },
];

const FAQ = [
  {
    q: "¿Qué es una ficha clínica?",
    a: "La ficha clínica es el documento único, confidencial y obligatorio donde se registra toda la atención de salud de un paciente: identificación, antecedentes, diagnósticos, tratamientos y evolución. En Chile está regulada por la Ley 20.584.",
  },
  {
    q: "¿Cuánto tiempo se debe guardar una ficha clínica en Chile?",
    a: "La normativa chilena exige conservar la ficha clínica por mínimo 15 años desde la última atención. En soporte electrónico debe garantizarse legibilidad y respaldo durante todo ese período.",
  },
  {
    q: "¿La ficha clínica electrónica tiene la misma validez legal que la de papel?",
    a: "Sí. Desde el Decreto 41 del Minsal y la Ley 20.584, la ficha clínica electrónica (FCE) tiene plena validez legal en Chile, siempre que use firma electrónica avanzada y cumpla con respaldo y trazabilidad.",
  },
  {
    q: "¿Quién puede acceder a una ficha clínica?",
    a: "Solo el paciente, los profesionales tratantes, los tribunales con orden judicial, y autoridades sanitarias en casos epidemiológicos específicos. La Ley 20.584 establece confidencialidad estricta.",
  },
  {
    q: "¿Cómo pido mi ficha clínica como paciente?",
    a: "En clínicas privadas: se solicita por escrito al área de archivos médicos, con respuesta en máximo 15 días hábiles. En el sistema público: vía portalpaciente.minsal.cl o presencialmente en OIRS del establecimiento.",
  },
  {
    q: "¿Qué software se usa para ficha clínica electrónica en Chile?",
    a: "Existen varias opciones: software especializado como Clinera (con IA integrada), Encuadrado, Reservo, Medilink, entre otros. La elección depende del tamaño de la clínica, especialidades y necesidad de integración con agenda y pagos.",
  },
];

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${URL}#collection`,
  url: URL,
  name: "Ficha Clínica: Guía Completa para Clínicas y Pacientes en Chile (2026)",
  description:
    "Guía completa sobre la ficha clínica en Chile: definición, marco legal Ley 20.584, ficha electrónica (FCE), elementos obligatorios, cómo solicitarla y software para clínicas.",
  inLanguage: "es-CL",
  isPartOf: { "@id": "https://www.clinera.io/#website" },
  publisher: { "@id": "https://www.clinera.io/#organization" },
  about: [
    { "@type": "Thing", name: "Ficha clínica" },
    { "@type": "Thing", name: "Ley 20.584" },
    { "@type": "Thing", name: "Ficha clínica electrónica" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${URL}#faq`,
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${URL}#articles`,
  name: "Artículos sobre Fichas Clínicas",
  itemListElement: CLUSTER.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://www.clinera.io/blog/${c.slug}`,
    name: c.name,
  })),
};

export default function FichasClinicasHubPage() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Novedades", url: "https://www.clinera.io/novedades" },
            { name: "Fichas Clínicas", url: URL },
          ]),
          collectionPageSchema,
          faqSchema,
          itemListSchema,
        ]}
      />
      <NavV3 />
      <main>
        <FichasClinicasHubV3 />
      </main>
      <FooterV3 />
    </>
  );
}
