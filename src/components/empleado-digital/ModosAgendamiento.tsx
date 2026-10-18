import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

type Paso = {
  idx: string;
  title: string;
  desc: string;
  tag?: string;
  featured?: boolean;
  innerEyebrow?: string;
};

const PASOS: Paso[] = [
  {
    idx: "01",
    title: "Conversa y califica",
    desc: "Tu IA responde por WhatsApp 24/7: precios, horarios, profesionales, qué incluye cada tratamiento. Entiende el contexto del paciente antes de proponer una hora.",
    innerEyebrow: "Incluido en Vortex",
  },
  {
    idx: "02",
    title: "Agenda sola",
    desc: "Sin links, sin fricción, sin salir del chat. Consulta la disponibilidad real de tu agenda, valida profesional, sala y duración, y deja la cita creada.",
    tag: "EL NÚCLEO",
    featured: true,
    innerEyebrow: "Incluido en Vortex",
  },
  {
    idx: "03",
    title: "Reagenda, cancela y confirma",
    desc: "Detecta conflictos y propone alternativas, libera el cupo al cancelar, cobra la reserva y manda el recordatorio. Todo dentro de la misma conversación.",
    innerEyebrow: "Incluido en Vortex",
  },
];

export default function ModosAgendamiento() {
  return (
    <section className={styles.modosSection} aria-labelledby="modos-h2">
      <div className={styles.modosInner}>
        <div className={styles.modosHead}>
          <p className={styles.duoEyebrow}>Modo Agentic</p>
          <h2 id="modos-h2" className={styles.duoH2}>
            Tu IA no manda links. Agenda sola.
          </h2>
          <p className={styles.modoSubtitle} style={{ marginTop: 14, fontSize: 16, color: "#4B5563", lineHeight: 1.55, maxWidth: 660 }}>
            Un solo modo de agendamiento, agéntico de principio a fin: la IA razona, consulta tu
            agenda y ejecuta la acción. Disponible en todos los planes.
          </p>
        </div>

        <div className={styles.modosGrid}>
          {PASOS.map((p) => (
            <article
              key={p.idx}
              className={`${styles.modoCard} ${p.featured ? styles.modoCardFeatured : ""}`}
            >
              <div className={styles.modoIndex}>{p.idx}</div>
              <h3 className={styles.modoTitle}>
                {p.title}
                {p.tag && <span className={styles.modoBetaTag}>{p.tag}</span>}
              </h3>
              <p className={styles.modoDesc}>{p.desc}</p>
              {p.innerEyebrow && (
                <p className={styles.modoInnerEyebrow}>{p.innerEyebrow}</p>
              )}
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: 28,
            textAlign: "center",
            fontSize: 13,
            color: "#6B7280",
            lineHeight: 1.5,
          }}
        >
          ¿Quieres entender qué modelo está detrás y cuántos créditos consume?{" "}
          <Link
            href="/blog/modo-agentic-agendamiento-ia-clinicas"
            style={{
              color: "#7C3AED",
              textDecoration: "underline",
              textDecorationThickness: 1,
              textUnderlineOffset: 3,
            }}
          >
            Lee el artículo técnico →
          </Link>
        </p>
      </div>
    </section>
  );
}
