// ============================================================================
// Catálogo de planes: Flux · Hex · Vortex · Ecosistema
// ----------------------------------------------------------------------------
// /planes publica Flux · Hex · Vortex (sin Ecosistema, 5-nov-2026); /planes2 conserva
// el Ecosistema. Flux US$ 79 (solo WhatsApp, 500 conversaciones, sin IA, recomendado),
// Hex US$ 179 (tres redes, 2.500, sin IA) y Vortex US$ 279 (tres redes + agente IA,
// 5.000 conversaciones, 28.000 créditos, Clinera Intelligence). Los tres van al
// Payment Link de `checkout.ts`, sin código de promoción. El 50% × 3 meses vive en
// /contrata. Lo que falta decidir va como `[PENDIENTE: …]` y solo lo ve /planes2.
// ============================================================================

import { CHECKOUT_URL } from "./checkout";

export type PlanNuevoId = "hex" | "flux" | "vortex" | "ecosistema";

export type PlanNuevo = {
  id: PlanNuevoId;
  name: string;
  monthlyUsd: number;
  etiqueta: string;
  profesionales: string;
  /** Opcional: Hex no publica tope de sucursales (Ricardo, 5-nov-2026). */
  sucursales?: string;
  incluye: readonly string[];
  /** Lo que NO trae, en gris: muestra qué se desbloquea al subir. */
  noIncluye: readonly string[];
  /** «pago»: Payment Link de Stripe. «prueba»: app.clinera.io. «ventas»: /agenda. */
  cta: "pago" | "prueba" | "ventas";
  /** Payment Link de Stripe cuando `cta` es «pago». */
  pagoUrl?: string;
  destacado?: boolean;
  /** Logos de canales junto al nombre (Ricardo, 29-oct). Desde el 4-nov todos traen WhatsApp. */
  canales: readonly ("whatsapp" | "facebook" | "instagram")[];
};

export const PRUEBA_URL = "https://app.clinera.io";
export const RECOMENDADO_LABEL = "Recomendado";
export const PRUEBA_LABEL = "Prueba gratis";
export const VENTAS_LABEL = "Hablar con ventas";

const BASE = ["Agendamiento", "Presupuestos y planes de tratamiento", "Panel de ventas"] as const;

