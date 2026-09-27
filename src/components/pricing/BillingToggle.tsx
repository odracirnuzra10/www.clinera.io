"use client";

import { ANNUAL_DISCOUNT_PERCENT, type Billing } from "@/content/pricing";
import { GRAD } from "@/components/brand-v3/Brand";

/**
 * Anual primero y por defecto. El mensual va después, con menos ancho.
 * El semestral no se publica en la web.
 */
export default function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (next: Billing) => void;
}) {
  const annual = billing === "annual";

  return (
    <div
      role="radiogroup"
      aria-label="Frecuencia de facturación"
      className="billing-period-toggle"
      data-billing={billing}
      style={{
        display: "inline-grid",
        gridTemplateColumns: "1.45fr 1fr",
        alignItems: "stretch",
        gap: 4,
        background: "#F6F6F7",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        padding: 4,
        maxWidth: 520,
        width: "100%",
      }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={annual}
        className="billing-toggle-option"
        data-billing-option="annual"
        onClick={() => onChange("annual")}
        style={{
          appearance: "none",
          cursor: "pointer",
          border: 0,
          borderRadius: 11,
          minHeight: 58,
          padding: "10px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 2,
          textAlign: "left",
          background: annual ? GRAD : "#fff",
          color: annual ? "#fff" : "#6D28D9",
          boxShadow: annual
            ? "0 8px 20px -6px rgba(124,58,237,.62)"
            : "inset 0 0 0 1.5px rgba(124,58,237,.45)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Anual
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              padding: "3px 7px",
              borderRadius: 999,
              background: annual ? "rgba(255,255,255,.22)" : "rgba(124,58,237,.12)",
              color: annual ? "#fff" : "#6D28D9",
              whiteSpace: "nowrap",
            }}
          >
            {ANNUAL_DISCOUNT_PERCENT}% OFF
          </span>
        </span>
        <small style={{ color: annual ? "#F5E9FF" : "#7C3AED", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: ".04em" }}>
          12 cuotas a precio de contado
        </small>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!annual}
        className="billing-toggle-option"
        data-billing-option="monthly"
        onClick={() => onChange("monthly")}
        style={{
          appearance: "none",
          cursor: "pointer",
          border: 0,
          borderRadius: 11,
          minHeight: 58,
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 2,
          textAlign: "left",
          background: annual ? "transparent" : "#7C3AED",
          color: annual ? "#4B5563" : "#fff",
          boxShadow: annual ? "none" : "0 6px 16px -6px rgba(124,58,237,.55)",
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em" }}>
          Mensual
        </span>
        <small style={{ color: annual ? "#777E89" : "#DDD6FE", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: ".04em" }}>
          Mes a mes
        </small>
      </button>
    </div>
  );
}
