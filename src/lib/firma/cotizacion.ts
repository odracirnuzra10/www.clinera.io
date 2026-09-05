// ============================================================================
// Firma + pago — snapshot de la cotización dentro del sobre
// ----------------------------------------------------------------------------
// El botón "Enviar a firma" de /cotizacion pasa la CONFIGURACIÓN de la
// cotización (plan, modalidad, extras, descuentos), nunca montos: acá se
// recalcula todo server-side contra el catálogo de src/content/pricing, que es
// la misma fuente que usa el cotizador. Con eso el checkout de Stripe cobra
// exactamente lo cotizado sin confiar en números que vengan del navegador.
// ============================================================================

import {
  ANNUAL_MONTHS,
  CLINERA_PLANS,
  EXTRA_CREDIT_PACK_USD,
  EXTRA_USER_USD,
  SEMESTER_MONTHS,
  SETUP_FEE_USD,
  type Billing,
} from "@/content/pricing";

/** Meses que cubre cada modalidad de pago. */
export type PeriodoMeses = 1 | 6 | 12;

/** "mensual" / "semestral" / "anual" — para redactar frases. */
export function periodoAdjetivo(meses: PeriodoMeses): "mensual" | "semestral" | "anual" {
  return meses === 12 ? "anual" : meses === 6 ? "semestral" : "mensual";
}

/** "mes" / "semestre" / "año" — para sufijos tipo "USD 2.678 / año". */
export function periodoSustantivo(meses: PeriodoMeses): "mes" | "semestre" | "año" {
  return meses === 12 ? "año" : meses === 6 ? "semestre" : "mes";
}

/** Cuánto dura la personalización de precio de la suscripción. */
export type DescuentoDuracion =
  | { tipo: "primer_pago" }
  | { tipo: "siempre" }
  | { tipo: "meses"; meses: number };

export type CotizacionSnapshot = {
  numero: string;
  planId: (typeof CLINERA_PLANS)[number]["id"];
  planNombre: string;
  billing: Billing;
  periodoMeses: PeriodoMeses;
  extraUsuarios: number;
  extraPacks: number;
  incluirSetup: boolean;
  descuentos: {
    plan: number;
    users: number;
    credits: number;
    setup: number;
    global: number;
  };
  duracionDescuento: DescuentoDuracion;
  moneda: "USD";
  /** Datos de presentación del documento (solo para renderizar el PDF). */
  presentacion?: {
    clienteNombre: string;
    cotizante: string;
    cotizanteEmail: string;
    cotizanteTelefono: string;
    fecha: string;
    validaHasta: string;
    notas: string;
  };
  /** Montos en centavos de USD, recalculados del catálogo. */
  centavos: {
    /** Precio de lista del plan por período. */
    planLista: number;
    /** Precio de lista por usuario extra por período. */
    usuarioLista: number;
    /** Precio de lista por pack de créditos por período. */
    packLista: number;
    setupLista: number;
    /** Total recurrente de lista por período (sin setup). */
    recurrenteLista: number;
    /** Total recurrente con descuentos por ítem + global. */
    recurrenteFinal: number;
    /** Lo que cubre el cupón de Stripe en cada período con descuento. */
    descuentoRecurrente: number;
    /** Setup con su descuento y el global aplicados (cobro único). */
    setupFinal: number;
  };
};

const clampPct = (v: unknown) =>
  Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
const clampQty = (v: unknown) =>
  Math.min(999, Math.max(0, Math.round(Number(v) || 0)));
const aCentavos = (usd: number) => Math.round(usd * 100);

/**
 * Valida la configuración cruda que envía el navegador y reconstruye el
 * snapshot con montos del catálogo. Devuelve null si no es interpretable.
 */
