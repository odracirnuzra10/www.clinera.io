import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  faqSchema,
  orgSchema,
  productPlansSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { PLANES_FAQ } from "@/content/planes-faq";
import { PLAN_DESDE_USD, PLANES } from "@/content/planes";

const TITLE = `Planes: Vortex y Ecosistema, desde US$ ${PLAN_DESDE_USD}/mes`;
const DESCRIPTION = `${PLANES.map((p) => `${p.name} US$ ${p.monthlyUsd}/mes`).join(" · ")}. Solo el software con IA, o el software más marketing de performance que trae pacientes a tu clínica.`;

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
        <PlanesV3 />
        <PageUpdated path="/planes" />
      </main>
      <FooterV3 />
    </>
  );
}
