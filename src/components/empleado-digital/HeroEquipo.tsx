"use client";

import CtaPar from "@/components/cta/CtaPar";

import Link from "next/link";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH, IMPLEMENTACION_LINEA, PLANES } from "@/content/planes";
import WhatsAppMockup from "./WhatsAppMockup";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

export default function HeroEquipo() {
  return (
    <section className={styles.hero} aria-labelledby="empleado-digital-hero">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="empleado-digital-hero" className={styles.heroH1}>
            Suma agentes de IA a <span style={{ color: "#7C3AED" }}>todo tu equipo</span>.
          </h1>

          <p className={styles.heroSub}>
            No es un chatbot. Es un agente que <strong>ejecuta funciones</strong> — agenda,
            reagenda, confirma, cobra y recupera pacientes por WhatsApp 24/7, sobre la agenda de
            todo tu equipo y todas tus sedes.
          </p>

          <div className={styles.heroCtaRow}>
            {/* Ricardo, 4-nov-2026: los dos CTA del sitio. */}
            <CtaPar />

            <div className={styles.statBar} role="list">
              <span role="listitem">
                <span className={styles.statDot} aria-hidden />
                <strong>24/7</strong> · sobre la agenda de todo tu equipo
              </span>
              <span role="listitem">
                Visibilidad y control central de tus sedes
              </span>
            </div>

            <p className={styles.trustLine}>
              Vortex US$ {PLANES[0].monthlyUsd}/mes · {PLANES[1].name} US$ {PLANES[1].monthlyUsd}/mes · {IMPLEMENTACION_LINEA}
            </p>
          </div>
        </div>

        <div className={styles.heroMockup}>
          <WhatsAppMockup />
        </div>
      </div>
    </section>
  );
}
