import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  KNOWN_AUTHORS,
  orgSchema,
  personSchema,
  webPageSchema,
} from "@/components/seo/schemas";

const TITLE = "Equipo Clinera";
const DESCRIPTION =
  "Quién está detrás de Clinera: Ricardo Oyarzún (fundador) y el equipo de producto y operaciones que implementa empleados digitales en clínicas LATAM.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/equipo" },
  openGraph: {
    url: "https://www.clinera.io/equipo",
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
};

const authors = Object.values(KNOWN_AUTHORS);

export default function EquipoPage() {
  const people = authors
    .map((a) => personSchema(a.slug))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          webPageSchema({
            path: "/equipo",
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Equipo", url: "https://www.clinera.io/equipo" },
          ]),
          ...people,
        ]}
      />
      <main
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#0A0A0A",
          background: "linear-gradient(180deg,#FAFAFA 0%,#FFFFFF 100%)",
        }}
      >
        <header
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: "96px 24px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6B7280",
              margin: "0 0 16px",
            }}
          >
            Quiénes somos
          </p>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: "0 0 12px",
            }}
          >
            Equipo Clinera
          </h1>
          <p style={{ fontSize: 17, color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
            {DESCRIPTION}
          </p>
        </header>

        <section
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "24px 24px 64px",
            display: "grid",
            gap: 24,
          }}
        >
          {authors.map((a) => (
            <article
              key={a.slug}
              id={a.slug}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                padding: 28,
              }}
            >
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>
                {a.name}
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#7C3AED",
                  margin: "0 0 12px",
                }}
              >
                {a.jobTitle}
              </p>
              {a.description && (
                <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {a.description}
                </p>
              )}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {a.sameAs.map((url) => (
                  <a
                    key={url}
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{ color: "#2563EB", fontWeight: 600, fontSize: 14 }}
                  >
                    LinkedIn →
                  </a>
                ))}
                <Link href="/efectividad" style={{ color: "#111318", fontWeight: 600, fontSize: 14 }}>
                  Estudio de efectividad →
                </Link>
              </div>
            </article>
          ))}
        </section>
        <PageUpdated path="/equipo" />
      </main>
      <FooterV3 />
    </>
  );
}
