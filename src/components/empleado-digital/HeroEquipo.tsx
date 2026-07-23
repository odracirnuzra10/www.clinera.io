import Link from "next/link";
import WhatsAppMockup from "./WhatsAppMockup";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_SUMMIT = "https://buy.stripe.com/5kQ6oJbtf3UmdN94NR1441w";

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
            <Link href="/hablar-con-ventas" className={styles.heroCta}>
              Agendar demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <a
              href={STRIPE_SUMMIT}
              className={styles.ctaDemoLink}
              data-plan="summit"
              data-plan-value="479"
              data-plan-name="Summit checkout hero empleado-digital"
            >
              Contratar Summit — USD 479/mes →
            </a>

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
              Desde USD 279/mes · Implementación USD 450 (onboarding asistido) · Pago seguro vía Stripe
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
