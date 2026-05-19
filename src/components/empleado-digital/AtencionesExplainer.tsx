"use client";

const CARDS = [
  {
    icon: "💬",
    title: "Consulta o FAQ",
    desc: "Un paciente pregunta por precios, ubicación, horarios o servicios. AURA responde con contexto de tu clínica.",
    creditos: "~5–8 créditos",
  },
  {
    icon: "📅",
    title: "Agendamiento completo",
    desc: "AURA conversa, valida disponibilidad, ejecuta tool calls a tu agenda y BD, confirma la cita.",
    creditos: "~12–15 créditos",
    featured: true,
  },
  {
    icon: "🔄",
    title: "Re-agenda o reactivación",
    desc: "Mueve una cita existente, contacta a un paciente dormido, gestiona cobros pendientes.",
    creditos: "~10–13 créditos",
  },
];

export default function AtencionesExplainer() {
  return (
    <section
      aria-labelledby="atenciones-h2"
      style={{
        padding: "96px 24px",
        background: "#fff",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#10B981",
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
                background: "#10B981",
                display: "inline-block",
              }}
            />
            ¿Qué es una atención?
          </p>
          <h2
            id="atenciones-h2"
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "0 0 16px",
              color: "#0A0A0A",
            }}
          >
            Una atención puede ser solo una consulta — o un agendamiento completo con tool
            calls.
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#4B5563",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Cada atención consume créditos según el modo y la complejidad. Tus créditos se
            descuentan en tiempo real y el cupo se renueva cada mes.
          </p>
        </div>

        <div
          className="atenciones-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
          }}
        >
          {CARDS.map((c) => (
            <article
              key={c.title}
              style={{
                background: c.featured
                  ? "linear-gradient(135deg, rgba(124,58,237,.05), rgba(200,80,192,.04))"
                  : "#fff",
                border: c.featured ? "1px solid rgba(124,58,237,.25)" : "1px solid #E5E7EB",
                borderRadius: 18,
                padding: "26px 26px 24px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 14,
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {c.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#0A0A0A",
                  margin: "0 0 10px",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  color: "#4B5563",
                  lineHeight: 1.55,
                  margin: "0 0 18px",
                }}
              >
                {c.desc}
              </p>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  color: c.featured ? "#7C3AED" : "#6B7280",
                  fontWeight: 500,
                  padding: "8px 12px",
                  background: c.featured ? "rgba(124,58,237,.08)" : "#FAFAFA",
                  borderRadius: 8,
                  display: "inline-block",
                }}
              >
                {c.creditos}
              </div>
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: 28,
            fontFamily: "Inter",
            fontSize: 13.5,
            color: "#6B7280",
            lineHeight: 1.55,
            padding: "14px 18px",
            background: "#FAFAFA",
            borderRadius: 10,
            borderLeft: "3px solid #E5E7EB",
          }}
        >
          <strong style={{ color: "#0A0A0A" }}>1 crédito = ~$0.001 USD</strong> de costo de IA.
          Los cupos de cada plan se calcularon con un margen conservador (-10%) para que tu
          atención promedio no se quede corta — y nunca pases por sorpresa del cupo.
        </p>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.atenciones-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
