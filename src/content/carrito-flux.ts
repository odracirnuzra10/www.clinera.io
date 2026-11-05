// Carrito de /contrata (Ricardo, 5-nov-2026). Flux modular a US$ 29 es un producto
// distinto del Flux de /planes. Los precios de Stripe todavía no existen: la ruta
// los busca por lookup_key y, si no están, el carrito ofrece agendar una reunión.
// No crear Products ni Prices desde este repo.

import { fechaChileISO } from "@/lib/urgencia-dias";

export const FLUX_BASE_INCLUYE = [
  "2 profesionales",
  "1 sucursal",
  "100 conversaciones",
  "Fichas clínicas",
  "WhatsApp",
  "Clinera Intelligence",
] as const;

export const CARRITO = {
  flux_base: { lookup: "clinera_flux_base_usd_m", usd: 29, min: 1, max: 1, tipo: "base", nombre: "Clinera Flux" },
  profesional_extra: { lookup: "clinera_profesional_extra_usd_m", usd: 9, min: 0, max: 50, tipo: "qty", nombre: "Profesional extra" },
  sucursal_extra: { lookup: "clinera_sucursal_extra_usd_m", usd: 9, min: 0, max: 20, tipo: "qty", nombre: "Sucursal extra" },
  conversaciones_1000: { lookup: "clinera_conversaciones_1000_usd_m", usd: 25, min: 0, max: 20, tipo: "qty", nombre: "1.000 conversaciones extra" },
  instagram: { lookup: "clinera_instagram_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", nombre: "Conexión Instagram" },
  facebook: { lookup: "clinera_facebook_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", nombre: "Conexión Facebook" },
  agente_ia: { lookup: "clinera_agente_ia_7000_usd_m", usd: 79, min: 0, max: 1, tipo: "toggle", nombre: "Agente IA" },
  email_marketing: { lookup: "clinera_email_marketing_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", nombre: "Email marketing" },
  automatizaciones: { lookup: "clinera_automatizaciones_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", nombre: "Automatizaciones" },
} as const;

export type ItemId = keyof typeof CARRITO;
export type Carrito = Partial<Record<ItemId, number>>;
export const PROMO_MESES = 3;
export const PROMO_PCT = 50;
export const PROMO_CODE_CARRITO = "CLINERA50X3";

/**
 * Hasta el 30-nov-2026 (hora de Chile) Email marketing y Automatizaciones
 * se muestran como «Regalo de noviembre» y no se cobran. Desde el 1-dic
 * son adicionales de US$ 9. Si quien contrató en noviembre los conserva
 * gratis no está decidido: el copy no lo promete.
 */
export const GIFT_UNTIL = "2026-11-30";
export const REGALO_IDS = ["email_marketing", "automatizaciones"] as const;
export type RegaloId = (typeof REGALO_IDS)[number];
export const REGALOS = REGALO_IDS.map((id) => ({ id, nombre: CARRITO[id].nombre }));

export function esRegaloNoviembre(id: string): id is RegaloId {
  return (REGALO_IDS as readonly string[]).includes(id);
}

const CORTOS: Record<Exclude<ItemId, "flux_base">, string> = {
  profesional_extra: "pe",
  sucursal_extra: "se",
  conversaciones_1000: "c1k",
  instagram: "ig",
  facebook: "fb",
  agente_ia: "ia",
  email_marketing: "em",
  automatizaciones: "au",
};

export const ITEM_IDS = Object.keys(CARRITO) as ItemId[];

export function regaloVigente(now: Date = new Date()): boolean {
  return fechaChileISO(now) <= GIFT_UNTIL;
}

/**
 * Entero entre min y max. La base siempre es 1. Lo que no es número vuelve al mínimo.
 * Mientras el regalo está vigente, email y automatizaciones quedan en 0: no se cobran.
 */
export function sanear(c: Carrito | null | undefined, now: Date = new Date()): Record<ItemId, number> {
  const out = {} as Record<ItemId, number>;
  const regalo = regaloVigente(now);
  for (const id of ITEM_IDS) {
    const spec = CARRITO[id];
    const raw = c?.[id];
    const n = typeof raw === "number" && Number.isFinite(raw) ? Math.trunc(raw) : spec.min;
    out[id] = regalo && esRegaloNoviembre(id) ? 0 : Math.min(spec.max, Math.max(spec.min, n));
  }
  out.flux_base = 1;
  return out;
}

export function totalLista(c: Carrito, now: Date = new Date()): number {
  const s = sanear(c, now);
  const suma = ITEM_IDS.reduce((acc, id) => acc + CARRITO[id].usd * s[id], 0);
  return Math.round(suma * 100) / 100;
}

export function totalPromo(c: Carrito, now: Date = new Date()): number {
  return Math.round(totalLista(c, now) * (100 - PROMO_PCT)) / 100;
}

/** JSON corto para metadata de Stripe (≤500). La base no viaja: siempre es 1. */
export function carritoCorto(c: Carrito, now: Date = new Date()): string {
  const s = sanear(c, now);
  const out: Record<string, number> = {};
  for (const id of Object.keys(CORTOS) as Exclude<ItemId, "flux_base">[]) {
    if (s[id] > 0) out[CORTOS[id]] = s[id];
  }
  return JSON.stringify(out);
}

/** `?plan=hex` premarca Instagram y Facebook; `vortex` suma el Agente IA. */
export function preseleccion(plan: string): Carrito {
  if (plan === "hex") return { instagram: 1, facebook: 1 };
  if (plan === "vortex") return { instagram: 1, facebook: 1, agente_ia: 1 };
  return {};
}
