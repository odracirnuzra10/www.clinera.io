import Link from "next/link";
import styles from "./IntelligenceSection.module.css";
import { ChatAnimado } from "./IntelligenceChat";

/* ============================================================
   Clinera Intelligence — secciones de marketing
   · IntelligenceHomeSection: destacado en el home
   · IntelligencePlataformaSection: "cómo funciona" en /plataforma
   El mockup del chat vive en IntelligenceChat.tsx: una ventana
   animada en loop (pregunta tipeada → respuesta con gráficos).
   Un solo acento: violeta #7C3AED.
   ============================================================ */

function SparkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width={size} height={size} fill="none">
      <path
        d="M8 1.8c.5 3 1.9 4.7 4.7 5.7.4.1.4.9 0 1-2.8 1-4.2 2.7-4.7 5.7-.5-3-1.9-4.7-4.7-5.7-.4-.1-.4-.9 0-1C6.1 6.5 7.5 4.8 8 1.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none">
      <path
        d="m5 10.5 3.2 3L15 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none">
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------
   Sección destacada — HOME
   ------------------------------------------------------------ */
const HOME_BULLETS = [
  "Ventas, cobros, citas, asistencia y tratamientos en un solo chat",
  "Respuestas en segundos, con gráficos generados al momento",
  "Cero reportes manuales, cero planillas",
  "Para todo el equipo, según los permisos de cada rol",
];

export function IntelligenceHomeSection() {
  return (
    <section id="intelligence" className={styles.homeSection}>
      <div className={styles.homeInner}>
        <div className={`${styles.homeCopy} reveal`}>
          <span className={styles.kicker}>
            <SparkIcon /> Clinera Intelligence · agente interno de Vortex
          </span>
          <h2 className={styles.homeTitle}>
            Pregúntale a tu clínica. <span>Te responde con tus números.</span>
          </h2>
          <p className={styles.homeLead}>
            Clinera Intelligence, el agente interno de Vortex, te asiste con los números de tu clínica:
            escribe la pregunta en lenguaje natural y recibe cifras reales, con
            gráficos generados al momento. En el producto aparece como función de reportes.
          </p>
          <ul className={styles.homeBullets}>
            {HOME_BULLETS.map((b) => (
              <li key={b}>
                <i>
                  <CheckIcon />
                </i>
                {b}
              </li>
            ))}
          </ul>
          <div className={styles.homeActions}>
            <Link className={styles.primaryCta} href="/demo">
              Ver una demo <ArrowIcon />
            </Link>
            <Link className={styles.secondaryCta} href="/agenda">
              Agendar reunión
            </Link>
          </div>
        </div>
        <div className={`${styles.homeMockup} reveal`}>
          <ChatAnimado inicial="ventas" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Sección "cómo funciona" — /PLATAFORMA
   ------------------------------------------------------------ */
const PLATAFORMA_STEPS = [
  {
    number: "01",
    title: "Pregunta en lenguaje natural",
    copy: "Escríbele como a tu administrador: “¿cuánto vendí el mes pasado?”, “¿cuántos pacientes llegaron a su cita?”.",
  },
  {
    number: "02",
    title: "Consulta tus datos reales",
    copy: "La IA lee las ventas, cobros, citas, asistencia y tratamientos de tu clínica — no cifras de ejemplo.",
  },
  {
    number: "03",
    title: "Responde con cifras y gráficos",
    copy: "En segundos: totales, desglose y gráficos generados al momento, listos para decidir.",
  },
];

const PLATAFORMA_META = [
  "Historial de conversaciones recientes",
  "Funciona con los créditos IA de tu plan",
  "Acceso para todo el equipo, según permisos",
];

export function IntelligencePlataformaSection({
  ctaHref = "/demo",
  ctaLabel = "Ver una demo",
}: {
  ctaHref?: string;
  ctaLabel?: string;
} = {}) {
  return (
    <section id="intelligence" className={styles.platSection}>
      <div className={styles.platInner}>
        <div className={styles.platIntro}>
          <span className={styles.kicker}>
            <SparkIcon /> Clinera Intelligence · agente interno de Vortex
          </span>
          <h2>
            Conversa con <span>toda tu operación</span>.
          </h2>
          <p>
            Clinera Intelligence, el agente interno de Vortex, te asiste con los datos reales de tu clínica:
            pregunta en lenguaje natural y responde sin reportes manuales ni planillas.
            En el producto aparece como función de reportes.
          </p>
        </div>
        <div className={styles.platGrid}>
          <div className={styles.platSteps}>
            <ol>
              {PLATAFORMA_STEPS.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className={styles.platMeta}>
              {PLATAFORMA_META.map((m) => (
                <li key={m}>
                  <i>
                    <CheckIcon />
                  </i>
                  {m}
                </li>
              ))}
            </ul>
            <Link className={styles.primaryCta} href={ctaHref}>
              {ctaLabel} <ArrowIcon />
            </Link>
          </div>
          <div className={styles.platMockup}>
            <ChatAnimado inicial="citas" conHistorial />
          </div>
        </div>
      </div>
    </section>
  );
}
