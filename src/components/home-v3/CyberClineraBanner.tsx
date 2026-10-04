"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Vigente hasta el 7 de octubre de 2026 inclusive (hora de Chile, UTC-3).
const CYBER_HASTA = Date.parse("2026-10-08T00:00:00-03:00");

const GRAD = "linear-gradient(90deg, #009FE3 0%, #7C3AED 55%, #D946EF 100%)";

/**
 * TEMPORAL — promo Cyber Clinera, hasta el 7 de octubre de 2026 (se oculta sola). Se retira borrando este archivo
 * y su uso en HomeV3.tsx. El catálogo (`pricing.ts`, contratos) NO cambia:
 * el costo de implementación $0 se concede en la venta, no aquí.
 */
export default function CyberClineraBanner() {
  // Se oculta solo al vencer, aunque la página esté en caché.
  const [vigente, setVigente] = useState(true);
  useEffect(() => {
    setVigente(Date.now() < CYBER_HASTA);
  }, []);
  if (!vigente) return null;
  return (
    <section
      aria-labelledby="cyber-clinera-title"
      data-promo="cyber-clinera"
      style={{ padding: "12px 80px 36px", background: "#fff" }}
    >
      <div
        className="cyber-clinera-card"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
          borderRadius: 24,
          border: "1px solid rgba(217,70,239,.45)",
          padding: "44px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 0 4px rgba(124,58,237,.14), 0 36px 80px -18px rgba(124,58,237,.65)",
        }}
      >
        <div
          aria-hidden
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: GRAD }}
        />
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 10px",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E9D5FF",
            }}
          >
            Cyber Clinera
          </p>
          <h2
            id="cyber-clinera-title"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(28px, 3.8vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 1.12,
              color: "#fff",
              margin: 0,
            }}
          >
            Aprovecha Cyber Clinera hasta el 7 de octubre y contrata con costo de implementación $0
          </h2>
        </div>
        <Link
          href="/agenda"
          style={{
            background: GRAD,
            color: "#fff",
            padding: "18px 32px",
            borderRadius: 999,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 17,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Agenda tu demo →
        </Link>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .cyber-clinera-card { padding: 30px 24px !important; }
        }
      `}</style>
    </section>
  );
}
