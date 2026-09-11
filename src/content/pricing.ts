// Fuente única del costo de configuración inicial (pago único).
// Lo consumen <SetupFeeBand />, las tarjetas de planes de home-v3
// (home, /planes, /planes-pro y /plataforma) y las calculadoras de consumo.
//
// Catálogo público (clinera.io): sólo mensual. El anual vive en el
// constructor (cotizacion.oacg.cl), no en la web. En las dos modalidades
// el primer cobro es implementación + primer período del plan.
export const SETUP_FEE_USD = 450;

/** Monto formateado en es-CL, sin símbolo ni moneda: "450". */
export const SETUP_FEE_NUMBER = "450";

/** Monto con símbolo, para el precio de la banda: "$450". */
export const SETUP_FEE_AMOUNT = `$${SETUP_FEE_NUMBER}`;

/** Línea corta para poner debajo del precio de cada plan. */
export const SETUP_FEE_INLINE = `+ USD ${SETUP_FEE_NUMBER} configuración inicial (pago único)`;

export const SETUP_FEE_TITLE = "Costo de configuración: una sola vez";

export const SETUP_FEE_COPY =
  "Migramos fichas clínicas, datos históricos, pacientes y tratamientos, y configuramos tus agentes de IA. El primer cobro es la implementación más el primer mes del plan. Después, el plan mes a mes.";

/** Permanencia mínima de todos los planes, en meses. */
export const SEMESTER_MONTHS = 6;
export const MIN_TERM_MONTHS = SEMESTER_MONTHS;

export const ANNUAL_MONTHS = 12;
export const ANNUAL_DISCOUNT_PERCENT = 20;

/**
 * Modalidades que todavía existen en el producto. La web pública sólo
 * muestra mensual; semestral y anual son herramienta del constructor
 * (cotizacion.oacg.cl). Este tipo cubre mensual/anual para firma y catálogo.
 */
export const BILLING_PERIODS = ["annual", "monthly"] as const;
export type Billing = (typeof BILLING_PERIODS)[number];

/**
 * El catálogo cobra la implementación siempre. Un closer puede regalarla
 * en una cotización formal; eso no se publica ni se asume acá.
 */
export function setupFeeFor(_billing: Billing): number {
  return SETUP_FEE_USD;
}

/** El catálogo nunca regala la implementación. */
export function includesFreeSetup(_billing: Billing): boolean {
  return false;
}

export const EXTRA_CREDIT_PACK_USD = 15;
export const EXTRA_CREDIT_PACK_CREDITS = 5_000;
export const EXTRA_USER_USD = 9;

/**
 * Modalidades públicas de precio: Chile vs México.
 * Ricardo (2026-09-11): el listado publicado NO incluye IVA.
 * No hay montos MXN/CLP oficiales — las dos muestran el catálogo USD
 * y la nota fiscal del país. No convertir. No sumar IVA al número.
 */
export const PRICE_MODALITIES = ["cl", "mx"] as const;
export type PriceModality = (typeof PRICE_MODALITIES)[number];
export const DEFAULT_PRICE_MODALITY: PriceModality = "cl";

export const PRICE_MODALITY = {
  cl: {
    id: "cl" as const,
    label: "Precios chilenos",
    country: "Chile",
    currency: "USD",
    ivaNote: "No incluye IVA",
    ivaNoteLong: "USD · no incluye IVA en Chile",
  },
  mx: {
    id: "mx" as const,
    label: "Precios mexicanos",
    country: "México",
    currency: "USD",
    ivaNote: "No incluye IVA",
    ivaNoteLong: "USD · no incluye IVA en México",
  },
} as const;

export type PriceModalityMeta = (typeof PRICE_MODALITY)[PriceModality];

export function isPriceModality(value: unknown): value is PriceModality {
  return value === "cl" || value === "mx";
}

/**
 * Catálogo comercial. La web publica monthlyPrice + implementación.
 * annualTotal / annualMonthly / stripeAnnual se quedan para el constructor
 * y la firma; no se muestran en clinera.io.
 *
 * Los anuales son doce meses con −20% de catálogo, redondeado al dólar
 * (así están en Stripe: 2.678 / 3.638 / 4.598). `annualMonthly` es el
 * equivalente para mostrar en cotización — no multipliques por 12
 * esperando `annualTotal`.
 */
