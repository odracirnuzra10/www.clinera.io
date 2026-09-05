// Fuente única del costo de configuración inicial (pago único).
// Lo consumen <SetupFeeBand />, las tarjetas de planes de home-v3
// (home, /planes, /planes-pro y /plataforma) y las calculadoras de consumo.
//
// OJO: semestral y anual NO pagan implementación. No leas SETUP_FEE_USD
// directo cuando la modalidad esté en juego — usa setupFeeFor(billing).
export const SETUP_FEE_USD = 450;

/** Monto formateado en es-CL, sin símbolo ni moneda: "450". */
export const SETUP_FEE_NUMBER = "450";

/** Monto con símbolo, para el precio de la banda: "$450". */
export const SETUP_FEE_AMOUNT = `$${SETUP_FEE_NUMBER}`;

/** Línea corta para poner debajo del precio de cada plan (solo mensual). */
export const SETUP_FEE_INLINE = `+ USD ${SETUP_FEE_NUMBER} configuración inicial (pago único)`;

export const SETUP_FEE_TITLE = "Costo de configuración: una sola vez";

export const SETUP_FEE_COPY =
  "Migramos fichas clínicas, datos históricos, pacientes y tratamientos, y configuramos tus agentes de IA. En mensual se cobra al inicio (el plan arranca después). En semestral y anual va incluida sin costo: pagas el plan de inmediato.";

export const SEMESTER_MONTHS = 6;
export const SEMESTER_DISCOUNT_PERCENT = 20;

export const ANNUAL_MONTHS = 12;
export const ANNUAL_DISCOUNT_PERCENT = 20;

/**
 * Las tres modalidades de venta. El orden es deliberado: `annual` va primero
 * porque es la que el sitio empuja (mejor caja, mejor retención) y por eso es
 * la opción por defecto de <Pricing /> y del cotizador.
 */
export const BILLING_PERIODS = ["annual", "semester", "monthly"] as const;
export type Billing = (typeof BILLING_PERIODS)[number];

/**
 * Semestral y anual absorben la implementación: quien anticipa el período NO
 * paga los USD 450. Solo el mensual la cobra (y el plan corre después).
 * Cualquier copy, tarjeta, calculadora o cotización que muestre el costo de
 * configuración tiene que pasar por acá en vez de asumir SETUP_FEE_USD.
 */
export function setupFeeFor(billing: Billing): number {
  return billing === "monthly" ? SETUP_FEE_USD : 0;
}

/** true cuando la modalidad regala la implementación (semestral o anual). */
export function includesFreeSetup(billing: Billing): boolean {
  return setupFeeFor(billing) === 0;
}

export const FREE_SETUP_PERK = "Implementación gratis";
export const FREE_SETUP_PERK_LONG = `Implementación gratis (ahorras USD ${SETUP_FEE_NUMBER})`;

/** @deprecated Preferí FREE_SETUP_PERK — el perk ya no es exclusivo del anual. */
export const ANNUAL_SETUP_PERK = FREE_SETUP_PERK;
/** @deprecated Preferí FREE_SETUP_PERK_LONG. */
export const ANNUAL_SETUP_PERK_LONG = FREE_SETUP_PERK_LONG;

export const EXTRA_CREDIT_PACK_USD = 15;
export const EXTRA_CREDIT_PACK_CREDITS = 5_000;
export const EXTRA_USER_USD = 9;

/**
 * Catálogo comercial compartido por /planes y /cotizacion.
 *
 * Los precios semestrales son el total de seis meses con el descuento de
 * catálogo aplicado; los anuales, el total de doce meses con el mismo 20% y
 * redondeado al dólar (así están cargados en Stripe: 2.678 / 3.638 / 4.598).
 * `annualMonthly` es el equivalente mensual redondeado a dos decimales para
 * mostrar en tarjeta — no multipliques por 12 esperando `annualTotal`.
 * Los add-ons no heredan ninguno de los dos descuentos automáticamente.
 */
export const CLINERA_PLANS = [
  {
    id: "vortex",
    name: "Vortex",
    monthlyPrice: 279,
    semesterTotal: 1_339.2,
    semesterMonthly: 223.2,
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
    stripeSemester: "https://buy.stripe.com/dRmfZj0OBduW5gDcgj1441x",
    stripeAnnual: "https://buy.stripe.com/5kQ5kF8h3bmO24r9471441A",
  },
  {
    id: "atlas",
    name: "Atlas",
    monthlyPrice: 379,
    semesterTotal: 1_819.2,
    semesterMonthly: 303.2,
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
    stripeSemester: "https://buy.stripe.com/3cIfZj7cZfD410ncgj1441y",
    stripeAnnual: "https://buy.stripe.com/00w00l7cZ76y24ra8b1441B",
  },
  {
    id: "summit",
    name: "Summit",
    monthlyPrice: 479,
    semesterTotal: 2_299.2,
    semesterMonthly: 383.2,
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
    stripeSemester: "https://buy.stripe.com/aFa8wR9l79eG10nbcf1441z",
    stripeAnnual: "https://buy.stripe.com/eVq8wRfJv9eG38v4NR1441C",
  },
] as const;

export type ClineraPlan = (typeof CLINERA_PLANS)[number];

/**
 * Link de pago de Stripe de un plan. Úsalo SIEMPRE en vez de pegar la URL:
 * los payment links viven acá y en ningún otro lado, igual que los precios.
 * Una copia suelta en un componente es un link que nadie actualiza el día que
 * el plan cambia de precio — y un link de pago viejo cobra el monto viejo.
 */
export function stripeLink(
  id: ClineraPlan["id"],
  periodo: "mensual" | "semestral" | "anual" = "anual",
): string {
  const plan = CLINERA_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan desconocido en stripeLink(): ${id}`);
  if (periodo === "anual") return plan.stripeAnnual;
  return periodo === "semestral" ? plan.stripeSemester : plan.stripe;
}

/** Link de pago del plan para una modalidad de la UI (`Billing`). */
export function planCheckoutUrl(plan: ClineraPlan, billing: Billing): string {
  if (billing === "annual") return plan.stripeAnnual;
  return billing === "semester" ? plan.stripeSemester : plan.stripe;
}

/** Lo que se cobra al contratar en esa modalidad (sin implementación). */
export function planPeriodTotal(plan: ClineraPlan, billing: Billing): number {
  if (billing === "annual") return plan.annualTotal;
  return billing === "semester" ? plan.semesterTotal : plan.monthlyPrice;
}

/** Equivalente mensual que se muestra en grande en la tarjeta. */
export function planMonthlyEquivalent(plan: ClineraPlan, billing: Billing): number {
  if (billing === "annual") return plan.annualMonthly;
  return billing === "semester" ? plan.semesterMonthly : plan.monthlyPrice;
}

/**
 * Ahorro del primer año al pagar anual en vez de mes a mes: el 20% del plan
 * más los USD 450 de implementación que el anual no cobra.
 */
export function annualFirstYearSavings(plan: ClineraPlan): number {
  return plan.monthlyPrice * ANNUAL_MONTHS - plan.annualTotal + SETUP_FEE_USD;
}

/**
 * Ahorro del semestre anticipado vs 6 meses mensuales + implementación:
 * el 20% del plan más los USD 450 que el semestral no cobra.
 */
export function semesterFirstPeriodSavings(plan: ClineraPlan): number {
  return plan.monthlyPrice * SEMESTER_MONTHS - plan.semesterTotal + SETUP_FEE_USD;
}
