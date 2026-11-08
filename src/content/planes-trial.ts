// ============================================================================
// Planes con prueba gratis: Flux · Hex · Xcale (Ricardo, 7-nov-2026)
// ----------------------------------------------------------------------------
// Fuente de /planes y de la sección de planes del home. El cliente se registra gratis,
// usa Clinera 7 días y elige el plan después, dentro de la plataforma. Los mismos números
// están escritos a mano en `public/kimi-gratis/index.html` (la landing de /contrata, HTML
// estático que no importa TS): si cambia un precio o un tope, se cambia en los dos.
// Xcale es el ex Vortex. /planes2 y /promo siguen con sus catálogos (planes-nuevos.ts, planes.ts).
// ============================================================================

export type PlanTrialId = "flux" | "hex" | "xcale";

export type PlanTrial = {
  id: PlanTrialId;
  name: string;
  monthlyUsd: number;
  etiqueta: string;
  incluye: readonly string[];
  canales: readonly ("whatsapp" | "facebook" | "instagram")[];
  destacado?: boolean;
  /** Payment Link de Stripe, solo Xcale (cobra US$ 149). */
  pagoUrl?: string;
};

export const XCALE_PAGO_URL = "https://buy.stripe.com/8x29AV7cZ9eG9wTgwz1441O";

export const PLANES_TRIAL: readonly PlanTrial[] = [
  {
    id: "flux",
    name: "Flux",
    monthlyUsd: 49,
    etiqueta: "Para partir",
    incluye: ["2 profesionales", "1 sucursal", "WhatsApp", "300 conversaciones", "Clinera Intelligence"],
    canales: ["whatsapp"],
  },
  {
    id: "hex",
    name: "Hex",
    monthlyUsd: 129,
    etiqueta: "Todas tus redes",
    incluye: ["5 profesionales", "2 sucursales", "WhatsApp, Instagram y Facebook", "600 conversaciones", "Clinera Intelligence"],
    canales: ["whatsapp", "facebook", "instagram"],
  },
  {
    id: "xcale",
    name: "Xcale",
    monthlyUsd: 149,
    etiqueta: "Para clínicas que crecen",
    incluye: [
      "10 profesionales",
      "3 sucursales",
      "WhatsApp, Instagram y Facebook",
      "2000 conversaciones",
      "Clinera Intelligence",
      "Agente IA",
      "Onboarding humano",
    ],
    canales: ["whatsapp", "facebook", "instagram"],
    destacado: true,
    pagoUrl: XCALE_PAGO_URL,
  },
];

/** Ricardo, 8-nov-2026: en la tarjeta de Xcale, junto a «Agente IA», los logos de los modelos. */
export const AGENTE_IA = "Agente IA";
export const MODELOS_IA = [
  { id: "anthropic", label: "Anthropic", src: "/brand/ia/anthropic.svg" },
  { id: "gemini", label: "Gemini", src: "/brand/ia/gemini-color.svg" },
  { id: "zai", label: "Z.ai", src: "/brand/ia/zai.svg" },
  { id: "openai", label: "OpenAI", src: "/brand/ia/openai.svg" },
] as const;

export const ADICIONALES_TRIAL = [
  { precio: "US$ 25", label: "5000 créditos IA" },
  { precio: "US$ 9", label: "Profesional extra" },
  { precio: "US$ 9", label: "Sucursal extra" },
  { precio: "US$ 48", label: "1000 conversaciones" },
] as const;

export const TRIAL_EYEBROW = "Demo de 7 días";
export const TRIAL_TITULO = "Regístrate gratis y elige tu plan después";
export const TRIAL_BAJADA = "Usas Clinera 7 días. Después, dentro de la plataforma, eliges el plan. Sin costo de implementación.";
export const RECOMENDADO = "Recomendado";
export const ADICIONALES_NOTA = "Los adicionales se eligen después, dentro de la plataforma.";
export const XCALE_PAGO_LABEL = "o paga Xcale ahora";

export const PLANES_TRIAL_FAQ: readonly { q: string; a: string }[] = [
  {
    q: "¿Cómo funciona la prueba gratis?",
    a: "Te registras gratis y usas Clinera 7 días. Después, dentro de la plataforma, eliges Flux, Hex o Xcale.",
  },
  {
    q: "¿Qué incluye cada plan?",
    a: "Flux (US$ 49/mes): 2 profesionales, 1 sucursal, WhatsApp, 300 conversaciones y Clinera Intelligence. Hex (US$ 129/mes): 5 profesionales, 2 sucursales, WhatsApp, Instagram y Facebook, 600 conversaciones y Clinera Intelligence. Xcale (US$ 149/mes): 10 profesionales, 3 sucursales, WhatsApp, Instagram y Facebook, 2000 conversaciones, Clinera Intelligence, agente IA y onboarding humano.",
  },
  {
    q: "¿Puedo sumar más después?",
    a: "Sí, dentro de la plataforma: 5000 créditos de IA por US$ 25, profesional extra US$ 9, sucursal extra US$ 9 y 1000 conversaciones por US$ 48.",
  },
  {
    q: "¿Hay costo de implementación?",
    a: "No. Y si necesitas ayuda, escríbenos por WhatsApp con «Solicita asistencia».",
  },
  {
    q: "¿Clinera se conecta con mi agenda actual?",
    a: "No se integra con agendas de terceros como Reservo, AgendaPro, Medilink o Dentalink. Clinera tiene su propia agenda, fichas y pagos, y nuestro equipo migra tus datos.",
  },
];

/** Desde cuánto se publica, para títulos y JSON-LD. */
export const PLANES_TRIAL_DESDE = Math.min(...PLANES_TRIAL.map((p) => p.monthlyUsd));
