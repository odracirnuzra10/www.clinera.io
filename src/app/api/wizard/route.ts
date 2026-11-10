// ============================================================================
// Wizard — endpoint server-side del wizard de /hablar-con-ventas, /ventas y /demo
// ----------------------------------------------------------------------------
// Antes de esto, VentasLanding.tsx, ReunionLanding.tsx y DemoWizard.tsx le
// hablaban directo a n8n.oacg.cl desde el navegador: cualquiera que abriera
// el inspector encontraba la URL del webhook y podía mandar leads con un
// curl, sin pasar por el sitio. Hallazgo #1 de auditoria-leads-clinera.md
// (PR #170). Mismo patrón que /api/triage:
//
//   Navegador  →  POST /api/wizard           (sin token)
//   Servidor   →  POST $WIZARD_N8N_URL       header: X-Wizard-Token: <secreto>
//
// Config por variables de entorno:
//   WIZARD_N8N_URL      URL del webhook de n8n (hoy 088a2cfe-…)   (REQUERIDA)
//   WIZARD_FORM_SECRET  mismo valor configurado en n8n            (REQUERIDA)
//
// Igual que triage: si falta la config, 503 — un lead que se pierde en
// silencio es peor que un error visible.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { validarWizard } from "./validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const N8N_URL = process.env.WIZARD_N8N_URL || "";
const FORM_SECRET = process.env.WIZARD_FORM_SECRET || "";

/** Corta la espera si n8n no responde — el usuario no puede quedar colgado. */
const TIMEOUT_MS = 15_000;

// ── Rate limit en memoria (mismo patrón que /api/triage) ────────────────────
// Por instancia y se reinicia en cada deploy: defensa mínima contra floods,
// no es autenticación.
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 5;
const golpes = new Map<string, number[]>();

function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);

  // Poda perezosa para que el Map no crezca sin techo.
  if (golpes.size > 500) {
    for (const [clave, marcas] of golpes) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(clave);
    }
  }

  return previos.length > MAX_POR_VENTANA;
}

function respuestaError(mensaje: string, status: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status });
}

export async function POST(request: Request) {
  if (!N8N_URL || !FORM_SECRET) {
    return respuestaError(
      "El wizard todavía no está conectado (falta configurar el webhook). Avísale al equipo técnico.",
      503,
    );
  }

  const h = await headers();

  // Guard de mismo origen. Los navegadores mandan `Origin` en un POST JSON,
  // así que sirve para descartar envíos desde otro sitio. Si no viene (curl,
  // tests server-side), lo dejamos pasar: no es una frontera de autenticación
  // — esa la pone el rate limit + la validación de abajo.
  const origin = h.get("origin");
  if (origin) {
    const host = h.get("host");
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
    if (!host || originHost !== host) {
      return respuestaError("Origen no permitido.", 403);
    }
  }

  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (h.get("x-real-ip") ?? "") ||
    "desconocida";

  if (superaRateLimit(ip)) {
    return respuestaError(
      "Demasiados envíos seguidos. Espera un minuto e inténtalo de nuevo.",
      429,
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return respuestaError("No pudimos leer el formulario.", 400);
  }

  // Revalidación server-side. La del navegador es para dar feedback rápido,
  // no es una garantía: se salta con un curl.
  const errores = validarWizard(data);
  if (errores.length > 0) {
    return respuestaError(errores.join(" "), 400);
  }

  let res: Response;
  try {
    res = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Wizard-Token": FORM_SECRET,
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // Timeout o n8n caído. El cliente conserva lo escrito (no navegamos hasta
    // ver `ok`) y puede reintentar.
    return respuestaError(
      "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.",
      502,
    );
  }

  if (!res.ok) {
    return respuestaError(
      "No pudimos registrar tu solicitud. Inténtalo de nuevo en un momento.",
      502,
    );
  }

  // El wizard actual solo mira si la respuesta fue OK (ver `postWebhook` en
  // VentasLanding.tsx): no hay un contrato de JSON de n8n que preservar, a
  // diferencia de triage.
  return NextResponse.json({ ok: true }, { status: 200 });
}
