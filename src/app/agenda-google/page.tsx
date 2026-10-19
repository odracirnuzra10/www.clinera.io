import type { Metadata } from "next";
import AgendaWizard from "@/components/agenda/AgendaWizard";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

export const dynamic = "force-dynamic";

// Ricardo, 19-oct-2026: versión del wizard de /agenda para los anuncios de Google (escritorio
// incluido). Mismo flujo; cambia la atribución (google-ads por defecto) y el `source_path`.
// `noindex`: es destino de anuncios, no contenido, y no debe competir con /agenda.
export const metadata: Metadata = {
  title: "Agenda una videollamada con Clinera",
  description: "Reserva una videollamada de 30 minutos con el equipo de Clinera.",
  alternates: { canonical: "https://www.clinera.io/agenda" },
  robots: { index: false, follow: false },
};

export default async function AgendaGooglePage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  const tzIp = await timezoneIpDelRequest();
  const { servicio } = await searchParams;
  const servicioInicial = Array.isArray(servicio) ? servicio[0] : (servicio ?? null);
  return <AgendaWizard tzIp={tzIp} servicioInicial={servicioInicial} google />;
}
