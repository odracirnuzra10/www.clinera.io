import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema } from "@/components/seo/schemas";
import { allClinics, type Clinic } from "@/content/clinics";

export const metadata: Metadata = {
  title: "Clínicas con Clinera — Agenda por WhatsApp 24/7",
  description:
    "Directorio público de clínicas que usan Clinera para agendar pacientes por WhatsApp con IA. Estética, medicina regenerativa, salud metabólica en LATAM.",
  alternates: { canonical: "https://www.clinera.io/clinicas" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.clinera.io/clinicas",
    siteName: "Clinera.io",
    title: "Clínicas con Clinera — Agenda por WhatsApp 24/7",
    description:
      "Clínicas activas que usan Clinera para responder y agendar pacientes 24/7 por WhatsApp.",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínicas con Clinera — Agenda por WhatsApp 24/7",
    description: "Directorio de clínicas activas con Clinera en LATAM.",
    images: ["/images/og-banner.png"],
  },
};

export default function ClinicasIndexPage() {
  const visible = allClinics.filter((c) => c.consentGranted);
  // Group by ciudad — preserva orden de inserción según el dataset.
  const byCity = new Map<string, Clinic[]>();
  for (const c of visible) {
    if (!byCity.has(c.ciudad)) byCity.set(c.ciudad, []);
    byCity.get(c.ciudad)!.push(c);
  }

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: visible.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.clinera.io/clinicas/${c.slug}`,
      name: c.nombre,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Clínicas", url: "https://www.clinera.io/clinicas" },
          ]),
          itemListLd,
        ]}
      />

      <NavV3 />
      <main
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#0A0A0A",
          background:
            "linear-gradient(180deg,#FAFAFA 0%,#FFFFFF 100%)",
        }}
      >
        {/* Hero */}
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
            Directorio de clínicas
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
            Clínicas que agendan por WhatsApp 24/7 con Clinera
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#4B5563",
              lineHeight: 1.6,
              maxWidth: 680,
              margin: "0 auto",
            }}
          >
            Agenda directo por WhatsApp con cualquiera de las clínicas activas
            en Clinera. Te responde AURA, nuestro agente IA, en cualquier
            momento del día.
          </p>
        </header>

        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "32px 24px 80px",
            display: "grid",
            gap: 40,
          }}
        >
          {[...byCity.entries()].map(([ciudad, clinics]) => (
            <section key={ciudad}>
              <h2
                style={{
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "#6B7280",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                {ciudad} · {clinics.length}{" "}
                {clinics.length === 1 ? "clínica" : "clínicas"}
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 14,
                }}
              >
                {clinics.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/clinicas/${c.slug}`}
                      style={{
                        display: "block",
                        background: "#fff",
                        border: "1px solid #EEECEA",
                        borderRadius: 14,
                        padding: "20px 22px",
                        textDecoration: "none",
                        color: "inherit",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        transition: "transform .12s ease, box-shadow .12s ease",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          letterSpacing: "-0.015em",
                          margin: "0 0 6px",
                          lineHeight: 1.2,
                        }}
                      >
                        {c.nombre}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          margin: "0 0 10px",
                        }}
                      >
                        {c.especialidades.slice(0, 2).join(" · ")}
                      </p>
                      <span
                        style={{
                          color: "#7C3AED",
                          fontWeight: 600,
                          fontSize: 13.5,
                        }}
                      >
                        Ver clínica →
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
