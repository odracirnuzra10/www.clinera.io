import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import PromoBar from "@/components/promo/PromoBar";

// /promo (Ricardo, 21-oct-2026): la misma /planes con una barra de descuento cuyo
// último día es el día de la reunión. Es una herramienta de cierre que el equipo
// comparte en la reunión: no se indexa ni va al sitemap.
export const metadata: Metadata = {
  title: "Planes con descuento",
  description: "Vortex y Ecosistema con el descuento vigente de esta semana.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/planes" },
};

export default function PromoPage() {
  return (
    <>
      <NavV3 />
      <main style={{ paddingBottom: 72 }}>
        <PlanesV3 />
      </main>
      <FooterV3 />
      <PromoBar />
    </>
  );
}
