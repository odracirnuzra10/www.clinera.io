"use client";

const ROWS: Array<{ label: string; human: string; aura: string }> = [
  { label: "Costo mensual", human: "~$950 USD", aura: "$479 USD" },
  { label: "Capacidad IA / mes", human: "500–1.500 conversaciones", aura: "46.000 créditos IA" },
  { label: "Horario", human: "45 h / semana", aura: "24 / 7 / 365" },
  { label: "Vacaciones / licencias", human: "15–20 días al año sin servicio", aura: "Cero" },
  { label: "Conversaciones simultáneas", human: "1–2", aura: "Ilimitadas" },
  { label: "Tiempo de respuesta", human: "5–30 min en horario", aura: "Inmediato" },
  { label: "Capacitación inicial", human: "1–3 meses", aura: "Configurado una vez" },
];

const MOBILE_METRICS: Array<{ label: string; aura: string; human: string }> = [
  { label: "Costo mensual", aura: "$479", human: "~$950 USD recepcionista humana" },
  { label: "Disponibilidad", aura: "24 / 7 / 365", human: "45 h / semana + licencias y vacaciones" },
  { label: "Conversaciones simultáneas", aura: "Ilimitadas", human: "1 a 2 conversaciones a la vez" },
];

export default function RoiSection() {
  return (
    <section
      aria-labelledby="roi-h2"
      style={{
        padding: "96px 24px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7C3AED",
            margin: "0 0 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#7C3AED",
              display: "inline-block",
            }}
          />
          ROI · Humano vs AURA Summit
        </p>
        <h2
          id="roi-h2"
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            margin: "0 0 14px",
            color: "#0A0A0A",
          }}
        >
          $479 vs <span style={{ color: "#7C3AED" }}>$950</span>.
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 0 36px",
            maxWidth: 640,
          }}
        >
          Costo laboral fijo vs. costo de software variable.
        </p>

        <div
          className="roi-mobile-stats"
          style={{
            display: "none",
            gridTemplateColumns: "1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {MOBILE_METRICS.map((m) => (
            <div
              key={m.label}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                padding: "22px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                  marginBottom: 14,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(32px, 9vw, 42px)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  color: "#7C3AED",
                  marginBottom: 16,
                }}
              >
                {m.aura}
              </div>
              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px dashed #E5E7EB",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11.5,
                  color: "#9CA3AF",
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "#6B7280", fontWeight: 600, marginRight: 6 }}>
                  Humano:
                </span>
                {m.human}
              </div>
            </div>
          ))}
        </div>

        <div
          className="roi-table-wrap"
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 12px 32px -16px rgba(11,11,15,.08)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.4fr 1.4fr",
              gap: 16,
              padding: "14px 22px",
              borderBottom: "1px solid #F3F4F6",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9CA3AF",
            }}
            className="roi-row-head"
          >
            <div>Concepto</div>
            <div>Recepcionista humana</div>
            <div style={{ color: "#7C3AED" }}>AURA Summit</div>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className="roi-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1.4fr 1.4fr",
                gap: 16,
                padding: "14px 22px",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid #F3F4F6",
              }}
            >
              <div
                className="roi-cell-label"
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: "#0A0A0A",
                }}
              >
                {row.label}
              </div>
              <div
                className="roi-cell-human"
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                <span className="roi-cell-tag" aria-hidden>Humano</span>
                {row.human}
              </div>
              <div
                className="roi-cell-aura"
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: "#7C3AED",
                  fontWeight: 500,
                }}
              >
                <span className="roi-cell-tag roi-cell-tag-aura" aria-hidden>AURA Summit</span>
                {row.aura}
              </div>
            </div>
          ))}
        </div>

        <div
          className="roi-kpis"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                marginBottom: 10,
              }}
            >
              Ahorro mensual
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1,
                color: "#7C3AED",
                marginBottom: 8,
              }}
            >
              ~$471
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
              USD vs. una recepcionista en Chile
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #C850C0 100%)",
              border: "none",
              color: "#fff",
              borderRadius: 16,
              padding: "20px 22px",
              boxShadow: "0 20px 44px -22px rgba(124,58,237,.45)",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.78)",
                marginBottom: 10,
              }}
            >
              Ahorro anualizado
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              ~$5.652
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                color: "rgba(255,255,255,.85)",
                lineHeight: 1.5,
              }}
            >
              USD / año por clínica
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                marginBottom: 10,
              }}
            >
              Capacidad efectiva
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1,
                color: "#7C3AED",
                marginBottom: 8,
              }}
            >
              ~1,1×
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
              capacidad vs. un humano promedio
            </div>
          </div>
        </div>

        <p
          style={{
            paddingLeft: 16,
            borderLeft: "3px solid #7C3AED",
            fontFamily: "Inter",
            fontSize: "clamp(18px, 2vw, 26px)",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "#0A0A0A",
            lineHeight: 1.35,
            margin: 0,
            maxWidth: 880,
          }}
        >
          &ldquo;Por $479 al mes tienes un{" "}
          <span style={{ color: "#7C3AED" }}>empleado 24/7</span>. Tu próxima recepcionista te
          va a costar mil dólares y va a trabajar 45 horas a la semana.&rdquo;
        </p>
      </div>

      <style jsx>{`
        :global(.roi-cell-tag) {
          display: none;
        }
        @media (max-width: 720px) {
          :global(.roi-table-wrap) {
            display: none !important;
          }
          :global(.roi-mobile-stats) {
            display: grid !important;
          }
          :global(.roi-kpis) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
