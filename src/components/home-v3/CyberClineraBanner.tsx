import Link from "next/link";

const GRAD = "linear-gradient(90deg, #009FE3 0%, #7C3AED 55%, #D946EF 100%)";

/**
 * TEMPORAL — promo Cyber Clinera (oct 2026). Se retira borrando este archivo
 * y su uso en HomeV3.tsx. El catálogo (`pricing.ts`, contratos) NO cambia:
 * el costo de implementación $0 se concede en la venta, no aquí.
 */
export default function CyberClineraBanner() {
  return (
    <section
      aria-labelledby="cyber-clinera-title"
      data-promo="cyber-clinera"
      style={{ padding: "8px 80px 28px", background: "#fff" }}
    >
      <div
        className="cyber-clinera-card"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
          borderRadius: 20,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 28px 64px -20px rgba(124,58,237,.3)",
        }}
      >
        <div
          aria-hidden
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }}
        />
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 10px",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
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
              fontSize: "clamp(22px, 2.6vw, 32px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.12,
              color: "#fff",
              margin: 0,
            }}
          >
            Aprovecha Cyber Clinera y contrata con costo de implementación $0
          </h2>
        </div>
        <Link
          href="/agenda"
          style={{
            background: "#fff",
            color: "#0E1014",
            padding: "13px 22px",
            borderRadius: 999,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 14.5,
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
          .cyber-clinera-card { padding: 24px 22px !important; }
        }
      `}</style>
    </section>
  );
}
