import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesNuevos from "@/components/planes-nuevos/PlanesNuevos";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import { faqSchema, orgSchema, webPageSchema } from "@/components/seo/schemas";
import { SITE_URL } from "@/content/entidad";
import { PLANES_NUEVOS, faqPublica } from "@/content/planes-nuevos";

// /planes (Ricardo, 4-nov-2026): publica el modelo de /planes2 — Hex · Flux · Vortex · Ecosistema,
// todos con WhatsApp. El catálogo es `planes-nuevos.ts`; los links de pago de Stripe siguen
// saliendo de `planes.ts` (ver `PlanesNuevos publico`). `/promo` y el home siguen con `planes.ts`.
const DESDE = Math.min(...PLANES_NUEVOS.map((p) => p.monthlyUsd));
const TITLE = `Planes: Hex, Flux, Vortex y Ecosistema, desde US$ ${DESDE}/mes`;
const DESCRIPTION = `${PLANES_NUEVOS.map((p) => `${p.name} US$ ${p.monthlyUsd}/mes`).join(" · ")}. Todos con WhatsApp. Parte gratis con Hex o Flux; Vortex suma el agente IA y el Ecosistema suma marketing.`;

const planesSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  offers: PLANES_NUEVOS.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: String(p.monthlyUsd),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/planes`,
    description: `${p.name}: US$ ${p.monthlyUsd}/mes. ${p.profesionales}, ${p.sucursales.toLowerCase()}. ${p.incluye.join(", ")}.`,
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
