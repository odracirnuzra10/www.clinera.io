import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import OfertaEsteticaLanding from "@/components/oferta-estetica/OfertaEsteticaLanding";

// Landing de anuncios (Ricardo, 22-oct-2026): software para clínicas estéticas con la
// oferta «software + marketing por US$ 379/mes». El precio público del Ecosistema sigue
// en /planes, así que esta página no se indexa ni va al sitemap (ver `oferta-estetica.ts`).
export const metadata: Metadata = {
  title: "Software para clínicas estéticas + marketing por US$ 379",
  description:
    "Agenda, ficha facial y corporal, pagos y un agente de IA que agenda por WhatsApp 24/7, más marketing de performance para tu clínica estética por US$ 379 al mes.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/software-estetica" },
};

export default function OfertaClinicasEsteticasPage() {
  return (
    <>
      <OfertaEsteticaLanding />
      <FooterV3 />
    </>
  );
}
