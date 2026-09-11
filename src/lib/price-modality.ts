import {
  DEFAULT_PRICE_MODALITY,
  isPriceModality,
  type PriceModality,
} from "@/content/pricing";

/** Query `?precios=usd|mxn` — la misma en todas las superficies. */
export const PRICE_MODALITY_QUERY = "precios";

/** Persistencia entre páginas. No es la fuente de verdad del catálogo. */
export const PRICE_MODALITY_STORAGE_KEY = "clinera-precios";

export function parsePriceModality(raw: unknown): PriceModality | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  if (isPriceModality(value)) return value;
  if (value === "dolar" || value === "dólar" || value === "dollar") return "usd";
  if (
    value === "mx" ||
    value === "mexico" ||
    value === "méxico" ||
    value === "mexicanos" ||
    value === "peso-mexicano"
  )
    return "mxn";
  return null;
}

export function priceModalityOrDefault(raw: unknown): PriceModality {
  return parsePriceModality(raw) ?? DEFAULT_PRICE_MODALITY;
}
