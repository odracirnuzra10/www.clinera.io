"use client";

import type { CSSProperties } from "react";
import { usePriceModality } from "@/components/pricing/PriceModalityProvider";

type Props = {
  /** `long` = "USD · no incluye IVA". `short` = "No incluye IVA". */
  variant?: "long" | "short";
  className?: string;
  style?: CSSProperties;
};

export default function PriceIvaNote({ variant = "long", className, style }: Props) {
  const { meta, modality } = usePriceModality();
  return (
    <span
      data-price-iva
      data-price-modality={modality}
      data-price-currency={meta.currency}
      className={className}
      style={style}
    >
      {variant === "short" ? meta.ivaNote : meta.ivaNoteLong}
    </span>
  );
}
