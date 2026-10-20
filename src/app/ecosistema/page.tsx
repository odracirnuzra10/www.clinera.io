import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EcosistemaV3 from "@/components/interior-v3/EcosistemaV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { orgSchema, webPageSchema } from "@/components/seo/schemas";

const TITLE = "Ecosistema: software con IA y marketing que trae pacientes";
const DESCRIPTION =
  "El Ecosistema Clinera es Vortex, el software con IA, más marketing de performance con la metodología PMFC: propuesta de valor, campañas, framework comercial y reunión semanal. US$ 529/mes; la publicidad se paga aparte.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/ecosistema" },
  openGraph: { url: "https://www.clinera.io/ecosistema", title: TITLE, description: DESCRIPTION, type: "website" },
};

export default function EcosistemaPage() {
  return (
    <>
      <NavV3 />
      <JsonLd data={[orgSchema, webPageSchema({ path: "/ecosistema", name: TITLE, description: DESCRIPTION })]} />
      <main>
        <EcosistemaV3 />
      </main>
      <FooterV3 />
    </>
  );
}
