import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import type { Cruzada } from "@/content/comparativas-cross";

function Mark({ value }: { value: string }) {
  if (value === "yes")
    return (
      <span
        aria-label="Sí"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#009FE3,#7C3AED,#C850C0)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        ✓
      </span>
    );
  if (value === "no")
    return (
      <span
        aria-label="No"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#F5F6F8",
          color: "#8B92A5",
          fontSize: 14,
        }}
      >
        ✕
      </span>
    );
  if (value === "partial")
    return (
      <span
        aria-label="Parcial"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(245,166,35,0.12)",
          color: "#B57B00",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        ◐
      </span>
    );
  return (
    <span
      style={{
        fontFamily: "var(--font-tech)",
        fontSize: "0.85rem",
        color: "var(--ink-primary)",
        fontWeight: 500,
      }}
    >
      {value}
    </span>
  );
}

export function CrossComparativa({ data }: { data: Cruzada }) {
  const { competitorA: A, competitorB: B } = data;

  return (
    <>
      <NavV3 />
      <main>
        {/* HERO */}
        <section className="hero-v2">
          <div className="hero-v2__halo" aria-hidden />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 880, margin: "0 auto" }}>
              <span
                className="hero-v2__eyebrow"
                style={{
                  background: "rgba(0,159,227,0.08)",
                  borderColor: "rgba(0,159,227,0.2)",
                  color: "var(--brand-cyan)",
                }}
              >
                COMPARATIVA CRUZADA · 2026
              </span>
              <h1 className="hero-v2__title" style={{ fontSize: "2.75rem" }}>
                {data.h1}
              </h1>
              <p className="hero-v2__sub">{data.intro}</p>
              <div className="hero-v2__actions">
                <Link href="/agenda" className="hero-v2__primary">
                  Agendar reunión
                </Link>
                <a href="#tabla" className="hero-v2__secondary">
                  Ver tabla comparativa ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TL;DR — 3 boxes */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.7rem",
                  marginBottom: 24,
                  color: "var(--ink-primary)",
                  textAlign: "center",
                }}
              >
                TL;DR — ¿cuál te conviene?
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 18,
                }}
              >
                <article
                  style={{
                    background: "#fff",
                    border: "1px solid var(--divider-subtle)",
                    borderRadius: 16,
                    padding: "24px 26px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--ink-tertiary)",
                      marginBottom: 8,
                    }}
                  >
                    Si eliges {A.name}
                  </div>
                  <p
                    style={{
                      fontSize: "0.97rem",
                      lineHeight: 1.55,
                      color: "var(--ink-primary)",
                      margin: 0,
                    }}
                  >
                    {data.tldr.A}
                  </p>
                </article>
                <article
                  style={{
                    background: "#fff",
                    border: "1px solid var(--divider-subtle)",
                    borderRadius: 16,
                    padding: "24px 26px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--ink-tertiary)",
                      marginBottom: 8,
                    }}
                  >
                    Si eliges {B.name}
                  </div>
                  <p
                    style={{
                      fontSize: "0.97rem",
                      lineHeight: 1.55,
                      color: "var(--ink-primary)",
                      margin: 0,
                    }}
                  >
                    {data.tldr.B}
                  </p>
                </article>
                <article
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,159,227,0.3)",
                    borderRadius: 16,
                    padding: "24px 26px",
                    boxShadow: "0 12px 32px -16px rgba(0,159,227,0.25)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 16,
                      background:
                        "linear-gradient(135deg,#009FE3,#7C3AED,#C850C0)",
                      color: "#fff",
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.66rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontWeight: 700,
                    }}
                  >
                    Tercera opción
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--brand-cyan)",
                      marginBottom: 8,
                    }}
                  >
                    Si eliges Clinera
                  </div>
                  <p
                    style={{
                      fontSize: "0.97rem",
                      lineHeight: 1.55,
                      color: "var(--ink-primary)",
                      margin: 0,
                    }}
                  >
                    {data.tldr.clinera}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* TABLA 3 COLUMNAS */}
        <section className="section" style={{ paddingTop: 40 }} id="tabla">
          <div className="container">
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.7rem",
                  marginBottom: 6,
                  color: "var(--ink-primary)",
                  textAlign: "center",
                }}
              >
                Tabla comparativa — {data.table.length} features
              </h2>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.92rem",
                  color: "var(--ink-tertiary)",
                  marginBottom: 28,
                }}
              >
                Datos públicos a {new Date(data.publishedAt).toLocaleDateString("es-CL", { month: "long", year: "numeric" })}.
              </p>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--divider-subtle)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.93rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "var(--surface-1)" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "14px 18px",
                          fontFamily: "var(--font-tech)",
                          fontSize: "0.72rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--ink-tertiary)",
                          fontWeight: 600,
                        }}
                      >
                        Feature
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "14px 12px",
                          fontFamily: "var(--font-tech)",
                          fontSize: "0.78rem",
                          letterSpacing: "0.06em",
                          color: "var(--ink-secondary)",
                          fontWeight: 700,
                        }}
                      >
                        {A.name}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "14px 12px",
                          fontFamily: "var(--font-tech)",
                          fontSize: "0.78rem",
                          letterSpacing: "0.06em",
                          color: "var(--ink-secondary)",
                          fontWeight: 700,
                        }}
                      >
                        {B.name}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "14px 12px",
                          fontFamily: "var(--font-tech)",
                          fontSize: "0.78rem",
                          letterSpacing: "0.06em",
                          color: "var(--brand-cyan)",
                          fontWeight: 700,
                        }}
                      >
                        Clinera
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.map((row, i) => (
                      <tr
                        key={row.feature}
                        style={{
                          borderTop:
                            i === 0 ? "none" : "1px solid var(--divider-subtle)",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 18px",
                            color: "var(--ink-primary)",
                            lineHeight: 1.4,
                          }}
                        >
                          {row.feature}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <Mark value={row.A} />
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <Mark value={row.B} />
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <Mark value={row.clinera} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ANÁLISIS POR DIMENSIÓN */}
        <section className="section" style={{ paddingTop: 60 }}>
          <div className="container">
            <div style={{ maxWidth: 880, margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.7rem",
                  marginBottom: 24,
                  color: "var(--ink-primary)",
                  textAlign: "center",
                }}
              >
                Análisis por dimensión
              </h2>
              <div style={{ display: "grid", gap: 20 }}>
                {data.dimensions.map((d) => (
                  <article
                    key={d.title}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 14,
                      padding: "24px 28px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        margin: "0 0 10px",
                        color: "var(--ink-primary)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {d.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.97rem",
                        lineHeight: 1.65,
                        color: "var(--ink-secondary)",
                        margin: 0,
                      }}
                    >
                      {d.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 880, margin: "0 auto" }}>
              <h2
                style={{
                  fontSize: "1.7rem",
                  marginBottom: 24,
                  color: "var(--ink-primary)",
                  textAlign: "center",
                }}
              >
                Preguntas frecuentes
              </h2>
              <div style={{ display: "grid", gap: 12 }}>
                {data.faqs.map((f) => (
                  <details
                    key={f.q}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      padding: "18px 22px",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--ink-primary)",
                      }}
                    >
                      {f.q}
                    </summary>
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "var(--ink-secondary)",
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA + INTERNAL LINKING */}
        <section
          className="section"
          style={{ paddingTop: 60, paddingBottom: 80 }}
        >
          <div className="container">
            <div
              style={{
                maxWidth: 880,
                margin: "0 auto",
                background:
                  "linear-gradient(135deg,#0A0A0A 0%,#1a1230 100%)",
                color: "#fff",
                borderRadius: 20,
                padding: "40px 44px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "1.7rem",
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                ¿Quieres ver Clinera en acción?
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.75)",
                  margin: "0 auto 22px",
                  maxWidth: 600,
                }}
              >
                AURA atendiendo WhatsApp 24/7 con tu agenda y tu base de
                datos. Demo en vivo de 5 minutos.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Link
                  href="/agenda"
                  style={{
                    background: "#fff",
                    color: "#0A0A0A",
                    padding: "12px 22px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  Agendar reunión →
                </Link>
                <Link
                  href="/planes"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "12px 22px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  Ver planes y precios
                </Link>
              </div>
            </div>

            {/* Otras comparativas — internal linking */}
            <div
              style={{
                maxWidth: 880,
                margin: "40px auto 0",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-tertiary)",
                  textAlign: "center",
                  marginBottom: 18,
                }}
              >
                Seguir explorando
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                <li>
                  <Link
                    href={`/comparativas/${A.key}`}
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Clinera vs {A.name} →
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/comparativas/${B.key}`}
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Clinera vs {B.name} →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/efectividad"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Estudio de efectividad: 100% en ≤3 intentos →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/comparativas"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Ver todas las comparativas →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
