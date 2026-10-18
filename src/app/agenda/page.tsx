import type { Metadata } from "next";
import AgendaWizard from "@/components/agenda/AgendaWizard";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

// `timezoneIpDelRequest()` lee headers de la request: sin esto el build intenta
// prerenderizar la página y rompe.
export const dynamic = "force-dynamic";

// Ricardo, 18-oct-2026: /agenda es el wizard de 3 pasos (datos → servicio →
// videollamada). Es la única puerta de entrada: las rutas anteriores
// /clinica-estetica, /clinica-estetica/activar-cuenta y /reunion-comercial
// redirigen acá con la query (utm, gclid, fbclid).
export const metadata: Metadata = {
  title: "Agenda una videollamada con Clinera",
  description:
    "Cuéntanos de tu clínica, elige entre marketing de performance, software con IA o ambos, y reserva una videollamada de 30 minutos con el equipo.",
  alternates: { canonical: "https://www.clinera.io/agenda" },
  openGraph: { url: "https://www.clinera.io/agenda" },
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  const tzIp = await timezoneIpDelRequest();
  const { servicio } = await searchParams;
  const servicioInicial = Array.isArray(servicio) ? servicio[0] : (servicio ?? null);
  return <AgendaWizard tzIp={tzIp} servicioInicial={servicioInicial} />;
}
