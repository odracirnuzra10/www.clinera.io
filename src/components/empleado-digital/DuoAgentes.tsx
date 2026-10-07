import AvisoNoReemplaza from "./AvisoNoReemplaza";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

type Agent = {
  id: "camila" | "aura" | "lia";
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
    id: "camila",
    name: "CAMILA",
    accent: "#0891B2",
    pill: "[live · solo Summit]",
    pillBg: "rgba(16,185,129,0.08)",
    pillBorder: "#A7F3D0",
    pillColor: "#047857",
    role: "El call center IA: llama para confirmar y reagendar, con tool-calling sobre tu agenda.",
    stat: "25 créditos por minuto · 5 acentos",
  },
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
    pill: "[live · Summit]",
    pillBg: "rgba(16,185,129,0.08)",
    pillBorder: "#A7F3D0",
    pillColor: "#047857",
    role:
      "La orquestadora: detecta cupos vacíos y morosos, elige el canal y despacha a CAMILA o AURA.",
    stat: "Fiscalización 0 cr · informes ≈4.000 cr/mes",
  },
];

export default function DuoAgentes() {
  return (
    <section className={styles.duoSection} aria-labelledby="duo-agentes-h2">
      <div className={styles.duoInner}>
        <div className={styles.duoHead}>
          <p className={styles.duoEyebrow}>Tu equipo IA</p>
          <h2 id="duo-agentes-h2" className={styles.duoH2}>
            Tres roles, una sola memoria del paciente
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
        <AvisoNoReemplaza />
      </div>
    </section>
  );
}
