import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import ConsumptionCalculator from "@/components/cro/ConsumptionCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema } from "@/components/seo/schemas";

const URL = "https://www.clinera.io/calculadora-de-consumo";

export const metadata: Metadata = {
  title: "Calculadora de consumo · Clinera",
  description:
    "Estima cuántos créditos IA necesita tu clínica al mes y descubre qué plan de Clinera se ajusta a tu volumen. Calculadora gratuita.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: "Calculadora de consumo · Clinera",
    description:
      "Estima cuántos créditos IA necesita tu clínica al mes y descubre qué plan de Clinera se ajusta a tu volumen.",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de consumo · Clinera",
    description:
      "Estima cuántos créditos IA necesita tu clínica al mes y descubre el plan ideal.",
    images: ["/images/og-banner.png"],
  },
};

const FONT_BODY = "Inter, system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

export default function CalculadoraDeConsumoPage() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Calculadora de consumo", url: URL },
          ]),
        ]}
      />

      <NavV3 />

      <main style={{ background: "#fff", color: "#0A0A0A", fontFamily: FONT_BODY }}>
        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section
          style={{
            padding: "72px 24px 56px",
            background:
              "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(0,159,227,0.10), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(124,58,237,0.08), transparent 60%), #fff",
            borderBottom: "1px solid #EEECEA",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#009FE3",
                background: "rgba(0,159,227,0.08)",
                padding: "5px 12px",
                borderRadius: 999,
              }}
            >
              Clinera.io · Documentación
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
                margin: "18px 0 14px",
              }}
            >
              Calculadora de consumo y guía de créditos
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "#4B5563",
                maxWidth: 700,
                margin: "0 0 28px",
              }}
            >
              Entiende qué consume cada plan, cuántas atenciones cubre y por qué
              los números son aproximados. Al final encontrarás una calculadora
              para estimar tu consumo según tu volumen real.
            </p>
            <a
              href="#calc"
              style={{
                display: "inline-block",
                background: "#0A0A0A",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Ir directo a la calculadora →
            </a>
          </div>
        </section>

        {/* ─────────────────────── 01 · CONCEPTOS ─────────────────────── */}
        <NumberedSection num="01" title="Conceptos">
          <p style={paragraphStyle}>
            Clinera factura por <strong>créditos</strong>, no por atención.
            Cada plan trae una bolsa mensual de créditos y cada interacción de
            AURA (la IA) consume un puñado dependiendo de cuánto razonamiento y
            cuántas tools usó para resolverla.
          </p>
          <p style={paragraphStyle}>
            Una <strong>atención</strong> es una conversación con un paciente
            (agendar, reagendar, confirmar, responder dudas). Lo que consume
            esa atención depende del <em>modo de IA</em> activo en tu cuenta y
            de la complejidad real de la conversación.
          </p>

          <blockquote
            style={{
              borderLeft: "3px solid #009FE3",
              paddingLeft: 18,
              margin: "28px 0 8px",
              fontFamily: FONT_BODY,
              fontSize: 20,
              fontStyle: "italic",
              color: "#0A0A0A",
              letterSpacing: "-0.01em",
              lineHeight: 1.45,
            }}
          >
            “Una atención no tiene costo fijo.”
          </blockquote>
        </NumberedSection>

        {/* ─────────────────────── 02 · MODOS ─────────────────────── */}
        <NumberedSection num="02" title="Modos de agendamiento">
          <p style={paragraphStyle}>
            Clinera ofrece tres modos de IA. Cada uno tiene un perfil distinto
            de consumo y disponibilidad según el plan contratado.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 28,
            }}
          >
            <ModeCard
              name="Eficiente"
              consumption="~4"
              model="Gemini 3 Flash"
              available="Plan Core"
              description="Optimizado para tareas simples y respuestas rápidas. Ideal para confirmar citas y responder FAQ."
            />
            <ModeCard
              name="Agentic"
              consumption="~17"
              model="Kimi K2.6"
              available="Plan Conect"
              description="El balance ideal entre razonamiento y costo. Maneja flujos completos de agendamiento, reagendamiento y triage."
              recommended
            />
            <ModeCard
              name="Agentic Flash"
              consumption="~36"
              model="Gemini 3 Flash (high-speed, 289 tok/s)"
              available="Solo plan Advanced"
              description="Máxima velocidad de razonamiento. Para flujos con muchos tool calls y respuestas inmediatas a alto volumen."
            />
          </div>
        </NumberedSection>

        {/* ─────────────────────── 03 · EJEMPLOS ─────────────────────── */}
        <NumberedSection num="03" title="Ejemplos reales de consumo">
          <p style={paragraphStyle}>
            Estos son escenarios reales medidos en clínicas activas. El
            consumo varía según número de <em>tool calls</em>, longitud del
            contexto y modo activo.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "28px 0 0",
              display: "grid",
              gap: 10,
            }}
          >
            {[
              { task: "Responder FAQ simple", meta: "sin tools · cualquier modo", cred: "~1 cr" },
              { task: "Confirmar cita existente", meta: "1 tool call · Eficiente", cred: "~4 cr" },
              { task: "Agendar cita nueva por WhatsApp", meta: "3 tool calls · Agentic", cred: "~17 cr" },
              { task: "Reagendar + confirmar", meta: "4 tool calls · Agentic", cred: "~23 cr" },
              { task: "Agendar + cobrar + email", meta: "5+ tool calls · Agentic Flash", cred: "~36 cr" },
            ].map((row) => (
              <li
                key={row.task}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  background: "#FAFAFA",
                  border: "1px solid #EEECEA",
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15.5 }}>{row.task}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      marginTop: 4,
                      fontFamily: FONT_MONO,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {row.meta}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#0A0A0A",
                  }}
                >
                  {row.cred}
                </div>
              </li>
            ))}
          </ul>

          <div style={calloutCyanStyle}>
            Estos valores incluyen un margen de seguridad del ~30% sobre el
            consumo promedio observado en clínicas activas. Preferimos prometer
            poco y que tu mes rinda más, antes que vendértelo al revés.
          </div>
        </NumberedSection>

        {/* ─────────────────────── 04 · EQUIVALENCIAS ─────────────────────── */}
        <NumberedSection num="04" title="Equivalencias: planes × modos">
          <p style={paragraphStyle}>
            Cuántas atenciones puedes cubrir al mes con la bolsa de créditos
            de cada plan, según el modo que actives. La celda destacada marca
            el modo <em>default</em> del plan.
          </p>

          <div style={{ overflowX: "auto", marginTop: 28 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: 560,
                fontFamily: FONT_BODY,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Eficiente</th>
                  <th style={thStyle}>Agentic</th>
                  <th style={thStyle}>Agentic Flash</th>
                </tr>
              </thead>
              <tbody>
                <PlanRow
                  plan="Core"
                  cells={[
                    { text: "hasta 2.000", isDefault: true },
                    { text: "no disponible" },
                    { text: "no disponible" },
                  ]}
                />
                <PlanRow
                  plan="Conect"
                  cells={[
                    { text: "hasta 3.000" },
                    { text: "hasta 700", isDefault: true },
                    { text: "no disponible" },
                  ]}
                />
                <PlanRow
                  plan="Advanced"
                  cells={[
                    { text: "hasta 8.000" },
                    { text: "hasta 1.880" },
                    { text: "hasta 880", isDefault: true },
                  ]}
                />
              </tbody>
            </table>
          </div>

          <p
            style={{
              marginTop: 18,
              fontSize: 13.5,
              color: "#6B7280",
              fontFamily: FONT_MONO,
              letterSpacing: "0.02em",
              lineHeight: 1.55,
            }}
          >
            La celda destacada en cada fila marca el modo <em>default</em> del
            plan. Los números usan una calibración conservadora con ~30% de
            margen de seguridad.
          </p>
        </NumberedSection>

        {/* ─────────────────────── 05 · SOBREUSO ─────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#fff" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div
              style={{
                background: "#0A0A0A",
                color: "#fff",
                borderRadius: 20,
                padding: "40px 36px",
                backgroundImage:
                  "radial-gradient(ellipse 50% 70% at 100% 0%, rgba(0,159,227,.22), transparent 60%), radial-gradient(ellipse 40% 60% at 0% 120%, rgba(124,58,237,.20), transparent 60%)",
              }}
            >
              <SectionEyebrow num="05" />
              <h2
                style={{
                  fontSize: "clamp(24px, 3.2vw, 32px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: "12px 0 16px",
                  color: "#fff",
                }}
              >
                Pack adicional · +5.000 créditos extra
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.78)",
                  marginBottom: 24,
                  maxWidth: 620,
                }}
              >
                ¿Te quedaste corto este mes? Sumas un pack adicional sin
                permanencia. Stackeable (puedes activar más de uno) y se
                resetea por ciclo de facturación de Stripe, no por mes
                calendario.
              </p>

              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                USD $50 / mes
              </div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                Equivale hasta ~1.250 atenciones extra en Eficiente · ~290 en
                Agentic · ~140 en Agentic Flash.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────── 06 · REGLAS ─────────────────────── */}
        <NumberedSection num="06" title="Reglas de cap">
          <p style={paragraphStyle}>
            Para evitar sorpresas, Clinera aplica dos avisos automáticos sobre
            el uso de créditos del ciclo:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 28,
            }}
          >
            <RuleCard
              percent="80%"
              label="Aviso"
              accent="#F59E0B"
              bg="rgba(245,158,11,0.08)"
              description="Email + notificación push con CTA directo para sumar el add-on de +5.000 créditos."
            />
            <RuleCard
              percent="100%"
              label="Pausa"
              accent="#EF4444"
              bg="rgba(239,68,68,0.08)"
              description="Las nuevas atenciones se pausan automáticamente. Las en curso terminan ok."
            />
          </div>

          <div style={calloutCyanStyle}>
            El ciclo se cuenta por <strong>facturación de Stripe</strong>, no
            por mes calendario. Si tu cobro es el día 15, tus créditos
            resetean cada 15.
          </div>
        </NumberedSection>

        {/* ─────────────────────── 07 · CALCULADORA ─────────────────────── */}
        <ConsumptionCalculator />

        {/* ─────────────────────── FOOTER NOTE ─────────────────────── */}
        <section style={{ padding: "32px 24px 80px", background: "#fff" }}>
          <div
            style={{
              maxWidth: 880,
              margin: "0 auto",
              fontSize: 13,
              color: "#9CA3AF",
              fontFamily: FONT_MONO,
              letterSpacing: "0.02em",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            Las cifras incluyen un margen de seguridad del ~30% sobre el
            promedio observado. Para una proyección exacta sobre tu operación,{" "}
            <a href="/hablar-con-ventas" style={{ color: "#7C3AED" }}>
              habla con el equipo de Clinera
            </a>
            .
          </div>
        </section>
      </main>

      <FooterV3 />
    </>
  );
}

