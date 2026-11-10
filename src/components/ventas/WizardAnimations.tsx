"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FeatureIcon } from "@/components/plataforma/AuraNetwork";
import styles from "./WizardAnimations.module.css";

/* Las dos animaciones que acompañan a los pasos 1 y 2 de /hablar-con-ventas.
 *
 * Son ilustraciones, no capturas: cuentan qué hace Clinera en el tiempo que el
 * visitante tarda en leer la pregunta de al lado. Por eso son livianas —CSS y,
 * donde hace falta coordinar dos escenas, un intervalo— y no un video ni una
 * librería de animación.
 *
 * Las dos se congelan en su estado final con prefers-reduced-motion: quien pidió
 * menos movimiento igual tiene que entender la idea.
 */

/* Igual que la zona horaria del paso 4: va por useSyncExternalStore y no por
   useState dentro de un efecto, porque el servidor no tiene matchMedia. El
   snapshot de servidor es `false`, el de cliente la preferencia real, así que el
   primer render coincide en ambos lados y no hay error de hidratación. */
const MQ_REDUCED = "(prefers-reduced-motion: reduce)";

function suscribirReducedMotion(alCambiar: () => void) {
  const mq = window.matchMedia(MQ_REDUCED);
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    suscribirReducedMotion,
    () => window.matchMedia(MQ_REDUCED).matches,
    () => false,
  );
}

/* ============ Paso 1 — la IA recibe datos y responde ============ */

const ENTRADAS = [
  { icon: "calendar", label: "Agenda" },
  { icon: "file", label: "Ficha del paciente" },
  { icon: "message", label: "WhatsApp" },
  { icon: "card", label: "Pagos" },
];

const SALIDAS = [
  { icon: "calendar", label: "Agenda la hora" },
  { icon: "message", label: "Responde al paciente" },
  { icon: "voice", label: "Llama y confirma" },
];

export function AuraFlow() {
  const reduced = useReducedMotion();
  return (
    <div className={reduced ? `${styles.flow} ${styles.still}` : styles.flow} aria-hidden="true">
      <div className={styles.flowSide}>
        <span className={styles.flowLabel}>Tu operación entra</span>
        <div className={styles.feedList}>
          {ENTRADAS.map((item, i) => (
            <span key={item.label} className={styles.feed} style={{ "--i": i } as React.CSSProperties}>
              <i>
                <FeatureIcon name={item.icon} />
              </i>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.flowCore}>
        <span className={styles.orbWrap}>
          <span className={styles.pulse} />
          <span className={styles.orb}>
            <svg viewBox="0 0 64 64" width="30" height="30" fill="none">
              <path
                d="M32 7c3.2 14.2 10.8 21.8 25 25-14.2 3.2-21.8 10.8-25 25C28.8 42.8 21.2 35.2 7 32 21.2 28.8 28.8 21.2 32 7Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </span>
        <strong>AURA</strong>
      </div>

      <div className={styles.flowSide}>
        <span className={styles.flowLabel}>La IA ejecuta</span>
        <div className={styles.emitList}>
          {SALIDAS.map((item, i) => (
            <span key={item.label} className={styles.emit} style={{ "--i": i } as React.CSSProperties}>
              <i>
                <FeatureIcon name={item.icon} />
              </i>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ Paso 2 — del chat a la agenda ============ */

const CHAT = [
  { de: "paciente", texto: "Hola, quiero agendar una limpieza" },
  { de: "aura", texto: "¡Claro! Tengo mañana 10:00 o el jueves 16:30" },
  { de: "paciente", texto: "Mañana a las 10 me sirve" },
  { de: "aura", texto: "Listo, quedaste agendada. Te confirmo por acá." },
];

const AGENDA = [
  { hora: "09:00", nombre: "Camila Reyes", tto: "Control", estado: "previa" },
  { hora: "10:00", nombre: "Paciente nuevo", tto: "Limpieza", estado: "nueva" },
  { hora: "11:30", nombre: "Diego Fuentes", tto: "Rejuvenecimiento", estado: "previa" },
  { hora: "16:30", nombre: "Josefa Lillo", tto: "Depilación láser", estado: "previa" },
];

const ESCENA_MS = 5200;

export function ChatToAgenda() {
  const reduced = useReducedMotion();
  const [escena, setEscena] = useState<"chat" | "agenda">("chat");

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(
      () => setEscena((e) => (e === "chat" ? "agenda" : "chat")),
      ESCENA_MS,
    );
    return () => window.clearInterval(t);
  }, [reduced]);

  // Sin movimiento se muestra el desenlace: la agenda ya completada.
  const activa = reduced ? "agenda" : escena;

  return (
    <div className={styles.device} aria-hidden="true">
      <div className={styles.deviceBar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.deviceUrl}>
          {activa === "chat" ? "whatsapp · aura" : "app.clinera.io / agenda"}
        </span>
        <span className={styles.live}>
          <i /> IA activa
        </span>
      </div>

      <div className={styles.deviceStage}>
        {activa === "chat" ? (
          <div key="chat" className={styles.chat}>
            {CHAT.map((m, i) => (
              <span
                key={m.texto}
                className={m.de === "aura" ? `${styles.bubble} ${styles.bubbleAura}` : styles.bubble}
                style={{ "--i": i } as React.CSSProperties}
              >
                {m.texto}
              </span>
            ))}
          </div>
        ) : (
          <div key="agenda" className={styles.agenda}>
            <span className={styles.agendaHead}>Jueves 21 · Dra. Michailiszen</span>
            {AGENDA.map((f, i) => (
              <span
                key={f.hora}
                className={
                  f.estado === "nueva" ? `${styles.slot} ${styles.slotNuevo}` : styles.slot
                }
                style={{ "--i": i } as React.CSSProperties}
              >
                <b>{f.hora}</b>
                <span>
                  <strong>{f.nombre}</strong>
                  <small>{f.tto}</small>
                </span>
                {f.estado === "nueva" && <em>agendada por AURA</em>}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.deviceFoot}>
        <span className={activa === "chat" ? styles.tabOn : styles.tab}>Conversación</span>
        <span className={activa === "agenda" ? styles.tabOn : styles.tab}>Agenda</span>
      </div>
    </div>
  );
}
