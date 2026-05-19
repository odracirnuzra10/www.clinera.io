import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_ADVANCED = "https://buy.stripe.com/dRmeVf54RbmO5gDbcf1441g";

const BULLETS = [
  "32.000 créditos IA / mes (4× Core)",
  "~2.400 atenciones / mes",
  "3 modos de agendamiento (incluye Automático)",
  "3 modelos IA: Gemini 3 Flash · Kimi K2.6 · Claude Sonnet 4.6",
  "Módulo clínico completo (agenda + fichas + Vault)",
  "Multi-sede + panel de atribución",
  "Webhooks + API pública (integraciones a medida)",
  "15 usuarios / profesionales",
  "Soporte prioritario · onboarding dedicado",
  "Acceso anticipado a LIA (0% vacancia)",
];

export default function AdvancedCTA() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-h2">
      <div className={styles.ctaCard}>
        <span className={styles.ctaBadge}>Recomendado · Advanced</span>

        <h2 id="cta-h2" className={styles.ctaH2}>
          Activa tu empleado digital hoy
        </h2>

        <div className={styles.ctaPriceRow}>
          <span className={styles.ctaPrice}>USD 359</span>
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
          data-plan-value="359"
          data-plan-name="Advanced signup final empleado-digital"
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

        <p className={styles.ctaTrust}>
          Cancela cuando quieras · Sin permanencia · Pago seguro vía Stripe
        </p>

        <Link href="/demo" className={styles.ctaDemoLink}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Ver demo en video — 2 min
        </Link>

        <div className={styles.ctaSecondaryLinks}>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="conect"
            data-plan-value="179"
            data-plan-name="Conect view from empleado-digital"
          >
            Ver plan Conect — USD 179/mes →
          </Link>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="core"
            data-plan-value="129"
            data-plan-name="Core view from empleado-digital"
          >
            Ver plan Core — USD 129/mes →
          </Link>
        </div>
      </div>
    </section>
  );
}
