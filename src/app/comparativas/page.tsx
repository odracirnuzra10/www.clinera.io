import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { allCruzadas } from "@/content/comparativas-cross";

export const metadata: Metadata = {
  title: "Comparativas — Clinera vs alternativas",
  description:
    "Comparamos Clinera con Reservo, AgendaPro, Medilink y hacerlo manual. Más comparativas cruzadas (AgendaPro vs Reservo, etc.) para decidir con datos.",
  alternates: { canonical: "https://www.clinera.io/comparativas" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://www.clinera.io/comparativas" },
  ],
};

const items = [
  {
    slug: "reservo",
    competitor: "Reservo",
    headline: "¿Reservo o Clinera?",
    bullets: [
      "Reservo: fuerte en ficha clínica y agendamiento manual clásico, 500+ clínicas en Chile.",
      "Clinera: IA conversacional (AURA) que responde WhatsApp 24/7 con memoria contextual.",
      "Precios públicos vs cotización privada de Reservo.",
    ],
  },
  {
    slug: "agendapro",
    competitor: "AgendaPro",
    headline: "¿AgendaPro o Clinera?",
    bullets: [
      "AgendaPro: la más grande en LATAM (20.000+ negocios), horizontal (salud + spa + gym).",
      "Clinera: 100% clínica, IA con LangChain + MCP, memoria contextual real.",
      "Desde USD 279/mes vs USD 19/usuario de AgendaPro.",
    ],
  },
  {
    slug: "medilink",
    competitor: "Medilink",
    headline: "¿Medilink o Clinera?",
    bullets: [
      "Medilink: Contact Center IA que cubre llamadas + WhatsApp, fuerte en ficha clínica.",
      "Clinera: WhatsApp IA con memoria contextual, MCP, precios públicos y prueba instantánea.",
      "Ambos referentes IA — la diferencia está en canal (voz vs chat) y transparencia comercial.",
    ],
  },
  {
    slug: "manual",
    competitor: "hacerlo manual",
    headline: "¿Seguir manual o Clinera?",
    bullets: [
      "Manual: 2-4h diarias de recepción, 30% no-shows y 40-60% de mensajes fuera de horario sin responder.",
      "Clinera: AURA contesta 24/7 y reduce no-shows a 5-10%.",
      "Payback en semanas: recuperas ~USD 2.000/mes en no-shows evitados por USD 279/mes.",
    ],
  },
  {
    slug: "dentalink",
    competitor: "Dentalink",
    headline: "¿Dentalink o Clinera?",
    bullets: [
      "Dentalink: líder dental LATAM (15.000+ clientes), 100% odontología con odontograma + ortodoncia + IA dental.",
      "Clinera: agnóstico de vertical, AURA WhatsApp 24/7 e integrable encima de Dentalink vía API/MCP.",
      "Si tu clínica también atiende otra vertical, Clinera la cubre sin pagar dos sistemas.",
    ],
  },
  {
    slug: "sacmed",
    competitor: "Sacmed",
    headline: "¿Sacmed o Clinera?",
    bullets: [
      "Sacmed: chileno, telemedicina certificada por Fonasa con receta QR, desde $26.000 CLP/mes.",
      "Clinera: AURA WhatsApp 24/7 con memoria contextual, atribución Meta/Google, cobertura LATAM.",
      "Combinable: Sacmed para telemedicina Fonasa + Clinera para WhatsApp y marketing.",
    ],
  },
];

export default function ComparativasHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <NavV3 />
      <main>
        <section className="hero-v2">
          <div className="hero-v2__halo" aria-hidden />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
              <span className="hero-v2__eyebrow" style={{ background: "rgba(0,159,227,0.08)", borderColor: "rgba(0,159,227,0.2)", color: "var(--brand-cyan)" }}>
                COMPARATIVAS · 2026
              </span>
              <h1 className="hero-v2__title" style={{ fontSize: "3rem" }}>
                Clinera vs AgendaPro, Reservo, Medilink y más:{" "}
                <span className="gt">comparativas con datos</span>.
              </h1>
              <p className="hero-v2__sub" style={{ margin: "0 auto" }}>
                ¿Clinera o la alternativa? Aquí decides. Comparamos Clinera con
                los sistemas más usados en LATAM — honesto, con tablas, precios
                y casos reales de migración.
              </p>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {items.map((item) => (
                <article
                  key={item.slug}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--divider-subtle)",
                    borderRadius: 16,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--brand-cyan)",
                    }}
                  >
                    Clinera vs {item.competitor}
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink-primary)", margin: 0 }}>
                    {item.headline}
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {item.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--ink-secondary)",
                          paddingLeft: 18,
                          position: "relative",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 8,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#009FE3,#C850C0)",
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/comparativas/${item.slug}`}
                    style={{
                      marginTop: "auto",
                      color: "var(--brand-cyan)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    Ver comparativa completa →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Otras comparativas útiles — cruzadas */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{ marginBottom: 28 }}>
                <span
                  style={{
                    fontFamily: "var(--font-tech)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink-tertiary)",
                  }}
                >
                  COMPARATIVAS CRUZADAS
                </span>
                <h2
                  style={{
                    fontSize: "1.7rem",
                    margin: "8px 0 8px",
                    color: "var(--ink-primary)",
                  }}
                >
                  Otras comparativas útiles
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "var(--ink-secondary)",
                    margin: 0,
                    maxWidth: 720,
                  }}
                >
                  Si ya estás comparando entre dos alternativas que no incluyen
                  a Clinera, dejamos el análisis honesto y agregamos a Clinera
                  como tercera opción.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 14,
                }}
              >
                {allCruzadas.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/comparativas/${c.slug}`}
                    style={{
                      display: "block",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 14,
                      padding: "20px 22px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-tech)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ink-tertiary)",
                        marginBottom: 6,
                      }}
                    >
                      {c.competitorA.name} vs {c.competitorB.name}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                        color: "var(--ink-primary)",
                        margin: "0 0 8px",
                        lineHeight: 1.25,
                      }}
                    >
                      {c.h1}
                    </h3>
                    <span
                      style={{
                        color: "var(--brand-cyan)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      Ver comparativa →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
