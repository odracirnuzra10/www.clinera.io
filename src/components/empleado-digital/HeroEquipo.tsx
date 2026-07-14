import WhatsAppMockup from "./WhatsAppMockup";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_SUMMIT = "https://buy.stripe.com/5kQ6oJbtf3UmdN94NR1441w";

export default function HeroEquipo() {
  return (
    <section className={styles.hero} aria-labelledby="empleado-digital-hero">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="empleado-digital-hero" className={styles.heroH1}>
            Tu próximo empleado <span style={{ color: "#7C3AED" }}>no es humano</span>.
          </h1>

          <p className={styles.heroSub}>
            No es un chatbot. Es un agente que <strong>ejecuta funciones</strong> — crea citas,
            re-agenda, consulta pagos y revisa sesiones. Hace el 100% del trabajo de tu
            recepcionista por WhatsApp, sin descanso.
          </p>

          <div className={styles.heroCtaRow}>
            <a
              href={STRIPE_SUMMIT}
              className={styles.heroCta}
              data-plan="summit"
              data-plan-value="479"
              data-plan-name="Summit signup hero empleado-digital"
            >
              Contratar Summit — USD 479/mes
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <div className={styles.statBar} role="list">
              <span role="listitem">
                <span className={styles.statDot} aria-hidden />
                <strong>$479</strong> vs ~$950 recepcionista
              </span>
              <span role="listitem">
                <strong>24/7</strong> · sin licencias ni vacaciones
              </span>
            </div>

            <p className={styles.trustLine}>
              Desde USD 279/mes · Implementación USD 450 pago único · Cancela cuando quieras · Pago seguro vía Stripe
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
