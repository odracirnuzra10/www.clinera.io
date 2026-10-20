"use client";

import { GRAD, Mono } from "@/components/brand-v3/Brand";
import styles from "./ClineraOsDiagram.module.css";

const SOURCES = [
  { n: "Agenda", s: "Horas y bloqueos", d: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>' },
  { n: "Sedes", s: "Toda tu operación", d: '<path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-5h4v5"/>' },
  { n: "Fichas", s: "Historial de cada paciente", d: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h6"/>' },
  { n: "Tratamientos", s: "Precios y protocolos", d: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>' },
  { n: "Ventas", s: "Qué se vende y cuánto", d: '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 5-6"/>' },
  { n: "Pagos", s: "Cobros y conciliación", d: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
  { n: "Marketing", s: "Campañas y difusiones", d: '<path d="M3 11l16-5v13L3 14z"/><path d="M11 15.5a3 3 0 0 1-5.5-1.5"/>' },
  { n: "WhatsApp", s: "Toda la conversación", d: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>' },
  { n: "Consentimientos", s: "Firmados y archivados", d: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 15l1.5 1.5L14 13"/>' },
  { n: "Exámenes", s: "Resultados y controles", d: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
] as const;

const ACTIONS = [
  { n: "Agenda y reagenda", s: "Reserva y mueve horas sola", d: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M9 15l2 2 4-4"/>' },
  { n: "Responde 24/7", s: "Por WhatsApp, sin descanso", d: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>' },
  { n: "Cobra y recupera", s: "Confirma pagos, reactiva pacientes", d: '<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { n: "Automatiza", s: "Flujos que se disparan solos", d: '<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>' },
] as const;

function icon(d: string, color: string) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />
  );
}

export function ClineraOsDiagram({
  heading = true,
}: {
  heading?: boolean;
}) {
  return (
    <div className={styles.wrap}>
      {heading ? (
        <div className={styles.heading}>
          <Mono color="#7C3AED">Clinera · El software de tu clínica</Mono>
          <h2 className={styles.h2}>
            Clinera:{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              el sistema con IA por el que opera toda tu clínica
            </span>
            .
          </h2>
          <p className={styles.lead}>
            Toda tu operación entrega contexto. Clinera entiende, decide y actúa.
          </p>
        </div>
      ) : null}

      <div
        className={styles.grid}
        role="img"
        aria-label="Los módulos de agenda, sedes, fichas, tratamientos, ventas, pagos, marketing, WhatsApp, consentimientos y exámenes alimentan Clinera para agendar, responder, cobrar y automatizar."
      >
        <div>
          <div className={styles.colLabel}>
            <Mono>Toda tu operación la alimenta</Mono>
          </div>
          <div className={styles.sources}>
            {SOURCES.map((p) => (
              <div key={p.n} className={styles.srcTile}>
                <span className={styles.srcIcon}>{icon(p.d, "#7C3AED")}</span>
                <span>
                  <span className={styles.tileTitle}>{p.n}</span>
                  <span className={styles.tileSub}>{p.s}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.core}>
          <div className={styles.coreDisc} style={{ background: GRAD }}>
            <span className={styles.coreRing} aria-hidden="true" />
            <span className={styles.coreStar} aria-hidden="true">
              ✦
            </span>
          </div>
          <div className={styles.coreName}>Clinera</div>
          <div className={styles.coreTag}>Contexto · decisiones · acción</div>
        </div>

        <div>
          <div className={styles.colLabel}>
            <Mono>Clinera actúa</Mono>
          </div>
          <div className={styles.actions}>
            {ACTIONS.map((p) => (
              <div key={p.n} className={styles.actTile}>
                <span className={styles.actIcon}>{icon(p.d, "#D8B4FE")}</span>
                <span>
                  <span className={styles.actTitle}>{p.n}</span>
                  <span className={styles.actSub}>{p.s}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
