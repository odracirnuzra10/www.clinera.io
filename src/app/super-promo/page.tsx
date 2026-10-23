import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import SuperPromoLanding from "@/components/super-promo/SuperPromoLanding";

// /super-promo (Ricardo, 23-oct-2026): destino de la difusión de WhatsApp y del correo a los
// leads. Software + Marketing a US$ 279/mes por 6 meses, hasta el 31 de octubre. El precio
// público sigue en /planes: la página no se indexa ni va al sitemap (ver `super-promo.ts`).
export const metadata: Metadata = {
  title: "Super promo: Software + Marketing a US$ 279",
  description:
    "Agente de IA que agenda 24/7, WhatsApp, Instagram y Facebook en un solo lugar, agenda, fichas, cobros y campañas de marketing por US$ 279 al mes durante 6 meses. Hasta el 31 de octubre.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/planes" },
};

export default function SuperPromoPage() {
  return (
    <>
      <SuperPromoLanding />
      <FooterV3 />
    </>
  );
}
