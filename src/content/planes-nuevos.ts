// ============================================================================
// /planes2: modelo de planes del 29-oct-2026 (Ricardo) — Hex · Flux · Vortex · Ecosistema
// ----------------------------------------------------------------------------
// 4-nov-2026 (Ricardo): todos los planes traen WhatsApp. Hex US$ 35 con 50 conversaciones,
// Flux US$ 55 con 200. Lo usan /planes2 y /contrata; /planes no cambia.
// Vista previa sin indexar. /planes (Vortex · Ecosistema, `planes.ts`) NO cambia hasta
// que Ricardo apruebe; al aprobar, /planes pasa a ser esta página. Solo clientes nuevos.
// Dos CTA (Ricardo, 29-oct): «Prueba gratis» (Hex, Flux) → app.clinera.io y
// «Hablar con ventas» (Vortex, Ecosistema) → /agenda?plan=…. Sin link de pago aún.
// Lo que falta decidir va como `[PENDIENTE: …]` visible: no se inventa.
// ============================================================================

import { PLANES_FAQ } from "@/content/planes-faq";

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
  /** «pago»: Payment Link de Stripe (Hex, desde el 4-nov-2026). «prueba»: app.clinera.io. «ventas»: /agenda. */
  cta: "pago" | "prueba" | "ventas";
  /** Payment Link de Stripe cuando `cta` es «pago». */
  pagoUrl?: string;
  destacado?: boolean;
  /** Logos de canales junto al nombre (Ricardo, 29-oct). Desde el 4-nov todos traen WhatsApp. */
  canales: readonly ("whatsapp" | "facebook" | "instagram")[];
};

export const PRUEBA_URL = "https://app.clinera.io";
// Hex es el plan a vender y el cliente parte en Hex (Ricardo, 4-nov-2026): su CTA principal es el
// Payment Link de Stripe. Enlace pelado: Analytics.tsx le pone client_reference_id al hacer clic.
export const HEX_PAGO_URL = "https://buy.stripe.com/14AdRbdBnfD49wTgwz1441M";
export const HEX_PAGO_LABEL = "Contratar Hex";
export const RECOMENDADO_LABEL = "Recomendado";
export const PRUEBA_LABEL = "Prueba gratis";
export const VENTAS_LABEL = "Hablar con ventas";

const BASE = ["Agendamiento", "Presupuestos y planes de tratamiento", "Panel de ventas"] as const;

export const PLANES_NUEVOS: readonly PlanNuevo[] = [
  {
    id: "hex",
    name: "Hex",
    monthlyUsd: 35,
    etiqueta: "Para partir",
    profesionales: "Hasta 2 profesionales",
    sucursales: "1 sucursal",
    incluye: [...BASE, "Clinera Intelligence con 100 créditos", "WhatsApp con 50 conversaciones"],
    noIncluye: ["Instagram y Facebook", "Agente IA", "Automatizaciones", "Difusiones"],
    cta: "pago",
    pagoUrl: HEX_PAGO_URL,
    canales: ["whatsapp"],
    destacado: true,
  },
  {
    id: "flux",
    name: "Flux",
    monthlyUsd: 55,
    etiqueta: "Más conversaciones",
    profesionales: "Hasta 5 profesionales",
    sucursales: "Hasta 2 sucursales",
    incluye: ["Todo lo de Hex", "Clinera Intelligence con 200 créditos", "WhatsApp con 200 conversaciones"],
    noIncluye: ["Instagram y Facebook", "Agente IA", "Automatizaciones", "Difusiones"],
    cta: "prueba",
    canales: ["whatsapp"],
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
      "Agente IA con 28.000 créditos",
      "5.000 conversaciones",
      "Mensajería WhatsApp, Facebook e Instagram",
      "Automatizaciones",
      "Difusiones",
      "Onboarding dedicado con un ejecutivo humano",
    ],
    noIncluye: [],
    cta: "ventas",
    canales: ["whatsapp", "facebook", "instagram"],
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
      "Reunión de marketing cada semana",
    ],
    noIncluye: [],
    cta: "ventas",
    canales: ["whatsapp", "facebook", "instagram"],
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
// Ricardo, 4-nov-2026: el cliente parte con Hex (antes «Parte gratis» y la prueba de Flux).
export const PLANES2_TITULO_ACENTO = "Parte con Hex.";
export const PLANES2_BAJADA = "Agenda y WhatsApp desde US$ 35 al mes. IA y marketing cuando tu clínica esté lista.";

