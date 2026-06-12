import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema } from "@/components/seo/schemas";
import {
  getPublishedByTopic,
  publishedRecursos,
  TOPIC_LABELS,
} from "@/content/recursos";

export const metadata: Metadata = {
  title: "Recursos para clínicas — Software, agenda, WhatsApp y fichas",
  description:
    "Comparativas y guías por ciudad para elegir el software clínico correcto. Mejor software, agenda online, WhatsApp e IA, y sistemas de ficha clínica para clínicas en LATAM.",
  alternates: { canonical: "https://www.clinera.io/recursos" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.clinera.io/recursos",
    siteName: "Clinera.io",
    title: "Recursos para clínicas — Software, agenda, WhatsApp y fichas",
    description:
      "Comparativas y guías por ciudad para elegir el software clínico correcto.",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos para clínicas — Clinera",
    description: "Comparativas y guías por ciudad.",
    images: ["/images/og-banner.png"],
  },
};

export default function RecursosIndexPage() {
  const byTopic = getPublishedByTopic();

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: publishedRecursos.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.clinera.io/recursos/${r.slug}`,
      name: `${TOPIC_LABELS[r.topic]} en ${r.ciudad}`,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Recursos", url: "https://www.clinera.io/recursos" },
          ]),
          itemListLd,
        ]}
      />

      <NavV3 />
      <main
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#0A0A0A",
          background: "linear-gradient(180deg,#FAFAFA 0%,#FFFFFF 100%)",
        }}
      >
        <header
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "96px 24px 32px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: "#fff",
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#7C3AED",
              }}
            />
            Recursos · 2026
          </span>
          <h1
            style={{
              fontSize: "clamp(36px, 4.6vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              margin: "20px 0 14px",
            }}
          >
            Recursos para elegir el software clínico correcto
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#4B5563",
              lineHeight: 1.6,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            Comparativas honestas por ciudad: precios, fortalezas y
            debilidades reales de los softwares más usados en LATAM. Sin
            humo, sin listas infinitas de features.
          </p>
        </header>

        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "32px 24px 80px",
            display: "grid",
            gap: 48,
          }}
        >
          <section>
            <h2
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: "#6B7280",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Herramientas
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                margin: "0 0 16px",
              }}
            >
              Calculadoras y guías para evaluar tu operación clínica
            </p>
            <Link
              href="/recursos/calculadora-roi"
              style={{
                display: "block",
                background:
                  "linear-gradient(135deg, #0A0A0A 0%, #1F1B2E 100%)",
                color: "#fff",
                borderRadius: 16,
                padding: "28px 32px",
                textDecoration: "none",
                backgroundImage:
                  "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(217,70,239,.18), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.20), transparent 60%), linear-gradient(135deg, #0A0A0A 0%, #1F1B2E 100%)",
                boxShadow: "0 18px 40px -16px rgba(124,58,237,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily:
                        "JetBrains Mono, ui-monospace, monospace",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#D946EF",
                      background: "rgba(217,70,239,0.14)",
                      padding: "5px 12px",
                      borderRadius: 999,
                      marginBottom: 14,
                    }}
                  >
                    Nuevo · Calculadora
                  </span>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      margin: "0 0 8px",
                      lineHeight: 1.2,
                    }}
                  >
                    ¿Cuánto pierde tu clínica por no-shows?
                  </h3>
                  <p
                    style={{
                      fontSize: 14.5,
                      color: "rgba(255,255,255,0.72)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Mete 3 datos básicos y obtén tu ahorro anual estimado
                    con Clinera. Reporte personalizado por WhatsApp.
                  </p>
                </div>
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
                    color: "#fff",
                    padding: "12px 22px",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14.5,
                    flexShrink: 0,
                    boxShadow:
                      "0 12px 28px -8px rgba(124,58,237,0.5)",
                  }}
                >
                  Calcular ROI →
                </span>
              </div>
            </Link>
          </section>

          {(
            Object.entries(byTopic) as [
              keyof typeof TOPIC_LABELS,
              (typeof publishedRecursos)[number][],
            ][]
          )
            .filter(([, items]) => items.length > 0)
            .map(([topic, items]) => (
              <section key={topic}>
                <h2
                  style={{
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    margin: "0 0 6px",
                  }}
                >
                  {TOPIC_LABELS[topic]}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                    margin: "0 0 16px",
                  }}
                >
                  {items.length} {items.length === 1 ? "ciudad publicada" : "ciudades publicadas"}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 12,
                  }}
                >
                  {items.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/recursos/${r.slug}`}
                        style={{
                          display: "block",
                          background: "#fff",
                          border: "1px solid #EEECEA",
                          borderRadius: 14,
                          padding: "20px 22px",
                          textDecoration: "none",
                          color: "inherit",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 17,
                            fontWeight: 700,
                            letterSpacing: "-0.015em",
                            margin: "0 0 6px",
                            lineHeight: 1.25,
                          }}
                        >
                          {TOPIC_LABELS[topic]} en {r.ciudad}
                        </h3>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#6B7280",
                            margin: "0 0 10px",
                          }}
                        >
                          Comparativa real · {r.year}
                        </p>
                        <span
                          style={{
                            color: "#7C3AED",
                            fontWeight: 600,
                            fontSize: 13.5,
                          }}
                        >
                          Leer recurso →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </main>
      <FooterV3 />
    </>
  );
}
