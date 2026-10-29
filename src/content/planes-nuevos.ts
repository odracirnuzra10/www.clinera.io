// ============================================================================
// /planes2: modelo de planes del 29-oct-2026 (Ricardo) — Hex · Flux · Vortex · Ecosistema
// ----------------------------------------------------------------------------
// Vista previa sin indexar. /planes (Vortex · Ecosistema, `planes.ts`) NO cambia hasta
// que Ricardo apruebe; al aprobar, /planes pasa a ser esta página. Solo clientes nuevos.
// Dos CTA (Ricardo, 29-oct): «Prueba gratis» (Hex, Flux) → app.clinera.io y
// «Hablar con ventas» (Vortex, Ecosistema) → /agenda?plan=…. Sin link de pago aún.
// Lo que falta decidir va como `[PENDIENTE: …]` visible: no se inventa.
// ============================================================================

export type PlanNuevoId = "hex" | "flux" | "vortex" | "ecosistema";

export type PlanNuevo = {
  id: PlanNuevoId;
  name: string;
  monthlyUsd: number;
  etiqueta: string;
  profesionales: string;
  sucursales: string;
  incluye: readonly string[];
  /** Lo que NO trae, en gris: muestra qué se desbloquea al subir. */
  noIncluye: readonly string[];
  cta: "prueba" | "ventas";
  destacado?: boolean;
};

export const PRUEBA_URL = "https://app.clinera.io";
export const PRUEBA_LABEL = "Prueba gratis";
export const VENTAS_LABEL = "Hablar con ventas";

const BASE = ["Agendamiento", "Presupuestos y planes de tratamiento", "Panel de ventas"] as const;

export const PLANES_NUEVOS: readonly PlanNuevo[] = [
  {
    id: "hex",
    name: "Hex",
    monthlyUsd: 35,
    etiqueta: "Prueba gratis",
    profesionales: "Hasta 2 profesionales",
    sucursales: "1 sucursal",
    incluye: [...BASE, "Clinera Intelligence con 100 créditos"],
    noIncluye: ["WhatsApp", "Agente IA", "Automatizaciones", "Difusiones"],
    cta: "prueba",
  },
  {
    id: "flux",
    name: "Flux",
    monthlyUsd: 55,
    etiqueta: "Prueba gratis con WhatsApp",
    profesionales: "Hasta 5 profesionales",
    sucursales: "Hasta 2 sucursales",
    incluye: ["Todo lo de Hex", "Clinera Intelligence con 200 créditos", "WhatsApp con 50 conversaciones"],
    noIncluye: ["Instagram y Facebook", "Agente IA", "Automatizaciones", "Difusiones"],
    cta: "prueba",
  },
  {
    id: "vortex",
    name: "Vortex",
    monthlyUsd: 279,
    etiqueta: "Con IA que atiende a tus pacientes",
    profesionales: "Hasta 10 profesionales",
    sucursales: "Hasta 3 sucursales",
    incluye: [
      ...BASE,
      "Agente IA",
      "Mensajería WhatsApp, Facebook e Instagram",
      "Automatizaciones",
      "Difusiones",
      "Onboarding dedicado con un ejecutivo humano",
    ],
    noIncluye: [],
    cta: "ventas",
  },
  {
    id: "ecosistema",
    name: "Ecosistema",
    monthlyUsd: 379,
    etiqueta: "Software + marketing",
    profesionales: "Hasta 10 profesionales",
    sucursales: "Hasta 3 sucursales",
    incluye: [
      "Todo lo de Vortex",
      "Campañas en Facebook, Instagram y Google",
      "Propuesta de valor",
      "Framework comercial",
      "Reunión de marketing semanal",
    ],
    noIncluye: [],
    cta: "ventas",
    destacado: true,
  },
];

export const EXTRAS_NUEVOS = [
  { label: "Profesional extra", precio: "US$ 9/mes" },
  { label: "Sucursal extra", precio: "US$ 9/mes" },
  { label: "1.000 conversaciones", precio: "US$ 98" },
  { label: "5.000 conversaciones", precio: "US$ 198" },
] as const;

export const EXTRAS_CREDITOS_PENDIENTE = "[PENDIENTE: confirmar si siguen los extras de 5.000 créditos de IA a US$ 15]";

/** 20 % por 6 meses, solo Vortex y Ecosistema, clientes nuevos que contraten en noviembre (Ricardo, 29-oct). */
export const OFERTA_LANZAMIENTO = {
  porcentaje: 20,
  meses: 6,
  planes: ["vortex", "ecosistema"] as readonly PlanNuevoId[],
  // Todo noviembre, hora de Chile (Ricardo, 29-oct-2026).
  hasta: "2026-11-30T23:59:59-03:00",
  linea: "20% de descuento por 6 meses. Oferta de noviembre.",
} as const;

