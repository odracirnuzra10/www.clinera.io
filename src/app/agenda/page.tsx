import type { Metadata } from "next";
import AgendaCuentaLanding from "@/components/agenda/AgendaCuentaLanding";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

// `timezoneIpDelRequest()` lee headers de la request: sin esto el build intenta
// prerenderizar la página y rompe.
export const dynamic = "force-dynamic";

// Ricardo, 18-oct-2026: /agenda es la landing «Crea tu cuenta» con oferta de
// Summit. El wizard viejo con calendario sigue en /reunion-comercial.
export const metadata: Metadata = {
  title: "Software para clínicas estéticas con IA: crea tu cuenta",
  description:
    "Ficha médica y estética facial y corporal, presupuestos, evoluciones y ventas en un solo lugar. Crea tu cuenta de Clinera y actívala en minutos.",
  alternates: { canonical: "https://www.clinera.io/agenda" },
  openGraph: { url: "https://www.clinera.io/agenda" },
};

export default async function AgendaPage() {
  const tzIp = await timezoneIpDelRequest();
  return <AgendaCuentaLanding tzIp={tzIp} />;
}
