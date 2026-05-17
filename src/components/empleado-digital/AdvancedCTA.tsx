import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_ADVANCED = "https://buy.stripe.com/4gM3cxapb9eG4cz1BF1441a";

const BULLETS = [
  "2000 conversaciones/mes",
  "15 usuarios",
  "Multi-sede",
  "Webhooks avanzados",
  "Soporte prioritario · onboarding dedicado",
  "Acceso anticipado a LIA",
];

export default function AdvancedCTA() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-h2">
      <div className={styles.ctaCard}>
        <span className={styles.ctaBadge}>Recomendado · Advanced</span>

        <h2 id="cta-h2" className={styles.ctaH2}>
          Activa tu equipo IA hoy
        </h2>

        <div className={styles.ctaPriceRow}>
          <span className={styles.ctaPrice}>USD 179</span>
          <span className={styles.ctaPriceUnit}>/ mes</span>
        </div>

        <ul className={styles.ctaBullets}>
          {BULLETS.map((b) => (
            <li key={b} className={styles.ctaBullet}>
              {b}
            </li>
          ))}
        </ul>

        <a
          href={STRIPE_ADVANCED}
          className={styles.ctaButton}
          data-plan="advanced"
          data-plan-value="179"
          data-plan-name="Advanced signup final"
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

        <p className={styles.ctaTrust}>
          Cancela cuando quieras · Sin permanencia · Pago seguro vía Stripe
        </p>

        <div className={styles.ctaSecondaryLinks}>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="conect"
            data-plan-value="129"
            data-plan-name="Conect view from empleado-digital"
          >
            Ver plan Conect — USD 129/mes →
          </Link>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="growth"
            data-plan-value="89"
            data-plan-name="Growth view from empleado-digital"
          >
            Ver plan Growth — USD 89/mes →
          </Link>
        </div>
      </div>
    </section>
  );
}
