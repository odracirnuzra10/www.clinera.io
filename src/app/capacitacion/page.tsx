import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Capacitación para agencias — Clinera.io",
  description:
    "Centro de capacitación para agencias partner de Clinera. Soporte dedicado con Franco (tu ejecutivo de cuentas) e importación de fichas clínicas, tratamientos y pacientes desde Dentalink, Medilink o AgendaPro hecha por nosotros.",
  alternates: { canonical: "https://clinera.io/capacitacion" },
  openGraph: {
    url: "https://clinera.io/capacitacion",
    title: "Capacitación para agencias — Clinera.io",
    description:
      "Soporte dedicado con Franco e importación de tus clientes hecha por nosotros.",
    type: "website",
  },
};

// Línea directa del equipo de partners (Franco). Reemplazar por el celular real de Franco si se quiere link directo.
const FRANCO_WA =
  "https://wa.me/56985581524?text=Hola%2C%20soy%20agencia%20partner%20y%20quiero%20coordinar%20con%20Franco.";

const INK = "#0A0A0A";
const GRAY = "#4B5563";
const VIOLET = "#7C3AED";
const LINE = "#E5E7EB";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: VIOLET,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: VIOLET, display: "inline-block" }} />
      {children}
    </div>
  );
}

export default function CapacitacionPage() {
  return (
    <>
      <NavV3 />
      <main>
        {/* Hero */}
        <section style={{ padding: "72px 80px 24px", background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <Eyebrow>Capacitación · Agencias partner</Eyebrow>
            <h1
              style={{
                fontFamily: "Inter",
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                margin: "14px 0 14px",
                color: INK,
              }}
              className="cap-h1"
            >
              Centro de capacitación.
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: 18, color: GRAY, lineHeight: 1.6, maxWidth: 640, margin: 0 }}>
              Aquí dejamos las presentaciones y recursos para que implementes Clinera
              en tus clientes. Dos cosas que queremos dejar muy claras desde el día uno:
            </p>
          </div>
        </section>

        {/* Dos puntos clave */}
        <section style={{ padding: "32px 80px 24px", background: "#FAFAFA" }}>
          <div
            className="cap-grid"
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
            }}
          >
            {/* 1 · Soporte dedicado con Franco */}
            <article
              style={{
                background: "#fff",
                border: "1px solid " + LINE,
                borderRadius: 20,
                padding: "30px 30px 26px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <img
                  src="/agents/franco.png"
                  alt="Franco — ejecutivo de cuentas de Clinera"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center 18%",
                    border: "2px solid #fff",
                    boxShadow: "0 10px 24px -10px rgba(124,58,237,.45)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: VIOLET }}>
                    01 · Soporte dedicado
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: INK, letterSpacing: "-0.02em", marginTop: 4 }}>
                    Franco, tu ejecutivo de cuentas
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: "Inter", fontSize: 15.5, color: GRAY, lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>
                Las agencias tienen <b style={{ color: INK }}>soporte dedicado con Franco</b>.
                Tendrás su <b style={{ color: INK }}>celular directo</b> para escribirle por
                WhatsApp y resolver lo que necesites — integraciones, automatizaciones y
                dudas de tus clientes, sin tickets anónimos ni filas de espera.
              </p>
              <a
                href={FRANCO_WA}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0A0A0A",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: 10,
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: 14.5,
                  textDecoration: "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hablar con Franco
              </a>
            </article>

            {/* 2 · Importación hecha por nosotros */}
            <article
              style={{
                background: "#fff",
                border: "1px solid " + LINE,
                borderRadius: 20,
                padding: "30px 30px 26px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#7C3AED,#D946EF)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M12 15V3" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: VIOLET }}>
                    02 · Migración
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: INK, letterSpacing: "-0.02em", marginTop: 4 }}>
                    Nosotros migramos a tus clientes
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: "Inter", fontSize: 15.5, color: GRAY, lineHeight: 1.6, margin: "0 0 16px" }}>
                Las importaciones de <b style={{ color: INK }}>fichas clínicas, tratamientos y
                pacientes</b> las hacemos nosotros. Franco solicita acceso a la cuenta actual
                de tu cliente y deja todo cargado en un plazo de <b style={{ color: INK }}>~1 semana</b>.
                Tu cliente no parte de cero ni pierde su historial.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
                {["Dentalink", "Medilink", "AgendaPro", "Dentalsoft", "y más"].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: MONO,
                      fontSize: 11.5,
                      letterSpacing: "0.04em",
                      color: "#0A0A0A",
                      background: "#F3F4F6",
                      border: "1px solid " + LINE,
                      borderRadius: 999,
                      padding: "5px 11px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* Cómo es la migración, paso a paso */}
        <section style={{ padding: "32px 80px 16px", background: "#FAFAFA" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              className="cap-steps"
              style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}
            >
              {[
                { n: "01", t: "Franco pide acceso", d: "Coordina contigo y tu cliente el acceso a su software actual (Dentalink, Medilink, AgendaPro, etc.)." },
                { n: "02", t: "Importamos todo", d: "Fichas clínicas, tratamientos y base de pacientes quedan cargados y validados dentro de Clinera." },
                { n: "03", t: "Listo en ~1 semana", d: "Tu cliente arranca con su historial completo y AURA operando desde el primer día." },
              ].map((it) => (
                <div key={it.n} style={{ background: "#fff", border: "1px solid " + LINE, borderRadius: 16, padding: "22px 24px" }}>
                  <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em", color: VIOLET, marginBottom: 10 }}>{it.n}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 700, color: INK, letterSpacing: "-0.015em", marginBottom: 6 }}>{it.t}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, color: GRAY, lineHeight: 1.55 }}>{it.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Presentaciones / recursos */}
        <section style={{ padding: "48px 80px 96px", background: "#FAFAFA" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Eyebrow>Presentaciones y recursos</Eyebrow>
            <h2
              style={{
                fontFamily: "Inter",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: INK,
                margin: "12px 0 20px",
              }}
            >
              Material para presentar Clinera.
            </h2>
            <div className="cap-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <a
                href="/presentacion-agencia/"
                style={{
                  textDecoration: "none",
                  background: "#fff",
                  border: "1px solid " + LINE,
                  borderRadius: 16,
                  padding: "24px 26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, color: INK, letterSpacing: "-0.015em" }}>
                    Presentación para agencias
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, color: GRAY, marginTop: 4 }}>
                    Deck completo: agentes, modos, ficha clínica, ROI, precios y programa partner.
                  </div>
                </div>
                <span style={{ color: VIOLET, fontSize: 22, flexShrink: 0 }}>→</span>
              </a>
              <a
                href="/presentacion/"
                style={{
                  textDecoration: "none",
                  background: "#fff",
                  border: "1px solid " + LINE,
                  borderRadius: 16,
                  padding: "24px 26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, color: INK, letterSpacing: "-0.015em" }}>
                    Presentación para clínicas
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, color: GRAY, marginTop: 4 }}>
                    La versión para mostrar directo al dueño o director de la clínica.
                  </div>
                </div>
                <span style={{ color: VIOLET, fontSize: 22, flexShrink: 0 }}>→</span>
              </a>
            </div>
            <p style={{ fontFamily: MONO, fontSize: 12, color: "#9CA3AF", letterSpacing: "0.04em", marginTop: 20 }}>
              Iremos sumando más capacitaciones y recursos aquí.
            </p>
          </div>
        </section>
      </main>
      <FooterV3 />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 860px) {
          .cap-grid { grid-template-columns: 1fr !important; }
          .cap-steps { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          main > section { padding-left: 28px !important; padding-right: 28px !important; }
          .cap-h1 { font-size: 36px !important; }
        }
      `,
        }}
      />
    </>
  );
}
