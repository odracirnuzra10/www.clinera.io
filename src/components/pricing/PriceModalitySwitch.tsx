"use client";

import { PRICE_MODALITIES, PRICE_MODALITY, type PriceModality } from "@/content/pricing";
import { usePriceModality } from "@/components/pricing/PriceModalityProvider";

type Props = {
  /** Compacto para heroes o pies de tarjeta. El control es de banderas en los dos. */
  size?: "default" | "compact";
  align?: "center" | "start";
  className?: string;
};

function FlagUS() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true" focusable="false">
      <rect width="16" height="11" fill="#B22234" />
      <g fill="#fff">
        <rect y="1.57" width="16" height="1.57" />
        <rect y="4.71" width="16" height="1.57" />
        <rect y="7.86" width="16" height="1.57" />
      </g>
      <rect width="7" height="5.9" fill="#3C3B6E" />
    </svg>
  );
}

function FlagMX() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true" focusable="false">
      <rect width="5.34" height="11" fill="#006847" />
      <rect x="5.34" width="5.33" height="11" fill="#fff" />
      <rect x="10.67" width="5.33" height="11" fill="#CE1126" />
    </svg>
  );
}

const FLAGS: Record<PriceModality, typeof FlagUS> = {
  usd: FlagUS,
  mxn: FlagMX,
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
      className={["home-billing-toggle", "price-modality-flags", className].filter(Boolean).join(" ")}
      data-price-modality-switch
      data-price-modality={modality}
      data-price-currency={meta.currency}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 4,
        width: "max-content",
      }}
    >
      <div
        role="radiogroup"
        aria-label="Modalidad de precios"
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 999,
          padding: 2,
          gap: 2,
        }}
      >
        {PRICE_MODALITIES.map((id) => {
          const option = PRICE_MODALITY[id];
          const selected = id === modality;
          const Flag = FLAGS[id];
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.label}
              className="billing-toggle-option"
              data-price-modality-option={id}
              onClick={() => setModality(id)}
              title={option.label}
              style={{
                appearance: "none",
                border: 0,
                cursor: "pointer",
                borderRadius: 999,
                padding: compact ? "3px 7px" : "4px 8px",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: compact ? 11 : 12,
                fontWeight: selected ? 700 : 600,
                letterSpacing: "-0.01em",
                color: selected ? "#111827" : "#6B7280",
                background: selected ? "#F3F4F6" : "transparent",
                boxShadow: selected ? "inset 0 0 0 1px #E5E7EB" : "none",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  borderRadius: 2,
                  overflow: "hidden",
                  lineHeight: 0,
                  boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
                }}
              >
                <Flag />
              </span>
              {option.currency}
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
          fontSize: 9,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#9CA3AF",
          textAlign: align === "center" ? "center" : "left",
        }}
      >
        {meta.ivaNoteLong}
      </p>
    </div>
  );
}