/* ───────────────────────── Helpers (server) ───────────────────────── */

const paragraphStyle: React.CSSProperties = {
  fontSize: 16.5,
  lineHeight: 1.7,
  color: "#374151",
  margin: "0 0 14px",
};

const calloutCyanStyle: React.CSSProperties = {
  marginTop: 28,
  padding: "18px 22px",
  background: "rgba(0,159,227,0.06)",
  borderLeft: "3px solid #009FE3",
  borderRadius: 8,
  fontSize: 14.5,
  lineHeight: 1.6,
  color: "#0A0A0A",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontFamily: FONT_MONO,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#6B7280",
  padding: "12px 14px",
  borderBottom: "1px solid #EEECEA",
  background: "#FAFAFA",
};

function SectionEyebrow({ num }: { num: string }) {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.55)",
      }}
    >
      Sección {num}
    </span>
  );
}

function NumberedSection({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ padding: "56px 24px", borderTop: "1px solid #EEECEA" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          Sección {num}
        </span>
        <h2
          style={{
            fontSize: "clamp(24px, 3.2vw, 32px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "10px 0 22px",
            color: "#0A0A0A",
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function ModeCard({
  name,
  consumption,
  model,
  available,
  description,
  recommended,
}: {
  name: string;
  consumption: string;
  model: string;
  available: string;
  description: string;
  recommended?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        border: recommended ? "1.5px solid #0A0A0A" : "1px solid #EEECEA",
        borderRadius: 16,
        padding: "24px 22px",
        boxShadow: recommended ? "0 8px 24px -16px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {recommended && (
        <span
          style={{
            position: "absolute",
            top: -10,
            left: 18,
            background: "#0A0A0A",
            color: "#fff",
            fontFamily: FONT_MONO,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          Recomendado
        </span>
      )}
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.015em",
          margin: "0 0 12px",
          color: "#0A0A0A",
        }}
      >
        {name}
      </h3>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 30,
          fontWeight: 700,
          color: "#0A0A0A",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {consumption}
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: "#6B7280",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        cr / atención
      </div>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: "#374151",
          margin: "0 0 16px",
        }}
      >
        {description}
      </p>
      <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
        <div>
          <strong style={{ color: "#0A0A0A" }}>Modelo:</strong> {model}
        </div>
        <div style={{ marginTop: 4 }}>
          <strong style={{ color: "#0A0A0A" }}>Desde:</strong> {available}
        </div>
      </div>
    </div>
  );
}

