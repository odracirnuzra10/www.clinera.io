import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/components/seo/schemas";
import s from "./ley20584.module.css";

export const metadata: Metadata = {
  title: "Seguridad de datos clínicos — cifrado y trazabilidad de la ficha",
  description:
    "Cómo Clinera protege la ficha clínica: cifrado en reposo AES-256-GCM, una llave por clínica, trazabilidad de acceso y respaldo continuo, sobre los requisitos técnicos de la normativa de ficha clínica de Chile, México, Perú y Colombia.",
  alternates: { canonical: "https://www.clinera.io/ley20584" },
  openGraph: {
    url: "https://www.clinera.io/ley20584",
    title: "Tus datos clínicos, cifrados y trazables — Clinera.io",
    description:
      "Cifrado en reposo AES-256-GCM, una llave por clínica, trazabilidad de acceso a la ficha y respaldo continuo.",
    type: "article",
  },
};

const PUBLISHED = "2026-07-22";
const MODIFIED = "2026-10-01";
const LAST_UPDATED = "1 de octubre de 2026";

const MEDIDAS = [
  {
    title: "Cifrado en reposo",
    text: "Todo el contenido clínico, AES-256-GCM.",
  },
  {
    title: "Una llave por clínica",
    text: "Los datos de una clínica no se descifran con la de otra.",
  },
  {
    title: "Trazabilidad de la ficha",
    text: "Queda registrado quién accede a qué, y cuándo.",
  },
  {
    title: "Respaldo continuo",
    text: "Copias automáticas y restauración a un instante exacto.",
  },
];

const RESPUESTA_DIRECTA =
  "La Ley 20.584 exige llevar una ficha clínica por paciente: confidencial, conservada al menos 15 años y accesible solo a quienes participan en la atención. Puede ser electrónica si mantiene integridad y trazabilidad. Clinera cifra cada ficha, registra quién accede y la respalda de forma continua.";

