// Modelo de planes nuevo (Ricardo, 17-oct-2026): Go! / Flux / Ultra.
// Lo consumen /planes2 y /go, ambas en revisión interna (noindex). Reemplaza al
// modelo Go!/Flux/Vortex del 16-oct. NO reemplaza a `pricing.ts`: Vortex/Atlas/
// Summit viejos siguen vigentes en /planes y en los contratos de /firma. Cuando
// Ricardo apruebe, estos números se pasan a `pricing.ts` y se retira este archivo.
//
// Regla del handoff: no se inventan cifras. Todo dato que falta es un marcador
// `[PENDIENTE: …]` visible en pantalla. `PENDIENTES` los lista para la entrega.

import type { PlanChannel } from "@/content/pricing";

export type Plan2Id = "go" | "flux" | "ultra";

/** Marcador visible. Se imprime tal cual en la página de revisión. */
export const pendiente = (texto: string) => `[PENDIENTE: ${texto}]`;

export const CHANNELS_2: readonly PlanChannel[] = ["whatsapp", "facebook", "instagram"];

export type Plan2 = {
  id: Plan2Id;
  name: string;
  /** US$ por mes. Catálogo decidido el 17-oct-2026. */
  monthlyUsd: number;
  /** Profesionales incluidos. Es lo que manda: las sucursales no limitan en Flux ni Ultra. */
  professionals: number;
  /** `null` = ilimitadas. */
  branches: number | null;
  /** Conversaciones por mes. El límite siempre se expresa en conversaciones, nunca en "mensajes". */
  conversations: number;
  /** Agendamientos por mes. `null` = ilimitados. */
  agendamientos: number | null;
  credits: number;
  /** Etiqueta sobre la tarjeta. */
  tag: string;
  tagline: string;
  intelligence: string;
  /** Ultra es el único con AURA. */
  aura: boolean;
  auraNote: string;
  /** Onboarding dedicado: solo Ultra. Es obligatorio, sin él la IA responde mal. */
  onboarding: boolean;
  /** Modelos de IA que se muestran en la tarjeta (solo Ultra). */
  models: readonly string[];
  /** Link de pago. `null` = falta (se muestra el marcador, no un link roto). */
  checkoutUrl: string | null;
  checkoutPending: string;
  ctaLabel: string;
  /** Funciones base de la tarjeta. Lo abierto lleva marcador [PENDIENTE]. */
  features: string[];
  /** Qué NO incluye: se tacha para que se vea qué se desbloquea al subir. */
  excluded: string[];
};

const n = (v: number) => v.toLocaleString("es-CL");