export function ofertaVigente(ahora: number = Date.now()): boolean {
  return ahora <= new Date(OFERTA_LANZAMIENTO.hasta).getTime();
}

/** Precio con el descuento, con dos decimales (279 → 223,20; 379 → 303,20). */
export function precioOferta(usd: number): number {
  return Math.round(usd * (100 - OFERTA_LANZAMIENTO.porcentaje)) / 100;
}

export const PLANES2_TITULO = "Elige tu plan.";
export const PLANES2_TITULO_ACENTO = "Parte gratis.";
export const PLANES2_BAJADA = "Agenda y WhatsApp para probar. IA y marketing cuando tu clínica esté lista.";

export const PRUEBA_LINEA =
  "La prueba gratis parte con Flux: 7 días o 50 conversaciones de WhatsApp, lo que ocurra primero.";

export const CLIENTE_ACTUAL_LINEA = "¿Ya eres cliente de Clinera? Tu plan actual se mantiene. Escríbenos si quieres revisarlo.";
export const CLIENTE_ACTUAL_PENDIENTE = "[PENDIENTE: URL de soporte o WhatsApp]";

export const COMO_FUNCIONA = [
  { n: "1", titulo: "Crea tu cuenta gratis", texto: "Entras a app.clinera.io y tu prueba parte con Flux." },
  {
    n: "2",
    titulo: "Conecta tu WhatsApp",
    texto: "En Flux respondes por WhatsApp con 50 conversaciones. Hex no trae WhatsApp: solo agenda, presupuestos y panel de ventas.",
  },
  { n: "3", titulo: "Elige tu plan", texto: "A los 7 días o a las 50 conversaciones eliges Hex, Flux, Vortex o Ecosistema." },
] as const;

export const PLANES2_FAQ: readonly { q: string; a: string }[] = [
  {
    q: "¿Qué incluye cada plan?",
    a: "Hex: agendamiento, presupuestos y planes, panel de ventas y Clinera Intelligence con 100 créditos, hasta 2 profesionales y 1 sucursal. Flux: lo de Hex, 200 créditos y WhatsApp con 50 conversaciones, hasta 5 profesionales y 2 sucursales. Vortex: agente IA, WhatsApp, Facebook e Instagram, automatizaciones y difusiones, hasta 10 profesionales y 3 sucursales. Ecosistema: todo Vortex más marketing (campañas, propuesta de valor, framework comercial y reunión semanal).",
  },
  {
    q: "¿Cuánto dura la prueba gratis?",
    a: "7 días o 50 conversaciones de WhatsApp, lo que ocurra primero. Parte con Flux para que conectes tu WhatsApp.",
  },
  {
    q: "¿Qué pasa al llegar a las 50 conversaciones?",
    a: "Termina la prueba y eliges tu plan: Hex, Flux, Vortex o Ecosistema. [PENDIENTE: qué pasa si no eliges: bloqueo o cobro automático]",
  },
  {
    q: "¿Puedo empezar con la prueba y subir después?",
    a: "Sí. Partes gratis y cuando quieras sumar Instagram, Facebook y el agente IA pasas a Vortex o Ecosistema.",
  },
  {
    q: "¿Cómo subo de plan?",
    a: "Desde la prueba o tu cuenta eliges el plan nuevo. Para Vortex o Ecosistema hablas con ventas y te ayudamos con el onboarding.",
  },
  {
    q: "¿Cómo funciona el 20% de descuento?",
    a: "Si eres cliente nuevo y contratas Vortex o Ecosistema en noviembre, pagas 20% menos durante 6 meses (Vortex US$ 223,20 y Ecosistema US$ 303,20). Desde el mes 7 se cobra el precio normal. Hex y Flux no tienen descuento. [PENDIENTE: confirmar si es acumulable]",
  },
  {
    q: "¿Puedo comprar conversaciones extra?",
    a: "Sí, en todos los planes: 1.000 conversaciones por US$ 98 o 5.000 por US$ 198.",
  },
  {
    q: "¿Ya soy cliente, puedo cambiarme?",
    a: "Tu plan y tu precio actuales se mantienen. Si quieres revisarlo, escríbenos. [PENDIENTE: URL de soporte o WhatsApp]",
  },
  {
    q: "¿La prueba pide tarjeta?",
    a: "[PENDIENTE: decisión de Ricardo]",
  },
];

/** Agrega `plan` a la query de la visita (utm, gclid, fbclid viajan con el lead). */
export function conPlan(base: string, plan: PlanNuevoId, search = ""): string {
  const q = new URLSearchParams(search);
  q.set("plan", plan);
  return `${base}?${q.toString()}`;
}
