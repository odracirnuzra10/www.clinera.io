"use client";

// «Lo que te ahorras con el Ecosistema» (Ricardo, 19-oct-2026). Bloque comercial bajo
// las tarjetas de planes: lo que cuesta armar lo mismo por separado y lo que se ahorra
// el cliente. Lo pinta `PlanesVigentes`, así que sale en el home, /planes y donde se
// reuse. Los números viven en `AHORRO` (planes.ts) y son estimados de mercado.

import { GRAD } from "@/components/brand-v3/Brand";
import { AHORRO } from "@/content/planes";

const MONO = "'JetBrains Mono', ui-monospace, monospace";

export default function AhorroEcosistema() {
  return (
    <div
      data-ahorro
      style={{
        maxWidth: 860,
        margin: "40px auto 0",
        padding: "28px 28px 24px",
        borderRadius: 24,
        background: "#fff",
        border: "1px solid #E9E3F7",
        boxShadow: "0 24px 54px -34px rgba(76,29,149,.45)",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#7C3AED", textAlign: "center" }}>
        {AHORRO.titulo}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginTop: 18 }}>
        {AHORRO.items.map((it) => (
          <div key={it.id} data-ahorro-item={it.id} style={{ padding: "14px 16px", borderRadius: 16, background: "#FAFAFC", border: "1px solid #F0EEF7" }}>
            <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4B5563" }}>{it.etiqueta}</div>
            <div style={{ fontFamily: "Inter", fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", color: "#0A0A0A", marginTop: 2 }}>{it.precio}</div>
            <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#6B7280", marginTop: 4 }}>{it.nota}</div>
          </div>
        ))}
      </div>
      <p style={{ margin: "18px 0 0", textAlign: "center", fontFamily: "Inter", fontSize: 15.5, color: "#374151" }}>{AHORRO.total}</p>
      <p
        data-ahorro-conclusion
        style={{
          margin: "8px 0 0",
          textAlign: "center",
          fontFamily: "Inter",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          background: GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {AHORRO.conclusion}
      </p>
      <p style={{ margin: "10px 0 0", textAlign: "center", fontFamily: MONO, fontSize: 10.5, letterSpacing: ".06em", color: "#9CA3AF" }}>{AHORRO.nota}</p>
    </div>
  );
}
