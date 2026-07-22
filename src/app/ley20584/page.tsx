import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Seguridad de datos y Ley 20.584 — Clinera.io",
  description:
    "Cómo Clinera protege los datos clínicos: cifrado en reposo AES-256-GCM con envelope encryption, una llave por clínica y trazabilidad de acceso a la ficha, bajo las leyes 20.584 y 21.719.",
  alternates: { canonical: "https://www.clinera.io/ley20584" },
  openGraph: {
    url: "https://www.clinera.io/ley20584",
    title: "Seguridad de datos y Ley 20.584 — Clinera.io",
    description:
      "Seguridad de datos de nivel enterprise: cifrado, aislamiento por clínica y trazabilidad de la ficha, bajo las leyes 20.584 y 21.719.",
    type: "article",
  },
};

const LAST_UPDATED = "22 de julio de 2026";

export default function Ley20584Page() {
  return (
    <>
      <NavV3 />
      <main>
        <section className="section">
          <div className="container" style={{ maxWidth: 820 }}>
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--brand-cyan)",
                }}
              >
                Seguridad y cumplimiento
              </span>
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--ink-primary)",
                marginBottom: 8,
              }}
            >
              Seguridad de datos y Ley 20.584
            </h1>
            <p
              style={{
                fontFamily: "var(--font-tech)",
                fontSize: "0.9rem",
                color: "var(--ink-tertiary)",
                marginBottom: 8,
              }}
            >
              Datos de salud — la categoría más sensible bajo la Ley 21.719.
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--ink-tertiary)",
                marginBottom: 32,
              }}
            >
              Última actualización: {LAST_UPDATED}
            </p>

            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--ink-secondary)",
              }}
            >
              <p style={p}>
                La ficha clínica es la categoría de datos más sensible que existe. En Clinera la
                tratamos con estándares de seguridad de nivel enterprise: cifrado, aislamiento por
                clínica y trazabilidad de acceso a cada ficha.
              </p>

              <h2 style={h2}>Cómo protegemos tus datos</h2>
              <p style={p}>
                Estas medidas están activas para todas las clínicas de la plataforma:
              </p>
              <ul style={ul}>
                <li style={li}>
                  <strong>Cifrado en reposo del 100% del contenido clínico.</strong> Todo el
                  contenido de la ficha se cifra en la base de datos.
                  <span style={badgeRow}>
                    <span style={badge}>AES-256-GCM</span>
                    <span style={badge}>Envelope encryption</span>
                  </span>
                </li>
                <li style={li}>
                  <strong>Una llave de cifrado por clínica.</strong> Aislamiento total entre
                  clínicas: los datos de una clínica no se pueden descifrar con la llave de otra.
                  <span style={badgeRow}>
                    <span style={badge}>1 DEK per clinic</span>
                    <span style={badge}>Cloud KMS</span>
                  </span>
                </li>
                <li style={li}>
                  <strong>Llave maestra en bóveda gestionada, nunca expuesta.</strong> La llave que
                  protege a las demás vive en un servicio de custodia, con acceso mínimo y rotación
                  periódica.
                  <span style={badgeRow}>
                    <span style={badge}>KMS</span>
                    <span style={badge}>IAM mínimo</span>
                    <span style={badge}>rotación 90d</span>
                  </span>
                </li>
                <li style={li}>
                  <strong>Trazabilidad completa de acceso a la ficha.</strong> Registro de quién
                  accede a cada ficha, en línea con la Ley 20.584.
                  <span style={badgeRow}>
                    <span style={badge}>Access log</span>
                    <span style={badge}>Ley 20.584</span>
                  </span>
                </li>
                <li style={li}>
                  <strong>Respaldos automáticos y recuperación punto en el tiempo.</strong> Copias
                  automáticas con restauración a un instante específico.
                  <span style={badgeRow}>
                    <span style={badge}>Backups + PITR 7d</span>
                  </span>
                </li>
              </ul>

              <h2 style={h2}>Envelope encryption, en una frase</h2>
              <p style={p}>
                Cada ficha se cifra con una llave única por clínica; esa llave se guarda cifrada por
                una llave maestra en un servicio de custodia especializado. Un robo de la base de
                datos expone solo texto ilegible.
              </p>

              <h2 style={h2}>Ley 20.584 — derechos del paciente y la ficha clínica</h2>
              <p style={p}>
                La Ley 20.584 regula los derechos y deberes de las personas en su atención de salud.
                Entre ellos, establece que la ficha clínica es un dato sensible: su acceso debe ser
                restringido al personal autorizado y quedar registrado. Por eso la trazabilidad de
                acceso a la ficha es una medida vigente en Clinera, no una promesa.
              </p>
              <p style={p}>
                Profundizamos en el marco legal chileno de la ficha clínica en{" "}
                <Link href="/blog/normativa-ficha-clinica-chile-ley-20584" style={linkStyle}>
                  esta guía sobre la Ley 20.584 y la ficha clínica
                </Link>
                .
              </p>

              <h2 style={h2}>Ley 21.719 — protección de datos personales</h2>
              <p style={p}>
                La Ley 21.719 moderniza la protección de datos personales en Chile y entra en
                vigencia en diciembre de 2026. Trata los datos de salud como una categoría especial,
                con obligaciones reforzadas de seguridad, consentimiento y derechos del titular. En
                Clinera aplicamos ese estándar de exigencia sobre los datos clínicos: cifrado,
                aislamiento por clínica y trazabilidad de acceso a cada ficha.
              </p>

              <p style={{ ...p, fontSize: "0.85rem", color: "var(--ink-tertiary)", marginTop: 28 }}>
                Esta página es informativa y no constituye asesoría legal. Para una revisión técnica
                de seguridad (due diligence),{" "}
                <Link href="/hablar-con-ventas" style={linkStyle}>
                  agenda una reunión con nuestro equipo
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}

const h2 = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "var(--ink-primary)",
  marginTop: 36,
  marginBottom: 12,
  letterSpacing: "-0.02em",
} as const;

const p = {
  marginBottom: 14,
  color: "var(--ink-secondary)",
  lineHeight: 1.7,
} as const;

const ul = {
  margin: "0 0 18px",
  paddingLeft: 24,
  color: "var(--ink-secondary)",
  lineHeight: 1.75,
} as const;

const li = {
  marginBottom: 12,
} as const;

const badgeRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  marginTop: 6,
} as const;

const badge = {
  fontFamily: "var(--font-tech)",
  fontSize: "0.72rem",
  letterSpacing: "0.01em",
  color: "var(--ink-secondary)",
  background: "var(--surface-1)",
  border: "1px solid var(--surface-2)",
  borderRadius: 6,
  padding: "2px 8px",
} as const;

const linkStyle = {
  color: "var(--brand-cyan)",
  textDecoration: "underline",
  textUnderlineOffset: 2,
} as const;
