// ============================================================================
// Eventos con valor para la campaña de tráfico de Meta (Ricardo, 13-nov-2026).
//
//   VisitaWeb           US$ 1  primera página de la sesión
//   NavegacionProfunda  US$ 5  3 páginas distintas, o pasó por /planes, o 60 s
//                              activos; una vez cada 30 días por navegador
//   Contact             US$ 7  clic a WhatsApp (wa.me / api.whatsapp.com)
//
// Cada uno sale por el pixel y por /api/meta/capi con el MISMO event_id, para
// que Meta lo cuente una sola vez. Las reglas de decisión son puras (abajo) y
// las prueba tests/eventos-valor.spec.ts.
// ============================================================================

import { sendMetaEvent } from "@/lib/metaEvents";

export const VALOR_USD = { VisitaWeb: 1, NavegacionProfunda: 5, Contact: 7 } as const;
export type EventoValor = keyof typeof VALOR_USD;

/** Días que tarda en volver a contar una navegación profunda del mismo navegador. */
export const PROFUNDA_CADA_DIAS = 30;
export const PROFUNDA_PAGINAS = 3;
export const PROFUNDA_SEGUNDOS = 60;

export function esNavegacionProfunda(estado: { paginas: string[]; segundos: number }): boolean {
  if (new Set(estado.paginas).size >= PROFUNDA_PAGINAS) return true;
  if (estado.paginas.some((p) => p === "/planes" || p.startsWith("/planes/"))) return true;
  return estado.segundos >= PROFUNDA_SEGUNDOS;
}

/** true si la última navegación profunda contada fue hace menos de 30 días. */
export function profundaReciente(ultimaMs: number | null, ahoraMs: number): boolean {
  if (!ultimaMs || !Number.isFinite(ultimaMs)) return false;
  return ahoraMs - ultimaMs < PROFUNDA_CADA_DIAS * 86_400_000;
}

export function esEnlaceWhatsApp(href: string): boolean {
  return href.includes("wa.me/") || href.includes("api.whatsapp.com/send");
}

function nuevoId(evento: EventoValor): string {
  const r = Math.random().toString(36).slice(2, 10);
  return `${evento}_${Date.now()}_${r}`;
}

/** El pixel lo carga GTM de forma asíncrona: se espera hasta ~8 s. */
function esperarPixel(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.fbq === "function") return resolve();
    let n = 0;
    const t = window.setInterval(() => {
      if (typeof window.fbq === "function" || ++n >= 50) {
        window.clearInterval(t);
        resolve();
      }
    }, 160);
  });
}

export async function dispararEventoValor(evento: EventoValor, extra: Record<string, unknown> = {}): Promise<void> {
  // El seguimiento nunca corta la navegación.
  try {
    await esperarPixel();
    await sendMetaEvent({
      eventName: evento,
      eventId: nuevoId(evento),
      customData: { ...extra, value: VALOR_USD[evento], currency: "USD", page_path: location.pathname },
      capi: true,
    });
  } catch (e) {
    console.error("[eventosValor]", evento, e);
  }
}