function PlanRow({
  plan,
  cells,
}: {
  plan: string;
  cells: { text: string; isDefault?: boolean }[];
}) {
  return (
    <tr>
      <td
        style={{
          padding: "16px 14px",
          borderBottom: "1px solid #EEECEA",
          fontWeight: 700,
          color: "#0A0A0A",
        }}
      >
        {plan}
      </td>
      {cells.map((c, i) => {
        const isUnavailable = c.text === "no disponible";
        return (
          <td
            key={i}
            style={{
              padding: "16px 14px",
              borderBottom: "1px solid #EEECEA",
              background: c.isDefault ? "rgba(0,159,227,0.10)" : "transparent",
              color: isUnavailable ? "#9CA3AF" : "#0A0A0A",
              fontFamily: FONT_MONO,
              fontSize: 14,
              fontStyle: isUnavailable ? "italic" : "normal",
            }}
          >
            <span>{c.text}</span>
            {c.isDefault && (
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "#009FE3",
                  color: "#fff",
                  padding: "2px 7px",
                  borderRadius: 999,
                  verticalAlign: "middle",
                }}
              >
                default
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function RuleCard({
  percent,
  label,
  accent,
  bg,
  description,
}: {
  percent: string;
  label: string;
  accent: string;
  bg: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${accent}33`,
        borderRadius: 16,
        padding: "24px 22px",
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 44,
          fontWeight: 700,
          color: accent,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: 14,
        }}
      >
        {percent}
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#0A0A0A", margin: 0 }}>
        {description}
      </p>
    </div>
  );
}
