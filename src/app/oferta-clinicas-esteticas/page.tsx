import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import OfertaEsteticaLanding from "@/components/oferta-estetica/OfertaEsteticaLanding";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

// El wizard de arriba muestra la hora local de la IP: se lee de los headers de la request.
export const dynamic = "force-dynamic";

// Landing de anuncios (Ricardo, 22-oct-2026): software para clínicas estéticas con la
// oferta «software + marketing por US$ 379/mes». El precio público del Ecosistema sigue
// en /planes, así que esta página no se indexa ni va al sitemap (ver `oferta-estetica.ts`).
// Sin menú (Ricardo, 22-oct): arriba va el formulario del wizard.
export const metadata: Metadata = {
  title: "Software para clínicas estéticas + marketing por US$ 379",
  description:
    "Agenda, ficha facial y corporal, pagos y un agente de IA que agenda por WhatsApp 24/7, más marketing de performance para tu clínica estética por US$ 379 al mes.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/software-estetica" },
};

export default async function OfertaClinicasEsteticasPage() {
  const tzIp = await timezoneIpDelRequest();
  return (
    <>
      <OfertaEsteticaLanding tzIp={tzIp} />
      <FooterV3 />
    </>
  );
}
