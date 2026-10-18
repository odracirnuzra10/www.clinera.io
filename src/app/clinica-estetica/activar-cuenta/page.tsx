import type { Metadata } from "next";
import AgendaCuentaLanding from "@/components/agenda/AgendaCuentaLanding";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

// `timezoneIpDelRequest()` lee headers de la request: sin esto el build intenta
// prerenderizar la página y rompe.
export const dynamic = "force-dynamic";

// Ricardo, 18-oct-2026: UNA sola landing, /clinica-estetica/activar-cuenta
// («Activar cuenta» del home, Google y Meta Ads). /agenda, /activar-cuenta y
// /clinica-estetica redirigen acá con la query. El wizard viejo con calendario
// sigue en /reunion-comercial.
export const metadata: Metadata = {
  title: "Software para clínicas estéticas con IA: crea tu cuenta",
  description:
    "Ficha médica, ficha estética facial y ficha estética corporal, con evoluciones, presupuestos y ventas en un solo lugar. Crea tu cuenta de Clinera y actívala en minutos.",
  alternates: { canonical: "https://www.clinera.io/clinica-estetica/activar-cuenta" },
  openGraph: { url: "https://www.clinera.io/clinica-estetica/activar-cuenta" },
};

export default async function ActivarCuentaPage() {
  const tzIp = await timezoneIpDelRequest();
  return <AgendaCuentaLanding tzIp={tzIp} />;
}
