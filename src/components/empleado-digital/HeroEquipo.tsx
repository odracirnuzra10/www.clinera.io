import WhatsAppMockup from "./WhatsAppMockup";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_ADVANCED = "https://buy.stripe.com/dRmeVf54RbmO5gDbcf1441g";

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
              href={STRIPE_ADVANCED}
              className={styles.heroCta}
              data-plan="advanced"
              data-plan-value="359"
              data-plan-name="Advanced signup hero empleado-digital"
            >
              Contratar Advanced — USD 359/mes
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
                <strong>$359</strong> vs ~$950 recepcionista
              </span>
              <span role="listitem">
                <strong>24/7</strong> · sin licencias ni vacaciones
              </span>
            </div>

            <p className={styles.trustLine}>
              Desde USD 129/mes · Cancela cuando quieras · Sin permanencia · Pago seguro vía Stripe
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
