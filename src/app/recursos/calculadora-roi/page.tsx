import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import RoiCalculator from "@/components/cro/RoiCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  orgSchema,
} from "@/components/seo/schemas";

const URL = "https://www.clinera.io/recursos/calculadora-roi";

export const metadata: Metadata = {
  title: "Calculadora de ROI Clinera — cuánto pierdes por no-shows",
  description:
    "Calcula en 30 segundos cuánto pierde tu clínica por no-shows y cuánto ahorrarías con Clinera (-73% promedio). Reporte personalizado por WhatsApp.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: "Calculadora de ROI Clinera — cuánto pierdes por no-shows",
    description:
      "Mete 3 datos y obtén tu ahorro anual estimado con Clinera. Auditado en 52 clínicas activas.",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de ROI Clinera",
    description:
      "Cuánto pierde tu clínica por no-shows y cuánto ahorrarías con Clinera.",
    images: ["/images/og-banner.png"],
  },
};

const FAQ = [
  {
    q: "¿De dónde sale el -73% promedio en no-shows?",
    a: "De la muestra interna de clínicas activas en Clinera (52 clínicas, abril 2026). Comparamos la tasa de no-shows en los 90 días previos a integrar Clinera contra los 90 días posteriores. La reducción promedio fue 73% gracias a 5 protocolos que opera AURA: confirmación 48h+24h, lista de espera para slots cancelados, override por patrón de fuga, recordatorios contextuales y abono adelantado para reincidentes.",
  },
  {
    q: "¿El cálculo aplica a mi vertical (estética / dental / médico)?",
    a: "Sí, la lógica de no-shows aplica a cualquier vertical clínico ambulatorio. Lo que cambia es el ticket promedio. La calculadora te deja ajustarlo por moneda y país. Para resultados más precisos en dental o multi-sede, agenda una sesión con ventas y modelamos contigo el escenario exacto.",
  },
  {
    q: "¿Cuándo veo el ahorro real?",
    a: "Setup en menos de 1 hora. AURA arranca a operar esa misma tarde. Los primeros recordatorios automatizados salen en 24h y la métrica de no-shows típicamente se mueve a partir de la segunda semana de operación. El payback típico de Clinera es menor a 1 mes.",
  },
  {
    q: "¿Necesito cambiar mi número de WhatsApp Business?",
    a: "No. Clinera opera en coexistencia con tu WhatsApp Business actual: tu equipo sigue respondiendo desde el celular cuando quiere y AURA opera en paralelo el resto del tiempo, sobre el mismo número.",
  },
];

export default function CalculadoraRoiPage() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Recursos", url: "https://www.clinera.io/recursos" },
            { name: "Calculadora de ROI", url: URL },
          ]),
          faqSchema(FAQ),
        ]}
      />

      <NavV3 />

      <main>
        <RoiCalculator />

        <section
          style={{
            padding: "64px 24px",
            background: "#fff",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                margin: "0 0 12px",
              }}
            >
              Cómo se calcula tu ROI
            </h2>
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 16,
                lineHeight: 1.65,
                color: "#374151",
                marginBottom: 24,
              }}
            >
              La calculadora usa una fórmula simple sobre tu data:
            </p>
            <ul
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 15.5,
                lineHeight: 1.7,
                color: "#374151",
                paddingLeft: 18,
              }}
            >
              <li>
                <b>Pacientes al mes</b> × <b>% de no-shows actual</b> ={" "}
                <b>pacientes perdidos al mes</b>.
              </li>
              <li>
                <b>Pacientes perdidos</b> × <b>ticket promedio</b> ={" "}
                <b>pérdida mensual</b>.
              </li>
              <li>
                Con Clinera la tasa baja a <b>0.27× la actual</b> (reducción
                promedio observada del 73% sobre 52 clínicas activas, abril 2026).
              </li>
              <li>
                <b>Ahorro anual</b> = (pérdida actual − pérdida con Clinera) ×
                12.
              </li>
            </ul>
            <p
              style={{
                marginTop: 24,
                fontSize: 13.5,
                color: "#6B7280",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                letterSpacing: "0.02em",
              }}
            >
              Métrica auditada en{" "}
              <Link href="/efectividad" style={{ color: "#7C3AED" }}>
                /efectividad
              </Link>
              . Metodología completa en{" "}
              <Link href="/blog/efectividad" style={{ color: "#7C3AED" }}>
                /blog/efectividad
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          style={{
            padding: "0 24px 80px",
            background: "#fff",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                margin: "0 0 24px",
              }}
            >
              Preguntas frecuentes
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  style={{
                    background: "#FAFAFA",
                    border: "1px solid #EEECEA",
                    borderRadius: 12,
                    padding: "16px 20px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#0A0A0A",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {f.q}
                  </summary>
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "#374151",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FooterV3 />
    </>
  );
}
