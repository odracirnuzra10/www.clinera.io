import type { Metadata } from "next";
import EsteticaAdsLanding from "@/components/estetica/EsteticaAdsLanding";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

// `timezoneIpDelRequest()` lee headers de la request: sin esto el build intenta
// prerenderizar la página y rompe.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Software para clínicas y centros de estética",
  description:
    "Agenda, ficha clínica estética facial y corporal, presupuestos y tratamientos precargados, con IA que agenda por WhatsApp. Agenda tu demo gratis de Clinera.",
  alternates: { canonical: "https://www.clinera.io/clinica-estetica" },
  // Destino de Google Ads, no página de contenido: la que posiciona orgánico
  // para «software para clínicas estéticas» es /software-estetica. También va
  // `Disallow` en robots-txt.ts y queda fuera del sitemap.
  robots: { index: false, follow: false },
};

export default async function ClinicaEsteticaPage() {
  const tzIp = await timezoneIpDelRequest();
  return <EsteticaAdsLanding tzIp={tzIp} />;
}