export const PLANS_2: readonly Plan2[] = [
  {
    id: "go",
    name: "Clinera Go!",
    monthlyUsd: 17,
    professionals: 1,
    branches: 1,
    conversations: 50,
    agendamientos: 100,
    credits: 100,
    tag: "Empieza aquí",
    tagline: "Tu agenda, tus fichas y tus mensajes en un solo lugar.",
    intelligence: "100 créditos IA",
    aura: false,
    auraNote: "",
    onboarding: false,
    models: [],
    checkoutUrl: "https://buy.stripe.com/bJeaEZbtf8aC5gD3JN1441G",
    checkoutPending: "",
    ctaLabel: "Contrata",
    features: [
      "Hasta 50 conversaciones al mes",
      "Hasta 100 agendamientos",
      "Agenda y fichas clínicas",
      "Bandeja de WhatsApp, Facebook e Instagram",
      "100 créditos IA",
    ],
    excluded: ["Automatizaciones", "Difusiones", "AURA · IA que responde a tus pacientes", "Onboarding dedicado"],
  },
  {
    id: "flux",
    name: "Clinera Flux",
    monthlyUsd: 89,
    professionals: 3,
    branches: null,
    conversations: 500,
    agendamientos: null,
    credits: 200,
    tag: "Para crecer",
    tagline: "Más profesionales, sucursales ilimitadas, automatizaciones y difusiones.",
    intelligence: "200 créditos IA",
    aura: false,
    auraNote: "",
    onboarding: false,
    models: [],
    // El link …441H es el del Flux de USD 87 (modelo del 16-oct): no se reutiliza.
    checkoutUrl: null,
    checkoutPending: "link de Stripe de Flux (USD 89/mes)",
    ctaLabel: "Contratar Flux",
    features: [
      "Todo lo de Go!",
      "Hasta 500 conversaciones al mes",
      "Agendamientos ilimitados",
      "200 créditos IA",
      "Automatizaciones",
      "Difusiones",
    ],
    excluded: ["AURA · IA que responde a tus pacientes", "Onboarding dedicado"],
  },
  {
    id: "ultra",
    name: "Clinera Ultra",
    monthlyUsd: 179,
    professionals: 10,
    branches: null,
    conversations: 5000,
    agendamientos: null,
    credits: 10000,
    tag: "Con IA que atiende a tus pacientes",
    tagline: "AURA responde a tus pacientes y agenda sola.",
    intelligence: "10.000 créditos IA",
    aura: true,
    auraNote: "AURA · IA que responde a tus pacientes",
    onboarding: true,
    models: ["Anthropic", "Z.ai", "Gemini (Google)", "OpenAI"],
    // El link …441I es el del Vortex de USD 279 (modelo del 16-oct): no se reutiliza.
    checkoutUrl: null,
    checkoutPending: "link de Stripe de Ultra (USD 179/mes)",
    ctaLabel: "Contratar Ultra",
    features: [
      "Todo lo de Flux",
      "Hasta 5.000 conversaciones al mes",
      "10.000 créditos IA",
      "AURA · IA que responde a tus pacientes y agenda sola",
      "Onboarding dedicado",
    ],
    excluded: [],
  },
] as const;

export const GO = PLANS_2[0];

/**
 * Precio mensual de Go! en Stripe (USD 17). Lo usa `/api/go/checkout` para crear el
 * pago con los datos del wizard ya cargados. No es secreto. Si el precio cambia en
 * Stripe, este id cambia con él.
 */
export const GO_STRIPE_PRICE_ID = "price_1URG7IRRk94z5RuMPZsqzP5e";
export const FLUX = PLANS_2[1];
export const ULTRA = PLANS_2[2];

/** Texto del CTA de /go cuando alguien ya está en el wizard (pantalla de oferta). */
export const GO_LANDING_CTA = "Sí, quiero activarla";

/** Reunión de ventas de Ultra. La query de la visita se le suma al navegar. */
export const ULTRA_DEMO_URL = "https://www.clinera.io/agenda?plan=ultra";

/** Extras que se compran dentro de la app (Ricardo, 17-oct-2026). */
export const EXTRA_PROFESSIONAL_USD = 9;
export const EXTRA_CONVERSATIONS_USD = 15;
export const EXTRA_CONVERSATIONS_PACK = 100;
export const EXTRA_CREDITS_USD = 15;
export const EXTRA_CREDITS_PACK = 5000;

export const DEFINICION_INTELLIGENCE =
  "Clinera Intelligence es el agente interno de tu equipo: responde preguntas sobre tus ventas, tu agenda y tu negocio. No conversa con pacientes.";
export const DEFINICION_AURA =
  "AURA es el agente de IA que responde los mensajes de tus pacientes y agenda sus horas. Solo está en Ultra.";

/** Los planes nuevos no cobran implementación (Ricardo, 16-oct-2026). `SETUP_FEE_USD` de pricing.ts sigue rigiendo los planes viejos. */
export const IMPLEMENTACION_USD = 0;

export const SOLO_NUEVOS = "Estos planes son solo para clientes nuevos.";
export const YA_ERES_CLIENTE = "¿Ya eres cliente de Clinera? Tu plan actual se mantiene.";
export const SOPORTE_LINK_PENDIENTE = pendiente("link de soporte");
export const LOGOS_MODELOS_PENDIENTE = pendiente("confirmar uso de logos de Anthropic, Z.ai, Gemini y OpenAI");

