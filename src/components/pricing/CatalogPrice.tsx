"use client";

import type { CSSProperties } from "react";
import { formatCatalogPrice, formatCatalogPriceWithCode } from "@/content/pricing";
import { usePriceModality } from "@/components/pricing/PriceModalityProvider";

type Props = {
  usd: number;
  /** `symbol` = `$279`. `code` = `USD 279`. */
  variant?: "symbol" | "code";
  className?: string;
  style?: CSSProperties;
};

/** Precio de catálogo en la moneda del switch. El `usd` nunca cambia. */
export default function CatalogPrice({
  usd,
  variant = "symbol",
  className,
  style,
}: Props) {
  const { modality, meta } = usePriceModality();
  const text =
    variant === "code" ? formatCatalogPriceWithCode(usd, modality) : formatCatalogPrice(usd, modality);
  return (
    <span
      data-catalog-price
      data-catalog-usd={usd}
      data-price-modality={modality}
      data-price-currency={meta.currency}
      className={className}
      style={style}
    >
      {text}
    </span>
  );
}
