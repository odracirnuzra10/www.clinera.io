"use client";

import Link from "next/link";

export default function CorporativoBanner() {
  return (
    <section
      aria-labelledby="corp-h2"
      style={{
        padding: "64px 24px",
        background: "#fff",
      }}
    >
      <div
        className="corp-card"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
          borderRadius: 20,
          padding: "40px 44px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 36,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 28px 64px -20px rgba(124,58,237,.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, #009FE3 0%, #7C3AED 50%, #C850C0 100%)",
          }}
          aria-hidden="true"
        />
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.6)",
              marginBottom: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#D946EF",
                display: "inline-block",
              }}
              aria-hidden="true"
            />
            Corporativo · plan personalizado
          </div>
          <h2
            id="corp-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.025em",
              margin: "0 0 12px",
              lineHeight: 1.08,
            }}
          >
            Cadenas, hospitales y redes médicas
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 15,
              color: "rgba(255,255,255,.78)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 500,
            }}
          >
            Todo de Advanced + onboarding white-glove + SLA personalizado + integraciones a
            medida + soporte dedicado + facturación adaptada. Capacidad a medida según tu volumen.
          </p>
        </div>
        <div
          className="corp-right"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.55)",
              }}
            >
              Desde
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 44,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              $1.500
            </span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>USD/mes</span>
          </div>
          <Link
            href="/hablar-con-ventas"
            data-plan="corporativo"
            data-plan-value="1500"
            data-plan-name="Corporativo from empleado-digital"
            style={{
              background: "#fff",
              color: "#0E1014",
              padding: "13px 26px",
              borderRadius: 999,
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 14.5,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Hablar con ventas →
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 760px) {
          :global(.corp-card) {
            grid-template-columns: 1fr !important;
            padding: 28px !important;
            gap: 22px !important;
          }
          :global(.corp-right) {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
