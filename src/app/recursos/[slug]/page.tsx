import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, orgSchema } from "@/components/seo/schemas";
import { allClinics } from "@/content/clinics";
import {
  getRecursoBySlug,
  publishedRecursos,
  TOPIC_LABELS,
} from "@/content/recursos";
import {
  generateRecursoContent,
  type RecursoSection,
} from "@/content/recursos-templates";

export function generateStaticParams() {
  return publishedRecursos.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recurso = getRecursoBySlug(slug);
  if (!recurso) return {};
  const content = generateRecursoContent(recurso);
  const url = `https://www.clinera.io/recursos/${slug}`;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url,
      title: content.metaTitle,
      description: content.metaDescription,
      images: ["/images/og-banner.png"],
      publishedTime: recurso.publishedAt,
      ...(recurso.updatedAt && { modifiedTime: recurso.updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: ["/images/og-banner.png"],
    },
  };
}

export default async function RecursoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recurso = getRecursoBySlug(slug);
  if (!recurso) notFound();

  const content = generateRecursoContent(recurso);
  const topicLabel = TOPIC_LABELS[recurso.topic];
  const url = `https://www.clinera.io/recursos/${slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.h1,
    description: content.metaDescription,
    url,
    datePublished: recurso.publishedAt,
    dateModified: recurso.updatedAt || recurso.publishedAt,
    author: { "@type": "Organization", name: "Clinera" },
    publisher: { "@id": "https://www.clinera.io/#organization" },
    image: "https://www.clinera.io/images/og-banner.png",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: recurso.countryCode === "CL" ? "es-CL" : recurso.countryCode === "PE" ? "es-PE" : "es-CO",
    about: {
      "@type": "Thing",
      name: `${topicLabel} en ${recurso.ciudad}`,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          articleLd,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Recursos", url: "https://www.clinera.io/recursos" },
            { name: content.h1, url },
          ]),
          faqSchema(content.faqs),
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
        {/* Hero */}
        <header
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "96px 24px 32px",
          }}
        >
          <nav
            aria-label="breadcrumb"
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "#6B7280",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <Link href="/recursos" style={{ color: "#7C3AED" }}>
              Recursos
            </Link>
            <span style={{ margin: "0 8px" }}>·</span>
            <span>{topicLabel}</span>
            <span style={{ margin: "0 8px" }}>·</span>
            <span>{recurso.ciudad}</span>
          </nav>
          <h1
            style={{
              fontSize: "clamp(34px, 4.6vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
              margin: "0 0 18px",
            }}
          >
            {content.h1}
          </h1>
          <p
            style={{
              fontSize: 19,
              color: "#4B5563",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {content.intro}
          </p>
          <div
            style={{
              marginTop: 24,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 11,
              color: "#6B7280",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Publicado el{" "}
            {new Date(recurso.publishedAt).toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            {recurso.updatedAt &&
              ` · Actualizado ${new Date(recurso.updatedAt).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}`}
          </div>
        </header>

        <article
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "32px 24px 60px",
            display: "grid",
            gap: 28,
          }}
        >
          {content.sections.map((s, i) => (
            <SectionRenderer key={i} section={s} />
          ))}

          {/* FAQ */}
          <section>
            <h2 style={h2Style}>Preguntas frecuentes sobre software clínico en {recurso.ciudad}</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {content.faqs.map((f) => (
                <details
                  key={f.q}
                  style={{
                    background: "#fff",
                    border: "1px solid #EEECEA",
                    borderRadius: 12,
                    padding: "16px 20px",
                  }}
                >
                  <summary
                    style={{
                      fontWeight: 600,
                      fontSize: 15.5,
                      cursor: "pointer",
                      color: "#0A0A0A",
                    }}
                  >
                    {f.q}
                  </summary>
                  <p
                    style={{
                      marginTop: 10,
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: "#4B5563",
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section
            style={{
              marginTop: 16,
              background: "#0A0A0A",
              color: "#fff",
              borderRadius: 18,
              padding: "32px 36px",
              backgroundImage:
                "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(217,70,239,.25), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.22), transparent 60%)",
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              {content.cta.title}
            </h2>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.78)",
                margin: "0 0 22px",
                maxWidth: 620,
              }}
            >
              {content.cta.body}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href={content.cta.primaryHref}
                style={{
                  background: "#fff",
                  color: "#0A0A0A",
                  padding: "13px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14.5,
                }}
              >
                {content.cta.primaryLabel}
              </Link>
              <Link
                href={content.cta.secondaryHref}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.18)",
                  padding: "13px 22px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14.5,
                }}
              >
                {content.cta.secondaryLabel}
              </Link>
            </div>
          </section>

          {/* Otros recursos relacionados */}
          <section style={{ marginTop: 8 }}>
            <h3
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: "#6B7280",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Otras ciudades publicadas
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 8,
              }}
            >
              {publishedRecursos
                .filter((r) => r.slug !== slug && r.topic === recurso.topic)
                .map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/recursos/${r.slug}`}
                      style={{
                        display: "block",
                        background: "#fff",
                        border: "1px solid #EEECEA",
                        borderRadius: 12,
                        padding: "14px 18px",
                        textDecoration: "none",
                        color: "#0A0A0A",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {topicLabel} en {r.ciudad} →
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </article>
      </main>
      <FooterV3 />
    </>
  );
}

