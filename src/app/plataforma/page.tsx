import type { Metadata } from "next";
import PlataformaLanding, { FAQ } from "@/components/plataforma/PlataformaLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  faqSchema,
  orgSchema,
  softwareSchema,
  videoObjectSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { DEMO_VIDEO } from "@/content/demo-video";
import { PRODUCT_NAME } from "@/content/entidad";

const TITLE = `${PRODUCT_NAME} | Sistema operativo de tu clínica`;
const DESCRIPTION =
  "Todas las operaciones de tu clínica bajo un mismo sistema operativo con IA: agenda, tratamientos, pacientes, fichas clínicas, consentimientos, automatizaciones, ventas, marketing y comunicación por voz y texto — con implementación gestionada.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/plataforma" },
  openGraph: {
    url: "https://www.clinera.io/plataforma",
    title: TITLE,
    description:
      "Mucho más que un chatbot: el sistema por el que opera tu clínica, con la potencia enterprise de las clínicas grandes al alcance de la tuya.",
  },
};

export default function PlataformaPage() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          softwareSchema,
          webPageSchema({
            path: "/plataforma",
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io/" },
            { name: "Plataforma", url: "https://www.clinera.io/plataforma" },
          ]),
          faqSchema(FAQ),
          videoObjectSchema({
            name: DEMO_VIDEO.title,
            description: DESCRIPTION,
            thumbnailUrl: "https://www.clinera.io/og-demo.png",
            uploadDate: "2026-05-01",
            embedUrl: DEMO_VIDEO.embedUrl,
          }),
        ]}
      />
      <PlataformaLanding />
      <PageUpdated path="/plataforma" />
    </>
  );
}
