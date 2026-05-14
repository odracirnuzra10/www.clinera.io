"use client";

import Link from "next/link";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";

const ARTICLE_FAQS: Array<{ q: string; a: string }> = [
  {
    q: "¿Es este un estudio científico o revisado por pares?",
    a: "No. Es un estudio interno de Clinera basado en datos operacionales reales de 89 clínicas y más de 57.000 interacciones. No es un paper académico ni ha sido revisado externamente. Publicamos los resultados porque creemos que la evidencia operacional es tan valiosa como la académica, y porque la transparencia es parte de cómo construimos confianza con nuestros clientes.",
  },
  {
    q: "¿Qué significa exactamente 'interacción completada'?",
    a: "Una interacción se considera completada cuando el paciente llegó hasta el paso final del flujo conversacional: confirmar un agendamiento, obtener la información que solicitó, o ser derivado a un agente humano de forma correcta. Las interacciones abandonadas (paciente que deja de responder antes de terminar) se contaron como no completadas.",
  },
  {
    q: "¿Por qué los pacientes completarían más cuando la IA es más lenta?",
    a: "La hipótesis más sólida es de confianza contextual: en salud, una respuesta instantánea puede parecer un bot genérico que no 'leyó' tu mensaje. Una respuesta con un pequeño retraso, dentro del rango normal de mensajería humana, activa la percepción de que hay atención real detrás. Esto es consistente con lo que se observa en investigaciones sobre confianza en sistemas de IA conversacional: la velocidad extrema puede romper la ilusión de presencia.",
  },
  {
    q: "¿Cuánto tiempo de delay usó el Grupo B?",
    a: "Entre 20 y 90 segundos, distribuidos según la complejidad percibida del mensaje. Mensajes cortos recibían delays menores (20-35 s); mensajes largos o con múltiples preguntas recibían delays mayores (50-90 s). El objetivo era simular el tiempo que tomaría leer y redactar una respuesta humana real.",
  },
  {
    q: "¿El modo de respuesta lenta afecta negativamente la experiencia?",
    a: "No en el rango estudiado. 90 segundos sigue siendo entre 3 y 10 veces más rápido que una recepcionista en horario activo, y entre 20 y 50 veces más rápido en horario fuera de oficina. El estudio no encontró señales de frustración en el Grupo B. Lo que sí observamos: los pacientes del Grupo B completaban el flujo completo, en lugar de abandonarlo a mitad.",
  },
  {
    q: "¿Los resultados aplican igual para Chile, México y los otros países?",
    a: "La muestra más grande es Chile (61 de 89 clínicas), por lo que los resultados están más representados en ese mercado. Las clínicas de Perú, Ecuador, México, Paraguay y España mostraron la misma dirección del efecto, aunque con muestras más pequeñas. No publicamos desgloses por país para no hacer inferencias con N bajo.",
  },
  {
    q: "¿Cómo aplico esto en mi clínica hoy?",
    a: "Si usas Clinera, el modo de respuesta con timing humano puede activarse desde el panel de configuración de tu agente. Si aún no usas Clinera, agenda una demo y te mostramos los dos modos en vivo sobre un clon de tu propia clínica.",
  },
  {
    q: "¿Habrá actualizaciones de este estudio?",
    a: "Sí. Planeamos replicar el estudio con una muestra más grande a fines de 2026, incluyendo seguimiento post-agendamiento para medir si el tipo de timing también afecta la tasa de asistencia real a la cita.",
  },
];

export default function ConfianzaIAArticle() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }
        @media (max-width: 720px) {
          main > section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
      <ArticleHero />
      <ArticleBody />
      <ArticleFinalCta />
    </>
  );
}

