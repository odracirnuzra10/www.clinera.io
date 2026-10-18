// ============================================================================
// Planes vigentes en la web: Flux · Nexus · Summit (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Fuente única de lo que el sitio PÚBLICO muestra como planes: home, /planes,
// /planes-pro, landings `software-vertical`, /agenda, schema y llms.
//
// El CTA de todos los planes es «Hablar con ventas» → /agenda (Ricardo,
// 18-oct-2026: «volveremos a utilizar clinera.io/agenda»). No hay checkout en
// la web: el cierre lo hace ventas.
//
// Lo que NO vive acá:
// - `pricing.ts` (Vortex/Atlas/Summit 279/379/479): sigue alimentando los
//   contratos de /firma y el constructor de /cotizacion. Contratos firmados
//   referencian esos ids; no se migran sin que Ricardo lo decida.
// - `planes2.ts` (Go!/Flux/Ultra): lo usan las piezas internas de /go y el
//   evento de compra de Meta. /go sigue existiendo, pero el sitio no lo promueve.
//
// Copy tal cual la diapositiva «Planes Flux · Nexus · Summit» de Ricardo.
// «Créditos CI» es su término: no lo reescribas sin confirmarlo con él.
// ============================================================================

import type { PlanChannel } from "@/content/pricing";

export type PlanId = "flux" | "nexus" | "summit";

export type Plan = {
  id: PlanId;
  name: string;
  /** US$ por mes. */
  monthlyUsd: number;
  professionals: number;
  /** Conversaciones por mes: el límite siempre se expresa en conversaciones. */
  conversations: number;
  channels: readonly PlanChannel[];
  /** Agente de IA que responde y agenda (texto y voz): solo Summit. */
  agenteIA: boolean;
  featured: boolean;
  /** Etiqueta sobre la tarjeta. Vacía = sin etiqueta. */
  tag: string;
  /** Líneas de la tarjeta, en el orden de la diapositiva. */
  features: readonly string[];
};

export const PLANES: readonly Plan[] = [
  {
    id: "flux",
    name: "Flux",
    monthlyUsd: 89,
    professionals: 3,
    conversations: 500,
    channels: ["whatsapp", "facebook", "instagram"],
    agenteIA: false,
    featured: false,
    tag: "",
    features: ["WhatsApp · Facebook · Instagram", "3 profesionales", "Hasta 500 conversaciones", "100 créditos CI"],
  },
  {
    id: "nexus",
    name: "Nexus",
    monthlyUsd: 129,
    professionals: 5,
    conversations: 2500,
    channels: ["whatsapp", "facebook", "instagram"],
    agenteIA: false,
    featured: true,
    tag: "Más elegido",
    features: [
      "Todo Flux + email marketing",
      "Automatizaciones y difusiones",
      "5 profesionales",
      "Hasta 2.500 conversaciones",
      "200 créditos CI",
    ],
  },
  {
    id: "summit",
    name: "Summit",
    monthlyUsd: 179,
    professionals: 10,
    conversations: 5000,
    channels: ["whatsapp", "facebook", "instagram", "llamadas"],
    agenteIA: true,
    featured: false,
    tag: "",
    features: [
      "Todo Nexus",
      "Agente IA de texto y voz",
      "10 profesionales",
      "Hasta 5.000 conversaciones",
      "1.000 créditos CI · 10.000 créditos IA",
      "Onboarding humano dedicado",
    ],
  },
] as const;

export const PLAN_DESDE_USD = Math.min(...PLANES.map((p) => p.monthlyUsd));
export const PLAN_HASTA_USD = Math.max(...PLANES.map((p) => p.monthlyUsd));
export const PLAN_CON_AGENTE = PLANES.find((p) => p.agenteIA)!;

/**
 * Implementación: pago único, en todos los planes (Ricardo, 18-oct-2026: «vuelve
 * el costo de implementación… ahora vale $250»). No es `SETUP_FEE_USD` de
 * pricing.ts (US$ 450): ese sigue rigiendo los contratos de /firma con los
 * planes viejos.
 */
export const IMPLEMENTACION_USD = 250;
export const IMPLEMENTACION_LINEA = `+ US$${IMPLEMENTACION_USD} de implementación (pago único, todos los planes)`;

/** Extras (diapositiva de Ricardo). */
export const EXTRAS = [
  { usd: 15, label: "500 conversaciones" },
  { usd: 15, label: "5.000 créditos IA" },
  { usd: 9, label: "profesional extra" },
] as const;

export const EXTRAS_LINEA = EXTRAS.map((e) => `US$${e.usd} · ${e.label}`).join(" · ");

/** CTA único de los planes. */
export const CTA_VENTAS_LABEL = "Hablar con ventas";
export const CTA_VENTAS_PATH = "/agenda";

/** `/agenda?plan=nexus` + la query de la visita (utm, gclid, fbclid). */
export function agendaHrefPlan(planId: PlanId | null, search = ""): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (planId) params.set("plan", planId);
  const q = params.toString();
  return q ? `${CTA_VENTAS_PATH}?${q}` : CTA_VENTAS_PATH;
}

export const PLANES_TITULO = "Elige según tu equipo.";
export const PLANES_TITULO_ACENTO = "Crece sin cambiar de sistema.";
