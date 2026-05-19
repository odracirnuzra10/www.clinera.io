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
    title: "Enlace interno",
    desc: "AURA conversa por WhatsApp y envía un link del calendario nativo de Clinera para que el paciente confirme. Incluido en todos los planes.",
    innerEyebrow: "Core · Conect · Advanced",
  },
  {
    idx: "02",
    title: "Enlace externo",
    desc: "AURA comparte tu link de agendamiento existente (Calendly, AgendaPro, Reservo, etc.). Tu agenda no se mueve. Conect y Advanced.",
    innerEyebrow: "Conect · Advanced",
  },
  {
    idx: "03",
    title: "Automático",
    desc: "AURA agenda directamente en tu calendario, sin que el paciente tenga que hacer nada extra. 100% sin fricción.",
    tag: "RECOMENDADO",
    featured: true,
    innerEyebrow: "Conect · Advanced",
  },
];

export default function ModosAgendamiento() {
  return (
    <section className={styles.modosSection} aria-labelledby="modos-h2">
      <div className={styles.modosInner}>
        <div className={styles.modosHead}>
          <p className={styles.duoEyebrow}>3 modos de agendamiento</p>
          <h2 id="modos-h2" className={styles.duoH2}>
            Una sola IA, tres formas de cerrar una cita
          </h2>
          <p className={styles.modoSubtitle} style={{ marginTop: 14, fontSize: 16, color: "#4B5563", lineHeight: 1.55, maxWidth: 660 }}>
            Elige el modo según tu flujo. Conect y Advanced incluyen los 3; Core viene con Enlace interno por default.
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
