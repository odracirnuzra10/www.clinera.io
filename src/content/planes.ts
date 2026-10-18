// ============================================================================
// Planes vigentes en la web: Flux · Hurricane · Vortex (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Fuente única de lo que el sitio PÚBLICO muestra como planes: home, /planes,
// /planes-pro, landings `software-vertical`, /agenda, schema y llms.
//
// El CTA de todos los planes es «Hablar con ventas» → /agenda (Ricardo,
// 18-oct-2026: «volveremos a utilizar clinera.io/agenda»). Además, /agenda
// (paso 3) y /planes llevan el Payment Link de Stripe de cada plan con el cupón
// CUKI (`agenda-oferta.ts`).
//
// Lo que NO vive acá:
// - `pricing.ts` (Vortex/Atlas/Summit 279/379/479): sigue alimentando los
//   contratos de /firma y el constructor de /cotizacion. Contratos firmados
//   referencian esos ids; no se migran sin que Ricardo lo decida.
// - `planes2.ts` (Go!/Flux/Ultra): lo usan las piezas internas de /go y el
//   evento de compra de Meta. /go sigue existiendo, pero el sitio no lo promueve.
//
// Precios, límites y funciones dictados por Ricardo el 18-oct-2026, enfocados en
// la clínica estética. «Créditos CI» = créditos de Clinera Intelligence.
// ============================================================================

import type { PlanChannel } from "@/content/pricing";

export type PlanId = "flux" | "hurricane" | "vortex";

export type Plan = {
  id: PlanId;
  name: string;
  /** US$ por mes. */
  monthlyUsd: number;
  professionals: number;
  /** Conversaciones por mes: el límite siempre se expresa en conversaciones. */
  conversations: number;
  channels: readonly PlanChannel[];
  /** Agente de IA que responde y agenda: desde Hurricane. Flux es sin IA. */
  agenteIA: boolean;
  /** Créditos de IA del agente al mes (0 = sin agente). */
  iaCredits: number;
  /** Créditos de Clinera Intelligence (el agente IA dentro del software). */
  ciCredits: number;
  featured: boolean;
  /** Etiqueta sobre la tarjeta. Vacía = sin etiqueta. */
  tag: string;
  /** «Funciones base» de la tarjeta, en el orden que dictó Ricardo. */
  features: readonly string[];
};

const FICHA = "Ficha estética facial y corporal personalizada, evoluciones y presupuestos";
const CANALES = "WhatsApp, Facebook, Instagram y email marketing";
// Vortex suma la llamada telefónica como canal (Ricardo, 18-oct-2026).
const CANALES_VORTEX = "WhatsApp, Facebook, Instagram, email marketing y llamada telefónica";
const ci = (n: number) => `${n} créditos de Clinera Intelligence`;
/** Hurricane y Vortex (Ricardo, 18-oct-2026). Va destacado en las tarjetas. */
export const ONBOARDING = "Onboarding humano dedicado";

// Ricardo, 18-oct-2026 (reemplaza Flux 89 · Nexus 129 · Summit 179). Los créditos
// de IA son los de sus viñetas (Hurricane 5.000, Vortex 15.000); en el mismo
// mensaje el título decía 10.000 y 27.000: confirmar con él.
export const PLANES: readonly Plan[] = [
  {
    id: "flux",
    name: "Flux",
    monthlyUsd: 129,
    professionals: 5,
    conversations: 500,
    channels: ["whatsapp", "facebook", "instagram", "email"],
    agenteIA: false,
    iaCredits: 0,
    ciCredits: 100,
    featured: false,
    tag: "",
    features: ["Hasta 5 profesionales", FICHA, CANALES, "Hasta 500 conversaciones", ci(100), "Sin agente IA"],
  },
  {
    id: "hurricane",
    name: "Hurricane",
    monthlyUsd: 179,
    professionals: 10,
    conversations: 1500,
    channels: ["whatsapp", "facebook", "instagram", "email"],
    agenteIA: true,
    iaCredits: 5000,
    ciCredits: 200,
    featured: true,
    tag: "Con IA",
    features: ["Hasta 10 profesionales", FICHA, CANALES, "Hasta 1.500 conversaciones", ci(200), "Agente IA · 5.000 créditos de IA", ONBOARDING],
  },
  {
    id: "vortex",
    name: "Vortex",
    monthlyUsd: 279,
    professionals: 20,
    conversations: 3000,
    channels: ["whatsapp", "facebook", "instagram", "email", "telefono"],
    agenteIA: true,
    iaCredits: 15000,
    ciCredits: 500,
    featured: false,
    tag: "",
    features: ["Hasta 20 profesionales", FICHA, CANALES_VORTEX, "Hasta 3.000 conversaciones", ci(500), "Agente IA · 15.000 créditos de IA", ONBOARDING],
  },
] as const;

/**
 * Funciones que van destacadas en las tarjetas (Ricardo, 18-oct-2026: «énfasis
 * en el agente IA, es una función clave» y «onboarding humano dedicado en negrita»).
 * «Sin agente IA» de Flux no se destaca.
 */
export function destacadoDe(feature: string): "ia" | "onboarding" | null {
  if (feature.startsWith("Agente IA")) return "ia";
  if (feature === ONBOARDING) return "onboarding";
  return null;
}

/**
 * Clinera Intelligence: el agente IA DENTRO del software (pregúntale por ventas,
 * agenda y pacientes). Los «créditos CI» son sus créditos (Ricardo, 18-oct-2026).
 * No conversa con pacientes: eso es el agente IA de Hurricane y Vortex.
 */
export const DEFINICION_CI =
  "Clinera Intelligence es el agente IA dentro del software: le preguntas por tus ventas, tu agenda y tus pacientes. Los créditos CI son su consumo.";

export const PLAN_DESDE_USD = Math.min(...PLANES.map((p) => p.monthlyUsd));
export const PLAN_HASTA_USD = Math.max(...PLANES.map((p) => p.monthlyUsd));
/** Primer plan con agente IA («desde Hurricane»). */
export const PLAN_IA_DESDE = PLANES.find((p) => p.agenteIA)!;

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

/** `/agenda?plan=hurricane` + la query de la visita (utm, gclid, fbclid). */
export function agendaHrefPlan(planId: PlanId | null, search = ""): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (planId) params.set("plan", planId);
  const q = params.toString();
  return q ? `${CTA_VENTAS_PATH}?${q}` : CTA_VENTAS_PATH;
}

export const PLANES_TITULO = "Elige según tu equipo.";
export const PLANES_TITULO_ACENTO = "Crece sin cambiar de sistema.";
export const PLANES_BAJADA =
  "Ficha estética facial y corporal, evoluciones, presupuestos, email marketing y Clinera Intelligence desde el primer plan. Subes de plan cuando crece tu equipo o cuando quieres que la IA atienda y agende por ti.";
