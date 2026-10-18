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
// Precios y límites de la diapositiva «Planes Flux · Nexus · Summit» de Ricardo;
// las funciones, enfocadas en la clínica estética (Ricardo, 18-oct-2026).
// «Créditos CI» = créditos de Clinera Intelligence (el agente IA del software).
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
  /** «Funciones base» de la tarjeta. */
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
    // Todo lo que una clínica estética usa en box viene desde Flux (Ricardo, 18-oct-2026).
    features: [
      "Ficha médica personalizable",
      "Ficha estética facial y corporal",
      "Presupuestos y evoluciones",
      "Ventas y seguimiento de pacientes",
      "Clinera Intelligence · 100 créditos CI",
      "Bandeja de WhatsApp, Facebook e Instagram",
    ],
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
      "Todo lo de Flux",
      "Email marketing",
      "Automatizaciones y difusiones",
      "Clinera Intelligence · 200 créditos CI",
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
      "Todo lo de Nexus",
      "Agente IA de texto y voz que agenda solo",
      "Clinera Intelligence · 1.000 créditos CI",
      "10.000 créditos IA",
      "Onboarding humano dedicado",
    ],
  },
] as const;

/**
 * Clinera Intelligence: el agente IA DENTRO del software (pregúntale por ventas,
 * agenda y pacientes). Los «créditos CI» de los planes son sus créditos
 * (Ricardo, 18-oct-2026). No conversa con pacientes: eso es el agente de Summit.
 */
export const DEFINICION_CI =
  "Clinera Intelligence es el agente IA dentro del software: le preguntas por tus ventas, tu agenda y tus pacientes. Los créditos CI son su consumo.";

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
export const PLANES_BAJADA =
  "Ficha médica y estética, presupuestos, evoluciones, ventas y Clinera Intelligence desde el primer plan. Subes de plan cuando crece tu equipo o cuando quieres que la IA atienda y agende sola.";