export function construirCotizacion(cruda: unknown): CotizacionSnapshot | null {
  if (typeof cruda !== "object" || cruda === null) return null;
  const c = cruda as Record<string, unknown>;

  const plan = CLINERA_PLANS.find((p) => p.id === c.planId);
  if (!plan) return null;

  const billing: Billing | null =
    c.billing === "annual"
      ? "annual"
      : c.billing === "semester"
        ? "semester"
        : c.billing === "monthly"
          ? "monthly"
          : null;
  if (!billing) return null;
  const periodoMeses: PeriodoMeses =
    billing === "annual" ? (ANNUAL_MONTHS as 12) : billing === "semester" ? (SEMESTER_MONTHS as 6) : 1;

  const d = (typeof c.descuentos === "object" && c.descuentos !== null
    ? c.descuentos
    : {}) as Record<string, unknown>;
  const descuentos = {
    plan: clampPct(d.plan),
    users: clampPct(d.users),
    credits: clampPct(d.credits),
    setup: clampPct(d.setup),
    global: clampPct(d.global),
  };

  const dur = (typeof c.duracionDescuento === "object" && c.duracionDescuento !== null
    ? c.duracionDescuento
    : {}) as Record<string, unknown>;
  let duracionDescuento: DescuentoDuracion;
  if (dur.tipo === "siempre") {
    duracionDescuento = { tipo: "siempre" };
  } else if (dur.tipo === "meses") {
    const meses = Math.min(60, Math.max(1, Math.round(Number(dur.meses) || 0)));
    duracionDescuento = { tipo: "meses", meses };
  } else {
    duracionDescuento = { tipo: "primer_pago" };
  }

  const extraUsuarios = clampQty(c.extraUsuarios);
  const extraPacks = clampQty(c.extraPacks);
  // El plan anual y el semestral incluyen la implementación: aunque el
  // navegador mande incluirSetup en true, acá no se cobra. Es política
  // comercial, no una preferencia del cotizador.
  const incluirSetup = billing === "monthly" && c.incluirSetup === true;

  // Mismo cálculo que QuoteBuilder: descuento por línea y luego el global
  // sobre todo (incluido el setup).
  const planListaUsd =
    billing === "annual"
      ? plan.annualTotal
      : billing === "semester"
        ? plan.semesterTotal
        : plan.monthlyPrice;
  const usuarioListaUsd = EXTRA_USER_USD * periodoMeses;
  const packListaUsd = EXTRA_CREDIT_PACK_USD * periodoMeses;

  const factorGlobal = 1 - descuentos.global / 100;
  const recurrenteListaUsd =
    planListaUsd + extraUsuarios * usuarioListaUsd + extraPacks * packListaUsd;
  const recurrenteFinalUsd =
    (planListaUsd * (1 - descuentos.plan / 100) +
      extraUsuarios * usuarioListaUsd * (1 - descuentos.users / 100) +
      extraPacks * packListaUsd * (1 - descuentos.credits / 100)) *
    factorGlobal;
  const setupFinalUsd = incluirSetup
    ? SETUP_FEE_USD * (1 - descuentos.setup / 100) * factorGlobal
    : 0;

  const recurrenteLista = aCentavos(recurrenteListaUsd);
  const recurrenteFinal = aCentavos(recurrenteFinalUsd);

  const p = (typeof c.presentacion === "object" && c.presentacion !== null
    ? c.presentacion
    : {}) as Record<string, unknown>;
  const campo = (v: unknown, max = 120) => String(v ?? "").trim().slice(0, max);
  const presentacion = {
    clienteNombre: campo(p.clienteNombre),
    cotizante: campo(p.cotizante),
    cotizanteEmail: campo(p.cotizanteEmail),
    cotizanteTelefono: campo(p.cotizanteTelefono, 30),
    fecha: campo(p.fecha, 10),
    validaHasta: campo(p.validaHasta, 10),
    notas: campo(p.notas, 400),
  };

  return {
    presentacion,
    numero: String(c.numero ?? "").trim().slice(0, 40) || "Clinera",
    planId: plan.id,
    planNombre: plan.name,
    billing,
    periodoMeses,
    extraUsuarios,
    extraPacks,
    incluirSetup,
    descuentos,
    duracionDescuento,
    moneda: "USD",
    centavos: {
      planLista: aCentavos(planListaUsd),
      usuarioLista: aCentavos(usuarioListaUsd),
      packLista: aCentavos(packListaUsd),
      setupLista: incluirSetup ? aCentavos(SETUP_FEE_USD) : 0,
      recurrenteLista,
      recurrenteFinal,
      descuentoRecurrente: Math.max(0, recurrenteLista - recurrenteFinal),
      setupFinal: aCentavos(setupFinalUsd),
    },
  };
}