export const PRUEBA_LINEA =
  "¿Prefieres probar antes? Flux tiene prueba gratis: 7 días o 50 conversaciones de WhatsApp, lo que ocurra primero.";

export const CLIENTE_ACTUAL_LINEA = "¿Ya eres cliente de Clinera? Tu plan actual se mantiene. Escríbenos si quieres revisarlo.";
export const CLIENTE_ACTUAL_PENDIENTE = "[PENDIENTE: URL de soporte o WhatsApp]";

export const COMO_FUNCIONA = [
  { n: "1", titulo: "Contrata Hex", texto: "Pagas US$ 35 al mes con tarjeta y tu clínica parte con Hex." },
  {
    n: "2",
    titulo: "Conecta tu WhatsApp",
    texto: "Todos los planes traen WhatsApp: Hex con 50 conversaciones al mes y Flux con 200.",
  },
  { n: "3", titulo: "Sube cuando crezcas", texto: "Pasa a Flux para más conversaciones, o a Vortex y Ecosistema para el agente IA y marketing." },
] as const;

export const PLANES2_FAQ: readonly { q: string; a: string }[] = [
  {
    q: "¿Qué incluye cada plan?",
    a: "Hex: agendamiento, presupuestos y planes, panel de ventas, Clinera Intelligence con 100 créditos y WhatsApp con 50 conversaciones, hasta 2 profesionales y 1 sucursal. Flux: lo de Hex, 200 créditos y WhatsApp con 200 conversaciones, hasta 5 profesionales y 2 sucursales. Vortex: agente IA con 28.000 créditos de IA, 5.000 conversaciones, WhatsApp, Facebook e Instagram, automatizaciones y difusiones, hasta 10 profesionales y 3 sucursales. Ecosistema: todo Vortex más marketing (campañas, propuesta de valor, framework comercial y reunión semanal).",
  },
  {
    q: "¿Cuánto dura la prueba gratis?",
    a: "La prueba gratis es de Flux: 7 días o 50 conversaciones de WhatsApp, lo que ocurra primero.",
  },
  {
    q: "¿Qué pasa al llegar a las 50 conversaciones?",
    a: "Termina la prueba y eliges tu plan: Hex, Flux, Vortex o Ecosistema. [PENDIENTE: qué pasa si no eliges: bloqueo o cobro automático]",
  },
  {
    q: "¿Con qué plan parto?",
    a: "Con Hex: US$ 35 al mes con WhatsApp y 50 conversaciones. Si necesitas más conversaciones pasas a Flux, y cuando quieras sumar Instagram, Facebook y el agente IA pasas a Vortex o Ecosistema.",
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

/** Quita las notas internas `[PENDIENTE: …]`: /planes no las publica (4-nov-2026). */
export function sinPendientes(texto: string): string {
  return texto.replace(/\s*\[PENDIENTE:[^\]]*\]/g, "").trim();
}

/** FAQ de /planes: la de /planes2 sin notas internas (se cae la que queda vacía) + la de publicidad. */
export function faqPublica(): { q: string; a: string }[] {
  const propias = PLANES2_FAQ.map((f) => ({ q: f.q, a: sinPendientes(f.a) })).filter((f) => f.a.length > 0);
  const publicidad = PLANES_FAQ.filter((f) => /publicidad/i.test(f.q));
  return [...propias, ...publicidad];
}

/** Payment Link con los utm de la visita (Stripe los guarda en la sesión de Checkout). */
export function conUtm(url: string, search = ""): string {
  const visita = new URLSearchParams(search);
  const u = new URL(url);
  for (const [k, v] of visita) if (k.startsWith("utm_") && v) u.searchParams.set(k, v);
  return u.toString();
}
