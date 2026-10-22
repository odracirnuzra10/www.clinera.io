// ============================================================================
// Oferta de la landing /oferta-clinicas-esteticas (Ricardo, 22-oct-2026)
// ----------------------------------------------------------------------------
// «Llévate el software + marketing por 379»: el Ecosistema a US$ 379/mes SOLO para
// quien entra por esta landing (anuncios). El precio público sigue en `planes.ts`
// (Ecosistema US$ 529) y /planes no cambia. Por eso la landing es noindex y no va al
// sitemap: no compite con /software-estetica ni muestra un precio distinto en Google.
//
// El lead sigue a /agenda con `?oferta=estetica379`. Solo ese valor exacto cambia la
// boleta del paso 1 y le avisa al closer en el CRM (`servicio_interes_label`); cualquier
// otro valor se ignora, así nadie inventa precios por la URL.
// ============================================================================

import { PLANES } from "@/content/planes";

const ECOSISTEMA = PLANES[1];
/** Lo que costaría todo por separado, piso del rango de `AHORRO.separado`. */
const SEPARADO_DESDE_USD = 1000;

export const OFERTA_ESTETICA = {
  id: "estetica379",
  slug: "oferta-clinicas-esteticas",
  leadSource: "oferta_clinicas_esteticas_landing",
  precioUsd: 379,
  precioRegularUsd: ECOSISTEMA.monthlyUsd,
  ahorroDesdeUsd: SEPARADO_DESDE_USD - 379,
  /** Lo que lee el closer en Twenty (servicio de interés). */
  etiquetaCrm: "Ecosistema (software con IA + marketing de performance) · oferta US$ 379/mes, landing clínicas estéticas",
} as const;

export type OfertaId = typeof OFERTA_ESTETICA.id;

/** `?oferta=` de la URL → oferta válida o null. Lista cerrada a propósito. */
export function ofertaDeQuery(valor: string | string[] | undefined | null): OfertaId | null {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v === OFERTA_ESTETICA.id ? OFERTA_ESTETICA.id : null;
}
