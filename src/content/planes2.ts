// Modelo de planes nuevo (Ricardo, 16-oct-2026): Go! / Flux / Vortex.
// Lo consumen /planes2 y /go, ambas en revisión interna (noindex). NO reemplaza
// a `pricing.ts`: Vortex/Atlas/Summit viejos siguen vigentes en /planes y en los
// contratos de /firma. Cuando Ricardo apruebe, estos números se pasan a
// `pricing.ts` y se retira este archivo.
//
// Regla del handoff: no se inventan cifras. Todo dato que falta es un marcador
// `[PENDIENTE: …]` visible en pantalla. `PENDIENTES` los lista para la entrega.

import type { PlanChannel } from "@/content/pricing";

export type Plan2Id = "go" | "flux" | "vortex";

/** Marcador visible. Se imprime tal cual en la página de revisión. */
export const pendiente = (texto: string) => `[PENDIENTE: ${texto}]`;

export const CHANNELS_2: readonly PlanChannel[] = ["whatsapp", "facebook", "instagram"];

export type Plan2 = {
  id: Plan2Id;
  name: string;
  /** US$ por mes. Catálogo decidido el 16-oct-2026. */
  monthlyUsd: number;
  branches: number;
  professionals: number;
  /** Etiqueta sobre la tarjeta. */
  tag: string;
  tagline: string;
  intelligence: string;
  /** Vortex es el único con AURA. */
  aura: boolean;
  auraNote: string;
  /** Link de pago. `null` = falta (se muestra el marcador, no un link roto). */
  checkoutUrl: string | null;
  checkoutPending: string;
  ctaLabel: string;
  /** Funciones base de la tarjeta. Lo abierto lleva marcador [PENDIENTE]. */
  features: string[];
  /** Qué NO incluye: se tacha para que se vea qué se desbloquea al subir. */
  excluded: string[];
};

export const PLANS_2: readonly Plan2[] = [
  {
    id: "go",
    name: "Clinera Go!",
    monthlyUsd: 17,
    branches: 1,
    professionals: 1,
    tag: "Empieza aquí",
    tagline: "Tu agenda, tus fichas y tus mensajes en un solo lugar.",
    intelligence: "100 créditos IA",
    aura: false,
    auraNote: "",
    checkoutUrl: "https://buy.stripe.com/bJeaEZbtf8aC5gD3JN1441G",
    checkoutPending: "",
    ctaLabel: "Contrata",
    features: [
      "Agenda y fichas clínicas",
      "Bandeja de WhatsApp, Facebook e Instagram",
      "100 créditos IA",
    ],
    excluded: ["AURA · IA que responde a tus pacientes"],
  },
  {
    id: "flux",
    name: "Clinera Flux",
    monthlyUsd: 87,
    branches: 2,
    professionals: 5,
    tag: "Para crecer",
    tagline: "Más sucursales, más profesionales y más créditos de Intelligence.",
    intelligence: "200 créditos IA",
    aura: false,
    auraNote: "",
    checkoutUrl: "https://buy.stripe.com/cNibJ37cZ2QifVh3JN1441H",
    checkoutPending: "",
    ctaLabel: "Contratar Flux",
    features: [
      "Todo lo de Go!",
      "200 créditos IA",
      "Automatizaciones",
      "Difusiones",
    ],
    excluded: ["AURA · IA que responde a tus pacientes"],
  },
  {
    id: "vortex",
    name: "Clinera Vortex",
    monthlyUsd: 279,
    branches: 3,
    professionals: 10,
    tag: "Con IA que atiende a tus pacientes",
    tagline: "AURA responde a tus pacientes y agenda sola.",
    intelligence: "28.000 créditos IA",
    aura: true,
    auraNote: "AURA · IA que responde a tus pacientes",
    // Vortex nuevo (Ricardo, 16-oct). El link …471441A es del Vortex viejo: no se reutiliza.
    checkoutUrl: "https://buy.stripe.com/cNi00ldBnduW24r8031441I",
    checkoutPending: "",
    ctaLabel: "Contratar Vortex",
    features: [
      "Todo lo de Flux",
      "AURA · IA que responde a tus pacientes y agenda sola",
      "28.000 créditos IA",
    ],
    excluded: [],
  },
] as const;

