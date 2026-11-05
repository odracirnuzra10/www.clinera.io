// ============================================================================
// Catálogo de /planes (y /planes2, /contrata): Flux · Hex · Vortex · Ecosistema
// ----------------------------------------------------------------------------
// 5-nov-2026 (Ricardo): la estructura de /kimi y /home-nuevo pasa a /planes. Flux US$ 79
// (solo WhatsApp, hasta 500 conversaciones, 5 profesionales, 2 sucursales, sin IA,
// «Recomendado»), Hex US$ 179 (WhatsApp + Facebook + Instagram, hasta 2.500
// conversaciones, 10 profesionales, sin IA) y Vortex US$ 279 (las tres redes + agente IA con
// 28.000 créditos, hasta 5.000 conversaciones, 15 profesionales). El Ecosistema no cambia.
// Sin descuento en Flux, Hex y Vortex. Solo clientes nuevos.
// CTA: «Prueba gratis» (Flux) → app.clinera.io y «Hablar con ventas» (Hex, Vortex,
// Ecosistema) → /agenda?plan=…. El Payment Link de Hex a US$ 35 (modelo del 4-nov) ya no se usa.
// Historial: 29-oct Hex 35 · Flux 55 · Vortex 279 · Ecosistema 379; 4-nov todos con WhatsApp
// y Hex como CTA principal al checkout. Lo que falta decidir va como `[PENDIENTE: …]` visible.
// ============================================================================

import { PLANES_FAQ } from "@/content/planes-faq";

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
  /** «pago»: Payment Link de Stripe (sin uso desde el 5-nov-2026). «prueba»: app.clinera.io. «ventas»: /agenda. */
  cta: "pago" | "prueba" | "ventas";
  /** Payment Link de Stripe cuando `cta` es «pago». */
  pagoUrl?: string;
  destacado?: boolean;
  /** Logos de canales junto al nombre (Ricardo, 29-oct). Desde el 4-nov todos traen WhatsApp. */
  canales: readonly ("whatsapp" | "facebook" | "instagram")[];
};

export const PRUEBA_URL = "https://app.clinera.io";
// Payment Link del Hex a US$ 35 (modelo del 4-nov-2026). Desde el 5-nov Hex vale US$ 179 y este
// link cobraría el precio viejo: no se usa en ningún plan hasta que exista uno nuevo en Stripe.
export const HEX_PAGO_URL = "https://buy.stripe.com/14AdRbdBnfD49wTgwz1441M";
export const HEX_PAGO_LABEL = "Contratar Hex";
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
      "Clinera Intelligence",
      "Recordatorios y confirmaciones",
      "Fichas clínicas personalizadas",
      "WhatsApp con 500 conversaciones",
    ],
    noIncluye: ["Instagram y Facebook", "Agente IA", "Automatizaciones", "Difusiones"],
    cta: "prueba",
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
    cta: "ventas",
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
      "Hasta 5.000 conversaciones",
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
export const PLANES2_BAJADA = "Agenda y WhatsApp desde US$ 79 al mes. Redes, IA y marketing cuando tu clínica esté lista.";

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
  { n: "3", titulo: "Sube cuando crezcas", texto: "Vortex agrega el agente IA con 28.000 créditos y 5.000 conversaciones; el Ecosistema suma marketing." },
] as const;

export const PLANES2_FAQ: readonly { q: string; a: string }[] = [
  {
    q: "¿Qué incluye cada plan?",
    a: "Flux: agendamiento, presupuestos y planes, panel de ventas, Clinera Intelligence, recordatorios, fichas clínicas y WhatsApp con hasta 500 conversaciones al mes, hasta 5 profesionales y 2 sucursales; sin agente IA. Hex: lo de Flux más Facebook e Instagram conectados, hasta 2.500 conversaciones y 10 profesionales; sin agente IA. Vortex: agente IA con 28.000 créditos de IA, hasta 5.000 conversaciones, WhatsApp, Facebook e Instagram, automatizaciones y difusiones, hasta 15 profesionales y 3 sucursales. Ecosistema: todo Vortex más marketing (campañas, propuesta de valor, framework comercial y reunión semanal).",
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
    q: "¿Cómo funciona el 20% de descuento?",
    a: "Si eres cliente nuevo y contratas el Ecosistema en noviembre, pagas 20% menos durante 6 meses (US$ 303,20). Desde el mes 7 se cobra el precio normal. Flux, Hex y Vortex no tienen descuento. [PENDIENTE: confirmar si es acumulable]",
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
