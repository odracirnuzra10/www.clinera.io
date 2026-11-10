import type { Metadata } from "next";
import ReservaHoraLanding from "@/components/ventas/ReservaHoraLanding";
import { timezoneIpDelRequest } from "@/lib/timezone-ip";

// `timezoneIpDelRequest()` lee headers de la request: sin esto el build intenta
// prerenderizar la página y rompe.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserva tu hora",
  description:
    "Elige el día y la hora para tu demo de Clinera. 45 minutos por videollamada con un ingeniero.",
  alternates: { canonical: "https://www.clinera.io/reserva-tu-hora" },
  // Destino de anuncios, no página de contenido: no compite en buscadores con
  // /hablar-con-ventas ni debe aparecer suelta en resultados. También va `Disallow` en
  // robots.ts y queda fuera del sitemap.
  robots: { index: false, follow: false },
};

/** Devuelve el primer valor de un parámetro, que puede venir repetido. */
function uno(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? "";
  return valor ?? "";
}

export default async function ReservaTuHoraPage({
  searchParams,
}: {
  // En Next 16 `searchParams` es una Promise y hay que esperarla.
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [tzIp, sp] = await Promise.all([timezoneIpDelRequest(), searchParams]);

  // Meta no garantiza prellenar un enlace de programación «Personalizado», así
  // que estos parámetros son oportunistas: si vienen, la persona no vuelve a
  // tipear lo que ya puso en el formulario. Se aceptan los nombres en español
  // y en inglés porque quien arma la URL del anuncio no siempre es quien
  // escribió esta página.
  const prefill = {
    nombre: uno(sp.nombre) || uno(sp.name) || uno(sp.full_name),
    email: uno(sp.email) || uno(sp.correo),
    telefono: uno(sp.telefono) || uno(sp.phone) || uno(sp.phone_number),
    clinica: uno(sp.clinica) || uno(sp.clinic),
    tamano: uno(sp.tamano) || uno(sp.tamano_operacion) || uno(sp.volumen),
    // El `leadgen_id` marca al lead que YA existe en Baserow y Twenty (lo creó
    // n8n al recibir el formulario). Sin él, esta página da de alta el lead;
    // con él, sólo agrega la reserva — y viaja hasta el campo `leadgenId` del
    // negocio, que es lo que habilita Conversion Leads en Meta.
    leadgenId: uno(sp.leadgen_id) || uno(sp.lead_id) || uno(sp.leadgenId),
  };

  return <ReservaHoraLanding tzIp={tzIp} prefill={prefill} />;
}