/** Sucursal extra, US$ por mes (Ricardo, 16-oct-2026). Profesional extra y recarga: `pricing.ts`. */
export const EXTRA_BRANCH_USD = 15;

export const GO = PLANS_2[0];

/** Texto del botón de compra en /go (hero, final y flotante). */
export const GO_LANDING_CTA = "Inicia ahora";
export const FLUX = PLANS_2[1];
export const VORTEX_2 = PLANS_2[2];

export const VORTEX_DEMO_URL = "https://www.clinera.io/agenda?plan=vortex";

export const DEFINICION_INTELLIGENCE =
  "Clinera Intelligence es el agente interno de tu equipo: responde preguntas sobre tus ventas, tu agenda y tu negocio. No conversa con pacientes.";
export const DEFINICION_AURA =
  "AURA es el agente de IA que responde los mensajes de tus pacientes y agenda sus horas. Solo está en Vortex.";

/** Los planes nuevos no cobran implementación (Ricardo, 16-oct-2026). `SETUP_FEE_USD` de pricing.ts sigue rigiendo los planes viejos. */
export const IMPLEMENTACION_USD = 0;

export const SOLO_NUEVOS = "Estos planes son solo para clientes nuevos.";

/** Ruta del éxito de Stripe Checkout de Go!. */
export const GO_EXITO_PATH = "/go/exito";
export const GO_ANALYTICS = {
  contentName: "Clinera Go!",
  contentId: "clinera_go",
  valueUsd: GO.monthlyUsd,
  currency: "USD",
  leadSource: "go_landing",
} as const;

export const REGISTRO_URL_PENDIENTE = pendiente(
  "URL y mecanismo exacto del registro en app.clinera.io (con el email del checkout precargado)",
);
/** Ruta de la reunión con ventas. Se le suma la query de la visita (UTM, click ids). */
export const AGENDA_PATH = "/agenda";

/** Cómo funciona (/planes2): en Go! y Flux no se conecta AURA. */
export const COMO_FUNCIONA_2 = [
  { n: "01", t: "Eliges tu plan", d: "Empiezas por Go! y subes cuando tu clínica lo pida." },
  {
    n: "02",
    t: "Conectas tus canales",
    d: "WhatsApp, Facebook e Instagram entran a la misma bandeja. AURA se conecta solo en Vortex.",
  },
  { n: "03", t: "Operas con tu equipo", d: "Agenda, fichas y Clinera Intelligence desde el primer día." },
] as const;

export const GO_PASOS = [
  { n: "01", t: "Pagas USD 17", d: "Checkout seguro con Stripe." },
  { n: "02", t: "Creas tu cuenta", d: "Con el mismo correo del pago." },
  { n: "03", t: "Conectas tu WhatsApp", d: "Y tu bandeja queda lista." },
] as const;

export const GO_INCLUYE = [
  "1 profesional",
  "1 sucursal",
  "Agenda",
  "Fichas clínicas",
  "Bandeja de WhatsApp, Facebook e Instagram",
  "100 créditos IA",
  "Clinera Intelligence: el agente interno que te responde sobre tus ventas y tu agenda",
] as const;

