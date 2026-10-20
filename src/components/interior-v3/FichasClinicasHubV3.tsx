"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import {
  CtaPrimary,
  CtaSecondary,
  Eyebrow,
  GRAD,
  Mono,
} from "@/components/brand-v3/Brand";

/* ============================================================
   /novedades/fichas-clinicas — Hub categoria SEO + AEO
   Long-form ~3.000 palabras, 7 H2 + FAQ + CTA + grid de articulos
   ============================================================ */

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = window.setTimeout(
      () => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")),
      1200
    );
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);
}

const CLUSTER_ARTICLES = [
  {
    slug: "que-es-una-ficha-clinica",
    title: "¿Qué es una ficha clínica?",
    excerpt: "Definición completa, marco legal y diferencia con la historia clínica.",
    readMin: 7,
  },
  {
    slug: "ficha-clinica-electronica-chile",
    title: "Ficha clínica electrónica (FCE) en Chile",
    excerpt: "Marco legal, requisitos técnicos y cómo implementarla en tu clínica.",
    readMin: 9,
  },
  {
    slug: "elementos-ficha-clinica-chile",
    title: "8 elementos obligatorios de una ficha clínica",
    excerpt: "Checklist exhaustivo más modelo descargable en PDF.",
    readMin: 6,
  },
  {
    slug: "normativa-ficha-clinica-chile-ley-20584",
    title: "Ley 20.584 y la ficha clínica",
    excerpt: "Artículos clave, derechos del paciente y sanciones por incumplimiento.",
    readMin: 8,
  },
  {
    slug: "como-pedir-ficha-clinica-chile",
    title: "Cómo pedir tu ficha clínica en Chile",
    excerpt: "Paso a paso para pacientes en sistema público y privado.",
    readMin: 5,
  },
  {
    slug: "software-ficha-clinica-electronica",
    title: "Software de ficha clínica electrónica",
    excerpt: "Comparativa, criterios de selección y caso Clinera AURA.",
    readMin: 10,
  },
  {
    slug: "ficha-clinica-papel-vs-electronica",
    title: "Ficha clínica en papel vs electrónica",
    excerpt: "Tabla maestra con 12 criterios comparados y guía de migración.",
    readMin: 7,
  },
  {
    slug: "ficha-clinica-estetica-vs-medica",
    title: "Ficha clínica en clínica estética vs médica",
    excerpt: "Particularidades, fotos antes/después y consentimientos informados.",
    readMin: 6,
  },
];