const h2Style = {
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  margin: "8px 0 14px",
} as const;

function SectionRenderer({ section }: { section: RecursoSection }) {
  if (section.type === "h2") {
    return <h2 style={h2Style}>{section.title}</h2>;
  }
  if (section.type === "p") {
    return (
      <p style={{ fontSize: 16.5, lineHeight: 1.65, color: "#374151", margin: 0 }}>
        {section.body}
      </p>
    );
  }
  if (section.type === "list-criterios") {
    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 8,
        }}
      >
        {section.items.map((it) => (
          <li
            key={it}
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#374151",
              paddingLeft: 22,
              position: "relative",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                width: 8,
                height: 8,
                borderRadius: 999,
                background:
                  "linear-gradient(135deg,#3B82F6,#7C3AED,#D946EF)",
              }}
            />
            {it}
          </li>
        ))}
      </ul>
    );
  }
  if (section.type === "software") {
    const { ranking, software: s } = section;
    const isClinera = ranking === 1;
    return (
      <article
        style={{
          background: isClinera ? "#0A0A0A" : "#fff",
          color: isClinera ? "#fff" : "#0A0A0A",
          border: isClinera ? "none" : "1px solid #EEECEA",
          borderRadius: 16,
          padding: "26px 28px",
          backgroundImage: isClinera
            ? "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(217,70,239,.22), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.18), transparent 60%)"
            : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: isClinera ? "#D946EF" : "#7C3AED",
            }}
          >
            #{ranking}
          </span>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: 0,
              color: isClinera ? "#fff" : "#0A0A0A",
            }}
          >
            {s.nombre}
          </h3>
        </div>
        <p
          style={{
            fontSize: 15.5,
            lineHeight: 1.6,
            color: isClinera ? "rgba(255,255,255,0.85)" : "#4B5563",
            margin: "0 0 16px",
          }}
        >
          {s.resumen}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: isClinera ? "rgba(255,255,255,0.6)" : "#6B7280",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Lo mejor
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              {s.fortalezas.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    paddingLeft: 16,
                    position: "relative",
                    color: isClinera ? "rgba(255,255,255,0.85)" : "#374151",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 7,
                      width: 5,
                      height: 5,
                      borderRadius: 999,
                      background: isClinera ? "#10B981" : "#10B981",
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: isClinera ? "rgba(255,255,255,0.6)" : "#6B7280",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Qué tiene que mejorar
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              {s.debilidades.map((d) => (
                <li
                  key={d}
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    paddingLeft: 16,
                    position: "relative",
                    color: isClinera ? "rgba(255,255,255,0.75)" : "#6B7280",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 7,
                      width: 5,
                      height: 5,
                      borderRadius: 999,
                      background: "#9CA3AF",
                    }}
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px,auto) 1fr",
            rowGap: 8,
            columnGap: 18,
            margin: "0 0 18px",
            fontSize: 13.5,
          }}
        >
          <dt
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: isClinera ? "rgba(255,255,255,0.6)" : "#6B7280",
              textTransform: "uppercase",
              alignSelf: "center",
            }}
          >
            Precio
          </dt>
          <dd style={{ margin: 0, color: isClinera ? "#fff" : "#0A0A0A" }}>
            {s.precioMensual}
          </dd>
          <dt
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: isClinera ? "rgba(255,255,255,0.6)" : "#6B7280",
              textTransform: "uppercase",
              alignSelf: "start",
            }}
          >
            Ideal para
          </dt>
          <dd
            style={{
              margin: 0,
              color: isClinera ? "rgba(255,255,255,0.85)" : "#374151",
              lineHeight: 1.5,
            }}
          >
            {s.idealPara}
          </dd>
        </dl>

        <Link
          href={s.ctaPrimaryHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: isClinera ? "#fff" : "#0A0A0A",
            color: isClinera ? "#0A0A0A" : "#fff",
            padding: "11px 20px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {s.ctaPrimaryLabel} →
        </Link>
      </article>
    );
  }
  if (section.type === "clinicas-locales") {
    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {section.clinicas.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/clinicas/${c.slug}`}
              style={{
                display: "block",
                background: "#fff",
                border: "1px solid #EEECEA",
                borderRadius: 12,
                padding: "16px 18px",
                textDecoration: "none",
                color: "#0A0A0A",
              }}
            >
              <h4
                style={{
                  fontSize: 15.5,
                  fontWeight: 700,
                  margin: "0 0 4px",
                  letterSpacing: "-0.015em",
                }}
              >
                {c.nombre}
              </h4>
              <p style={{ fontSize: 12.5, color: "#6B7280", margin: 0 }}>
                {c.especialidades.slice(0, 2).join(" · ")}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  color: "#7C3AED",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Ver clínica →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  if (section.type === "migracion") {
    return (
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 14,
        }}
      >
        {section.pasos.map((p) => (
          <li
            key={p.title}
            style={{
              background: "#fff",
              border: "1px solid #EEECEA",
              borderRadius: 12,
              padding: "18px 22px",
            }}
          >
            <h4
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                margin: "0 0 6px",
              }}
            >
              {p.title}
            </h4>
            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.6,
                color: "#4B5563",
                margin: 0,
              }}
            >
              {p.body}
            </p>
          </li>
        ))}
      </ol>
    );
  }
  return null;
}
