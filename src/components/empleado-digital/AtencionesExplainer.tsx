"use client";

const CARDS = [
  {
    icon: "💬",
    title: "Mensaje de texto (AURA)",
    desc: "Cada respuesta que AURA envía por WhatsApp — precios, ubicación, horarios o servicios, con el contexto de tu clínica.",
    creditos: "10 créditos",
  },
  {
    icon: "📅",
    title: "Agendamiento",
    desc: "AURA agenda, re-agenda o confirma la cita ejecutando tool calls a tu agenda y BD. Cierra la cita sin gastar tu bolsa.",
    creditos: "0 créditos",
    featured: true,
  },
  {
    icon: "🎙️",
    title: "Minuto de voz (CAMILA)",
    desc: "Cada minuto que CAMILA habla por teléfono con tu paciente — confirmación, recordatorio o reactivación.",
    creditos: "25 créditos",
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
            ¿Qué consume créditos?
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
            Una bolsa mensual de créditos. Y el agendamiento no consume nada.
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
            Cada acción de IA descuenta créditos de tu bolsa mensual en tiempo real. El
            agendamiento no consume créditos y el cupo se renueva cada mes.
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
          <strong style={{ color: "#0A0A0A" }}>Tu plan incluye una bolsa mensual de créditos: 28.000 (Vortex) · 37.000 (Atlas) · 46.000 (Summit).</strong>{" "}
          El texto de AURA consume 10 créditos y un minuto de voz de CAMILA 25 — el agendamiento
          no consume créditos. Los cupos se dimensionaron con margen para que nunca te quedes
          corto ni pases por sorpresa del cupo.
        </p>

        <p
          style={{
            marginTop: 18,
            textAlign: "center",
            fontFamily: "Inter",
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 1.5,
          }}
        >
          ¿Cuánto consume tu clínica al mes?{" "}
          <a
            href="/calculadora-de-consumo"
            style={{
              color: "#7C3AED",
              textDecoration: "underline",
              textDecorationThickness: 1,
              textUnderlineOffset: 3,
              fontWeight: 600,
            }}
          >
            Calcula tu plan ideal →
          </a>
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