const FAQS = [
  {
    q: "¿Qué exige la Ley 20.584 a la ficha clínica?",
    a: "Que exista un registro por paciente con lo necesario para integrar el proceso asistencial, que sea confidencial y que se conserve. El artículo 12 la define y la declara dato sensible; el artículo 13 regula reserva, conservación y acceso; el artículo 14 trata el consentimiento informado, que debe constar en la ficha cuando corresponde.",
  },
  {
    q: "¿Cuánto tiempo se debe conservar la ficha clínica?",
    a: "Al menos 15 años en poder del prestador, que es además responsable de su reserva (artículo 13).",
  },
  {
    q: "¿La ficha clínica puede ser electrónica?",
    a: "Sí. La ley reconoce el soporte electrónico, el papel u otro. Lo central no es el formato sino la integridad del registro: autenticidad, conservación, acceso oportuno, confidencialidad y trazabilidad.",
  },
  {
    q: "¿Quién puede acceder a la ficha clínica?",
    a: "Quienes participan en la atención del paciente. Fuera de ellos, el titular, su representante legal, los herederos, un tercero con poder simple ante notario, los tribunales y los organismos con facultades legales, según el caso. Trabajar en la clínica no equivale a poder ver cualquier ficha.",
  },
  {
    q: "¿Cómo protege Clinera la ficha clínica?",
    a: "Con cifrado en reposo AES-256-GCM, una llave de cifrado por clínica, registro de quién accede a qué y cuándo, y respaldo continuo con restauración a un instante exacto. Esta página es informativa y no constituye asesoría legal.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.clinera.io/ley20584#article",
  headline: "Tus datos clínicos, cifrados y trazables",
  description:
    "Medidas técnicas de protección de la ficha clínica en Clinera: cifrado en reposo AES-256-GCM, una llave de cifrado por clínica, trazabilidad de acceso y respaldo continuo con restauración punto en el tiempo.",
  url: "https://www.clinera.io/ley20584",
  inLanguage: "es",
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  author: { "@id": "https://clinera.io/#organization" },
  publisher: { "@id": "https://clinera.io/#organization" },
  isPartOf: { "@id": "https://www.clinera.io/acreditacion#article" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.clinera.io/ley20584",
  },
};

export default function Ley20584Page() {
  return (
    <>
      <JsonLd data={[articleSchema, faqSchema(FAQS)]} />
      <NavV3 />
      <main className={s.page}>
        {/* Bloque 0 — Hero */}
        <section className={s.hero}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>Seguridad de datos</p>
            <div className={s.rule} aria-hidden="true" />
            <h1 className={s.h1}>Tus datos clínicos, cifrados y trazables.</h1>
            <p className={s.lede}>
              La ficha clínica es el dato más sensible que existe. Así la protegemos.
            </p>
            <p className={s.answer}>{RESPUESTA_DIRECTA}</p>
            <div className={s.actions}>
              <Link href="/agenda?lead_source=ley20584" className={s.btnPrimary}>
                Agenda una demo
              </Link>
              <Link href="/novedades/fichas-clinicas" className={s.btnGhost}>
                Guía de ficha clínica
              </Link>
            </div>
            <p className={s.stamp}>Última actualización — {LAST_UPDATED}</p>
          </div>
        </section>

        {/* Bloque 1 — Cuatro medidas */}
        <section aria-label="Medidas activas">
          <div className={s.wrap}>
            <div className={s.cards}>
              {MEDIDAS.map((m, i) => (
                <article key={m.title} className={s.card}>
                  <p className={s.cardIdx}>{String(i + 1).padStart(2, "0")}</p>
                  <h2 className={s.cardTitle}>{m.title}</h2>
                  <p className={s.cardText}>{m.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bloque 2 — Envelope encryption */}
        <section className={s.envelope}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>Envelope encryption, en una frase</p>
            <p className={s.envSentence}>
              Cada ficha se cifra con una llave única por clínica, esa llave se guarda cifrada
              por una llave maestra en un servicio de custodia especializado, y un robo de la
              base de datos expone solo texto ilegible.
            </p>
          </div>
        </section>

        {/* Bloque 3 — Franja de países */}
        <section className={s.strip} aria-label="Países donde opera Clinera">
          <div className={s.wrap}>
            <div className={s.stripInner}>
              <p className={s.codes}>CL · MX · PE · CO</p>
              <p className={s.stripText}>
                Clinera está diseñado sobre los requisitos técnicos de la normativa de ficha
                clínica de cada país donde operamos.
              </p>
            </div>
          </div>
        </section>

        {/* Bloque 3b — Preguntas frecuentes */}
        <section className={s.faq} aria-label="Preguntas frecuentes">
          <div className={s.wrap}>
            <p className={s.eyebrow}>Preguntas frecuentes</p>
            <h2 className={s.faqTitle}>Ley 20.584 y ficha clínica</h2>
            <div className={s.faqList}>
              {FAQS.map((f) => (
                <details key={f.q} className={s.faqItem}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bloque 4 — Derivación */}
        <section className={s.cta}>
          <div className={s.wrap}>
            <p className={s.ctaDemo}>
              <Link href="/agenda?lead_source=ley20584" className={s.btnPrimary}>
                Ver la ficha clínica de Clinera en una demo
              </Link>
            </p>
            <Link href="/acreditacion" className={s.ctaLink}>
              Ver la normativa de cada país en detalle
              <span className={s.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Bloque 5 — Legal */}
        <section className={s.legal}>
          <div className={s.wrap}>
            <p className={s.legalText}>
              Esta página es informativa y no constituye asesoría legal. Lo que describe son las
              medidas técnicas activas en la plataforma, auditables en una revisión de due
              diligence. Qué exige cada marco normativo y quién lo valida está detallado en{" "}
              <Link href="/acreditacion">normativa y acreditación en LATAM</Link>. Para una
              revisión técnica con nuestro equipo,{" "}
              <Link href="/agenda">agenda una reunión</Link>.
            </p>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
