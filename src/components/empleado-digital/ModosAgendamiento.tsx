import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

type Modo = {
  idx: string;
  title: string;
  desc: string;
  tag?: string;
  featured?: boolean;
  innerEyebrow?: string;
};

const MODOS: Modo[] = [
  {
    idx: "01",
    title: "Eficiente",
    desc: "Tu IA conversa. Tu paciente confirma con un link a tu calendario propio o al de Clinera. ~4 créditos por conversación — el costo IA más bajo del mercado.",
    innerEyebrow: "Desde Plan Conect",
  },
  {
    idx: "02",
    title: "Agentic",
    desc: "Tu IA agenda sola, sin links, sin fricción. La mejor relación capacidad agéntica / costo (~17 créditos por conversación). Lo que usa la mayoría de las clínicas.",
    tag: "RECOMENDADO",
    featured: true,
    innerEyebrow: "Desde Plan Conect",
  },
  {
    idx: "03",
    title: "Agentic Pro",
    desc: "Mismo nivel agéntico que Agentic, respuesta inmediata (289 tokens/s). Para clínicas que no toleran latencia (~36 créditos por conversación).",
    tag: "VELOCIDAD MÁX",
    innerEyebrow: "Solo Plan MAX",
  },
];

export default function ModosAgendamiento() {
  return (
    <section className={styles.modosSection} aria-labelledby="modos-h2">
      <div className={styles.modosInner}>
        <div className={styles.modosHead}>
          <p className={styles.duoEyebrow}>3 modos de agendamiento</p>
          <h2 id="modos-h2" className={styles.duoH2}>
            Una sola IA. Tres formas de cerrar la cita.
          </h2>
          <p className={styles.modoSubtitle} style={{ marginTop: 14, fontSize: 16, color: "#4B5563", lineHeight: 1.55, maxWidth: 660 }}>
            Elige según tu volumen y velocidad de respuesta. Subes de plan, subes de modo.
          </p>
        </div>

        <div className={styles.modosGrid}>
          {MODOS.map((m) => (
            <article
              key={m.idx}
              className={`${styles.modoCard} ${m.featured ? styles.modoCardFeatured : ""}`}
            >
              <div className={styles.modoIndex}>{m.idx}</div>
              <h3 className={styles.modoTitle}>
                {m.title}
                {m.tag && <span className={styles.modoBetaTag}>{m.tag}</span>}
              </h3>
              <p className={styles.modoDesc}>{m.desc}</p>
              {m.innerEyebrow && (
                <p className={styles.modoInnerEyebrow}>{m.innerEyebrow}</p>
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
          ¿Quieres entender qué modelo está detrás de cada modo?{" "}
          <Link
            href="/blog/modos-agendamiento-ia-eficiente-agentic-agentic-flash"
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