// Copy de FAQ de /planes2. Las respuestas que dependen de una decisión abierta
// llevan el marcador en vez de afirmar algo que Ricardo no confirmó.
export const PLANES2_FAQ = [
  {
    q: "¿Qué es Clinera Intelligence?",
    a: DEFINICION_INTELLIGENCE,
  },
  {
    q: "¿Qué es AURA y en qué plan está?",
    a: `${DEFINICION_AURA} En Go! y Flux no se conecta.`,
  },
  {
    q: "¿Puedo empezar con Go! y subir después?",
    a: "Sí. Partes con Go! (1 profesional, 1 sucursal) y subes a Flux o a Vortex cuando tu clínica crezca. Nuestro equipo de ventas te contactará para ayudarte a elegir el momento.",
  },
  {
    q: "¿Ya soy cliente, puedo cambiarme a estos planes?",
    a: "No. Estos planes son solo para clientes nuevos. Tu plan actual se mantiene. Escríbenos si quieres revisarlo.",
  },
  {
    q: "¿Cuántos créditos incluye cada plan?",
    a: "Go! incluye 100 créditos IA, Flux 200 y Vortex 28.000. Vortex además trae a AURA, el agente que responde a tus pacientes.",
  },
  {
    q: "¿Cuánto cuesta la implementación?",
    a: "Nada. Ningún plan tiene costo de implementación: pagas solo la mensualidad.",
  },
  {
    q: "¿Hay permanencia?",
    a: "No. Puedes cancelar tu plan cuando quieras.",
  },
  {
    q: "¿Hay plan anual y cuotas con Mercado Pago?",
    a: `${pendiente("confirmar con Ricardo: ¿el 20% OFF anual y las 12 cuotas aplican a los 3 planes?")}`,
  },
  {
    q: "¿Qué canales incluyen?",
    a: "Los tres planes incluyen WhatsApp, Facebook e Instagram en una sola bandeja.",
  },
  {
    q: "¿Qué pasa si se me acaban los créditos?",
    a: "Te avisamos antes de que se agoten. Puedes sumar una recarga de USD 15 por 5.000 créditos.",
  },
  {
    q: "¿Puedo sumar más profesionales o sucursales?",
    a: "Sí. Cada profesional extra cuesta USD 9 al mes y cada sucursal extra USD 15 al mes.",
  },
  {
    q: "¿Se integra con mi software de agenda actual?",
    a: "No. Clinera opera sobre su propia agenda, sus fichas clínicas y su módulo de pagos. En el onboarding migramos tus datos.",
  },
  {
    q: "¿Qué pasó con las llamadas con IA (CAMILA) y la fiscalización (LIA)?",
    a: pendiente("confirmar con Ricardo si quedan como add-on"),
  },
] as const;

export const GO_FAQ = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Puedes cancelar tu plan cuando quieras, sin permanencia.",
  },
  {
    q: "¿Puedo subir de plan?",
    a: "Sí. Cuando tu clínica crezca puedes pasar a Flux (2 sucursales, 5 profesionales) o a Vortex (3 sucursales, 10 profesionales y AURA). Nuestro equipo de ventas te contacta para ayudarte.",
  },
  {
    q: "¿Necesito cambiar mi número de WhatsApp?",
    a: pendiente("confirmar con Mauricio López si se conecta el número actual de la clínica"),
  },
  {
    q: "¿Qué pasa si tengo más profesionales?",
    a: "Go! incluye 1 profesional. Si tu equipo es más grande, Flux incluye 5 y Vortex 10.",
  },
] as const;

/** Todo lo que sigue abierto, para la entrega (sección 5 del handoff). */
export const PENDIENTES = [
  "Plan anual 20% OFF y 12 cuotas Mercado Pago: ¿aplican a los 3 planes?",
  "CAMILA (llamadas con IA) y LIA (fiscalización): ¿quedan como add-on?",
  "Ruta definitiva de la landing (/go es sugerida).",
  "URL y mecanismo del registro en app.clinera.io con el email del checkout precargado.",
  "success_url / cancel_url configurados en Stripe Checkout de Go!.",
  "Cuenta marcada con plan GO y bloqueada a sus límites (Mauricio López).",
  "Alta del lead/cliente en Twenty con plan GO (confirmar integración con López).",
] as const;
