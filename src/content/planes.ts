// ============================================================================
// Las dos opciones de Clinera: Vortex · Ecosistema (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Fuente única de lo que el sitio PÚBLICO vende: home, /planes, landings
// `software-vertical`, /agenda, schema y llms. Clinera pasa de «solo software» a
// ecosistema: software con IA + marketing de performance, para clínicas estéticas
// y médicas.
//
//  · Vortex                USD 279/mes  — software con IA.
//  · Ecosistema            USD 529/mes  — software + marketing de performance («Recomendado»).
//  · Implementación        eliminada (Ricardo, 19-oct): no se cobra ni se publica.
//
// No hay compra por la web: todo CTA lleva a /agenda (wizard de 3 pasos que termina
// en una videollamada). Se acabaron los planes y cupones anteriores y los precios de extras (lo de más profesionales o más IA se conversa).
//
// Lo que NO vive acá:
// - `pricing.ts` (catálogo anterior; SETUP_FEE_USD = 0, sin implementación): sigue
//   alimentando los contratos de /firma y /cotizacion; no se migran sin que Ricardo
//   lo decida. OJO: «Vortex» tiene ahí otro precio (279), el del catálogo viejo.
// - `planes2.ts` (modelo anterior): piezas internas de /go y el evento de compra.
//
// [PENDIENTE: Ricardo] permanencia mínima y plan anual (20% / 12 cuotas Mercado
// Pago): mientras no confirme, no se muestran.
// ============================================================================

import type { PlanChannel } from "@/content/pricing";

export type PlanId = "vortex" | "ecosistema";

/** Servicio que la clínica elige en el paso 2 de /agenda (y en `?servicio=`). */
export type ServicioId = "software" | "marketing" | "ambas";

export type Plan = {
  id: PlanId;
  name: string;
  /** US$ por mes. */
  monthlyUsd: number;
  /** Servicio de /agenda que le corresponde a la tarjeta. */
  servicio: ServicioId;
  professionals: number;
  /** Créditos de IA del agente al mes. */
  iaCredits: number;
  channels: readonly PlanChannel[];
  featured: boolean;
  /** Etiqueta sobre la tarjeta. Vacía = sin etiqueta. */
  tag: string;
  /** Una línea para el home. */
  resumen: string;
  /** «Qué incluye» de la tarjeta. */
  features: readonly string[];
};

/** Lo que trae el software. Marketing lo suma, no lo reemplaza. */
const SOFTWARE_FEATURES = [
  "Hasta 10 profesionales",
  "10.000 créditos de IA",
  "Bandeja de WhatsApp, Instagram y Facebook",
  "Agenda y fichas de la clínica",
  "Agente de IA (AURA) que responde y agenda",
  "Automatizaciones y difusiones",
  "Onboarding dedicado con un ejecutivo humano",
] as const;

/** Los cuatro bloques de marketing de performance (Ricardo, 18-oct-2026). */
export const MARKETING_BLOQUES = [
  {
    id: "campanas",
    titulo: "Campañas de performance en Facebook, Instagram y Google",
    texto: "Campañas de performance que traen pacientes a tu clínica, no solo likes. Incluye los creativos: tú entregas los videos y nosotros los editamos.",
  },
  {
    id: "propuesta",
    titulo: "Propuesta de valor",
    texto: "Creamos, optimizamos y perfeccionamos qué ofrece tu clínica y cómo lo comunica.",
  },
  {
    id: "framework",
    titulo: "Framework comercial",
    texto: "Técnicas de venta que aplicamos contigo para que tu equipo las use con sus pacientes y cierre a los que le llegan.",
  },
  {
    id: "reuniones",
    titulo: "Reunión de marketing cada semana",
    texto: "4 reuniones de marketing al mes, 1 por semana, para revisar los resultados y ajustar las campañas contigo.",
  },
] as const;

export const PLANES: readonly Plan[] = [
  {
    id: "vortex",
    name: "Vortex",
    monthlyUsd: 279,
    servicio: "software",
    professionals: 10,
    iaCredits: 10000,
    channels: ["whatsapp", "instagram", "facebook"],
    featured: false,
    tag: "",
    resumen: "Software con IA: agenda, fichas, bandeja unificada y el agente AURA que responde y agenda por ti.",
    features: SOFTWARE_FEATURES,
  },
  {
    id: "ecosistema",
    name: "Ecosistema",
    monthlyUsd: 529,
    servicio: "ambas",
    professionals: 10,
    iaCredits: 10000,
    channels: ["whatsapp", "instagram", "facebook"],
    featured: true,
    tag: "Recomendado",
    resumen: "Marketing de performance que trae pacientes a tu clínica, con un equipo y 4 reuniones al mes contigo, más el software con IA que los atiende.",
    features: ["Todo lo de Vortex", ...MARKETING_BLOQUES.map((b) => b.titulo)],
  },
] as const;

