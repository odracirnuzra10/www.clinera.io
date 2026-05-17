import WhatsAppMockup from "./WhatsAppMockup";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_ADVANCED = "https://buy.stripe.com/4gM3cxapb9eG4cz1BF1441a";

export default function HeroEquipo() {
  return (
    <section className={styles.hero} aria-labelledby="empleado-digital-hero">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="empleado-digital-hero" className={styles.heroH1}>
            Empleados IA para tu clínica, 24/7
          </h1>

          <p className={styles.heroSub}>
            <span className={styles.heroSubName} style={{ color: "#7C3AED" }}>
              AURA
            </span>{" "}
            contesta WhatsApp.{" "}
            <span className={styles.heroSubName} style={{ color: "#0A0A0A" }}>
              LIA
            </span>{" "}
            decide a quién contactar y cuándo. Misma memoria del paciente, distinto canal.
          </p>

          <div className={styles.heroCtaRow}>
            <a
              href={STRIPE_ADVANCED}
              className={styles.heroCta}
              data-plan="advanced"
              data-plan-value="179"
              data-plan-name="Advanced signup hero"
            >
              Contratar Advanced — USD 179/mes
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
                <strong>94%</strong> confirmaciones automáticas
              </span>
              <span role="listitem">
                <strong>+21%</strong> cupos recuperados/mes
              </span>
            </div>

            <p className={styles.trustLine}>
              Cancela cuando quieras · Sin permanencia · Pago seguro vía Stripe
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
