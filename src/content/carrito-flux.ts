// Carrito de /contrata (Ricardo, 5-nov-2026). Flux modular a US$ 29 es un producto
// distinto del Flux de /planes. Los precios de Stripe todavía no existen: la ruta
// los busca por lookup_key y, si no están, el carrito ofrece «Solicita asistencia».
// No crear Products ni Prices desde este repo.

import { emailValido } from "@/app/api/wizard/validation";
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
  flux_base: { lookup: "clinera_flux_base_usd_m", usd: 29, min: 1, max: 1, tipo: "base", cobro: "mes", nombre: "Clinera Flux" },
  profesional_extra: { lookup: "clinera_profesional_extra_usd_m", usd: 9, min: 0, max: 50, tipo: "qty", cobro: "mes", nombre: "Profesional extra" },
  sucursal_extra: { lookup: "clinera_sucursal_extra_usd_m", usd: 9, min: 0, max: 20, tipo: "qty", cobro: "mes", nombre: "Sucursal extra" },
  conversaciones_1000: { lookup: "clinera_conversaciones_1000_usd_m", usd: 25, min: 0, max: 20, tipo: "qty", cobro: "mes", nombre: "1.000 conversaciones extra" },
  instagram: { lookup: "clinera_instagram_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", cobro: "mes", nombre: "Conexión Instagram" },
  facebook: { lookup: "clinera_facebook_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", cobro: "mes", nombre: "Conexión Facebook" },
  agente_ia: { lookup: "clinera_agente_ia_7000_usd_m", usd: 79, min: 0, max: 1, tipo: "toggle", cobro: "mes", nombre: "Agente IA" },
  email_marketing: { lookup: "clinera_email_marketing_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", cobro: "mes", nombre: "Email marketing" },
  automatizaciones: { lookup: "clinera_automatizaciones_usd_m", usd: 9, min: 0, max: 1, tipo: "toggle", cobro: "mes", nombre: "Automatizaciones" },
  // Cobro único: no entra en el 50% de 3 meses. El Price lo crea Ricardo en Stripe.
  onboarding_humano: { lookup: "clinera_onboarding_humano_usd_once", usd: 190, min: 0, max: 1, tipo: "toggle", cobro: "unico", nombre: "Onboarding humano" },
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
  onboarding_humano: "oh",
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

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * `lista` es el precio de lista (mensual + cobro único). `promo` aplica el 50%
 * solo a lo mensual: el onboarding humano queda en US$ 190.
 */
export function totales(c: Carrito, now: Date = new Date()): { mensual: number; unico: number; lista: number; promo: number } {
  const s = sanear(c, now);
  let mensual = 0;
  let unico = 0;
  for (const id of ITEM_IDS) {
    const usd = CARRITO[id].usd * s[id];
    if (CARRITO[id].cobro === "unico") unico += usd;
    else mensual += usd;
  }
  mensual = redondear(mensual);
  unico = redondear(unico);
  const promoMes = Math.round(mensual * (100 - PROMO_PCT)) / 100;
  return { mensual, unico, lista: redondear(mensual + unico), promo: redondear(promoMes + unico) };
}

export function totalLista(c: Carrito, now: Date = new Date()): number {
  return totales(c, now).lista;
}

export function totalPromo(c: Carrito, now: Date = new Date()): number {
  return totales(c, now).promo;
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

/** CTA de asistencia. El texto del mensaje es la atribución: WhatsApp no conserva la URL. */
export const ASISTENCIA_LABEL = "Solicita asistencia";
export const ASISTENCIA_WHATSAPP = "https://wa.me/56985581524?text=necesito%20asistencia";

/**
 * Primer cobro que se muestra en Chile (Ricardo, 6-nov-2026): CLP 14.990.
 * Mercado Pago todavía no tiene keys; la sesión sigue en Stripe y el copy
 * visible no la nombra. No inventar el equivalente en pesos de los adicionales.
 */
export const PRECIO_FLUX_CLP = 14990;
export const CTA_ACTIVAR_CLP = "Activar por $14.990";
export const PREGUNTA_ADICIONALES = "¿Quieres adicionales o con esto partes?";

/** Chips de la pregunta al activar. pe, se, c1k, ig, fb, ia. Sin regalo ni onboarding. */
export const ADICIONALES_AL_ACTIVAR = [
  "profesional_extra",
  "sucursal_extra",
  "conversaciones_1000",
  "instagram",
  "facebook",
  "agente_ia",
] as const satisfies readonly Exclude<ItemId, "flux_base" | "email_marketing" | "automatizaciones" | "onboarding_humano">[];

/**
 * Claves cortas que AURA pone en el link de /contrata. `oh` (onboarding) no
 * se lee: ese adicional no se prearma desde WhatsApp.
 */
const QUERY_A_ID = {
  pe: "profesional_extra",
  se: "sucursal_extra",
  c1k: "conversaciones_1000",
  ig: "instagram",
  fb: "facebook",
  ia: "agente_ia",
  em: "email_marketing",
  au: "automatizaciones",
} as const satisfies Record<string, Exclude<ItemId, "flux_base" | "onboarding_humano">>;

const PLANES_QUERY = new Set(["flux", "hex", "vortex"]);

export type CarritoQuery = {
  /** Hay plan o una cantidad: esta visita manda sobre el carrito guardado. */
  aplica: boolean;
  carrito: Record<ItemId, number>;
  /** Vacío si no vino o no pasa `emailValido`. Ya va en minúsculas. */
  email: string;
};

function paramsDe(raw: string | URLSearchParams): URLSearchParams {
  if (typeof raw !== "string") return raw;
  const q = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : raw.replace(/^\?/, "");
  return new URLSearchParams(q);
}

/**
 * Arma el carrito de una visita de AURA: `?plan=` (preselección) y las
 * cantidades cortas se pisan entre sí, y `sanear` recorta. En noviembre el
 * regalo deja `em` y `au` en 0 aunque el link diga 1. Sin plan ni cantidad
 * no aplica, para no borrar el carrito de `?pago=cancelado`.
 */
export function carritoDesdeQuery(raw: string | URLSearchParams, now: Date = new Date()): CarritoQuery {
  const params = paramsDe(raw);
  const plan = (params.get("plan") ?? "").trim().toLowerCase();
  const overlay: Carrito = {};
  let tieneQty = false;
  for (const corto of Object.keys(QUERY_A_ID) as (keyof typeof QUERY_A_ID)[]) {
    const v = params.get(corto);
    if (v == null) continue;
    const t = v.trim();
    if (!/^-?\d+$/.test(t)) continue;
    overlay[QUERY_A_ID[corto]] = Number(t);
    tieneQty = true;
  }
  const planOk = PLANES_QUERY.has(plan);
  const aplica = planOk || tieneQty;
  const emailRaw = (params.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const email = emailRaw && emailValido(emailRaw) ? emailRaw : "";
  const carrito = sanear(
    aplica ? { flux_base: 1, ...preseleccion(planOk ? plan : ""), ...overlay } : {},
    now,
  );
  return { aplica, carrito, email };
}