export default function FichasClinicasHubV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
        .fc-prose h2 {
          font-family: Inter;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.15;
          color: #0A0A0A;
          margin: 56px 0 18px;
          scroll-margin-top: 80px;
        }
        .fc-prose h3 {
          font-family: Inter;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1.25;
          color: #0A0A0A;
          margin: 32px 0 12px;
        }
        .fc-prose p {
          font-family: Inter;
          font-size: 17px;
          color: #1F2937;
          line-height: 1.65;
          margin: 0 0 18px;
        }
        .fc-prose p > strong { color: #0A0A0A; font-weight: 700; }
        .fc-prose a {
          color: #2563EB;
          text-decoration: underline;
          text-decoration-color: rgba(124, 58, 237, 0.4);
          text-underline-offset: 3px;
        }
        .fc-prose a:hover { text-decoration-color: #7C3AED; }
        .fc-prose ul, .fc-prose ol {
          font-family: Inter;
          font-size: 17px;
          color: #1F2937;
          line-height: 1.65;
          margin: 0 0 18px;
          padding-left: 24px;
        }
        .fc-prose li { margin-bottom: 8px; }
        .fc-prose .lead {
          font-size: 19px;
          line-height: 1.6;
          color: #0A0A0A;
          font-weight: 500;
          padding: 20px 24px;
          background: linear-gradient(135deg, rgba(59,130,246,.06) 0%, rgba(124,58,237,.06) 50%, rgba(217,70,239,.06) 100%);
          border-left: 3px solid #7C3AED;
          border-radius: 6px;
          margin: 0 0 32px;
        }
        .fc-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          font-family: Inter;
          font-size: 14.5px;
          background: #fff;
          border: 1px solid #EEECEA;
          border-radius: 12px;
          overflow: hidden;
        }
        .fc-prose th {
          text-align: left;
          padding: 12px 16px;
          background: #FAFAFA;
          font-weight: 700;
          color: #0A0A0A;
          border-bottom: 1px solid #EEECEA;
          font-size: 13.5px;
        }
        .fc-prose td {
          padding: 12px 16px;
          border-bottom: 1px solid #F3F2F0;
          color: #374151;
          vertical-align: top;
        }
        .fc-prose tr:last-child td { border-bottom: 0; }
        .fc-prose .stat-callout {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          border-radius: 12px;
          margin: 24px 0;
        }
        .fc-prose .stat-callout .num {
          font-family: Inter;
          font-size: 32px;
          font-weight: 800;
          color: #065F46;
          line-height: 1;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .fc-prose .stat-callout .body {
          font-size: 15px;
          color: #065F46;
          line-height: 1.5;
          margin: 0;
        }
        .fc-prose .toc {
          background: #FAFAFA;
          border: 1px solid #EEECEA;
          border-radius: 14px;
          padding: 22px 26px;
          margin: 0 0 40px;
        }
        .fc-prose .toc-title {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6B7280;
          margin-bottom: 12px;
        }
        .fc-prose .toc ol {
          counter-reset: toc;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .fc-prose .toc li {
          counter-increment: toc;
          padding: 6px 0;
          position: relative;
          padding-left: 36px;
          margin-bottom: 0;
          font-size: 15px;
          line-height: 1.4;
        }
        .fc-prose .toc li::before {
          content: counter(toc, decimal-leading-zero);
          position: absolute;
          left: 0;
          top: 6px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          font-weight: 600;
          color: #7C3AED;
        }
        .fc-prose .toc a { text-decoration: none; color: #0A0A0A; font-weight: 500; }
        .fc-prose .toc a:hover { color: #7C3AED; }
      `}</style>

      <Hero />
      <Body />
      <ClusterGrid />
      <Faq />
      <FinalCTA />
    </>
  );
}

/* -------------------------------- HERO -------------------------------- */
function Hero() {
  return (
    <section style={{ position: "relative", padding: "80px 80px 32px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, #DBEAFE 0%, #E9D5FF 30%, #FBE8F0 55%, #FFFFFF 80%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <span
          className="reveal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: "#fff",
            border: "1px solid #E5E7EB",
            padding: "6px 12px",
            borderRadius: 999,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: GRAD,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            ✦
          </span>
          Categoría · Fichas Clínicas
        </span>
        <h1
          className="reveal fc-hero-title"
          style={{
            fontFamily: "Inter",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            margin: "20px auto 0",
            color: "#0A0A0A",
          }}
        >
          Ficha Clínica:{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            guía completa
          </span>{" "}
          para clínicas y pacientes en Chile (2026).
        </h1>
        <p
          className="reveal"
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            fontWeight: 400,
            lineHeight: 1.6,
            color: "#4B5563",
            margin: "20px auto 0",
            maxWidth: 720,
          }}
        >
          Qué es, qué dice la Ley 20.584, cuáles son sus elementos obligatorios, cómo migrar a
          ficha clínica electrónica (FCE), cómo solicitarla como paciente y qué software elegir.
          Todo en un solo lugar, actualizado a 2026.
        </p>
        <div
          className="reveal"
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <CtaPrimary as={Link} href="/funciones" style={{ padding: "13px 22px", fontSize: 15 }}>
            Ver software Clinera <span>→</span>
          </CtaPrimary>
          <CtaSecondary as={Link} href="/agenda" style={{ padding: "13px 22px", fontSize: 15 }}>
            Agendar reunión
          </CtaSecondary>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.fc-hero-title) { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}

/* -------------------------------- BODY -------------------------------- */
function Body() {
  return (
    <section style={{ padding: "32px 80px 64px", background: "#fff" }}>
      <article className="reveal fc-prose" style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Apertura citable — primer parrafo de 60 palabras pensado para AI Overview */}
        <p className="lead">
          La <strong>ficha clínica</strong> es el documento confidencial donde un equipo de salud
          registra toda la atención médica de un paciente: identificación, antecedentes,
          diagnósticos, tratamientos y evolución. En Chile está regulada por la{" "}
          <strong>Ley 20.584</strong> y debe conservarse mínimo <strong>15 años</strong>. Puede
          ser en papel o electrónica (FCE), siendo la electrónica el estándar actual.
        </p>

        <nav className="toc" aria-label="Tabla de contenido">
          <div className="toc-title">En esta guía</div>
          <ol>
            <li><a href="#que-es">¿Qué es una ficha clínica?</a></li>
            <li><a href="#ley-20584">Marco legal: Ley 20.584 y normativa Minsal</a></li>
            <li><a href="#elementos">Elementos obligatorios de una ficha clínica</a></li>
            <li><a href="#fce">Ficha clínica electrónica (FCE): el estándar 2026</a></li>
            <li><a href="#solicitar">Cómo solicitar tu ficha clínica como paciente</a></li>
            <li><a href="#estetica">Ficha clínica en clínicas estéticas: particularidades</a></li>
            <li><a href="#software">Software de ficha clínica electrónica: qué buscar</a></li>
            <li><a href="#articulos">Profundiza por tema</a></li>
            <li><a href="#faq">Preguntas frecuentes</a></li>
          </ol>
        </nav>

        {/* ============== H2 1 ============== */}
        <h2 id="que-es">¿Qué es una ficha clínica?</h2>
        <p>
          Una ficha clínica es el <strong>registro único, confidencial y obligatorio</strong> de
          toda la atención de salud que recibe un paciente en un establecimiento. Su función no
          es burocrática: es la memoria estructurada del caso, el documento que permite al equipo
          tratante tomar decisiones seguras y al paciente conocer y reclamar la atención que
          recibió.
        </p>
        <p>
          En Chile, la ficha clínica está definida formalmente en el{" "}
          <strong>Decreto 41 del Ministerio de Salud</strong> (que reglamenta la Ley 20.584) como
          el <em>&ldquo;instrumento obligatorio en el que se registra el conjunto de antecedentes
          relativos a las diferentes áreas relacionadas con la salud de las personas&rdquo;</em>.
          Eso incluye datos de identificación, anamnesis, exámenes, diagnósticos, indicaciones,
          procedimientos y evolución.
        </p>

        <h3>Ficha clínica vs historia clínica</h3>
        <p>
          Mucha gente usa los términos de manera intercambiable, pero hay matiz. La{" "}
          <strong>ficha</strong> es el contenedor formal que existe por establecimiento; la{" "}
          <strong>historia clínica</strong> es el relato cronológico longitudinal de la salud de
          la persona, que puede atravesar varios establecimientos. En la práctica chilena, &ldquo;ficha
          clínica&rdquo; es el término legal y operativo que se usa en clínicas y hospitales.
        </p>
        <table>
          <thead>
            <tr>
              <th>Dimensión</th>
              <th>Ficha clínica</th>
              <th>Historia clínica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alcance</td>
              <td>Por establecimiento</td>
              <td>Longitudinal del paciente</td>
            </tr>
            <tr>
              <td>Marco legal CL</td>
              <td>Ley 20.584 + Decreto 41 Minsal</td>
              <td>No tiene una definición legal propia distinta</td>
            </tr>
            <tr>
              <td>Custodia</td>
              <td>Establecimiento de salud</td>
              <td>Persona / sistema integrado (Minsal)</td>
            </tr>
            <tr>
              <td>Conservación mínima</td>
              <td>15 años desde la última atención</td>
              <td>Sin plazo único definido</td>
            </tr>
          </tbody>
        </table>
        <p>
          Para profundizar: <Link href="/blog/que-es-una-ficha-clinica">Qué es una ficha clínica</Link>{" "}
          (definición legal, sujetos involucrados y casos por especialidad).
        </p>

        {/* ============== H2 2 ============== */}
        <h2 id="ley-20584">Marco legal en Chile: Ley 20.584 y normativa Minsal</h2>
        <p>
          La{" "}
          <a href="https://www.bcn.cl/leychile/navegar?idNorma=1039348" target="_blank" rel="noopener">
            Ley 20.584
          </a>{" "}
          (publicada en abril de 2012) regula los <strong>derechos y deberes de las personas en
          relación con acciones vinculadas a su atención en salud</strong>. La ficha clínica está
          tratada explícitamente en sus artículos 12, 13 y 14, que cubren tres ejes:
        </p>
        <ol>
          <li>
            <strong>Carácter obligatorio.</strong> Todo prestador, público o privado, debe
            mantener una ficha por cada paciente atendido.
          </li>
          <li>
            <strong>Confidencialidad.</strong> El contenido es sensible y reservado. Solo pueden
            acceder el paciente, los profesionales tratantes, los tribunales con orden judicial
            específica y la autoridad sanitaria en investigaciones epidemiológicas.
          </li>
          <li>
            <strong>Derecho de acceso del paciente.</strong> El paciente puede solicitar copia de
            su propia ficha y debe recibirla en un plazo razonable (en la práctica, hasta 15 días
            hábiles en clínicas privadas).
          </li>
        </ol>
        <p>
          El <strong>Decreto 41 del Minsal</strong> (publicado en 2012 y vigente con modificaciones)
          aterriza la operativa: define qué debe contener la ficha, cómo se conserva, quién es
          responsable y cómo se entrega al paciente que la solicita. También consagra la validez
          de la ficha clínica electrónica (FCE) bajo ciertas condiciones técnicas (firma
          electrónica avanzada, trazabilidad, respaldo).
        </p>
        <p>
          <strong>Sanciones.</strong> El incumplimiento puede derivar en multas administrativas,
          sumarios sanitarios y, en casos de filtración dolosa de información, responsabilidad
          civil y penal por violación de secreto profesional.
        </p>
        <p>
          Análisis completo de los artículos clave y casos chilenos en{" "}
          <Link href="/blog/normativa-ficha-clinica-chile-ley-20584">
            Ley 20.584 y la ficha clínica
          </Link>
          .
        </p>

        {/* ============== H2 3 ============== */}
        <h2 id="elementos">Elementos obligatorios de una ficha clínica</h2>
        <p>
          Una ficha clínica chilena, sea papel o electrónica, debe contener al menos{" "}
          <strong>8 bloques estructurados</strong>. Esta lista funciona como checklist para
          auditorías internas y para evaluar cualquier software de FCE:
        </p>
        <ol>
          <li>
            <strong>Identificación del paciente.</strong> RUT/cédula, nombre completo, fecha de
            nacimiento, sexo registral, datos de contacto y previsión (Fonasa, Isapre, particular).
          </li>
          <li>
            <strong>Antecedentes.</strong> Mórbidos personales, familiares, quirúrgicos,
            alergias, medicamentos en uso, hábitos relevantes (tabaco, alcohol).
          </li>
          <li>
            <strong>Anamnesis y motivo de consulta.</strong> Relato del paciente con sus
            síntomas, tiempo de evolución y contexto.
          </li>
          <li>
            <strong>Examen físico.</strong> Signos vitales y hallazgos por sistema según
            corresponda al motivo de consulta.
          </li>
          <li>
            <strong>Diagnósticos.</strong> Codificación CIE-10 cuando aplique, hipótesis
            diferenciales y diagnóstico definitivo.
          </li>
          <li>
            <strong>Indicaciones y prescripciones.</strong> Tratamientos farmacológicos, no
            farmacológicos, derivaciones, exámenes solicitados.
          </li>
          <li>
            <strong>Resultados de exámenes y procedimientos.</strong> Adjuntos, imágenes,
            informes de laboratorio, consentimientos firmados.
          </li>
          <li>
            <strong>Identificación del profesional tratante.</strong> Nombre, RUT profesional,
            firma (manuscrita o electrónica avanzada) y fecha-hora del registro.
          </li>
        </ol>
        <p>
          Cada bloque tiene reglas finas (formato de fechas, unidades obligatorias, codificación).
          La guía con plantillas concretas y un modelo descargable está en{" "}
          <Link href="/blog/elementos-ficha-clinica-chile">
            8 elementos obligatorios de una ficha clínica
          </Link>
          .
        </p>

        {/* ============== H2 4 ============== */}
        <h2 id="fce">Ficha clínica electrónica (FCE): el estándar 2026</h2>
        <p>
          La <strong>ficha clínica electrónica (FCE)</strong> es la versión digital, firmada
          electrónicamente y respaldada de forma trazable, del mismo documento. En Chile, su
          validez legal es plena desde el Decreto 41 del Minsal y el reconocimiento de la firma
          electrónica avanzada (Ley 19.799). En 2026, es el estándar operativo en clínicas
          medianas y grandes — el papel sobrevive principalmente en consultas individuales y
          centros muy pequeños.
        </p>
        <div className="stat-callout">
          <div className="num">78%</div>
          <p className="body">
            de las clínicas chilenas usan ficha clínica electrónica en 2025, según muestra interna
            de Clinera sobre 52 establecimientos activos en Chile, México, Perú y Colombia.
          </p>
        </div>
        <h3>Papel vs electrónica: comparación rápida</h3>
        <table>
          <thead>
            <tr>
              <th>Criterio</th>
              <th>Papel</th>
              <th>Electrónica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tiempo de creación por consulta</td>
              <td>5-10 min</td>
              <td>2-4 min (con IA, &lt;1 min)</td>
            </tr>
            <tr>
              <td>Búsqueda de paciente histórico</td>
              <td>2-15 min</td>
              <td>Instantánea</td>
            </tr>
            <tr>
              <td>Riesgo de pérdida</td>
              <td>Alto (incendio, humedad, traspapeleo)</td>
              <td>Bajo con respaldo en la nube</td>
            </tr>
            <tr>
              <td>Costo anual archivo físico</td>
              <td>USD 600-2.000 / 1.000 fichas</td>
              <td>Incluido en suscripción del software</td>
            </tr>
            <tr>
              <td>Acceso multi-sede</td>
              <td>No</td>
              <td>Sí, en tiempo real</td>
            </tr>
            <tr>
              <td>Cumplimiento normativo</td>
              <td>Manual y reactivo</td>
              <td>Automatizable (logs, firma, respaldo)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Profundización en{" "}
          <Link href="/blog/ficha-clinica-electronica-chile">FCE en Chile</Link> y{" "}
          <Link href="/blog/ficha-clinica-papel-vs-electronica">
            comparativa exhaustiva papel vs electrónica
          </Link>
          .
        </p>

        {/* ============== H2 5 ============== */}
        <h2 id="solicitar">Cómo solicitar tu ficha clínica como paciente</h2>
        <p>
          Como paciente tienes derecho a pedir y recibir copia de tu ficha clínica. El cómo
          depende del tipo de prestador:
        </p>
        <ol>
          <li>
            <strong>Sistema público.</strong> Vía{" "}
            <a href="https://portalpaciente.minsal.cl" target="_blank" rel="noopener">
              Portal Paciente del Minsal
            </a>{" "}
            con ClaveÚnica, o presencialmente en la OIRS del establecimiento donde te atendieron.
            Plazos de respuesta varían por hospital (5–15 días hábiles).
          </li>
          <li>
            <strong>Clínicas privadas.</strong> Solicitud por escrito al área de archivos
            médicos. La clínica debe entregar copia en máximo 15 días hábiles. Algunas cobran un
            arancel administrativo razonable por reproducción.
          </li>
          <li>
            <strong>Por terceros.</strong> Familiares directos en caso de fallecimiento del
            paciente, o representantes legales con poder notarial. Tribunales pueden requerirla
            con orden judicial.
          </li>
        </ol>
        <p>
          Si te niegan el acceso sin causa justificada, podés reclamar ante la{" "}
          <strong>Superintendencia de Salud</strong>. Pasos detallados, modelos de carta y casos
          prácticos en{" "}
          <Link href="/blog/como-pedir-ficha-clinica-chile">
            Cómo pedir tu ficha clínica en Chile
          </Link>
          .
        </p>

        {/* ============== H2 6 ============== */}
        <h2 id="estetica">Ficha clínica en clínicas estéticas: particularidades</h2>
        <p>
          Las clínicas estéticas operan bajo el mismo marco legal (Ley 20.584) que cualquier
          prestador de salud, pero la operativa diaria suma elementos que la ficha tradicional no
          contempla bien:
        </p>
        <ul>
          <li>
            <strong>Fotografías antes/después</strong> con consentimiento explícito de uso clínico
            y, separadamente, de uso comunicacional. Se almacenan dentro de la ficha con metadata
            (fecha, profesional, área tratada).
          </li>
          <li>
            <strong>Plan de tratamiento multi-sesión.</strong> A diferencia de una consulta
            médica única, un protocolo estético típico abarca 6–12 sesiones con productos,
            parámetros de equipo y reacciones registradas.
          </li>
          <li>
            <strong>Consentimientos informados específicos</strong> por procedimiento (toxina
            botulínica, ácido hialurónico, criolipólisis, HIFU). Cada uno con riesgos, alternativas
            y firma.
          </li>
          <li>
            <strong>Datos del producto inyectado</strong> cuando aplique: lote, fabricante, fecha
            de vencimiento. Es exigible legalmente y crítico ante reacciones adversas.
          </li>
        </ul>
        <p>
          Una ficha clínica estética bien armada es también un activo comercial: documenta
          resultados con evidencia y permite al equipo retomar el plan en cualquier sesión sin
          depender de la memoria del profesional. Más detalle en{" "}
          <Link href="/blog/ficha-clinica-estetica-vs-medica">
            Ficha clínica en clínica estética vs médica
          </Link>
          .
        </p>

        {/* ============== H2 7 ============== */}
        <h2 id="software">Software de ficha clínica electrónica: qué buscar</h2>
        <p>
          Elegir software FCE no es elegir un visor de PDF — es elegir el sistema operativo de la
          clínica para los próximos 5–10 años. Las clínicas que se equivocan terminan con datos
          atrapados, fugas de profesionales por mala UX y costos ocultos que duplican la
          suscripción mensual.
        </p>
        <h3>Checklist mínimo para evaluar</h3>
        <table>
          <thead>
            <tr>
              <th>Criterio</th>
              <th>Por qué importa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cumplimiento Ley 20.584 + Decreto 41</td>
              <td>Firma electrónica avanzada, logs de acceso, respaldo trazable</td>
            </tr>
            <tr>
              <td>Plantillas por especialidad</td>
              <td>Dental, estética, médica general, kinesiología — no template único</td>
            </tr>
            <tr>
              <td>Adjuntos (fotos, exámenes)</td>
              <td>Sin tope mensual, almacenamiento cifrado en Chile (Google Cloud, región Santiago)</td>
            </tr>
            <tr>
              <td>API e integraciones</td>
              <td>Para sincronizar con agenda, WhatsApp, contabilidad y campañas Meta/Google</td>
            </tr>
            <tr>
              <td>IA de autocompletado</td>
              <td>Reduce el tiempo de redacción 50–70% (medido en clientes Clinera con AURA)</td>
            </tr>
            <tr>
              <td>Multi-sede / multi-profesional</td>
              <td>Permisos por rol y vista unificada cuando crece la clínica</td>
            </tr>
            <tr>
              <td>Migración asistida desde el sistema actual</td>
              <td>Si la clínica ya tiene fichas en otro software o papel</td>
            </tr>
            <tr>
              <td>Soporte en español LATAM</td>
              <td>Tickets resueltos en horario hábil de la zona, no email a Estados Unidos</td>
            </tr>
          </tbody>
        </table>
        <p>
          Comparativa con criterios reales (Clinera vs los principales players LATAM) y cómo
          calcular el ROI real de migrar en{" "}
          <Link href="/blog/software-ficha-clinica-electronica">
            Software de ficha clínica electrónica
          </Link>
          . Si querés ver Clinera AURA en acción con tu clínica concreta,{" "}
          <Link href="/funciones">revisá las funciones</Link> o{" "}
          <Link href="/agenda">agendá una demo</Link>.
        </p>
      </article>
    </section>
  );
}

/* ----------------------------- CLUSTER GRID ---------------------------- */
function ClusterGrid() {
  return (
    <section
      id="articulos"
      style={{
        padding: "72px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <Mono>Profundiza por tema</Mono>
          <h2
            className="fc-cluster-title"
            style={{
              fontFamily: "Inter",
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "12px 0 0",
              color: "#0A0A0A",
            }}
          >
            Los 8 artículos del cluster Fichas Clínicas.
          </h2>
        </div>
        <div
          className="fc-cluster-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {CLUSTER_ARTICLES.map((a, i) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#fff",
                border: "1px solid #EEECEA",
                borderRadius: 14,
                padding: "18px 20px 20px",
                textDecoration: "none",
                color: "inherit",
                transition: "transform .2s, box-shadow .2s, border-color .2s",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7C3AED",
                }}
              >
                {String(i + 1).padStart(2, "0")} · {a.readMin} min
              </span>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.25,
                  margin: 0,
                  color: "#0A0A0A",
                }}
              >
                {a.title}
              </h3>
              <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                {a.excerpt}
              </p>
              <span
                style={{
                  marginTop: "auto",
                  paddingTop: 10,
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0A0A0A",
                }}
              >
                Leer artículo →
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.fc-cluster-grid) { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          :global(.fc-cluster-grid) { grid-template-columns: 1fr !important; }
          :global(.fc-cluster-title) { font-size: 28px !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------- FAQ ---------------------------- */
function Faq() {
  const items = [
    {
      q: "¿Qué es una ficha clínica?",
      a: "La ficha clínica es el documento único, confidencial y obligatorio donde se registra toda la atención de salud de un paciente: identificación, antecedentes, diagnósticos, tratamientos y evolución. En Chile está regulada por la Ley 20.584.",
    },
    {
      q: "¿Cuánto tiempo se debe guardar una ficha clínica en Chile?",
      a: "La normativa chilena exige conservar la ficha clínica por mínimo 15 años desde la última atención. En soporte electrónico debe garantizarse legibilidad y respaldo durante todo ese período.",
    },
    {
      q: "¿La ficha clínica electrónica tiene la misma validez legal que la de papel?",
      a: "Sí. Desde el Decreto 41 del Minsal y la Ley 20.584, la ficha clínica electrónica (FCE) tiene plena validez legal en Chile, siempre que use firma electrónica avanzada y cumpla con respaldo y trazabilidad.",
    },
    {
      q: "¿Quién puede acceder a una ficha clínica?",
      a: "Solo el paciente, los profesionales tratantes, los tribunales con orden judicial, y autoridades sanitarias en casos epidemiológicos específicos. La Ley 20.584 establece confidencialidad estricta.",
    },
    {
      q: "¿Cómo pido mi ficha clínica como paciente?",
      a: "En clínicas privadas: se solicita por escrito al área de archivos médicos, con respuesta en máximo 15 días hábiles. En el sistema público: vía portalpaciente.minsal.cl o presencialmente en OIRS del establecimiento.",
    },
    {
      q: "¿Qué software se usa para ficha clínica electrónica en Chile?",
      a: "Existen varias opciones: software especializado como Clinera (con IA integrada), Encuadrado, Reservo, Medilink, entre otros. La elección depende del tamaño de la clínica, especialidades y necesidad de integración con agenda y pagos.",
    },
  ];
  return (
    <section
      id="faq"
      style={{
        padding: "72px 80px",
        background: "#fff",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "12px 0 0",
              color: "#0A0A0A",
            }}
          >
            Lo que más preguntan sobre la ficha clínica.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => (
            <details
              key={it.q}
              className="reveal"
              style={{
                background: "#fff",
                border: "1px solid #F0F0F0",
                borderRadius: 14,
                padding: "16px 20px",
              }}
            >
              <summary
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {it.q}
                <span style={{ color: "#7C3AED", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>+</span>
              </summary>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 15,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  margin: "12px 0 0",
                }}
              >
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FINAL CTA ----------------------------- */
function FinalCTA(): ReactNode {
  return (
    <section style={{ padding: "24px 80px 64px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 24,
          padding: "56px 40px",
          position: "relative",
          overflow: "hidden",
          background: "#0E1014",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,70,239,.35) 0%, rgba(124,58,237,.15) 40%, transparent 70%),radial-gradient(ellipse 50% 60% at 10% 110%, rgba(34,211,238,.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 14,
          }}
        >
          <Eyebrow style={{ color: "#D946EF" }}>Para clínicas</Eyebrow>
          <h2
            className="fc-finalcta-title"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              margin: 0,
              color: "#fff",
              maxWidth: 720,
            }}
          >
            ¿Buscas software de ficha clínica electrónica?
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#A0A6B2",
              margin: 0,
              lineHeight: 1.55,
              maxWidth: 600,
            }}
          >
            Clinera AURA cumple Ley 20.584, integra agenda + WhatsApp + IA y migra tus fichas
            actuales sin parar de atender. Diagnóstico de 30 min, sin compromiso.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/agenda"
              style={{
                background: GRAD,
                color: "#fff",
                border: 0,
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 12px 32px -8px rgba(217,70,239,.5)",
              }}
            >
              Agendar reunión <span>→</span>
            </Link>
            <Link
              href="/funciones"
              style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Ver funciones
            </Link>
            <Link
              href="/software-medico"
              style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Software médico
            </Link>
            <Link
              href="/plataforma"
              style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Plataforma
            </Link>
            <Link
              href="/mejor-software-clinicas"
              style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Mejor software para clínicas
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.fc-finalcta-title) { font-size: 28px !important; }
        }
      `}</style>
    </section>
  );
}
