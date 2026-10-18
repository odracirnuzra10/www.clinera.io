import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import { CHAT_AGENDA_IA as C } from "@/content/estetica";
import styles from "./ChatAgendaIA.module.css";

// Animación sin JavaScript (Ricardo, 18-oct-2026): una paciente escribe por
// WhatsApp, la IA le ofrece horas, ella elige y la cita aparece en la agenda de
// Clinera con la etiqueta «Agendado por IA». Datos de ejemplo (`estetica.ts`).
// Con «reducir movimiento» queda quieta en el estado final.

const CICLO = 13; // segundos por vuelta
const FIN = 93; // % del ciclo en que todo se apaga para volver a empezar

/** Instante de entrada (% del ciclo) de cada pieza. */
const PIEZAS = { m1: 4, escribe1: 12, m2: 18, m3: 34, escribe2: 42, m4: 48, cita: 60, etiqueta: 68 } as const;
type Pieza = keyof typeof PIEZAS;

const KEYFRAMES = (Object.keys(PIEZAS) as Pieza[])
  .map((id) => {
    const t = PIEZAS[id];
    // «escribiendo…» dura poco: se apaga cuando entra el mensaje de la IA.
    const fin = id === "escribe1" ? PIEZAS.m2 : id === "escribe2" ? PIEZAS.m4 : FIN;
    return `@keyframes cai-${id}{0%,${t}%{opacity:0;transform:translateY(8px) scale(.97)}${t + 3}%{opacity:1;transform:none}${fin - 1}%{opacity:1;transform:none}${fin}%,100%{opacity:0;transform:none}}`;
  })
  .join("");

const pieza = (id: Pieza): React.CSSProperties => ({ opacity: 0, animation: `cai-${id} ${CICLO}s ease-out infinite` });

export default function ChatAgendaIA() {
  return (
    <section className={styles.section} aria-labelledby="chat-agenda-ia-h2" data-chat-agenda-ia>
      <style>{`
        ${KEYFRAMES}
        @media (prefers-reduced-motion: reduce) {
          [data-chat-agenda-ia] [style*="cai-"] { animation: none !important; opacity: 1 !important; transform: none !important; }
          [data-chat-agenda-ia] [data-escribiendo] { display: none !important; }
        }
      `}</style>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.meta}>{C.meta}</span>
          <h2 id="chat-agenda-ia-h2" className={styles.h2}>
            {C.titulo} <span className={styles.grad}>{C.acento}</span>
          </h2>
          <p className={styles.lead}>{C.texto}</p>
        </div>

        <div className={styles.demo} aria-hidden>
          {/* WhatsApp */}
          <div className={styles.chat}>
            <div className={styles.chatHead}>
              <ChannelLogo channel="whatsapp" size={18} />
              <div>
                <b>{C.clinica}</b>
                <small>Agente IA · en línea</small>
              </div>
            </div>
            <div className={styles.chatBody}>
              <p className={`${styles.msg} ${styles.paciente}`} style={pieza("m1")}>{C.mensajes[0]}</p>
              <p className={`${styles.msg} ${styles.escribiendo}`} style={pieza("escribe1")} data-escribiendo>escribiendo…</p>
              <p className={`${styles.msg} ${styles.ia}`} style={pieza("m2")}>{C.mensajes[1]}</p>
              <p className={`${styles.msg} ${styles.paciente}`} style={pieza("m3")}>{C.mensajes[2]}</p>
              <p className={`${styles.msg} ${styles.escribiendo}`} style={pieza("escribe2")} data-escribiendo>escribiendo…</p>
              <p className={`${styles.msg} ${styles.ia}`} style={pieza("m4")}>{C.mensajes[3]}</p>
            </div>
          </div>

          {/* Agenda de Clinera */}
          <div className={styles.agenda}>
            <div className={styles.agendaHead}>
              <span>Agenda · Clinera</span>
              <span className={styles.agendaSemana}>Esta semana</span>
            </div>
            <div className={styles.dias}>
              {C.agenda.map((d) => (
                <div key={d.dia} className={styles.dia}>
                  <span className={styles.diaNombre}>{d.dia}</span>
                  {d.citas.map((c) => (
                    <div key={c.hora} className={styles.cita}>
                      <b>{c.hora}</b> {c.tratamiento}
                      <small>{c.paciente}</small>
                    </div>
                  ))}
                  {"nueva" in d && (
                    <div className={`${styles.cita} ${styles.citaNueva}`} style={pieza("cita")}>
                      <b>{d.nueva.hora}</b> {d.nueva.tratamiento}
                      <small>{d.nueva.paciente}</small>
                      <span className={styles.etiqueta} style={pieza("etiqueta")}>
                        ⚡ Agendado por IA
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
