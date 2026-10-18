// ============================================================================
// /agenda: landing «Crea tu cuenta» (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Paso 1 datos (van al CRM) → paso 2 funciones que necesita → paso 3 los tres
// planes con el cupón CUKI (50% el primer mes; vence al día siguiente de la primera visita).
// Los links de pago los manda Ricardo: mientras sean `null`, cada botón muestra el marcador y no un enlace roto.
// ============================================================================

import { PLANES, type PlanId } from "@/content/planes";

/**
 * Paso 3 (Ricardo, 18-oct-2026, versión final): cupón CUKI con 50% de descuento
 * SOLO EL PRIMER MES, válido en cualquiera de los 3 planes. Antes se probó 30% por
 * 3 meses; se cambió «para impulsar la venta automática». El visitante ve Flux, Hurricane y Vortex con el
 * precio con descuento y paga el plan que elija aplicando el código en Stripe.
 *
 * VENCE AL DÍA SIGUIENTE DE SU PRIMERA VISITA: si entró el domingo 18, vale
 * hasta el lunes 19; si entró el 20, hasta el 21. La primera visita se guarda en
 * el navegador (`CUPON_PRIMERA_VISITA_KEY`) para que la fecha no se corra cada
 * vez que vuelve. Fechas en hora de Chile.
 */
export const CUPON = {
  // Código que ve y escribe la clínica (Stripe promo, 18-oct-2026).
  codigo: "CUKI",
  descuentoPct: 50,
  /** Meses con descuento (después, precio normal). Se configura igual en Stripe. */
  meses: 1,
  diasValidez: 1,
} as const;

export const CUPON_PRIMERA_VISITA_KEY = "cl_cupon_primera_visita";
const TZ_CHILE = "America/Santiago";

/** «2026-10-18» de un instante, en hora de Chile. */
export function ymdChile(instante: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ_CHILE, year: "numeric", month: "2-digit", day: "2-digit" }).format(instante);
}

/** Último día válido del cupón: el día siguiente a la primera visita (YYYY-MM-DD). */
export function venceCupon(primeraVisitaYmd: string): string {
  const [y, m, d] = primeraVisitaYmd.split("-").map(Number);
  const f = new Date(Date.UTC(y, m - 1, d + CUPON.diasValidez, 12));
  return f.toISOString().slice(0, 10);
}

/** «lunes 19 de octubre». */
export function fechaLarga(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d, 12)),
  ).replace(",", "");
}

export function precioConCupon(usd: number): number {
  return Math.round(usd * (100 - CUPON.descuentoPct)) / 100;
}

/** «44,50» / «89» — dos decimales solo si hay centavos. */
export function formatoUsd(usd: number): string {
  return Number.isInteger(usd)
    ? usd.toLocaleString("es-CL")
    : usd.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Payment Links por plan (Stripe, 18-oct-2026). El cupón lo escribe la clínica en
 * «Añadir código de promoción»: `?prefilled_promo_code=CUKI` NO lo aplica en estos
 * links (probado el 18-oct-2026; el total quedó sin descuento). Para precargarlo
 * hay que abrir una Checkout Session con `discounts`, que pide una llave con escritura.
 */
export const LINKS_PAGO: Record<PlanId, string | null> = {
  flux: "https://buy.stripe.com/14A28tgNz1MegZl9471441J",
  hurricane: "https://buy.stripe.com/28EbJ3btffD4cJ59471441K",
  vortex: "https://buy.stripe.com/cNi00ldBnduW24r8031441I",
};

export const linkPagoPendiente = (plan: string) => `[PENDIENTE: link de pago de ${plan}]`;

/** Lo que se destaca de cada plan en el paso 3 (sale de `planes.ts`). */
export const PLANES_OFERTA = PLANES.map((p) => ({
  ...p,
  conCupon: precioConCupon(p.monthlyUsd),
  destacados: p.features,
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

/**
 * Lo que trae Clinera, en el hero al lado del wizard (Ricardo, 18-oct-2026:
 * «ficha facial, ficha corporal, evoluciones, pagos, agente IA, conexión
 * WhatsApp, Facebook, Insta, correos, etc.», con el formato de /clinica-estetica).
 */
export const FUNCIONES_HERO = [
  "Ficha estética facial y corporal, con fotos y consentimientos",
  "Evoluciones por sesión y presupuestos enviados por WhatsApp",
  "Pagos y ventas de tu clínica en un solo lugar",
  "Agente IA que responde y agenda por ti",
  "WhatsApp, Facebook e Instagram conectados a tu agenda",
  "Correos y email marketing a tus pacientes",
] as const;

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
  sub: "Ficha médica, ficha estética facial y ficha estética corporal, con evoluciones, presupuestos y ventas en un solo lugar. Completa los datos de tu clínica y te mostramos la oferta para activarla.",
  beneficios: [
    "Ficha estética facial y corporal, con fotos y consentimientos",
    "Presupuestos y evoluciones por sesión",
    "Sculptra, Radiesse, Endoláser y Rinolips ya cargados",
    "Y si quieres, la IA atiende tu WhatsApp y agenda por ti",
  ],
} as const;