/* ---------- HERO ---------- */
function ArticleHero() {
  return (
    <section
      style={{
        padding: "96px 80px 48px",
        background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div className="reveal" style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
          <Link
            href="/novedades"
            style={{
              fontFamily: "Inter",
              fontSize: 13,
              color: "#6B7280",
              textDecoration: "none",
            }}
          >
            ← Novedades
          </Link>
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#7C3AED",
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
              padding: "4px 10px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            Investigación
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B7280",
            }}
          >
            8 min · 14 mayo 2026
          </span>
        </div>
        <h1
          className="article-title"
          style={{
            fontFamily: "Inter",
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            margin: "0 0 20px",
            color: "#0A0A0A",
          }}
        >
          Estudio Clinera 2026:{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            los pacientes confían más en una IA que responde como humano
          </span>
          , no necesariamente más rápido.
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 720,
          }}
        >
          Un experimento A/B interno con <strong>89 clínicas</strong> y más de{" "}
          <strong>57.000 interacciones</strong> reveló que los pacientes completan el flujo de agendamiento un{" "}
          <strong>12% más</strong> cuando la IA responde con un timing similar al humano, en lugar de hacerlo en menos de
          5 segundos.
        </p>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.article-title) { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- BODY ---------- */
function ArticleBody() {
  return (
    <section style={{ padding: "64px 80px 80px", background: "#fff" }}>
      <article
        className="article-body reveal"
        style={{
          maxWidth: 760,
          margin: "0 auto",
          fontFamily: "Inter",
          fontSize: 17,
          color: "#1F2937",
          lineHeight: 1.75,
        }}
      >
        <Callout>
          Este es un estudio interno de Clinera. No es un paper académico ni ha sido revisado por pares. Sí es
          evidencia operacional de <strong>89 clínicas reales</strong> durante <strong>9 semanas</strong> y más
          de <strong>57.000 interacciones humano-IA</strong> analizadas. Publicamos los números porque creemos
          que la transparencia es la base de la confianza, especialmente cuando hablamos de IA en salud.
        </Callout>

        <P>
          Cuando construimos el agente de Clinera, el supuesto inicial fue el mismo que en casi todo el software:
          más rápido es mejor. Menos de 5 segundos para responder. Cero fricción. Atención instantánea.
        </P>
        <P>
          Después de meses en producción, empezamos a notar algo que no encajaba con esa lógica: algunas clínicas
          reportaban tasas de abandono inusualmente altas, sin que existiera un problema técnico de por medio. Los
          mensajes llegaban, las respuestas salían, pero los pacientes no terminaban el flujo. Ese patrón nos llevó
          a hacernos una pregunta incómoda: <strong>¿y si el problema no es la precisión de la IA, sino cómo se
          siente?</strong>
        </P>
        <P>
          Para responderla, diseñamos un experimento A/B controlado entre el 2 de febrero y el 6 de abril de 2026.
          Esto es lo que encontramos.
        </P>

        <H2>TL;DR — Lo que necesitas saber en 30 segundos</H2>
        <Ul>
          <li><strong>89 clínicas</strong> participaron en el estudio (61 de Chile; el resto de Perú, Ecuador, México, Paraguay y España).</li>
          <li>Se analizaron <strong>más de 57.000 interacciones</strong> humano-IA en WhatsApp e Instagram DM.</li>
          <li><strong>Grupo A</strong> — IA con respuesta en menos de 5 segundos: <strong>79% de interacciones completadas</strong>.</li>
          <li><strong>Grupo B</strong> — IA con delay de 20 a 90 segundos (timing humano): <strong>91% de interacciones completadas</strong>.</li>
          <li>Diferencia: <strong>+12 puntos porcentuales</strong> a favor del timing humano.</li>
          <li>Conclusión: en contextos de salud y estética, la velocidad importa, pero la <strong>confianza percibida importa más</strong>.</li>
        </Ul>

        <H2>Por qué estudiamos el timing de respuesta</H2>
        <P>
          La premisa de que "más rápido = mejor" viene del mundo del e-commerce, donde la fricción es el enemigo.
          Menos tiempo de carga, menos pasos, respuesta inmediata. Esa lógica tiene sentido cuando el usuario está
          comprando zapatillas.
        </P>
        <P>
          La salud funciona diferente. Una paciente que escribe "quiero agendar una consulta de nutrición" no solo
          está haciendo una transacción: está confiando en alguien con algo personal. Y la confianza, a diferencia
          de la velocidad, no se construye en milisegundos.
        </P>
        <P>
          Investigaciones en interacción humano-computadora y sistemas conversacionales han observado que los
          usuarios pueden interpretar respuestas anormalmente rápidas como señal de que "nadie leyó mi mensaje
          de verdad". Esto es especialmente relevante en contextos de alta implicación personal, como la salud,
          la estética o la psicología — áreas donde opera la mayoría de los clientes de Clinera.
        </P>
        <Quote>
          El timing de una respuesta no es solo un dato técnico. Es una señal social. Y los pacientes la leen,
          aunque no lo sepan conscientemente.
        </Quote>

        <H2>Diseño del experimento</H2>
        <H3>Período y muestra</H3>
        <Table
          headers={["Parámetro", "Valor"]}
          rows={[
            ["Período", "2 de febrero — 6 de abril de 2026 (9 semanas)"],
            ["Total de clínicas", "89"],
            ["Chile", "61 clínicas"],
            ["Otros países", "28 clínicas (Perú, Ecuador, México, Paraguay, España)"],
            ["Total de interacciones analizadas", "+57.000"],
            ["Canal principal", "WhatsApp Business API + Instagram DM"],
            ["Tipo de interacción", "Agendamiento, consulta de disponibilidad, información de servicios"],
          ]}
        />

        <H3>Grupos del experimento</H3>
        <Table
          headers={["", "Grupo A", "Grupo B"]}
          rows={[
            ["Condición", "Respuesta en < 5 segundos", "Delay de 20–90 segundos"],
            ["Lógica", "Respuesta técnicamente óptima", "Simula tiempo de lectura + escritura humana"],
            ["Delay calculado por", "—", "Longitud y complejidad del mensaje recibido"],
            ["Clínicas asignadas", "44", "45"],
            ["Asignación", "Aleatoria por clínica, fija durante todo el período", "Aleatoria por clínica, fija durante todo el período"],
          ]}
        />

        <P>
          La asignación fue fija por clínica durante todo el período para evitar efectos de confusión entre
          grupos dentro de la misma base de pacientes. La IA, el prompt, las instrucciones y los servicios
          disponibles eran idénticos en ambos grupos. La única variable era el tiempo de respuesta.
        </P>
        <Meta>
          <strong>Definición de "interacción completada":</strong> el paciente llegó al paso final del flujo —
          agendamiento confirmado, información entregada, o derivación a humano ejecutada — sin abandonar la
          conversación antes de ese punto.
        </Meta>

        <H2>Los resultados</H2>
        <H3>Tabla de resultados generales</H3>
        <Table
          headers={["Métrica", "Grupo A (< 5 s)", "Grupo B (20–90 s)", "Diferencia"]}
          rows={[
            ["Tasa de interacción completada", "79%", "91%", "+12 pp"],
            ["Tasa de abandono", "21%", "9%", "−12 pp"],
            ["Clínicas en el grupo", "44", "45", "—"],
            ["Período del estudio", "Feb 2 – Abr 6, 2026", "Feb 2 – Abr 6, 2026", "—"],
          ]}
        />

        <P>
          La diferencia de 12 puntos porcentuales se mantuvo estable a lo largo de las 9 semanas. No fue
          un pico inicial que se diluyó: el efecto fue consistente desde la segunda semana hasta el final
          del período.
        </P>
        <Quote>
          De cada 100 pacientes que iniciaban una conversación, el Grupo B convertía 12 más que el Grupo A.
          Para una clínica que recibe 400 consultas al mes, eso son <strong>48 agendamientos adicionales</strong>{" "}
          sin cambiar nada más.
        </Quote>

        <H3>Desglose por tipo de flujo</H3>
        <Table
          headers={["Flujo", "Grupo A", "Grupo B", "Delta"]}
          rows={[
            ["Agendar cita (nuevo paciente)", "74%", "89%", "+15 pp"],
            ["Consultar disponibilidad", "83%", "93%", "+10 pp"],
            ["Consultar precio o servicio", "81%", "94%", "+13 pp"],
            ["Reagendar cita existente", "77%", "90%", "+13 pp"],
            ["Solicitar derivación a humano", "86%", "92%", "+6 pp"],
          ]}
        />

        <P>
          El efecto fue mayor en nuevos pacientes (flujo de agendamiento desde cero), donde el delta llegó a
          15 puntos. Esto tiene sentido: un paciente nuevo no tiene historial con la clínica y está construyendo
          confianza desde cero. En ese contexto, la señal del timing tiene más peso.
        </P>

        <H2>¿Por qué los pacientes completan más con una respuesta "más lenta"?</H2>
        <P>
          Esta es la pregunta más importante del estudio, y también la más honesta de responder: no tenemos
          una respuesta definitiva. Lo que sí tenemos es una hipótesis respaldada por el patrón de datos y
          coherente con lo que se sabe sobre confianza en sistemas conversacionales de IA.
        </P>
        <H3>La hipótesis de confianza contextual</H3>
        <P>
          En salud y estética, el paciente está compartiendo información personal: síntomas, preocupaciones
          estéticas, diagnósticos previos, disponibilidad horaria. Esa exposición requiere que la contraparte
          se sienta presente y atenta. Una respuesta en 2 segundos puede activar el patrón cognitivo de "esto
          es un bot que no leyó lo que escribí". Una respuesta en 35 segundos activa el patrón de "alguien
          tomó un momento para considerar mi caso".
        </P>
        <P>
          Estudios en el campo de la interacción humano-computadora han documentado que los usuarios atribuyen
          mayor credibilidad y competencia a sistemas que muestran latencia consistente con la complejidad de
          la tarea. Un médico que responde en 1 segundo genera desconfianza, no confianza. Lo mismo parece
          ocurrir con la IA en contextos de alta implicación personal.
        </P>
        <H3>El efecto de la señal social del mensaje</H3>
        <P>
          WhatsApp e Instagram DM son canales de mensajería entre personas. El usuario los asocia a conversaciones
          humanas. Cuando la IA responde en 2 segundos a un mensaje de 80 palabras, rompe ese contrato implícito:
          ninguna persona lee y responde 80 palabras en 2 segundos. Ese quiebre puede sentirse como artificial,
          y lo artificial genera desconfianza.
        </P>
        <P>
          El Grupo B, al mantener el timing dentro del rango de "podría haber sido una persona", mantuvo ese
          contrato implícito intacto.
        </P>
        <H3>Lo que no podemos afirmar con este estudio</H3>
        <Ul>
          <li>No medimos satisfacción post-agendamiento ni NPS.</li>
          <li>No medimos si los pacientes del Grupo B asistieron más a sus citas (eso requiere seguimiento de 60+ días que está en progreso).</li>
          <li>No tenemos datos suficientes para desagregar por país con confianza estadística.</li>
          <li>No comparamos contra canales de voz o videollamada.</li>
          <li>Este estudio no prueba que el timing sea la única variable relevante, ni que otros factores no influyan en la tasa de completación.</li>
        </Ul>

        <H2>Qué significa esto para tu clínica</H2>
        <P>
          Si eres dueño de una clínica médica o estética y estás evaluando implementar IA para atención de
          pacientes, este estudio tiene una implicancia práctica directa: <strong>optimizar solo por velocidad
          técnica puede estar costándote pacientes</strong>.
        </P>
        <P>
          Una IA que responde en menos de 5 segundos puede parecer técnicamente superior en un benchmark.
          Pero si 21 de cada 100 pacientes la abandonan antes de terminar el flujo — frente a 9 en el modelo
          con timing humano —, el resultado operacional es peor.
        </P>
        <H3>El cálculo de impacto real</H3>
        <Table
          headers={["Escenario", "Consultas/mes", "Completación", "Agendamientos generados"]}
          rows={[
            ["IA con respuesta instantánea (Grupo A)", "400", "79%", "316"],
            ["IA con timing humano (Grupo B)", "400", "91%", "364"],
            ["Diferencia", "—", "+12 pp", "+48 agendamientos/mes"],
          ]}
        />
        <P>
          Para una clínica con un valor promedio de consulta de $25.000 CLP, 48 agendamientos adicionales
          al mes equivalen a <strong>$1.200.000 CLP adicionales</strong> sin aumentar el presupuesto en ads,
          sin contratar más personal, y sin cambiar el agente de IA. Solo ajustando cómo se siente la respuesta.
        </P>

        <H2>Contexto más amplio: la confianza en IA conversacional</H2>
        <P>
          Este estudio no existe en un vacío. Hay una creciente literatura académica e industria de investigación
          sobre cómo los humanos perciben y confían en sistemas de IA conversacional. Algunos patrones recurrentes
          que son coherentes con nuestros hallazgos:
        </P>
        <Ul>
          <li>
            <strong>Timing y atribución de presencia:</strong> investigaciones en HCI (human-computer interaction)
            han documentado que el delay en respuestas digitales modula la percepción de presencia social.
            Sistemas demasiado rápidos pueden romper la percepción de que "hay alguien ahí".
          </li>
          <li>
            <strong>Confianza en IA médica:</strong> en contextos de salud digital, los pacientes tienden a
            preferir sistemas que demuestren señales de cuidado y atención, más allá de precisión técnica pura.
          </li>
          <li>
            <strong>El paradox of automation:</strong> en sistemas críticos, la automatización perfecta puede
            generar complacencia o desconfianza cuando supera el umbral de lo humanamente plausible.
          </li>
          <li>
            <strong>Conversational AI en healthcare:</strong> estudios sobre chatbots en atención primaria
            han observado que el tono y los patrones de respuesta influyen significativamente en la disposición
            del paciente a completar la interacción.
          </li>
        </Ul>
        <Meta>
          Clinera no afirma que estas investigaciones validen directamente este estudio. Las mencionamos como
          contexto intelectual, no como respaldo científico formal. Nuestros datos son operacionales, no
          experimentales en el sentido académico.
        </Meta>

        <H2>Preguntas frecuentes</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          {ARTICLE_FAQS.map((f, i) => (
            <details
              key={i}
              style={{
                background: "#FAFAFA",
                border: "1px solid #EEECEA",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span>{f.q}</span>
                <span aria-hidden style={{ color: "#6B7280", fontWeight: 400 }}>＋</span>
              </summary>
              <div style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.65, marginTop: 10 }}>{f.a}</div>
            </details>
          ))}
        </div>

        <Meta>
          Estudio interno Clinera — período 2 de febrero al 6 de abril de 2026. Publicado el 14 de mayo de 2026.
          Muestra: 89 clínicas, +57.000 interacciones. Estudio operacional, no revisado por pares. Datos
          disponibles para clientes activos bajo NDA.
        </Meta>
      </article>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
function ArticleFinalCta() {
  return (
    <section style={{ padding: "0 80px 96px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "#0E1014",
          color: "#fff",
          borderRadius: 20,
          padding: "40px 36px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,70,239,.3) 0%, rgba(124,58,237,.12) 40%, transparent 70%),radial-gradient(ellipse 50% 60% at 10% 110%, rgba(34,211,238,.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <Eyebrow style={{ color: "#D946EF" }}>Próximos pasos</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "14px 0 14px",
              color: "#fff",
            }}
          >
            Agenda una demo y descubre cómo la IA puede convertir más pacientes sin perder el factor humano.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 16, color: "#A0A6B2", margin: "0 0 24px", lineHeight: 1.6 }}>
            Te mostramos Clinera corriendo sobre un clon de tu clínica — con tus servicios, tus horarios y el
            modo de timing que más convierte. 30 minutos, sin compromiso.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/hablar-con-ventas"
              style={{
                background: GRAD,
                color: "#fff",
                padding: "14px 24px",
                borderRadius: 10,
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Agenda una demo <span>→</span>
            </Link>
            <Link
              href="/blog/efectividad"
              style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                padding: "14px 24px",
                borderRadius: 10,
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Ver estudio de efectividad
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Primitives de tipografía ---------- */
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "Inter",
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: "-0.025em",
        lineHeight: 1.2,
        margin: "56px 0 16px",
        color: "#0A0A0A",
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "Inter",
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: "-0.018em",
        lineHeight: 1.3,
        margin: "36px 0 10px",
        color: "#0A0A0A",
      }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 18px" }}>{children}</p>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul
      style={{
        margin: "0 0 22px",
        paddingLeft: 22,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {children}
    </ul>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        margin: "24px 0",
        padding: "20px 24px",
        background: "#F5F3FF",
        borderLeft: "3px solid #7C3AED",
        borderRadius: 8,
        fontStyle: "italic",
        color: "#1F2937",
        fontSize: 17,
        lineHeight: 1.6,
      }}
    >
      {children}
    </blockquote>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: "0 0 32px",
        padding: "16px 20px",
        background: "#F7F6F3",
        border: "1px solid #EEECEA",
        borderRadius: 12,
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: "12px 0 22px",
        padding: "14px 18px",
        background: "#FAFAFA",
        border: "1px solid #F0F0F0",
        borderRadius: 10,
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ margin: "16px 0 28px", overflowX: "auto", borderRadius: 12, border: "1px solid #EEECEA" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14.5,
          fontFamily: "Inter",
        }}
      >
        <thead>
          <tr style={{ background: "#0E1014", color: "#fff" }}>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: "0.01em",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: i === 0 ? "0" : "1px solid #F3F4F6", background: "#fff" }}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "12px 14px",
                    color: "#1F2937",
                    verticalAlign: "top",
                    lineHeight: 1.55,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
