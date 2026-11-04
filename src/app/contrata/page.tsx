import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import ContrataLanding from "@/components/contrata/ContrataLanding";

// /contrata (Ricardo, 4-nov-2026): landing L2 «Software», Hex y Flux con WhatsApp. Es una
// landing de anuncios, como /oferta-clinicas-esteticas: no se indexa ni va al sitemap, y
// /planes sigue siendo la página pública de precios hasta que Ricardo apruebe el modelo nuevo.
export const metadata: Metadata = {
  title: "Contrata Clinera: software para tu clínica con WhatsApp",
  description:
    "Agenda, presupuestos, panel de ventas y WhatsApp para tu clínica. Hex US$ 35 al mes con 50 conversaciones, Flux US$ 55 con 200. Prueba gratis.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/planes" },
};

export default function ContrataPage() {
  return (
    <>
      <ContrataLanding />
      <FooterV3 />
    </>
  );
}
