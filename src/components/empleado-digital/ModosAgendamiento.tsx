import styles from "@/app/empleado-digital/empleado-digital.module.css";

type Modo = {
  idx: string;
  title: string;
  desc: string;
  beta?: boolean;
  featured?: boolean;
  innerEyebrow?: string;
};

const MODOS: Modo[] = [
  {
    idx: "01",
    title: "Enlace interno",
    desc: "La IA usa el calendario nativo de Clinera. Default para clínicas que centralizan todo en un solo lugar.",
  },
  {
    idx: "02",
    title: "Automático",
    desc: "La IA agenda directamente en tu sistema. Activable cuando estés listo.",
    beta: true,
  },
  {
    idx: "03",
    title: "Enlace externo",
    desc: "La IA comparte tu link (Calendly, AgendaPro, Reservo, etc.). Tu agenda no se mueve.",
    featured: true,
    innerEyebrow: "Para clínicas con software propio",
  },
];

export default function ModosAgendamiento() {
  return (
    <section className={styles.modosSection} aria-labelledby="modos-h2">
      <div className={styles.modosInner}>
        <div className={styles.modosHead}>
          <p className={styles.duoEyebrow}>Funciona con tu setup actual</p>
          <h2 id="modos-h2" className={styles.duoH2}>
            3 formas de agendar, una sola IA
          </h2>
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
                {m.beta && <span className={styles.modoBetaTag}>BETA</span>}
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