/** Ruta del éxito de Stripe Checkout de Go!. */
export const GO_EXITO_PATH = "/go/exito";
export const GO_ANALYTICS = {
  contentName: "Clinera Go!",
  contentId: "clinera_go",
  valueUsd: GO.monthlyUsd,
  currency: "USD",
  leadSource: "go_landing",
} as const;

/**
 * Activación tras el pago (Ricardo, 16-oct): el cliente escribe a soporte por WhatsApp y
 * soporte le deja andando el WhatsApp de la clínica. Sin registro autoservicio por ahora.
 */
export const SOPORTE_WHATSAPP = {
  phone: "56985581524",
  display: "+56 9 8558 1524",
  message: "Hola, acabo de contratar Clinera Go! y quiero activar el WhatsApp de mi clínica.",
} as const;

export const SOPORTE_WHATSAPP_URL = `https://wa.me/${SOPORTE_WHATSAPP.phone}?text=${encodeURIComponent(SOPORTE_WHATSAPP.message)}`;

export const GO_ACTIVACION_PASOS = [
  "Toca el botón y escribe a soporte por WhatsApp.",
  "Soporte te pide el número de WhatsApp de tu clínica y el nombre de tus profesionales.",
  "Te dejamos andando el agendamiento. Tú empiezas a agendar.",
] as const;
/** Ruta de la reunión con ventas. Se le suma la query de la visita (UTM, click ids). */
export const AGENDA_PATH = "/agenda";

/** Wizard de /go (Ricardo, 17-oct): textos de las tres pantallas. */
export const GO_WIZARD = {
  ofertaTitulo: "Potencia tu clínica por solo $17 dólares.",
  ofertaTexto: `Incluye ${GO.conversations} conversaciones en WhatsApp, Facebook e Instagram y ${GO.agendamientos} agendamientos. Prueba el poder de Clinera ahora.`,
  ofertaPregunta: "¿Te interesa avanzar?",
  datosTitulo: "Cuéntanos de tu clínica.",
  datosTexto: "Con estos datos te dejamos lista la cuenta.",
  pagoTitulo: "Último paso.",
  resumen: `Plan Go! · USD ${GO.monthlyUsd}/mes · ${GO.professionals} profesional · ${GO.conversations} conversaciones · ${GO.agendamientos} agendamientos`,
  pagoCta: `Pagar USD ${GO.monthlyUsd}`,
} as const;

/** Prueba social bajo el wizard de /go (frase dictada por Ricardo, 17-oct). */
export const GO_PRUEBA_SOCIAL = "Clinera ya lo usan más de 1.000 clínicas en Chile";

/** Tamaño de la clínica en profesionales (pantalla 2 del wizard). */
export const GO_TAMANOS = [
  { id: "1", label: "1" },
  { id: "2_3", label: "2–3" },
  { id: "4_10", label: "4–10" },
  { id: "10_plus", label: "Más de 10" },
] as const;

/** Cómo funciona (/planes2): en Go! y Flux no se conecta AURA. */
export const COMO_FUNCIONA_2 = [
  { n: "01", t: "Eliges tu plan", d: "Empiezas por Go! y subes cuando tu clínica lo pida." },
  {
    n: "02",
    t: "Conectas tus canales",
    d: "WhatsApp, Facebook e Instagram entran a la misma bandeja. AURA se conecta solo en Ultra.",
  },
  { n: "03", t: "Operas con tu equipo", d: "Agenda, fichas y Clinera Intelligence desde el primer día." },
] as const;

export const GO_INCLUYE = [
  `${GO.professionals} profesional`,
  `${GO.branches} sucursal`,
  `Hasta ${GO.conversations} conversaciones al mes`,
  `Hasta ${GO.agendamientos} agendamientos`,
  "Agenda y fichas clínicas",
  "Bandeja de WhatsApp, Facebook e Instagram",
  `${GO.credits} créditos IA`,
] as const;

