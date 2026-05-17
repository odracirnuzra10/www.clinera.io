import styles from "@/app/empleado-digital/empleado-digital.module.css";

type Agent = {
  id: "aura" | "lia";
  name: string;
  accent: string;
  pill: string;
  pillBg: string;
  pillBorder: string;
  pillColor: string;
  role: string;
  stat: string;
};

const AGENTS: Agent[] = [
  {
    id: "aura",
    name: "AURA",
    accent: "#7C3AED",
    pill: "[live]",
    pillBg: "rgba(16,185,129,0.08)",
    pillBorder: "#A7F3D0",
    pillColor: "#047857",
    role: "Responde WhatsApp, agenda y reagenda con autonomía.",
    stat: "Atiende ~300 conversaciones/día por clínica",
  },
  {
    id: "lia",
    name: "LIA",
    accent: "#0A0A0A",
    pill: "[beta · incluida en advanced]",
    pillBg: "rgba(124,58,237,0.06)",
    pillBorder: "#DDD6FE",
    pillColor: "#7C3AED",
    role:
      "Es la jefa. Detecta cupos vacíos, decide a qué paciente contactar y se lo indica a AURA. También responde, agenda y reagenda por su cuenta.",
    stat: "Recupera ~21% de cupos perdidos al mes",
  },
];

export default function DuoAgentes() {
  return (
    <section className={styles.duoSection} aria-labelledby="duo-agentes-h2">
      <div className={styles.duoInner}>
        <div className={styles.duoHead}>
          <p className={styles.duoEyebrow}>Tu equipo IA</p>
          <h2 id="duo-agentes-h2" className={styles.duoH2}>
            Dos roles, una sola memoria del paciente
          </h2>
        </div>

        <div className={styles.duoGrid}>
          {AGENTS.map((a) => (
            <a key={a.id} href={`#${a.id}`} className={styles.duoCard}>
              <div className={styles.duoCardHead}>
                <span className={styles.duoCardName} style={{ color: a.accent }}>
                  {a.name}
                </span>
                <span
                  className={styles.duoPill}
                  style={{
                    background: a.pillBg,
                    borderColor: a.pillBorder,
                    color: a.pillColor,
                  }}
                >
                  {a.pill}
                </span>
              </div>
              <p className={styles.duoRole}>{a.role}</p>
              <p className={styles.duoStat}>{a.stat}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