export const CLINERA_PLANS = [
  {
    id: "vortex",
    name: "Vortex",
    monthlyPrice: 279,
    annualTotal: 2_678,
    annualMonthly: 223.17,
    credits: 28_000,
    users: 10,
    branches: "1 sucursal",
    channel: "Texto",
    consumptionReference: "~933 conversaciones o ~143 agendamientos automáticos",
    description:
      "Para clínicas con equipo de recepción y varios profesionales que empiezan a ordenar su operación.",
    headline: "Incluye",
    featured: false,
    agents: [{ id: "aura", name: "AURA" }],
    stripe: "https://buy.stripe.com/4gM7sN7cZ4Yq9wT5RV1441u",
    stripeAnnual: "https://buy.stripe.com/5kQ5kF8h3bmO24r9471441A",
  },
  {
    id: "atlas",
    name: "Atlas",
    monthlyPrice: 379,
    annualTotal: 3_638,
    annualMonthly: 303.17,
    credits: 37_000,
    users: 15,
    branches: "2 sucursales",
    channel: "Texto + voz",
    consumptionReference:
      "~1.233 conversaciones o ~189 agendamientos · ~320 min de voz",
    description:
      "Para clínicas con alto volumen o 2+ sedes que necesitan estandarizar la atención.",
    headline: "Todo de Vortex, más",
    featured: false,
    agents: [
      { id: "aura", name: "AURA" },
      { id: "camila", name: "CAMILA" },
    ],
    stripe: "https://buy.stripe.com/5kQ7sN40Nez08sP9471441v",
    stripeAnnual: "https://buy.stripe.com/00w00l7cZ76y24ra8b1441B",
  },
  {
    id: "summit",
    name: "Summit",
    monthlyPrice: 479,
    annualTotal: 4_598,
    annualMonthly: 383.17,
    credits: 46_000,
    users: 25,
    branches: "Sucursales ilimitadas",
    channel: "Texto + voz + API",
    consumptionReference:
      "~1.533 conversaciones o ~235 agendamientos · ~440 min de voz",
    description:
      "Para grupos clínicos y clínicas de alto volumen —una o varias sedes— que necesitan control central de toda la operación.",
    headline: "Todo de Atlas, más",
    featured: true,
    agents: [
      { id: "aura", name: "AURA" },
      { id: "camila", name: "CAMILA" },
      { id: "lia", name: "LIA" },
    ],
    stripe: "https://buy.stripe.com/5kQ6oJbtf3UmdN94NR1441w",
    stripeAnnual: "https://buy.stripe.com/eVq8wRfJv9eG38v4NR1441C",
  },
] as const;

export type ClineraPlan = (typeof CLINERA_PLANS)[number];

/**
 * Link de pago de Stripe de un plan. Úsalo SIEMPRE en vez de pegar la URL:
 * los payment links viven acá y en ningún otro lado, igual que los precios.
 * La web pública siempre manda al mensual. El anual no se publica.
 */
export function stripeLink(
  id: ClineraPlan["id"],
  periodo: "mensual" | "anual" = "mensual",
): string {
  const plan = CLINERA_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan desconocido en stripeLink(): ${id}`);
  return periodo === "anual" ? plan.stripeAnnual : plan.stripe;
}

/** Link de pago del plan para una modalidad (`Billing`). */
export function planCheckoutUrl(plan: ClineraPlan, billing: Billing): string {
  return billing === "annual" ? plan.stripeAnnual : plan.stripe;
}

/** Lo que se cobra del plan en esa modalidad (sin implementación). */
export function planPeriodTotal(plan: ClineraPlan, billing: Billing): number {
  return billing === "annual" ? plan.annualTotal : plan.monthlyPrice;
}

/** Equivalente mensual que se muestra en grande. */
export function planMonthlyEquivalent(plan: ClineraPlan, billing: Billing): number {
  return billing === "annual" ? plan.annualMonthly : plan.monthlyPrice;
}

/**
 * Ahorro del plan anual vs 12 meses mensuales (sólo el −20% de catálogo).
 * La implementación se cobra igual en las dos, así que no entra.
 */
export function annualFirstYearSavings(plan: ClineraPlan): number {
  return plan.monthlyPrice * ANNUAL_MONTHS - plan.annualTotal;
}
