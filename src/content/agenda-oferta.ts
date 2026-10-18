// ============================================================================
// /agenda: landing «Crea tu cuenta» (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Paso 1 datos (van al CRM) → paso 2 funciones que necesita → paso 3 los tres
// planes con el cupón KUKY (50%). Los links de pago los manda Ricardo: mientras
// sean `null`, cada botón muestra el marcador y no un enlace roto.
// ============================================================================

import { PLANES, type PlanId } from "@/content/planes";

/**
 * Paso 3 (Ricardo, 18-oct-2026, reemplaza la oferta de Summit a US$ 89): cupón
 * KUKY con 50% de descuento, válido en cualquiera de los 3 planes. El visitante
 * ve Flux, Nexus y Summit con el precio con descuento y paga el plan que elija
 * aplicando el código en Stripe. Duración del descuento: pendiente de Ricardo
 * (no la publiques hasta que la confirme).
 */
export const CUPON = {
  codigo: "KUKY",
  descuentoPct: 50,
} as const;

export function precioConCupon(usd: number): number {
  return Math.round(usd * (100 - CUPON.descuentoPct)) / 100;
}

/** «44,50» / «89» — dos decimales solo si hay centavos. */
export function formatoUsd(usd: number): string {
  return Number.isInteger(usd)
    ? usd.toLocaleString("es-CL")
    : usd.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Payment Links por plan. `null` = Ricardo aún no los envía: se muestra el marcador. */
export const LINKS_PAGO: Record<PlanId, string | null> = {
  flux: null,
  nexus: null,
  summit: null,
};

export const linkPagoPendiente = (plan: string) => `[PENDIENTE: link de pago de ${plan}]`;

/** Lo que se destaca de cada plan en el paso 3 (sale de `planes.ts`). */
export const PLANES_OFERTA = PLANES.map((p) => ({
  ...p,
  conCupon: precioConCupon(p.monthlyUsd),
  destacados: p.features.slice(0, 4),
}));

/** Paso 2: lo que la clínica necesita. Varias opciones. */
export const FUNCIONES = [
  { id: "ficha_facial", label: "Ficha estética facial" },
  { id: "ficha_corporal", label: "Ficha estética corporal" },
  { id: "presupuestos", label: "Presupuestos" },
  { id: "evoluciones", label: "Evoluciones" },
  { id: "agente_ia", label: "Agente IA" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
] as const;

export type FuncionId = (typeof FUNCIONES)[number]["id"];

/** Profesionales (mismos ids que /agenda usaba en `boxes_profesionales`). */
export const PROFESIONALES = [
  { id: "1_3", label: "1–3" },
  { id: "4_6", label: "4–6" },
  { id: "7_10", label: "7–10" },
  { id: "10_plus", label: "Más de 10" },
] as const;

export const AGENDA_COPY = {
  eyebrow: "Software para clínicas estéticas con IA",
  h1: "Crea tu cuenta y actívala en minutos.",
  sub: "Ficha médica y estética facial y corporal, presupuestos, evoluciones y ventas en un solo lugar. Completa los datos de tu clínica y te mostramos la oferta para activarla.",
  beneficios: [
    "Ficha estética facial y corporal, con fotos y consentimientos",
    "Presupuestos y evoluciones por sesión",
    "Sculptra, Radiesse, Endoláser y Rinolips ya cargados",
    "Y si quieres, la IA atiende tu WhatsApp y agenda por ti",
  ],
} as const;
