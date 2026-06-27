import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PrensaV3 from "@/components/interior-v3/PrensaV3";

export const metadata: Metadata = {
  title: "Prensa — Clinera en los medios | Clinera.io",
  description:
    "Clinera en la prensa. Ricardo Oyarzún, fundador de Clinera, entrevistado por CNN sobre cómo la IA está transformando la atención de las clínicas en LATAM.",
  alternates: { canonical: "https://www.clinera.io/prensa" },
  openGraph: {
    url: "https://www.clinera.io/prensa",
    title: "Clinera en la prensa — Entrevista en CNN",
    description:
      "Ricardo Oyarzún, fundador de Clinera, entrevistado por CNN sobre cómo la IA está transformando la atención de las clínicas en LATAM.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Prensa",
      },
    ],
  },
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "CNN entrevista a Clinera — Un gran paso para Clinera",
  description:
    "Ricardo Oyarzún, fundador de Clinera, entrevistado por CNN sobre cómo la inteligencia artificial está transformando la atención de las clínicas en LATAM.",
  thumbnailUrl: ["https://www.clinera.io/images/og-banner.png"],
  uploadDate: "2026-06-26",
  duration: "PT10M12S",
  embedUrl: "https://player.vimeo.com/video/1205127087",
  publisher: {
    "@type": "Organization",
    name: "Clinera.io",
    url: "https://www.clinera.io",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Prensa", item: "https://www.clinera.io/prensa" },
  ],
};

export default function PrensaPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <PrensaV3 />
      </main>
      <FooterV3 />
    </>
  );
}
