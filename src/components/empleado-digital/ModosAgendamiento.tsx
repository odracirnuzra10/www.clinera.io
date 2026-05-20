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
    desc: "Tu IA conversa. Tu paciente confirma con un link a tu calendario propio o al de Clinera. ~3 créditos por atención — el costo IA más bajo del mercado.",
    innerEyebrow: "Desde Plan Core",
  },
  {
    idx: "02",
    title: "Óptimo",
    desc: "Tu IA agenda sola, sin links, sin fricción. La mejor relación capacidad agéntica / costo (~13 créditos por atención). Lo que usa la mayoría de las clínicas.",
    tag: "RECOMENDADO",
    featured: true,
    innerEyebrow: "Desde Plan Conect",
  },
  {
    idx: "03",
    title: "Agentic Flash",
    desc: "Mismo nivel agéntico que Óptimo, respuesta inmediata (289 tokens/s). Para clínicas que no toleran latencia (~28 créditos por atención).",
    tag: "VELOCIDAD MÁX",
    innerEyebrow: "Solo Plan Advanced",
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
      </div>
    </section>
  );
}