export const PLANES_NUEVOS: readonly PlanNuevo[] = [
  {
    id: "flux",
    name: "Flux",
    monthlyUsd: 79,
    etiqueta: "Para partir",
    profesionales: "Hasta 5 profesionales",
    sucursales: "Hasta 2 sucursales",
    incluye: [
      ...BASE,
      "Recordatorios y confirmaciones",
      "Fichas clínicas personalizadas",
      "WhatsApp con 500 conversaciones",
    ],
    noIncluye: ["Instagram y Facebook", "Agente IA", "Automatizaciones", "Difusiones"],
    cta: "pago",
    pagoUrl: CHECKOUT_URL.flux,
    canales: ["whatsapp"],
    destacado: true,
  },
  {
    id: "hex",
    name: "Hex",
    monthlyUsd: 179,
    etiqueta: "Todas tus redes",
    profesionales: "Hasta 10 profesionales",
    incluye: ["Todo lo de Flux", "WhatsApp, Facebook e Instagram con 2.500 conversaciones"],
    noIncluye: ["Agente IA", "Automatizaciones", "Difusiones"],
    cta: "pago",
    pagoUrl: CHECKOUT_URL.hex,
    canales: ["whatsapp", "facebook", "instagram"],
  },
  {
    id: "vortex",
    name: "Vortex",
    monthlyUsd: 279,
    etiqueta: "Con IA que atiende a tus pacientes",
    profesionales: "Hasta 15 profesionales",
    sucursales: "Hasta 3 sucursales",
    incluye: [
      ...BASE,
      "Agente IA con 28.000 créditos",
      "Clinera Intelligence",
      "Hasta 5.000 conversaciones",
      "Mensajería WhatsApp, Facebook e Instagram",
      "Automatizaciones",
      "Difusiones",
      "Onboarding dedicado con un ejecutivo humano",
    ],
    noIncluye: [],
    cta: "pago",
    pagoUrl: CHECKOUT_URL.vortex,
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

/** /planes no publica el Ecosistema (5-nov-2026). /planes2 sí. */
export const PLANES_PUBLICOS = PLANES_NUEVOS.filter((p) => p.id !== "ecosistema");

export const EXTRAS_NUEVOS = [
  { label: "Profesional extra", precio: "US$ 9/mes" },
  { label: "Sucursal extra", precio: "US$ 9/mes" },
  { label: "1.000 conversaciones", precio: "US$ 98" },
  { label: "5.000 conversaciones", precio: "US$ 198" },
] as const;

export const EXTRAS_CREDITOS_PENDIENTE = "[PENDIENTE: confirmar si siguen los extras de 5.000 créditos de IA a US$ 15]";

/** 20 % por 6 meses para clientes nuevos que contraten en noviembre (Ricardo, 29-oct). Desde el
 * 5-nov-2026 solo queda en el Ecosistema (que no cambió): Flux, Hex y Vortex van sin descuento. */
export const OFERTA_LANZAMIENTO = {
  porcentaje: 20,
  meses: 6,
  planes: ["ecosistema"] as readonly PlanNuevoId[],
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
// Ricardo, 5-nov-2026: el cliente parte con Flux (el 4-nov era Hex a US$ 35).
export const PLANES2_TITULO_ACENTO = "Parte con Flux.";
export const PLANES2_BAJADA = "Agenda y WhatsApp desde US$ 79 al mes. Redes e IA cuando tu clínica esté lista.";

export const PRUEBA_LINEA =
  "¿Prefieres probar antes? Flux tiene prueba gratis: 7 días o 50 conversaciones de WhatsApp, lo que ocurra primero.";

export const CLIENTE_ACTUAL_LINEA = "¿Ya eres cliente de Clinera? Tu plan actual se mantiene. Escríbenos si quieres revisarlo.";
export const CLIENTE_ACTUAL_PENDIENTE = "[PENDIENTE: URL de soporte o WhatsApp]";

export const COMO_FUNCIONA = [
  { n: "1", titulo: "Parte con Flux", texto: "Agenda online y tu WhatsApp conectado por US$ 79 al mes, con hasta 500 conversaciones." },
  {
    n: "2",
    titulo: "Suma tus redes",
    texto: "Con Hex se conectan también Facebook e Instagram y llegas a 2.500 conversaciones al mes.",
  },
  { n: "3", titulo: "Sube cuando crezcas", texto: "Vortex agrega el agente IA con 28.000 créditos y hasta 5.000 conversaciones." },
] as const;

export const PLANES2_FAQ: readonly { q: string; a: string }[] = [
  {
    q: "¿Qué incluye cada plan?",
    a: "Flux: agendamiento, presupuestos y planes de tratamiento, panel de ventas, recordatorios y confirmaciones, fichas clínicas personalizadas y WhatsApp con hasta 500 conversaciones al mes, hasta 5 profesionales y 2 sucursales; sin IA. Hex: todo lo de Flux más Facebook e Instagram conectados, hasta 2.500 conversaciones al mes y hasta 10 profesionales; sin IA. Vortex: todo lo de Hex más el agente IA con 28.000 créditos de IA, Clinera Intelligence, hasta 5.000 conversaciones, automatizaciones y difusiones, hasta 15 profesionales y 3 sucursales. Ecosistema: todo Vortex más marketing (campañas, propuesta de valor, framework comercial y reunión semanal).",
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
    a: "Con Flux: US$ 79 al mes con agenda y WhatsApp, hasta 500 conversaciones. Cuando quieras sumar Facebook e Instagram pasas a Hex, y para el agente IA, a Vortex o al Ecosistema.",
  },
  {
    q: "¿Cómo subo de plan?",
    a: "Desde la prueba o tu cuenta eliges el plan nuevo. Para Hex, Vortex o Ecosistema hablas con ventas y te ayudamos con el onboarding.",
  },
  {
    q: "¿Hay descuentos?",
    a: "Sí, para clientes nuevos. Flux, Hex y Vortex: 50% durante los primeros 3 meses si contratas desde clinera.io/contrata (Flux US$ 39,50, Hex US$ 89,50 y Vortex US$ 139,50 al mes); desde el mes 4, precio normal. Ecosistema: 20% durante 6 meses si lo contratas en noviembre (US$ 303,20); desde el mes 7, precio normal. [PENDIENTE: confirmar si son acumulables]",
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

/** FAQ de /planes: sin Ecosistema, sin notas internas y sin la de publicidad (es del marketing). */
export const PLANES_FAQ_PUBLICA: readonly { q: string; a: string }[] = [
  { q: "¿Qué incluye cada plan?", a: "Flux: agendamiento, presupuestos y planes de tratamiento, panel de ventas, recordatorios y confirmaciones, fichas clínicas personalizadas y WhatsApp con hasta 500 conversaciones al mes, hasta 5 profesionales y 2 sucursales; sin IA. Hex: todo lo de Flux más Facebook e Instagram conectados, hasta 2.500 conversaciones al mes y hasta 10 profesionales; sin IA. Vortex: todo lo de Hex más el agente IA con 28.000 créditos de IA, Clinera Intelligence, hasta 5.000 conversaciones, automatizaciones y difusiones, hasta 15 profesionales y 3 sucursales." },
  { q: "¿Cuánto dura la prueba gratis?", a: "La prueba gratis es de Flux: 7 días o 50 conversaciones de WhatsApp, lo que ocurra primero." },
  { q: "¿Con qué plan parto?", a: "Con Flux: US$ 79 al mes con agenda y WhatsApp, hasta 500 conversaciones. Cuando quieras sumar Facebook e Instagram pasas a Hex, y para el agente IA, a Vortex." },
  { q: "¿Hay descuento?", a: "Sí. Si eres cliente nuevo y contratas Flux, Hex o Vortex desde clinera.io/contrata, pagas 50% durante los primeros 3 meses: Flux US$ 39,50, Hex US$ 89,50 y Vortex US$ 139,50 al mes. Desde el mes 4 pagas el precio normal. Los botones de esta página cobran el precio normal." },
  { q: "¿Cómo subo de plan?", a: "Desde tu cuenta eliges el plan nuevo. Si tienes dudas, hablas con ventas y te ayudamos con el onboarding." },
  { q: "¿Puedo comprar conversaciones extra?", a: "Sí, en todos los planes: 1.000 conversaciones por US$ 98 o 5.000 por US$ 198." },
  { q: "¿Ya soy cliente, puedo cambiarme?", a: "Tu plan y tu precio actuales se mantienen. Si quieres revisarlo, escríbenos." },
];
export function faqPublica() { return [...PLANES_FAQ_PUBLICA]; }

/** Payment Link con los utm de la visita (Stripe los guarda en la sesión de Checkout). */
export function conUtm(url: string, search = ""): string {
  const visita = new URLSearchParams(search);
  const u = new URL(url);
  for (const [k, v] of visita) if (k.startsWith("utm_") && v) u.searchParams.set(k, v);
  return u.toString();
}