/** Funciones que van destacadas en las tarjetas (ícono + negrita). */
export function destacadoDe(feature: string): "ia" | "marketing" | null {
  if (/^Agente de IA/.test(feature)) return "ia";
  if (MARKETING_BLOQUES.some((b) => b.titulo === feature)) return "marketing";
  return null;
}

/**
 * Clinera Intelligence: el agente IA DENTRO del software (pregúntale por ventas,
 * agenda y pacientes). Los «créditos CI» son su consumo; ya no se atan a un plan.
 */
export const DEFINICION_CI =
  "Clinera Intelligence es el agente IA dentro del software: le preguntas por tus ventas, tu agenda y tus pacientes.";

export const PLAN_DESDE_USD = Math.min(...PLANES.map((p) => p.monthlyUsd));
/** Único plan de software: de él parte el agente IA. */
export const PLAN_IA_DESDE = PLANES[0];

/** Onboarding dedicado con un ejecutivo humano (las dos opciones). El valor de la implementación no se publica. */
export const IMPLEMENTACION_LINEA = "Sin costo de implementación. Onboarding dedicado con un ejecutivo humano en las dos opciones.";
/**
 * Extras del software (Ricardo, 18-oct-2026): se compran dentro de la app cuando al
 * cliente se le queda corto el plan. Valen para Vortex y Ecosistema, porque son parte
 * del software. Ojo: el catálogo viejo (`pricing.ts`, `planes2.ts`) tiene otros extras.
 */
export const EXTRAS = [
  { id: "profesional", titulo: "Profesional extra", precioUsd: 9, unidad: "al mes", detalle: "US$ 9 al mes por cada profesional extra" },
  { id: "conversaciones", titulo: "500 conversaciones extra", precioUsd: 15, unidad: "pago único", detalle: "US$ 15 por 500 conversaciones extra" },
  { id: "creditos", titulo: "5.000 créditos de IA extra", precioUsd: 15, unidad: "pago único", detalle: "US$ 15 por 5.000 créditos de IA extra" },
] as const;

/**
 * Lo que se ahorra el cliente con el Ecosistema (Ricardo, 19-oct-2026): discurso
 * comercial fuerte. Son valores de referencia del mercado, no un dato medido, así que
 * se publican como estimados y sin nombrar competidores.
 */
export const AHORRO = {
  titulo: "Lo que te ahorras",
  items: [
    { id: "agencia", etiqueta: "Agencia de marketing", nota: "sin especialización en clínicas estéticas y médicas", precio: "US$ 600–800/mes" },
    { id: "software", etiqueta: "Software de agendamientos", nota: "", precio: "US$ 100–300/mes" },
    { id: "ia", etiqueta: "Agente IA con créditos", nota: "", precio: "US$ 300–600/mes" },
  ],
  separado: { etiqueta: "Todo por separado", precio: "US$ 1.000–1.700/mes" },
  ecosistema: { etiqueta: "Clinera Ecosistema", precio: `US$ ${PLANES[1].monthlyUsd}/mes`, nota: "todo en un solo lugar" },
  ahorro: "Ahorras desde US$ 470 al mes",
  nota: "Valores de referencia estimados del mercado.",
} as const;

export const NECESIDADES_LINEA = `Extras del software: profesional extra US$ ${EXTRAS[0].precioUsd}/mes · 500 conversaciones extra US$ ${EXTRAS[1].precioUsd} · 5.000 créditos de IA extra US$ ${EXTRAS[2].precioUsd}.`;

/** CTA único: lleva a /agenda, que termina en una videollamada con el equipo. */
export const CTA_VENTAS_LABEL = "Agendar videollamada";
export const CTA_VENTAS_PATH = "/agenda";

/** `/agenda?servicio=ambas` + la query de la visita (utm, gclid, fbclid). */
export function agendaHref(servicio: ServicioId | null, search = ""): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (servicio) params.set("servicio", servicio);
  const q = params.toString();
  return q ? `${CTA_VENTAS_PATH}?${q}` : CTA_VENTAS_PATH;
}

export const PLANES_TITULO = "Elige cómo";
export const PLANES_TITULO_ACENTO = "quieres crecer.";
export const PLANES_BAJADA = "Solo el software, o el software más un equipo de marketing que trae pacientes.";