const usdn = (v: number) => `USD ${v}`;

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
    a: `Sí. Partes con Go! (${GO.professionals} profesional, ${GO.branches} sucursal) y subes a Flux o a Ultra cuando tu clínica crezca. Nuestro equipo de ventas te contactará para ayudarte a elegir el momento.`,
  },
  {
    q: "¿Ya soy cliente, puedo cambiarme a estos planes?",
    a: `No. Estos planes son solo para clientes nuevos. Tu plan actual se mantiene. Escríbenos si quieres revisarlo: ${SOPORTE_LINK_PENDIENTE}`,
  },
  {
    q: "¿Cuántos créditos incluye cada plan?",
    a: `Go! incluye ${GO.credits} créditos IA, Flux ${FLUX.credits} y Ultra ${n(ULTRA.credits)}. Ultra además trae a AURA, el agente que responde a tus pacientes.`,
  },
  {
    q: "¿Cuántas conversaciones incluye cada plan?",
    a: `Go! hasta ${GO.conversations} al mes, Flux hasta ${FLUX.conversations} y Ultra hasta ${n(ULTRA.conversations)}. Contamos conversaciones, no mensajes sueltos.`,
  },
  {
    q: "¿Qué pasa si supero mi límite de conversaciones?",
    a: `Puedes sumar ${EXTRA_CONVERSATIONS_PACK} conversaciones extra por ${usdn(EXTRA_CONVERSATIONS_USD)} desde dentro de la app.`,
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
    a: `Te avisamos antes de que se agoten. Puedes sumar una recarga de ${usdn(EXTRA_CREDITS_USD)} por ${n(EXTRA_CREDITS_PACK)} créditos desde dentro de la app.`,
  },
  {
    q: "¿Puedo sumar más profesionales o sucursales?",
    a: `Las sucursales son ilimitadas en Flux y Ultra. Lo que manda es la cantidad de profesionales: Go! incluye ${GO.professionals} y para más hay que pasar a Flux (${FLUX.professionals}) o Ultra (${ULTRA.professionals}). En Flux y Ultra cada profesional extra cuesta ${usdn(EXTRA_PROFESSIONAL_USD)} al mes.`,
  },
  {
    q: "¿Por qué Ultra incluye onboarding dedicado?",
    a: "Porque AURA necesita que la dejemos configurada con tus tratamientos, tus horarios y tus reglas. Sin ese onboarding la IA responde mal, por eso es obligatorio en Ultra.",
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

// FAQ de /go (la ve quien viene de un anuncio). Se arma desde `PLANS_2` y las
// constantes de add-ons para que un cambio de precio no deje la FAQ desfasada.
// Sin marcadores [PENDIENTE]: lo que no está decidido no se pregunta acá.
export const GO_FAQ = [
  {
    q: "¿Cuáles son los planes?",
    a: `Hay tres. Clinera Go! cuesta ${usdn(GO.monthlyUsd)} al mes (${GO.professionals} profesional y ${GO.branches} sucursal). Clinera Flux, ${usdn(FLUX.monthlyUsd)} al mes (${FLUX.professionals} profesionales y sucursales ilimitadas). Clinera Ultra, ${usdn(ULTRA.monthlyUsd)} al mes (${ULTRA.professionals} profesionales y sucursales ilimitadas). Los tres incluyen WhatsApp, Facebook e Instagram en una sola bandeja.`,
  },
  {
    q: "¿Qué incluye Clinera Go!?",
    a: `Agenda, fichas clínicas, bandeja de WhatsApp, Facebook e Instagram, hasta ${GO.conversations} conversaciones y ${GO.agendamientos} agendamientos al mes, ${GO.credits} créditos IA y Clinera Intelligence, el agente interno que te responde sobre tus ventas y tu agenda. Es para ${GO.professionals} profesional y ${GO.branches} sucursal. No incluye AURA.`,
  },
  {
    q: "¿Qué incluye Clinera Flux?",
    a: `Todo lo de Go!, más hasta ${FLUX.conversations} conversaciones al mes, agendamientos ilimitados, ${FLUX.credits} créditos IA, automatizaciones y difusiones. Es para ${FLUX.professionals} profesionales y sucursales ilimitadas. No incluye AURA.`,
  },
  {
    q: "¿Qué incluye Clinera Ultra?",
    a: `Todo lo de Flux, más hasta ${n(ULTRA.conversations)} conversaciones al mes, ${n(ULTRA.credits)} créditos IA, onboarding dedicado y AURA, el agente de IA que responde los mensajes de tus pacientes y agenda sus horas. Es para ${ULTRA.professionals} profesionales y sucursales ilimitadas.`,
  },
  {
    q: "¿Qué es Clinera Intelligence?",
    a: DEFINICION_INTELLIGENCE,
  },
  {
    q: "¿Qué es AURA y en qué plan está?",
    a: `${DEFINICION_AURA} En Go! y Flux no se conecta.`,
  },
  {
    q: "¿Qué son los créditos IA?",
    a: `Es lo que consumen los agentes de IA al trabajar. Go! trae ${GO.credits}, Flux ${FLUX.credits} y Ultra ${n(ULTRA.credits)}. Si se te acaban, puedes sumar una recarga de ${n(EXTRA_CREDITS_PACK)} créditos por ${usdn(EXTRA_CREDITS_USD)}.`,
  },
  {
    q: "¿Hay costo de implementación o permanencia?",
    a: "No. Ningún plan tiene costo de implementación ni permanencia. Pagas solo la mensualidad.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Puedes cancelar tu plan cuando quieras, sin permanencia.",
  },
  {
    q: "¿Puedo empezar con Go! y subir de plan después?",
    a: "Sí. Partes con Go! y subes a Flux o a Ultra cuando tu clínica crezca. Nuestro equipo de ventas te contacta para ayudarte a elegir el momento.",
  },
  {
    q: "¿Qué pasa si tengo más profesionales o necesito más conversaciones?",
    a: `En Go! el límite de ${GO.professionals} profesional es fijo: para más, pasa a Flux. En Flux y Ultra puedes sumar un profesional extra por ${usdn(EXTRA_PROFESSIONAL_USD)} al mes. Las conversaciones extra cuestan ${usdn(EXTRA_CONVERSATIONS_USD)} por cada ${EXTRA_CONVERSATIONS_PACK}.`,
  },
] as const;

/** Todo lo que sigue abierto, para la entrega (sección 4 del handoff). */
export const PENDIENTES = [
  "Link de Stripe de Flux (USD 89/mes) y de Ultra (USD 179/mes). Los links viejos (87 y 279) no se reutilizan.",
  "Plan anual 20% OFF y 12 cuotas Mercado Pago: ¿aplican a los 3 planes?",
  "Implementación, permanencia y plan anual por plan: confirmar para Flux y Ultra (hoy se publica sin costo y sin permanencia por decisión del 16-oct).",
  "Logos de Anthropic, Z.ai, Gemini (Google) y OpenAI en la tarjeta de Ultra: confirmar uso (hoy van en texto).",
  "Link de soporte para «¿Ya eres cliente de Clinera?».",
  "CAMILA (llamadas con IA) y LIA (fiscalización): ¿quedan como add-on?",
  "Llave de Stripe con escritura en Customers y Checkout Sessions: sin ella el pago de /go no precarga nombre ni celular y cae al Payment Link (solo correo).",
  "TRIAL (Go! pagó) y CLIENTE (Flux/Ultra) como etapas del CRM Twenty (clientes.oacg.cl): hay que crear la opción en el campo stage y adaptar n8n (Wizard y Suscripción).",
  "Registro autoservicio en app.clinera.io: hoy la activación la hace soporte por WhatsApp (+56 9 8558 1524).",
  "Cuenta marcada con plan GO y bloqueada a sus límites (Mauricio López).",
  "Alta del lead/cliente en Twenty con plan GO/FLUX/ULTRA y mapeo del valor de `planClinera` en W1 para Flux (89) y Ultra (179) (n8n, con López).",
  "Especialidad «Dental» en la lista del wizard de /go: sigue fuera, como en /agenda, hasta que ventas lo valide.",
] as const;
