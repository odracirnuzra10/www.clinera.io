import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesNuevos from "@/components/planes-nuevos/PlanesNuevos";

// /planes2 (Ricardo, 29-oct-2026): vista previa de Hex · Flux · Vortex · Ecosistema.
// No se indexa ni va al sitemap hasta que reemplace a /planes.
export const metadata: Metadata = {
  title: "Planes: Hex, Flux, Vortex y Ecosistema",
  description: "Parte gratis con Hex o Flux. Vortex suma el agente IA; el Ecosistema suma marketing.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/planes" },
};

export default function Planes2Page() {
  return (
    <>
      <NavV3 />
      <main>
        <PlanesNuevos />
      </main>
      <FooterV3 />
    </>
  );
}
