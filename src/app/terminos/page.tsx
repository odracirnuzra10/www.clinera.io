import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Clinera.io",
  description:
    "Términos y condiciones de uso de Clinera.io. Derechos y obligaciones al usar nuestro software, licencia, privacidad, pagos y jurisdicción.",
  alternates: { canonical: "https://www.clinera.io/terminos" },
  openGraph: {
    url: "https://www.clinera.io/terminos",
    title: "Términos y Condiciones — Clinera.io",
    description:
      "Derechos y obligaciones al usar el software Clinera.",
    type: "article",
  },
};

const LAST_UPDATED = "20 de abril de 2026";

export default function TerminosPage() {
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
                  color: "var(--brand-magenta, #B847FF)",
                }}
              >
                Legal
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
              Términos y Condiciones
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
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
              <h2 style={h2}>1. Entidad legal y aceptación de los términos</h2>
              <p style={p}>
                Estos Términos de Uso rigen la prestación de servicios del
                Software Clinera. El servicio es provisto por{" "}
                <strong>Clinera.io</strong>, una empresa constituida en
                Delaware, EE. UU. (en adelante, «la Compañía»).
              </p>
              <p style={p}>
                Al utilizar el Software Clinera, usted acepta estar obligado
                por las presentes cláusulas. Cualquier disputa, controversia o
                reclamo que surja de o esté relacionado con estos términos o
                el uso del software se resolverá exclusivamente bajo las leyes
                del Estado de Delaware y en los tribunales competentes de los
                Estados Unidos de América.
              </p>

              <h2 style={h2}>2. Definiciones y licencia</h2>
              <ul style={ul}>
                <li>
                  <strong>Servicio:</strong> plataforma Clinera, incluyendo
                  software, inteligencia artificial, API, integraciones y
                  funcionalidades asociadas.
                </li>
                <li>
                  <strong>Usuario / Cliente:</strong> clínica, profesional de
                  la salud o entidad que contrata y utiliza el Servicio.
                </li>
                <li>
                  <strong>Contenido:</strong> datos ingresados por el Usuario,
                  incluyendo fichas médicas, historiales clínicos y planes de
                  tratamiento.
                </li>
                <li>
                  <strong>Licencia de uso:</strong> la Compañía otorga una
                  licencia limitada, no exclusiva, revocable y no transferible
                  para utilizar el software únicamente para la gestión interna
                  del Cliente.
                </li>
              </ul>

              <h2 style={h2}>3. Privacidad y manejo de datos médicos</h2>
              <p style={p}>
                El Cliente es el <strong>Responsable del Tratamiento</strong>{" "}
                de los datos personales y médicos que procesa a través de
                Clinera y declara contar con los consentimientos legales
                necesarios.
              </p>
              <p style={p}>
                Clinera implementa medidas de seguridad razonables conforme a
                la normativa estándar vigente. El Cliente conserva la
                propiedad del Contenido ingresado.
              </p>

              <h2 style={h2}>4. Obligaciones y limitación de responsabilidad</h2>
              <p style={p}>
                El Cliente es responsable de la confidencialidad de su cuenta
                y de toda actividad realizada bajo ella.
              </p>
              <p style={p}>
                El Servicio se proporciona <em>&quot;tal cual&quot;</em> y
                según disponibilidad, sin garantías expresas o implícitas. La
                Compañía no será responsable por daños indirectos, lucro
                cesante, pérdida de datos o interrupciones del servicio.
              </p>
              <p style={p}>
                La propiedad intelectual del Software Clinera pertenece
                exclusivamente a la Compañía.
              </p>

              <h2 style={h2}>5. Precios, facturación y pagos</h2>
              <p style={p}>El acceso al Software Clinera puede incluir:</p>
              <ul style={ul}>
                <li>Tarifa de incorporación inicial, y</li>
                <li>Suscripción mensual, según el plan contratado.</li>
              </ul>
              <p style={p}>
                La Compañía podrá modificar precios y condiciones comerciales
                en cualquier momento, notificando con antelación razonable.
              </p>
              <p style={p}>
                Salvo acuerdo contrario por escrito, todas las sumas pagadas
                son <strong>no reembolsables</strong>.
              </p>

              <h2 style={h2}>6. Modelos de inteligencia artificial y precisión</h2>
              <p style={p}>
                Clinera utiliza modelos de lenguaje de gran escala (LLM)
                avanzados de proveedores líderes (como OpenAI, Anthropic y
                Google) para potenciar sus funciones de asistencia.
              </p>
              <p style={p}>
                Dada la naturaleza experimental de la inteligencia artificial,
                el Usuario reconoce que el sistema puede presentar
                &quot;alucinaciones&quot; (generación de información técnica o
                datos incorrectos que parecen plausibles).{" "}
                <strong>
                  El Servicio se proporciona con fines de asistencia
                  administrativa y, bajo ninguna circunstancia, reemplaza las
                  decisiones, diagnósticos o el juicio clínico de un
                  profesional de la salud.
                </strong>
              </p>
              <p style={p}>
                Es responsabilidad exclusiva del Usuario validar toda
                información generada por la IA antes de su uso. La Compañía no
                se responsabiliza por errores u omisiones derivados del uso
                directo de contenidos generados por los modelos de IA.
              </p>

              <h2 style={h2}>7. Disposiciones generales</h2>
              <p style={p}>
                Estos Términos se rigen por las leyes del Estado de Delaware,
                Estados Unidos. Toda controversia, disputa o reclamación
                relacionada con el uso del Software Clinera será sometida y
                resuelta exclusivamente en los tribunales competentes de los
                Estados Unidos de América.
              </p>
              <p style={{ ...p, fontWeight: 600, color: "var(--ink-primary)" }}>
                Jurisdicción: Estado de Delaware, Estados Unidos de América.
              </p>

              <p style={{ ...p, marginTop: 28 }}>
                Consulta también nuestra{" "}
                <Link href="/privacidad">Política de Privacidad</Link> y la{" "}
                <Link href="/cookies">Política de Cookies</Link>.
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
