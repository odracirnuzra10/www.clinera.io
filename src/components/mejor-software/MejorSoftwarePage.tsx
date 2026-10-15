import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, orgSchema, webPageSchema } from "@/components/seo/schemas";
import type { RankingPais, SoftwareRanked } from "@/content/mejor-software";

const h2Style = {
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  margin: "8px 0 14px",
} as const;

function itemListSchema(ranking: RankingPais, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.h1,
    description: ranking.metaDescription,
    url: pageUrl,
    numberOfItems: ranking.software.length,
    itemListElement: ranking.software.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: s.nombre,
        description: s.resumen,
        ...(s.url && { url: s.url }),
        applicationCategory: "MedicalApplication",
      },
    })),
  };
}

function SoftwareCard({ software, rank }: { software: SoftwareRanked; rank: number }) {
  const isClinera = software.esClinera === true;
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
          #{rank}
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
          {software.nombre}
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
        {software.resumen}
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
            {software.fortalezas.map((f) => (
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
                    background: "#10B981",
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
            {software.debilidades.map((d) => (
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
        {software.precioMensual && (
          <>
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
              {software.precioMensual}
            </dd>
          </>
        )}
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
          {software.idealPara}
        </dd>
      </dl>

      {software.comparativaUrl && (
        <Link
          href={software.comparativaUrl}
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
          {isClinera ? "Ver empleados digitales" : "Ver comparativa con Clinera"} →
        </Link>
      )}
    </article>
  );
}

type Props = {
  ranking: RankingPais;
  pageUrl: string;
  breadcrumbLabel: string;
  parentLinks?: { label: string; href: string }[];
};

export function MejorSoftwarePage({ ranking, pageUrl, breadcrumbLabel, parentLinks }: Props) {
  const breadcrumbs = [
    { name: "Inicio", url: "https://www.clinera.io" },
    { name: "Mejor software para clínicas", url: "https://www.clinera.io/mejor-software-clinicas" },
    ...(parentLinks?.map((l) => ({
      name: l.label,
      url: `https://www.clinera.io${l.href}`,
    })) ?? []),
    { name: breadcrumbLabel, url: pageUrl },
  ];

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          webPageSchema({
            path: pageUrl.replace("https://www.clinera.io", "") || "/",
            name: ranking.metaTitle,
            description: ranking.metaDescription,
          }),
          itemListSchema(ranking, pageUrl),
          breadcrumbSchema(breadcrumbs),
          faqSchema(ranking.faqs),
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
            <Link href="/mejor-software-clinicas" style={{ color: "#7C3AED" }}>
              Mejor software
            </Link>
            {parentLinks?.map((l) => (
              <span key={l.href}>
                <span style={{ margin: "0 8px" }}>·</span>
                <Link href={l.href} style={{ color: "#7C3AED" }}>
                  {l.label}
                </Link>
              </span>
            ))}
            {ranking.pais !== "latam" && (
              <>
                <span style={{ margin: "0 8px" }}>·</span>
                <span>{breadcrumbLabel}</span>
              </>
            )}
          </nav>

          <p
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#6B7280",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            Actualizado:{" "}
            {new Date(ranking.updatedAt).toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1
            style={{
              fontSize: "clamp(34px, 4.6vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
              margin: "0 0 18px",
            }}
          >
            {ranking.h1}
          </h1>
          <p
            style={{
              fontSize: 19,
              color: "#4B5563",
              lineHeight: 1.6,
              margin: "0 0 16px",
            }}
          >
            {ranking.intro}
          </p>
          <p
            style={{
              fontSize: 13.5,
              color: "#6B7280",
              lineHeight: 1.5,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            Comparativa editada por el equipo de Clinera — criterios y fuentes al pie de
            cada sección.
          </p>
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
          <section>
            <h2 style={h2Style}>Criterios de evaluación</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 8,
              }}
            >
              {ranking.criterios.map((it) => (
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
                      background: "linear-gradient(135deg,#3B82F6,#7C3AED,#D946EF)",
                    }}
                  />
                  {it}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={h2Style}>Ranking {ranking.pais === "latam" ? "LATAM" : "completo"}</h2>
            <div style={{ display: "grid", gap: 20 }}>
              {ranking.software.map((s, i) => (
                <SoftwareCard key={s.nombre} software={s} rank={i + 1} />
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2Style}>Cómo elegir el software correcto</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 10,
              }}
            >
              {ranking.checklist.map((item, i) => (
                <li
                  key={item}
                  style={{
                    background: "#fff",
                    border: "1px solid #EEECEA",
                    borderRadius: 12,
                    padding: "16px 20px",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "#374151",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, ui-monospace, monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#7C3AED",
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {ranking.relatedComparativas && ranking.relatedComparativas.length > 0 && (
            <section>
              <h2 style={h2Style}>Comparativas detalladas</h2>
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
                {ranking.relatedComparativas.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
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
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ranking.cityLinks && ranking.cityLinks.length > 0 && (
            <section>
              <h2 style={h2Style}>Rankings por ciudad</h2>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 8,
                }}
              >
                {ranking.cityLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
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
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 style={h2Style}>Empleados digitales de Clinera</h2>
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.65,
                color: "#374151",
                margin: "0 0 16px",
              }}
            >
              Si tu criterio principal es IA que ejecuta — no solo responde — los tres
              empleados digitales de Clinera (AURA, CAMILA, LIA) operan sobre la misma
              memoria del paciente. Conoce cada rol en{" "}
              <Link href="/empleado-digital" style={{ color: "#7C3AED", fontWeight: 600 }}>
                /empleado-digital
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 style={h2Style}>Preguntas frecuentes</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {ranking.faqs.map((f) => (
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
              ¿Listo para probar Clinera en tu clínica?
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
              Agenda una reunión con un ingeniero de Clinera. Te mostramos AURA con tu
              flujo real en menos de 30 minutos — sin presentación genérica.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/agenda"
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
                Agendar reunión →
              </Link>
              <Link
                href="/planes"
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
                Ver planes desde USD 279/mes
              </Link>
            </div>
          </section>

          {ranking.pais === "latam" && (
            <section>
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
                Rankings por país
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 8,
                }}
              >
                {[
                  { label: "Chile", href: "/mejor-software-clinicas/chile" },
                  { label: "México", href: "/mejor-software-clinicas/mexico" },
                  { label: "Colombia", href: "/mejor-software-clinicas/colombia" },
                  { label: "Perú", href: "/mejor-software-clinicas/peru" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
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
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <FooterV3 />
    </>
  );
}
