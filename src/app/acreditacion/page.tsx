import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  COUNTRIES,
  GLOSSARY,
  LAST_UPDATED,
  MODIFIED_ISO,
  PUBLISHED_ISO,
  TABLE_COLUMNS,
  TABLE_ROWS,
  TOC,
} from "./content";
import s from "./acreditacion.module.css";

export const metadata: Metadata = {
  title: "Normativa y acreditación de software clínico en LATAM",
  description:
    "Qué exige cada país a un sistema de ficha clínica electrónica en Chile (Ley 20.584, Ley 21.668 y Ley 21.719), México (NOM-024-SSA3-2012, NOM-004 y DGIS), Perú (Ley 30024, RENHICE y RM 164-2025/MINSA) y Colombia (Ley 2015 de 2020, Resolución 866 de 2021 e IHCE), quién valida el software y dónde está Clinera hoy.",
  alternates: { canonical: "https://www.clinera.io/acreditacion" },
  openGraph: {
    url: "https://www.clinera.io/acreditacion",
    title: "Normativa y acreditación de software clínico en LATAM — Clinera.io",
    description:
      "Chile, México, Perú y Colombia: qué exige cada marco normativo a una ficha clínica electrónica, quién valida el software y qué medidas técnicas están activas en Clinera.",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.clinera.io/acreditacion#article",
  headline: "Normativa y acreditación de software clínico en LATAM",
  description:
    "Marco normativo de la ficha clínica electrónica en Chile, México, Perú y Colombia: Ley 20.584, Ley 21.668, NOM-024-SSA3-2012, Ley 30024 y RENHICE, Ley 2015 de 2020 y Resolución 866 de 2021. Quién valida el software en cada país y qué medidas técnicas están activas en Clinera.",
  url: "https://www.clinera.io/acreditacion",
  inLanguage: "es",
  datePublished: PUBLISHED_ISO,
  dateModified: MODIFIED_ISO,
  author: { "@id": "https://clinera.io/#organization" },
  publisher: { "@id": "https://clinera.io/#organization" },
  about: [
    { "@type": "Legislation", name: "Ley 20.584 (Chile)" },
    { "@type": "Legislation", name: "Ley 21.668 (Chile)" },
    { "@type": "Legislation", name: "Ley 21.719 (Chile)" },
    { "@type": "Legislation", name: "NOM-024-SSA3-2012 (México)" },
    { "@type": "Legislation", name: "NOM-004-SSA3-2012 (México)" },
    { "@type": "Legislation", name: "Ley 30024 (Perú)" },
    { "@type": "Legislation", name: "RM 164-2025/MINSA (Perú)" },
    { "@type": "Legislation", name: "Ley 2015 de 2020 (Colombia)" },
    { "@type": "Legislation", name: "Resolución 866 de 2021 (Colombia)" },
    { "@type": "Legislation", name: "Resolución 1888 de 2025 (Colombia)" },
  ],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.clinera.io/acreditacion",
  },
};

