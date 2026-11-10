"use client";

import { AuraFlow, ChatToAgenda } from "./WizardAnimations";
import styles from "./WizardShowcase.module.css";

/* Columna izquierda de /hablar-con-ventas en los pasos 1–3 (necesidad + clínica).
 * Desde contacto y calendario vuelve el carrusel de doctores (ReunionHero).
 */

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.panel}>
      <span className={styles.badge}>
        <i /> Clinera en funcionamiento
      </span>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}

/* ---------- Paso 1 — la IA recibe datos y responde ---------- */
function PasoSistemaOperativo() {
  return (
    <Panel
      eyebrow="Todo conectado · una sola IA"
      title={
        <>
          Tu clínica entra por un lado. <em>Las respuestas salen por el otro.</em>
        </>
      }
    >
      <AuraFlow />
    </Panel>
  );
}

/* ---------- Paso 2 — del chat a la agenda ---------- */
function PasoMensajeria() {
  return (
    <Panel
      eyebrow="WhatsApp con IA · agenda real"
      title={
        <>
          El paciente escribe. <em>La hora queda tomada.</em>
        </>
      }
    >
      <ChatToAgenda />
    </Panel>
  );
}

function PasoClinica() {
  return (
    <Panel
      eyebrow="Operación · una sola ficha"
      title={
        <>
          El volumen y la sede. <em>El sistema se arma alrededor.</em>
        </>
      }
    >
      <ChatToAgenda />
    </Panel>
  );
}

export default function WizardShowcase({ step }: { step: number }) {
  if (step <= 1) return <PasoSistemaOperativo />;
  if (step === 2) return <PasoMensajeria />;
  return <PasoClinica />;
}
