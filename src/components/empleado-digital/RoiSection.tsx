"use client";

const ROWS: Array<{ label: string; human: string; aura: string }> = [
  { label: "Costo mensual", human: "~$950 USD", aura: "$359 USD" },
  { label: "Atenciones / mes", human: "500–1.500", aura: "~2.400" },
  { label: "Horario", human: "45 h / semana", aura: "24 / 7 / 365" },
  { label: "Vacaciones / licencias", human: "15–20 días al año sin servicio", aura: "Cero" },
  { label: "Atenciones simultáneas", human: "1–2", aura: "Ilimitadas" },
  { label: "Tiempo de respuesta", human: "5–30 min en horario", aura: "Inmediato" },
  { label: "Capacitación inicial", human: "1–3 meses", aura: "Configurado una vez" },
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
          ROI · Humano vs AURA Advanced
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
          $359 vs <span style={{ color: "#7C3AED" }}>$950</span>.
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
            <div style={{ color: "#7C3AED" }}>AURA Advanced</div>
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
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                {row.human}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: "#7C3AED",
                  fontWeight: 500,
                }}
              >
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
              ~$592
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
              ~$7.104
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
              3,7×
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
              turnos simultáneos cubiertos
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
          &ldquo;Por $359 al mes tienes un{" "}
          <span style={{ color: "#7C3AED" }}>empleado 24/7</span>. Tu próxima recepcionista te
          va a costar mil dólares y va a trabajar 45 horas a la semana.&rdquo;
        </p>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          :global(.roi-row-head),
          :global(.roi-row) {
            grid-template-columns: 1fr !important;
            gap: 4px !important;
          }
          :global(.roi-row-head) {
            display: none !important;
          }
          :global(.roi-kpis) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
