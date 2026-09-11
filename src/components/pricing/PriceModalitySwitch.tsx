"use client";

import { PRICE_MODALITIES, PRICE_MODALITY } from "@/content/pricing";
import { usePriceModality } from "@/components/pricing/PriceModalityProvider";

type Props = {
  /** Compacto para heroes o pies de tarjeta. */
  size?: "default" | "compact";
  align?: "center" | "start";
  className?: string;
};

export default function PriceModalitySwitch({
  size = "default",
  align = "center",
  className,
}: Props) {
  const { modality, meta, setModality } = usePriceModality();
  const compact = size === "compact";

  return (
    <div
      className={["home-billing-toggle", className].filter(Boolean).join(" ")}
      data-price-modality-switch
      data-price-modality={modality}
      data-price-currency="USD"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: compact ? 8 : 10,
      }}
    >
      <div
        role="radiogroup"
        aria-label="Modalidad de precios"
        style={{
          display: "inline-flex",
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 999,
          padding: 4,
          gap: 4,
          boxShadow: "0 8px 28px -18px rgba(15,23,42,.35)",
        }}
      >
        {PRICE_MODALITIES.map((id) => {
          const option = PRICE_MODALITY[id];
          const selected = id === modality;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              className="billing-toggle-option"
              data-price-modality-option={id}
              onClick={() => setModality(id)}
              style={{
                appearance: "none",
                border: 0,
                cursor: "pointer",
                borderRadius: 999,
                padding: compact ? "8px 14px" : "9px 18px",
                minWidth: compact ? 0 : 148,
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: compact ? 13 : 14,
                fontWeight: selected ? 700 : 600,
                letterSpacing: "-0.01em",
                color: selected ? "#fff" : "#374151",
                background: selected
                  ? "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)"
                  : "transparent",
                boxShadow: selected ? "0 8px 18px -10px rgba(124,58,237,.7)" : "none",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p
        data-price-iva
        aria-live="polite"
        style={{
          margin: 0,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: compact ? 10.5 : 11.5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#6B7280",
          textAlign: align === "center" ? "center" : "left",
        }}
      >
        {meta.ivaNoteLong}
      </p>
    </div>
  );
}
