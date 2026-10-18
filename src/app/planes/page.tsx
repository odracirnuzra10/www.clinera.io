import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import TrialBanner from "@/components/cro/TrialBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  faqSchema,
  orgSchema,
  productPlansSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { PLANES_FAQ } from "@/content/planes-faq";
import { IMPLEMENTACION_USD, PLAN_DESDE_USD, PLANES } from "@/content/planes";

const TITLE = `Planes: Flux, Hurricane y Vortex, desde US$ ${PLAN_DESDE_USD}/mes`;
const DESCRIPTION = `${PLANES.map((p) => `${p.name} US$ ${p.monthlyUsd}/mes`).join(", ")}. Eliges según cuántos profesionales tiene tu equipo. Implementación US$ ${IMPLEMENTACION_USD}, pago único en todos los planes.`;

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
          productPlansSchema,
          webPageSchema({
            path: "/planes",
            name: TITLE,
            description: DESCRIPTION,
          }),
          faqSchema(PLANES_FAQ),
        ]}
      />
      <main>
        <TrialBanner />
        <PlanesV3 />
        <PageUpdated path="/planes" />
      </main>
      <FooterV3 />
    </>
  );
}