export default function AcreditacionPage() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <NavV3 />
      <main className={s.page}>
        <header className={s.head}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>Normativa · LATAM</p>
            <div className={s.rule} aria-hidden="true" />
            <h1 className={s.h1}>Normativa y acreditación de software clínico en LATAM</h1>
            <p className={s.lede}>
              Qué exige cada país a un sistema de ficha clínica electrónica, quién lo valida, y
              dónde está Clinera hoy.
            </p>
            <p className={s.stamp}>Última actualización — {LAST_UPDATED}</p>

            <details className={s.tocMobile}>
              <summary className={s.tocSummary}>
                Contenido
                <span className={s.tocChevron} aria-hidden="true">
                  ▼
                </span>
              </summary>
              <ul className={s.tocMobileList}>
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </header>

        <div className={s.wrap}>
          <div className={s.shell}>
            <nav className={s.toc} aria-label="Contenido de la página">
              <p className={s.tocTitle}>Contenido</p>
              <ul className={s.tocList}>
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <article className={s.doc}>
              {/* Sección 0 — Dónde estamos hoy */}
              <section id="estado" className={s.section}>
                <h2 className={s.h2}>Clinera y la norma</h2>
                <div className={s.estado}>
                  <p className={s.estadoText}>
                    Clinera cumple con los requisitos técnicos que exige la normativa de ficha
                    clínica de Chile, México, Perú y Colombia: cifrado del contenido clínico, una
                    llave de cifrado por clínica, trazabilidad de acceso a la ficha y respaldo
                    continuo con restauración a un instante exacto. Son medidas activas hoy en la
                    plataforma, verificables en una revisión de due diligence.
                  </p>
                </div>
                <p className={s.p} style={{ marginTop: 18 }}>
                  El resumen de esas medidas técnicas —cifrado, aislamiento por clínica,
                  trazabilidad y respaldo— está en{" "}
                  <Link href="/ley20584">seguridad de datos</Link>.
                </p>
              </section>

              {/* Sección 1 — Tabla de equivalencias */}
              <section id="equivalencias" className={s.section}>
                <h2 className={s.h2}>Equivalencias entre los cuatro países</h2>
                <p className={s.p}>
                  El mismo concepto cambia de nombre, de organismo y de norma al cruzar cada
                  frontera. Esta tabla es el mapa de traducción.
                </p>
                <div className={s.tableScroll} tabIndex={0} role="region" aria-label="Tabla de equivalencias normativas entre Chile, México, Perú y Colombia">
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th scope="col">Concepto</th>
                        {TABLE_COLUMNS.map((c) => (
                          <th key={c} scope="col">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map((row) => (
                        <tr key={row.label}>
                          <th scope="row">{row.label}</th>
                          {row.cells.map((cell, i) => (
                            <td key={TABLE_COLUMNS[i]}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={s.tableNote}>
                  Desliza la tabla en horizontal si no ves las cuatro columnas
                </p>
              </section>

              {/* Secciones 2–5 — un bloque por país */}
              {COUNTRIES.map((c) => (
                <section key={c.id} id={c.id} className={s.section}>
                  <div className={s.countryHead}>
                    <span className={s.countryCode}>{c.code}</span>
                    <h2 className={s.h2}>{c.name}</h2>
                  </div>

                  <h3 className={s.h3}>Qué exige la norma</h3>
                  <p className={s.p}>{c.exige}</p>

                  <h3 className={s.h3}>Quién valida</h3>
                  <p className={s.p}>{c.valida}</p>

                  <h3 className={s.h3}>Cómo lo cubre la arquitectura de Clinera</h3>
                  <ul className={s.bullets}>
                    {c.arquitectura.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  <h3 className={s.h3}>Vocabulario del país</h3>
                  <ul className={s.chips}>
                    {c.vocabulario.map((v) => (
                      <li key={v} className={s.chip}>
                        {v}
                      </li>
                    ))}
                  </ul>

                  {c.guia && (
                    <p className={s.guia}>
                      <Link href={c.guia.href}>{c.guia.label}</Link>
                    </p>
                  )}
                </section>
              ))}

              {/* Sección 6 — Glosario */}
              <section id="glosario" className={s.section}>
                <h2 className={s.h2}>Glosario</h2>
                <p className={s.p}>
                  Las siglas que aparecen en una licitación, un contrato o una auditoría de
                  cualquiera de los cuatro países.
                </p>
                <dl className={s.glossary}>
                  {GLOSSARY.map((g) => (
                    <div key={g.term}>
                      <dt>{g.term}</dt>
                      <dd>{g.def}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Sección 7 — Aviso legal y CTA */}
              <section id="aviso" className={s.section}>
                <h2 className={s.h2}>Aviso legal</h2>
                <div className={s.closing}>
                  <p className={s.closingText}>
                    Esta página es informativa y no constituye asesoría legal. Las normas citadas
                    se modifican: la fecha del encabezado indica la última revisión de este
                    contenido. Lo que aquí se describe son las medidas técnicas activas en la
                    plataforma, verificables en una revisión de due diligence con acceso a la
                    arquitectura, los registros de acceso y la configuración de cifrado. Los
                    procesos de registro estatal de software clínico de México, Perú y Colombia
                    se encuentran en curso.
                  </p>
                  <div className={s.ctaRow}>
                    <Link href="https://wa.me/56985581524?text=necesito%20asistencia" target="_blank" rel="noopener noreferrer" className={s.ctaLink}>
                      Solicita asistencia
                      <span className={s.arrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                    <Link href="/ley20584" className={s.ctaSecondary}>
                      Ver las medidas de seguridad de datos
                      <span className={s.arrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <FooterV3 />
    </>
  );
}
