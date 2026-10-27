// ============================================================================
// /super-promo (Ricardo, 23-oct-2026): destino de la difusión de WhatsApp y del correo
// a los leads MQL/SQL. «Software + Marketing a US$ 279/mes por 6 meses», hasta el
// 31-oct-2026. Es el Ecosistema con descuento: el precio público sigue en `planes.ts`
// (US$ 529) y /planes no cambia. Por eso la página es noindex y no va al sitemap.
// Sin link de pago: se cierra por WhatsApp con el equipo comercial.
// ============================================================================

import { AHORRO, PLANES } from "@/content/planes";

const ECOSISTEMA = PLANES[1];

export const SUPER_PROMO = {
  slug: "super-promo",
  precioUsd: 279,
  meses: 6,
  precioRegularUsd: ECOSISTEMA.precioNormalUsd ?? ECOSISTEMA.monthlyUsd,
  /** Piso del rango «por separado» (US$ 1.000) menos el precio de la promo. */
  ahorroDesdeUsd: 1000 - 279,
  /** Fin de la promo: 31-oct-2026 23:59:59 hora de Chile (GMT−3 en octubre). */
  terminaIso: "2026-10-31T23:59:59-03:00",
  terminaTexto: "31 de octubre",
} as const;

/** Las tres partidas que se pagarían por separado (estimados de mercado, sin nombrar competidores). */
export const SUPER_PROMO_SEPARADO = AHORRO.items;
export const SUPER_PROMO_SEPARADO_TOTAL = AHORRO.separado.precio;

export const SUPER_PROMO_INCLUYE = [
  "Una IA que responde y agenda a tus pacientes 24/7",
  "WhatsApp, Instagram y Facebook en un solo lugar",
  "Agenda online, fichas clínicas y cobros",
  "Campañas de marketing hechas por nosotros, con creativos",
  "Una reunión de marketing cada semana",
  "Onboarding con un ejecutivo humano, sin costo de implementación",
] as const;

export const SUPER_PROMO_WHATSAPP_URL = `https://wa.me/56985581524?text=${encodeURIComponent(
  `Hola, vi la super promo de Clinera y estoy interesado en avanzar con Software + Marketing a US$ ${SUPER_PROMO.precioUsd} al mes.`,
)}`;
