import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesNuevos from "@/components/planes-nuevos/PlanesNuevos";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import { faqSchema, orgSchema, webPageSchema } from "@/components/seo/schemas";
import { SITE_URL } from "@/content/entidad";
import { PLANES_PUBLICOS, faqPublica } from "@/content/planes-nuevos";

// /planes (Ricardo, 5-nov-2026): Flux · Hex · Vortex, sin Ecosistema. Los Payment Links salen de
// `checkout.ts`. `/planes2` conserva el Ecosistema. `/promo` y el home siguen con `planes.ts`.
const DESDE = Math.min(...PLANES_PUBLICOS.map((p) => p.monthlyUsd));
const TITLE = `Planes: Flux, Hex y Vortex, desde US$ ${DESDE}/mes`;
const DESCRIPTION = "Flux US$ 79/mes · Hex US$ 179/mes · Vortex US$ 279/mes. Todos con WhatsApp. Parte con Flux; Hex suma Facebook e Instagram y Vortex el agente IA.";

const planesSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  offers: PLANES_PUBLICOS.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: String(p.monthlyUsd),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/planes`,
    description: `${p.name}: US$ ${p.monthlyUsd}/mes. ${p.profesionales}${p.sucursales ? `, ${p.sucursales.toLowerCase()}` : ""}. ${p.incluye.join(", ")}.`,
  })),
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/planes" },
  openGraph: {
    url: "https://www.clinera.io/planes",
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
};

export default function PlanesPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          planesSchema,
          webPageSchema({ path: "/planes", name: TITLE, description: DESCRIPTION }),
          faqSchema(faqPublica()),
        ]}
      />
      <main>
        <PlanesNuevos publico />
        <PageUpdated path="/planes" />
      </main>
      <FooterV3 />
    </>
  );
}
